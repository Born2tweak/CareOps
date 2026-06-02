"use server";

import { EmploymentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  fieldErrorsFromZod,
  parseEmployeeFormData,
} from "@/lib/employees/validation";
import { logAuditEvent } from "@/lib/audit";
import { createMissingRecordsForEmployee } from "@/lib/compliance/auto-create";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type EmployeeActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
};

function revalidateEmployeePaths(id?: string) {
  revalidatePath("/admin/employees");
  if (id) {
    revalidatePath(`/admin/employees/${id}`);
  }
}

function prismaUniqueEmailMessage(): string {
  return "An employee with this email already exists.";
}

export async function createEmployee(
  _prev: EmployeeActionState,
  formData: FormData,
): Promise<EmployeeActionState> {
  const { appUser } = await requireAdmin();

  const parsed = parseEmployeeFormData(formData);
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const data = parsed.data;

  try {
    const employee = await prisma.employee.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email.toLowerCase(),
        phone: data.phone,
        hireDate: new Date(data.hireDate),
        status: data.status,
        position: data.position ?? null,
        department: data.department ?? null,
      },
    });
    await createMissingRecordsForEmployee(employee.id);
    await logAuditEvent({
      userId: appUser.id,
      action: "employee_created",
      entityType: "employee",
      entityId: employee.id,
      details: { name: `${data.firstName} ${data.lastName}` },
    });
    revalidateEmployeePaths(employee.id);
    redirect(`/admin/employees/${employee.id}`);
  } catch (e) {
    if (isPrismaUniqueViolation(e)) {
      return { fieldErrors: { email: [prismaUniqueEmailMessage()] } };
    }
    throw e;
  }
}

export async function updateEmployee(
  employeeId: string,
  _prev: EmployeeActionState,
  formData: FormData,
): Promise<EmployeeActionState> {
  const { appUser } = await requireAdmin();

  const parsed = parseEmployeeFormData(formData);
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const data = parsed.data;

  try {
    await prisma.employee.update({
      where: { id: employeeId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email.toLowerCase(),
        phone: data.phone,
        hireDate: new Date(data.hireDate),
        status: data.status,
        position: data.position ?? null,
        department: data.department ?? null,
      },
    });
    await logAuditEvent({
      userId: appUser.id,
      action: "employee_updated",
      entityType: "employee",
      entityId: employeeId,
    });
    revalidateEmployeePaths(employeeId);
    return { success: true };
  } catch (e) {
    if (isPrismaUniqueViolation(e)) {
      return { fieldErrors: { email: [prismaUniqueEmailMessage()] } };
    }
    throw e;
  }
}

export async function deactivateEmployee(
  employeeId: string,
  status: "INACTIVE" | "TERMINATED",
): Promise<EmployeeActionState> {
  const { appUser } = await requireAdmin();

  if (status !== "INACTIVE" && status !== "TERMINATED") {
    return { error: "Invalid deactivation status." };
  }

  await prisma.employee.update({
    where: { id: employeeId },
    data: { status: status as EmploymentStatus },
  });

  await logAuditEvent({
    userId: appUser.id,
    action: "employee_deactivated",
    entityType: "employee",
    entityId: employeeId,
    details: { status },
  });

  revalidateEmployeePaths(employeeId);
  return {};
}

function isPrismaUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "P2002"
  );
}
