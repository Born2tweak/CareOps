"use client";

import { DocumentList } from "@/components/admin/documents/document-list";
import { DocumentUploadForm } from "@/components/admin/documents/document-upload-form";
import { spacing, typography } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

type DocumentRow = {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  storagePath: string;
  createdAt: Date;
};

type Props = {
  complianceRecordId: string;
  employeeId: string;
  documents: DocumentRow[];
  viewUrlMap: Record<string, string>;
};

export function RecordDocuments({
  complianceRecordId,
  employeeId,
  documents,
  viewUrlMap,
}: Props) {
  return (
    <div className={cn("border-t border-border px-4 py-3", spacing.section)}>
      <h4 className={typography.sectionTitle}>Documents</h4>
      <DocumentList
        documents={documents}
        employeeId={employeeId}
        viewUrlMap={viewUrlMap}
      />
      <DocumentUploadForm
        complianceRecordId={complianceRecordId}
        employeeId={employeeId}
      />
    </div>
  );
}
