import { prisma } from "@/lib/prisma";
import { effectiveStatus } from "@/lib/compliance/urgency";

export type DashboardMetrics = {
  totalActiveEmployees: number;
  fullyCompliant: number;
  incompleteEmployees: number;
  expiringSoonCount: number;
  expiredCount: number;
  compliancePercentage: number;
  onboardingIncomplete: number;
};

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const activeEmployees = await prisma.employee.findMany({
    where: { status: { in: ["ACTIVE", "ONBOARDING"] } },
    select: {
      id: true,
      status: true,
      complianceRecords: {
        select: {
          status: true,
          expirationDate: true,
        },
      },
    },
  });

  const totalActiveEmployees = activeEmployees.length;

  let fullyCompliant = 0;
  let incompleteEmployees = 0;
  let onboardingIncomplete = 0;
  let totalRecords = 0;
  let completeRecords = 0;
  let expiringSoonCount = 0;
  let expiredCount = 0;

  for (const emp of activeEmployees) {
    const records = emp.complianceRecords;
    totalRecords += records.length;

    let allComplete = records.length > 0;

    for (const rec of records) {
      const eff = effectiveStatus(rec.status, rec.expirationDate, now);

      if (eff === "COMPLETE") {
        completeRecords++;
      } else {
        allComplete = false;
      }

      if (eff === "EXPIRED") {
        expiredCount++;
      } else if (
        eff === "COMPLETE" &&
        rec.expirationDate &&
        rec.expirationDate <= thirtyDaysFromNow &&
        rec.expirationDate > now
      ) {
        expiringSoonCount++;
      } else if (
        rec.expirationDate &&
        rec.expirationDate <= thirtyDaysFromNow &&
        rec.expirationDate > now
      ) {
        expiringSoonCount++;
      }
    }

    if (allComplete) {
      fullyCompliant++;
    } else {
      incompleteEmployees++;
      if (emp.status === "ONBOARDING") {
        onboardingIncomplete++;
      }
    }
  }

  const compliancePercentage =
    totalRecords > 0 ? Math.round((completeRecords / totalRecords) * 100) : 0;

  return {
    totalActiveEmployees,
    fullyCompliant,
    incompleteEmployees,
    expiringSoonCount,
    expiredCount,
    compliancePercentage,
    onboardingIncomplete,
  };
}
