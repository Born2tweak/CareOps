import type { NotificationType, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

type CreateNotificationParams = {
  employeeId: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Prisma.InputJsonValue;
};

export async function createNotification({
  employeeId,
  type,
  title,
  message,
  metadata,
}: CreateNotificationParams) {
  return prisma.notification.create({
    data: {
      employeeId,
      type,
      title,
      message,
      metadata: metadata ?? undefined,
    },
  });
}

/**
 * Check if a notification with the given dedup key already exists.
 * Used to prevent duplicate cron notifications for the same item + threshold.
 */
export async function notificationExists(
  employeeId: string,
  type: NotificationType,
  dedupKey: string,
): Promise<boolean> {
  const existing = await prisma.notification.findFirst({
    where: {
      employeeId,
      type,
      metadata: {
        path: ["dedupKey"],
        equals: dedupKey,
      },
    },
  });
  return existing !== null;
}
