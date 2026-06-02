"use client";

import { ComplianceStatus, FollowUpStatus } from "@prisma/client";
import { useActionState } from "react";

import {
  updateComplianceRecord,
  type ComplianceRecordActionState,
} from "@/app/(admin)/admin/employees/[id]/compliance-actions";
import { ReminderDraft } from "@/components/admin/reminders/reminder-draft";
import { Button } from "@/components/ui/button";
import { followUpStatusOptions } from "@/lib/compliance/follow-up";
import {
  inputClassName,
  selectClassName,
  spacing,
  typography,
} from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

const statusOptions: { value: ComplianceStatus; label: string }[] = [
  { value: "MISSING", label: "Missing" },
  { value: "PENDING", label: "Pending" },
  { value: "COMPLETE", label: "Complete" },
  { value: "EXPIRED", label: "Expired" },
];

type Props = {
  recordId: string;
  employeeId: string;
  employeeName: string;
  recipientEmail: string;
  itemName: string;
  defaultValues: {
    status: ComplianceStatus;
    completedDate: string;
    expirationDate: string;
    notes: string;
    followUpStatus: FollowUpStatus;
    followUpNotes: string;
    lastContactedDate: string;
  };
  onClose: () => void;
};

const initialState: ComplianceRecordActionState = {};

function getReminderType(
  status: ComplianceStatus,
  expirationDate: string,
): "expired" | "expiring" | "missing" | null {
  if (status === "EXPIRED") return "expired";
  if (status === "MISSING") return "missing";
  if (status === "COMPLETE" && expirationDate) {
    const exp = new Date(expirationDate);
    const now = new Date();
    if (exp < now) return "expired";
    const daysUntil = Math.ceil(
      (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysUntil <= 30) return "expiring";
  }
  if (status === "PENDING") return "expiring";
  return null;
}

export function RecordEditForm({
  recordId,
  employeeId,
  employeeName,
  recipientEmail,
  itemName,
  defaultValues,
  onClose,
}: Props) {
  const action = updateComplianceRecord.bind(null, recordId, employeeId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <div className="border-t border-border bg-muted/30 px-4 py-3">
      <form action={formAction} className={cn(spacing.section)}>
        {state.error ? (
          <p className="text-xs text-destructive" role="alert">
            {state.error}
          </p>
        ) : null}
        {state.success ? (
          <p
            className="text-xs text-[var(--status-success-fg)]"
            role="status"
          >
            Saved.
          </p>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-3">
          <div className={spacing.stack}>
            <label htmlFor={`status-${recordId}`} className={typography.meta}>
              Status
            </label>
            <select
              id={`status-${recordId}`}
              name="status"
              defaultValue={defaultValues.status}
              className={selectClassName}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className={spacing.stack}>
            <label
              htmlFor={`completedDate-${recordId}`}
              className={typography.meta}
            >
              Completed date
            </label>
            <input
              id={`completedDate-${recordId}`}
              name="completedDate"
              type="date"
              defaultValue={defaultValues.completedDate}
              className={inputClassName}
            />
          </div>

          <div className={spacing.stack}>
            <label
              htmlFor={`expirationDate-${recordId}`}
              className={typography.meta}
            >
              Expiration date
            </label>
            <input
              id={`expirationDate-${recordId}`}
              name="expirationDate"
              type="date"
              defaultValue={defaultValues.expirationDate}
              className={inputClassName}
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className={spacing.stack}>
            <label
              htmlFor={`followUpStatus-${recordId}`}
              className={typography.meta}
            >
              Follow-up status
            </label>
            <select
              id={`followUpStatus-${recordId}`}
              name="followUpStatus"
              defaultValue={defaultValues.followUpStatus}
              className={selectClassName}
            >
              {followUpStatusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className={spacing.stack}>
            <label
              htmlFor={`lastContactedDate-${recordId}`}
              className={typography.meta}
            >
              Last contacted
            </label>
            <input
              id={`lastContactedDate-${recordId}`}
              name="lastContactedDate"
              type="date"
              defaultValue={defaultValues.lastContactedDate}
              className={inputClassName}
            />
          </div>
        </div>

        <div className={spacing.stack}>
          <label htmlFor={`notes-${recordId}`} className={typography.meta}>
            Notes
          </label>
          <textarea
            id={`notes-${recordId}`}
            name="notes"
            defaultValue={defaultValues.notes}
            rows={2}
            className={cn(inputClassName, "h-auto py-2")}
            placeholder="Optional notes"
          />
        </div>

        <div className={spacing.stack}>
          <label
            htmlFor={`followUpNotes-${recordId}`}
            className={typography.meta}
          >
            Follow-up notes
          </label>
          <textarea
            id={`followUpNotes-${recordId}`}
            name="followUpNotes"
            defaultValue={defaultValues.followUpNotes}
            rows={2}
            className={cn(inputClassName, "h-auto py-2")}
            placeholder="Optional follow-up notes"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>

      {(() => {
        const reminderType = getReminderType(
          defaultValues.status,
          defaultValues.expirationDate,
        );
        if (!reminderType) return null;
        return (
          <ReminderDraft
            complianceRecordId={recordId}
            employeeId={employeeId}
            employeeName={employeeName}
            recipientEmail={recipientEmail}
            itemName={itemName}
            expirationDate={
              defaultValues.expirationDate
                ? new Date(defaultValues.expirationDate)
                : null
            }
            reminderType={reminderType}
          />
        );
      })()}
    </div>
  );
}
