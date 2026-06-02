import { NextResponse, type NextRequest } from "next/server";

import { toCsv } from "@/lib/export/csv";
import { effectiveStatus } from "@/lib/compliance/urgency";
import { prisma } from "@/lib/prisma";

type ExportType = "all" | "incomplete" | "expiring" | "exceptions";

function csvResponse(csv: string, filename: string): NextResponse {
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

function formatDate(date: Date | null): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export async function GET(request: NextRequest) {
  const type = (request.nextUrl.searchParams.get("type") ?? "all") as ExportType;
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const employees = await prisma.employee.findMany({
    where: { status: { in: ["ACTIVE", "ONBOARDING"] } },
    include: {
      complianceRecords: {
        include: { complianceItem: { select: { name: true, category: true } } },
      },
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });

  const headers = [
    "Employee",
    "Email",
    "Employee Status",
    "Compliance Item",
    "Category",
    "Status",
    "Effective Status",
    "Completed Date",
    "Expiration Date",
    "Follow-Up Status",
    "Notes",
  ];

  const allRows: string[][] = [];

  for (const emp of employees) {
    for (const rec of emp.complianceRecords) {
      const eff = effectiveStatus(rec.status, rec.expirationDate, now);

      // Filter based on export type
      if (type === "incomplete" && eff === "COMPLETE") continue;
      if (type === "expiring") {
        if (!rec.expirationDate) continue;
        if (rec.expirationDate > thirtyDaysFromNow || rec.expirationDate < now) continue;
      }
      if (type === "exceptions") {
        if (eff === "COMPLETE" && rec.followUpStatus === "RESOLVED") continue;
        if (eff === "COMPLETE" && rec.followUpStatus !== "RESOLVED") {
          // include only if expiring
          if (!rec.expirationDate || rec.expirationDate > thirtyDaysFromNow) continue;
        }
      }

      allRows.push([
        `${emp.firstName} ${emp.lastName}`,
        emp.email,
        emp.status,
        rec.complianceItem.name,
        rec.complianceItem.category ?? "",
        rec.status,
        eff,
        formatDate(rec.completedDate),
        formatDate(rec.expirationDate),
        rec.followUpStatus,
        rec.notes ?? "",
      ]);
    }
  }

  const timestamp = now.toISOString().slice(0, 10);
  const filename = `careops-${type}-${timestamp}.csv`;
  const csv = toCsv(headers, allRows);

  return csvResponse(csv, filename);
}
