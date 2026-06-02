"use server";

import { ComplianceStatus, FollowUpStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { logAuditEvent } from "@/lib/audit";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type ComplianceRecordActionState = {
  error?: string;
  success?: boolean;
};

export async function updateComplianceRecord(
  recordId: string,
  employeeId: string,
  _prev: ComplianceRecordActionState,
  formData: FormData,
): Promise<ComplianceRecordActionState> {
  const { appUser } = await requireAdmin();

  const status = formData.get("status") as string;
  const completedDateRaw = formData.get("completedDate") as string;
  const expirationDateRaw = formData.get("expirationDate") as string;
  const notes = (formData.get("notes") as string)?.trim() || null;
  const followUpStatus = formData.get("followUpStatus") as string;
  const followUpNotes = (formData.get("followUpNotes") as string)?.trim() || null;
  const lastContactedDateRaw = formData.get("lastContactedDate") as string;

  if (!Object.values(ComplianceStatus).includes(status as ComplianceStatus)) {
    return { error: "Invalid status." };
  }

  if (
    followUpStatus &&
    !Object.values(FollowUpStatus).includes(followUpStatus as FollowUpStatus)
  ) {
    return { error: "Invalid follow-up status." };
  }

  const completedDate = completedDateRaw
    ? new Date(completedDateRaw)
    : null;
  const expirationDate = expirationDateRaw
    ? new Date(expirationDateRaw)
    : null;
  const lastContactedDate = lastContactedDateRaw
    ? new Date(lastContactedDateRaw)
    : null;

  if (completedDate && Number.isNaN(completedDate.getTime())) {
    return { error: "Invalid completed date." };
  }
  if (expirationDate && Number.isNaN(expirationDate.getTime())) {
    return { error: "Invalid expiration date." };
  }
  if (lastContactedDate && Number.isNaN(lastContactedDate.getTime())) {
    return { error: "Invalid last contacted date." };
  }

  await prisma.complianceRecord.update({
    where: { id: recordId },
    data: {
      status: status as ComplianceStatus,
      completedDate,
      expirationDate,
      notes,
      followUpStatus: (followUpStatus as FollowUpStatus) || undefined,
      followUpNotes,
      lastContactedDate,
    },
  });

  await logAuditEvent({
    userId: appUser.id,
    action: "compliance_record_updated",
    entityType: "employee",
    entityId: employeeId,
    details: {
      recordId,
      status: status as ComplianceStatus,
      followUpStatus: followUpStatus || undefined,
    },
  });

  revalidatePath(`/admin/employees/${employeeId}`);
  revalidatePath("/admin/queue");
  return { success: true };
}
