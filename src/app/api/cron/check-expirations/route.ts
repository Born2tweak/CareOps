import { NextResponse } from "next/server";

import { sendEmail } from "@/lib/email/resend";
import {
  createNotification,
  notificationExists,
} from "@/lib/notifications/create";
import { prisma } from "@/lib/prisma";
import { effectiveStatus } from "@/lib/compliance/urgency";

const THRESHOLDS = [30, 14, 7, 0] as const;
const EMAIL_THRESHOLDS = new Set([14, 7]);

export async function GET(request: Request) {
  // Verify cron secret in production
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const now = new Date();
  let notificationsCreated = 0;
  let emailsSent = 0;

  const records = await prisma.complianceRecord.findMany({
    where: {
      employee: { status: { in: ["ACTIVE", "ONBOARDING"] } },
      followUpStatus: { not: "RESOLVED" },
    },
    include: {
      employee: { select: { id: true, firstName: true, lastName: true, email: true } },
      complianceItem: { select: { name: true } },
    },
  });

  for (const record of records) {
    const eff = effectiveStatus(record.status, record.expirationDate, now);
    if (eff === "COMPLETE") continue;

    if (!record.expirationDate) continue;

    const msPerDay = 1000 * 60 * 60 * 24;
    const daysUntil = Math.ceil(
      (record.expirationDate.getTime() - now.getTime()) / msPerDay,
    );

    for (const threshold of THRESHOLDS) {
      if (daysUntil > threshold) continue;

      const dedupKey = `${record.id}-${threshold}d`;
      const alreadySent = await notificationExists(
        record.employee.id,
        daysUntil < 0 ? "EXPIRED" : "EXPIRING_SOON",
        dedupKey,
      );

      if (alreadySent) continue;

      const itemLabel = record.complianceItem.name;
      const employeeName = `${record.employee.firstName} ${record.employee.lastName}`;

      const notificationType = daysUntil < 0 ? "EXPIRED" : "EXPIRING_SOON";
      const title =
        daysUntil < 0
          ? `${itemLabel} expired for ${employeeName}`
          : daysUntil === 0
            ? `${itemLabel} expires today for ${employeeName}`
            : `${itemLabel} expires in ${daysUntil} days for ${employeeName}`;

      await createNotification({
        employeeId: record.employee.id,
        type: notificationType,
        title,
        message: `${itemLabel} requires attention. Employee: ${employeeName}.`,
        metadata: { dedupKey, complianceRecordId: record.id, threshold },
      });
      notificationsCreated++;

      // Send email at 14-day and 7-day thresholds
      if (EMAIL_THRESHOLDS.has(threshold) && record.employee.email) {
        try {
          await sendEmail({
            to: record.employee.email,
            subject: title,
            text: `Hi ${record.employee.firstName},\n\nThis is an automated reminder that your ${itemLabel} ${daysUntil <= 0 ? "has expired" : `expires in ${daysUntil} days`}. Please take action as soon as possible.\n\nThank you,\nCareOps`,
          });
          emailsSent++;
        } catch {
          // Log but don't fail the cron
        }
      }

      // Only create one notification per record (the most urgent threshold)
      break;
    }
  }

  return NextResponse.json({
    ok: true,
    notificationsCreated,
    emailsSent,
    checkedAt: now.toISOString(),
  });
}
