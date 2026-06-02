"use server";

import { revalidatePath } from "next/cache";

import { logAuditEvent } from "@/lib/audit";
import { requireAdmin } from "@/lib/auth";
import {
  buildStoragePath,
  deleteFile,
  uploadFile,
  validateFile,
} from "@/lib/documents/storage";
import { prisma } from "@/lib/prisma";

export type DocumentActionState = {
  error?: string;
  success?: boolean;
};

export async function uploadDocument(
  complianceRecordId: string,
  employeeId: string,
  _prev: DocumentActionState,
  formData: FormData,
): Promise<DocumentActionState> {
  const { appUser } = await requireAdmin();

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { error: "No file selected." };
  }

  const validationError = validateFile(file);
  if (validationError) {
    return { error: validationError };
  }

  const storagePath = buildStoragePath(complianceRecordId, file.name);

  try {
    await uploadFile(storagePath, file);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Upload failed.";
    return { error: message };
  }

  await prisma.document.create({
    data: {
      complianceRecordId,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      storagePath,
      uploadedById: appUser.id,
    },
  });

  await logAuditEvent({
    userId: appUser.id,
    action: "document_uploaded",
    entityType: "employee",
    entityId: employeeId,
    details: { complianceRecordId, fileName: file.name },
  });

  revalidatePath(`/admin/employees/${employeeId}`);
  return { success: true };
}

export async function replaceDocument(
  documentId: string,
  employeeId: string,
  _prev: DocumentActionState,
  formData: FormData,
): Promise<DocumentActionState> {
  const { appUser } = await requireAdmin();

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { error: "No file selected." };
  }

  const validationError = validateFile(file);
  if (validationError) {
    return { error: validationError };
  }

  const existing = await prisma.document.findUnique({
    where: { id: documentId },
  });
  if (!existing) {
    return { error: "Document not found." };
  }

  const storagePath = buildStoragePath(
    existing.complianceRecordId,
    file.name,
  );

  try {
    await uploadFile(storagePath, file);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Upload failed.";
    return { error: message };
  }

  // Delete old file from storage (best-effort)
  try {
    await deleteFile(existing.storagePath);
  } catch {
    // old file cleanup is non-critical
  }

  await prisma.document.update({
    where: { id: documentId },
    data: {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      storagePath,
      uploadedById: appUser.id,
    },
  });

  await logAuditEvent({
    userId: appUser.id,
    action: "document_replaced",
    entityType: "employee",
    entityId: employeeId,
    details: {
      documentId,
      oldFileName: existing.fileName,
      newFileName: file.name,
    },
  });

  revalidatePath(`/admin/employees/${employeeId}`);
  return { success: true };
}

export async function removeDocument(
  documentId: string,
  employeeId: string,
): Promise<DocumentActionState> {
  const { appUser } = await requireAdmin();

  const existing = await prisma.document.findUnique({
    where: { id: documentId },
  });
  if (!existing) {
    return { error: "Document not found." };
  }

  try {
    await deleteFile(existing.storagePath);
  } catch {
    // storage cleanup is non-critical
  }

  await prisma.document.delete({ where: { id: documentId } });

  await logAuditEvent({
    userId: appUser.id,
    action: "document_removed",
    entityType: "employee",
    entityId: employeeId,
    details: {
      documentId,
      fileName: existing.fileName,
      complianceRecordId: existing.complianceRecordId,
    },
  });

  revalidatePath(`/admin/employees/${employeeId}`);
  return { success: true };
}
