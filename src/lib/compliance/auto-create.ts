import { prisma } from "@/lib/prisma";

/**
 * Create ComplianceRecords (status=MISSING) for an employee
 * for every required ComplianceItem that doesn't already have a record.
 */
export async function createMissingRecordsForEmployee(
  employeeId: string,
): Promise<number> {
  const requiredItems = await prisma.complianceItem.findMany({
    where: { isRequired: true },
    select: { id: true },
  });

  const existingRecords = await prisma.complianceRecord.findMany({
    where: { employeeId },
    select: { complianceItemId: true },
  });

  const existingItemIds = new Set(existingRecords.map((r) => r.complianceItemId));

  const toCreate = requiredItems
    .filter((item) => !existingItemIds.has(item.id))
    .map((item) => ({
      employeeId,
      complianceItemId: item.id,
      status: "MISSING" as const,
    }));

  if (toCreate.length === 0) return 0;

  const result = await prisma.complianceRecord.createMany({
    data: toCreate,
    skipDuplicates: true,
  });

  return result.count;
}

/**
 * Backfill ComplianceRecords for all active/onboarding employees
 * when a new required ComplianceItem is created.
 */
export async function backfillRecordsForComplianceItem(
  complianceItemId: string,
): Promise<number> {
  const employees = await prisma.employee.findMany({
    where: { status: { in: ["ACTIVE", "ONBOARDING"] } },
    select: { id: true },
  });

  const existingRecords = await prisma.complianceRecord.findMany({
    where: { complianceItemId },
    select: { employeeId: true },
  });

  const existingEmployeeIds = new Set(existingRecords.map((r) => r.employeeId));

  const toCreate = employees
    .filter((emp) => !existingEmployeeIds.has(emp.id))
    .map((emp) => ({
      employeeId: emp.id,
      complianceItemId,
      status: "MISSING" as const,
    }));

  if (toCreate.length === 0) return 0;

  const result = await prisma.complianceRecord.createMany({
    data: toCreate,
    skipDuplicates: true,
  });

  return result.count;
}
