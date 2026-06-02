"use client";

import { useActionState, useState } from "react";

import {
  sendReminderEmail,
  type SendReminderState,
} from "@/app/(admin)/admin/employees/[id]/reminder-actions";
import { CopyButton } from "@/components/admin/reminders/copy-button";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { generateReminder } from "@/lib/reminders/templates";
import { spacing, typography } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

type Props = {
  complianceRecordId: string;
  employeeId: string;
  employeeName: string;
  recipientEmail: string;
  itemName: string;
  expirationDate: Date | null;
  reminderType: "expired" | "expiring" | "missing";
};

const initialState: SendReminderState = {};

export function ReminderDraft({
  complianceRecordId,
  employeeId,
  employeeName,
  recipientEmail,
  itemName,
  expirationDate,
  reminderType,
}: Props) {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<"email" | "sms">("email");
  const [confirmDuplicate, setConfirmDuplicate] = useState(false);
  const [sendState, sendAction, sending] = useActionState(
    sendReminderEmail,
    initialState,
  );

  if (!open) {
    return (
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
      >
        Draft Reminder
      </Button>
    );
  }

  const draft = generateReminder(reminderType, {
    employeeName,
    itemName,
    expirationDate,
  });

  const needsConfirmation =
    sendState.error?.includes("already sent") && !confirmDuplicate;

  return (
    <SurfaceCard className={cn("mt-2", spacing.section)}>
      <div className="flex items-center justify-between">
        <h3 className={typography.sectionTitle}>Reminder Draft</h3>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setOpen(false)}
        >
          Close
        </Button>
      </div>

      {sendState.success ? (
        <p className="text-xs text-[var(--status-success-fg)]" role="status">
          Reminder sent to {recipientEmail}.
        </p>
      ) : null}

      {sendState.error ? (
        <p className="text-xs text-destructive" role="alert">
          {sendState.error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant={format === "email" ? "default" : "outline"}
          onClick={() => setFormat("email")}
        >
          Email
        </Button>
        <Button
          type="button"
          size="sm"
          variant={format === "sms" ? "default" : "outline"}
          onClick={() => setFormat("sms")}
        >
          SMS
        </Button>
      </div>

      {format === "email" ? (
        <div className={spacing.section}>
          <div className={spacing.stack}>
            <p className={typography.meta}>Subject</p>
            <p className={cn(typography.body, "font-medium")}>
              {draft.emailSubject}
            </p>
          </div>
          <div className={spacing.stack}>
            <p className={typography.meta}>Body</p>
            <pre className={cn(typography.body, "whitespace-pre-wrap")}>
              {draft.emailBody}
            </pre>
          </div>
          <div className="flex items-center gap-2">
            <CopyButton
              text={`Subject: ${draft.emailSubject}\n\n${draft.emailBody}`}
              label="Copy Email"
            />
            <form action={sendAction}>
              <input type="hidden" name="complianceRecordId" value={complianceRecordId} />
              <input type="hidden" name="employeeId" value={employeeId} />
              <input type="hidden" name="recipientEmail" value={recipientEmail} />
              <input type="hidden" name="reminderType" value={reminderType} />
              <input type="hidden" name="subject" value={draft.emailSubject} />
              <input type="hidden" name="body" value={draft.emailBody} />
              {needsConfirmation ? (
                <>
                  <input type="hidden" name="confirmDuplicate" value="true" />
                  <Button
                    type="submit"
                    size="sm"
                    variant="destructive"
                    disabled={sending}
                    onClick={() => setConfirmDuplicate(true)}
                  >
                    {sending ? "Sending…" : "Confirm Send Again"}
                  </Button>
                </>
              ) : (
                <Button type="submit" size="sm" disabled={sending || sendState.success}>
                  {sending ? "Sending…" : "Send Email"}
                </Button>
              )}
            </form>
          </div>
        </div>
      ) : (
        <div className={spacing.section}>
          <div className={spacing.stack}>
            <p className={typography.meta}>Message</p>
            <p className={typography.body}>{draft.smsBody}</p>
          </div>
          <CopyButton text={draft.smsBody} label="Copy SMS" />
        </div>
      )}
    </SurfaceCard>
  );
}
