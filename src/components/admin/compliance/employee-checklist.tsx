"use client";

import { useState } from "react";
import { ComplianceStatus, FollowUpStatus } from "@prisma/client";
import { Paperclip } from "lucide-react";

import { ExpirationIndicator } from "@/components/admin/compliance/expiration-indicator";
import { RecordEditForm } from "@/components/admin/compliance/record-edit-form";
import { RecordDocuments } from "@/components/admin/documents/record-documents";
import { StatusBadge } from "@/components/ui/status-badge";
import { SurfaceCard } from "@/components/ui/surface-card";
import {
  followUpStatusLabels,
  followUpStatusOperational,
} from "@/lib/compliance/follow-up";
import { effectiveStatus } from "@/lib/compliance/urgency";
import type { OperationalState } from "@/lib/design-tokens";
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

type ComplianceRecordRow = {
  id: string;
  status: ComplianceStatus;
  completedDate: Date | null;
  expirationDate: Date | null;
  notes: string | null;
  followUpStatus: FollowUpStatus;
  followUpNotes: string | null;
  lastContactedDate: Date | null;
  documents: DocumentRow[];
  complianceItem: {
    name: string;
    category: string | null;
  };
};

const statusLabels: Record<ComplianceStatus, string> = {
  COMPLETE: "Complete",
  PENDING: "Pending",
  MISSING: "Missing",
  EXPIRED: "Expired",
};

const statusOperational: Record<ComplianceStatus, OperationalState> = {
  COMPLETE: "success",
  PENDING: "warning",
  MISSING: "danger",
  EXPIRED: "danger",
};

function dateToInput(date: Date | null): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

type Props = {
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  records: ComplianceRecordRow[];
  documentViewUrls: Record<string, string>;
};

export function EmployeeComplianceChecklist({ employeeId, employeeName, employeeEmail, records, documentViewUrls }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (records.length === 0) {
    return (
      <SurfaceCard>
        <p className={cn(typography.body, "text-muted-foreground")}>
          No compliance items assigned. Required items are auto-assigned when an
          employee is created.
        </p>
      </SurfaceCard>
    );
  }

  const complete = records.filter(
    (r) => effectiveStatus(r.status, r.expirationDate) === "COMPLETE",
  ).length;
  const total = records.length;

  return (
    <div className={spacing.section}>
      <div className="flex items-center justify-between">
        <h2 className={typography.sectionTitle}>Compliance Checklist</h2>
        <span className={typography.meta}>
          {complete}/{total} complete
        </span>
      </div>

      <SurfaceCard className="p-0">
        <ul className="divide-y divide-border">
          {records.map((record) => {
            const isExpanded = expandedId === record.id;
            return (
              <li key={record.id}>
                <button
                  type="button"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : record.id)
                  }
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 min-h-[44px] text-left hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className={cn(typography.body, "font-medium")}>
                      {record.complianceItem.name}
                    </p>
                    {record.complianceItem.category ? (
                      <p className={typography.meta}>
                        {record.complianceItem.category}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2">
                    {record.documents.length > 0 ? (
                      <span className="inline-flex items-center gap-0.5 text-muted-foreground" title={`${record.documents.length} document${record.documents.length === 1 ? "" : "s"}`}>
                        <Paperclip className="h-3 w-3" />
                        <span className="text-[10px]">{record.documents.length}</span>
                      </span>
                    ) : null}
                    {record.followUpStatus !== "NOT_CONTACTED" ? (
                      <StatusBadge
                        kind="operational"
                        state={followUpStatusOperational[record.followUpStatus]}
                        label={followUpStatusLabels[record.followUpStatus]}
                      />
                    ) : null}
                    <ExpirationIndicator expirationDate={record.expirationDate} />
                    <StatusBadge
                      kind="operational"
                      state={
                        statusOperational[
                          effectiveStatus(
                            record.status,
                            record.expirationDate,
                          ) as ComplianceStatus
                        ]
                      }
                      label={
                        statusLabels[
                          effectiveStatus(
                            record.status,
                            record.expirationDate,
                          ) as ComplianceStatus
                        ]
                      }
                    />
                  </div>
                </button>
                {isExpanded ? (
                  <>
                    <RecordEditForm
                      recordId={record.id}
                      employeeId={employeeId}
                      employeeName={employeeName}
                      recipientEmail={employeeEmail}
                      itemName={record.complianceItem.name}
                      defaultValues={{
                        status: record.status,
                        completedDate: dateToInput(record.completedDate),
                        expirationDate: dateToInput(record.expirationDate),
                        notes: record.notes ?? "",
                        followUpStatus: record.followUpStatus,
                        followUpNotes: record.followUpNotes ?? "",
                        lastContactedDate: dateToInput(record.lastContactedDate),
                      }}
                      onClose={() => setExpandedId(null)}
                    />
                    <RecordDocuments
                      complianceRecordId={record.id}
                      employeeId={employeeId}
                      documents={record.documents}
                      viewUrlMap={documentViewUrls}
                    />
                  </>
                ) : null}
              </li>
            );
          })}
        </ul>
      </SurfaceCard>
    </div>
  );
}
