import { prisma } from "@/lib/prisma";
import { effectiveStatus } from "@/lib/compliance/urgency";

export type ExceptionRecord = {
  id: string;
  status: string;
  effectiveStatus: string;
  completedDate: Date | null;
  expirationDate: Date | null;
  notes: string | null;
  followUpStatus: string;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
  };
  complianceItem: {
    name: string;
    category: string | null;
  };
};

export type ExceptionGroups = {
  critical: ExceptionRecord[];
  expiringSoon: ExceptionRecord[];
  missing: ExceptionRecord[];
  pending: ExceptionRecord[];
  recentlyResolved: ExceptionRecord[];
};

export async function getExceptionGroups(): Promise<ExceptionGroups> {
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const allRecords = await prisma.complianceRecord.findMany({
    where: {
      employee: { status: { in: ["ACTIVE", "ONBOARDING"] } },
    },
    include: {
      employee: { select: { id: true, firstName: true, lastName: true } },
      complianceItem: { select: { name: true, category: true } },
    },
    orderBy: [{ expirationDate: "asc" }, { complianceItem: { sortOrder: "asc" } }],
  });

  const critical: ExceptionRecord[] = [];
  const expiringSoon: ExceptionRecord[] = [];
  const missing: ExceptionRecord[] = [];
  const pending: ExceptionRecord[] = [];
  const recentlyResolved: ExceptionRecord[] = [];

  for (const record of allRecords) {
    const eff = effectiveStatus(record.status, record.expirationDate, now);
    const mapped: ExceptionRecord = {
      id: record.id,
      status: record.status,
      effectiveStatus: eff,
      completedDate: record.completedDate,
      expirationDate: record.expirationDate,
      notes: record.notes,
      followUpStatus: record.followUpStatus,
      employee: record.employee,
      complianceItem: record.complianceItem,
    };

    // Recently resolved (completed in last 7 days)
    if (
      eff === "COMPLETE" &&
      record.completedDate &&
      record.completedDate >= sevenDaysAgo
    ) {
      recentlyResolved.push(mapped);
      continue;
    }

    // Skip fully resolved items
    if (eff === "COMPLETE" || record.followUpStatus === "RESOLVED") {
      continue;
    }

    // Critical: expired or expires within 7 days
    if (eff === "EXPIRED") {
      critical.push(mapped);
    } else if (
      record.expirationDate &&
      record.expirationDate <= sevenDaysFromNow
    ) {
      critical.push(mapped);
    }
    // Expiring soon: 8-30 days
    else if (
      record.expirationDate &&
      record.expirationDate <= thirtyDaysFromNow
    ) {
      expiringSoon.push(mapped);
    }
    // Missing items
    else if (eff === "MISSING") {
      missing.push(mapped);
    }
    // Pending
    else if (eff === "PENDING") {
      pending.push(mapped);
    }
  }

  return { critical, expiringSoon, missing, pending, recentlyResolved };
}
