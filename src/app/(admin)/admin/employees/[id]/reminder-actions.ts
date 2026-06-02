"use server";

import { revalidatePath } from "next/cache";

import { logAuditEvent } from "@/lib/audit";
import { requireAdmin } from "@/lib/auth";
import { sendEmail } from "@/lib/email/resend";
import { prisma } from "@/lib/prisma";

export type SendReminderState = {
  error?: string;
  success?: boolean;
};

export async function sendReminderEmail(
  _prev: SendReminderState,
  formData: FormData,
): Promise<SendReminderState> {
  const { appUser } = await requireAdmin();

  const complianceRecordId = formData.get("complianceRecordId") as string;
  const employeeId = formData.get("employeeId") as string;
  const recipientEmail = formData.get("recipientEmail") as string;
  const reminderType = formData.get("reminderType") as string;
  const subject = formData.get("subject") as string;
  const body = formData.get("body") as string;

  if (!complianceRecordId || !employeeId || !recipientEmail || !subject || !body) {
    return { error: "Missing required fields." };
  }

  // Check for duplicate sends within 24 hours
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentReminder = await prisma.reminderLog.findFirst({
    where: {
      complianceRecordId,
      sentAt: { gte: twentyFourHoursAgo },
    },
    orderBy: { sentAt: "desc" },
  });

  if (recentReminder) {
    const confirmed = formData.get("confirmDuplicate") as string;
    if (confirmed !== "true") {
      return {
        error: "A reminder was already sent for this item in the last 24 hours. Confirm to send again.",
      };
    }
  }

  try {
    await sendEmail({ to: recipientEmail, subject, text: body });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send email.";
    return { error: message };
  }

  await prisma.reminderLog.create({
    data: {
      complianceRecordId,
      employeeId,
      sentById: appUser.id,
      recipientEmail,
      reminderType: reminderType || "missing",
      subject,
      body,
    },
  });

  await logAuditEvent({
    userId: appUser.id,
    action: "reminder_sent",
    entityType: "employee",
    entityId: employeeId,
    details: { complianceRecordId, reminderType, recipientEmail },
  });

  revalidatePath(`/admin/employees/${employeeId}`);
  return { success: true };
}
