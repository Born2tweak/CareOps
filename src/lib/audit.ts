import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

type AuditParams = {
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: Prisma.InputJsonValue;
};

export async function logAuditEvent({
  userId,
  action,
  entityType,
  entityId,
  details,
}: AuditParams) {
  return prisma.auditLog.create({
    data: {
      userId,
      action,
      entityType,
      entityId,
      details: details ?? undefined,
    },
  });
}

export async function getAuditLogsForEntity(
  entityType: string,
  entityId: string,
) {
  return prisma.auditLog.findMany({
    where: { entityType, entityId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}
