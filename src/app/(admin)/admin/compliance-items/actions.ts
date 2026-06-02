"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  fieldErrorsFromZod,
  parseComplianceItemFormData,
} from "@/lib/compliance/validation";
import { backfillRecordsForComplianceItem } from "@/lib/compliance/auto-create";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type ComplianceItemActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
};

function revalidateComplianceItemPaths(id?: string) {
  revalidatePath("/admin/compliance-items");
  if (id) {
    revalidatePath(`/admin/compliance-items/${id}`);
  }
}

function prismaUniqueNameMessage(): string {
  return "A compliance item with this name already exists.";
}

export async function createComplianceItem(
  _prev: ComplianceItemActionState,
  formData: FormData,
): Promise<ComplianceItemActionState> {
  await requireAdmin();

  const parsed = parseComplianceItemFormData(formData);
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const data = parsed.data;

  try {
    const item = await prisma.complianceItem.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        category: data.category ?? null,
        expiresAfterDays: data.expiresAfterDays,
        isRequired: data.isRequired,
        isDefault: false,
        sortOrder: data.sortOrder,
      },
    });
    if (data.isRequired) {
      await backfillRecordsForComplianceItem(item.id);
    }
    revalidateComplianceItemPaths(item.id);
    redirect(`/admin/compliance-items/${item.id}`);
  } catch (e) {
    if (isPrismaUniqueViolation(e)) {
      return { fieldErrors: { name: [prismaUniqueNameMessage()] } };
    }
    throw e;
  }
}

export async function updateComplianceItem(
  itemId: string,
  _prev: ComplianceItemActionState,
  formData: FormData,
): Promise<ComplianceItemActionState> {
  await requireAdmin();

  const parsed = parseComplianceItemFormData(formData);
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const data = parsed.data;

  try {
    await prisma.complianceItem.update({
      where: { id: itemId },
      data: {
        name: data.name,
        description: data.description ?? null,
        category: data.category ?? null,
        expiresAfterDays: data.expiresAfterDays,
        isRequired: data.isRequired,
        sortOrder: data.sortOrder,
      },
    });
    revalidateComplianceItemPaths(itemId);
    return { success: true };
  } catch (e) {
    if (isPrismaUniqueViolation(e)) {
      return { fieldErrors: { name: [prismaUniqueNameMessage()] } };
    }
    throw e;
  }
}

function isPrismaUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "P2002"
  );
}
