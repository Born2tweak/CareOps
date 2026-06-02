import { prisma } from "@/lib/prisma";

export async function getUnreadNotificationCount(): Promise<number> {
  return prisma.notification.count({
    where: { isRead: false },
  });
}

export async function getRecentNotifications(limit = 20) {
  return prisma.notification.findMany({
    orderBy: { sentAt: "desc" },
    take: limit,
    include: {
      employee: { select: { id: true, firstName: true, lastName: true } },
    },
  });
}

export async function markNotificationRead(id: string) {
  return prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
}

export async function markAllNotificationsRead() {
  return prisma.notification.updateMany({
    where: { isRead: false },
    data: { isRead: true },
  });
}
