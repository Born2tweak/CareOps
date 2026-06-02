import { prisma } from "@/lib/prisma";
import { getSignedUrl } from "@/lib/documents/storage";

export async function getDocumentsForRecord(complianceRecordId: string) {
  return prisma.document.findMany({
    where: { complianceRecordId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getDocumentViewUrl(
  documentId: string,
): Promise<string | null> {
  const doc = await prisma.document.findUnique({
    where: { id: documentId },
  });
  if (!doc) return null;
  return getSignedUrl(doc.storagePath, 3600);
}
