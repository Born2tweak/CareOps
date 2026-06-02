"use client";

import { useActionState, useRef } from "react";

import {
  uploadDocument,
  type DocumentActionState,
} from "@/app/(admin)/admin/employees/[id]/document-actions";
import { Button } from "@/components/ui/button";
import { ALLOWED_EXTENSIONS, MAX_FILE_SIZE } from "@/lib/documents/storage";
import { typography } from "@/lib/design-tokens";

type Props = {
  complianceRecordId: string;
  employeeId: string;
};

const acceptString = Array.from(ALLOWED_EXTENSIONS)
  .map((ext) => `.${ext}`)
  .join(",");

const initialState: DocumentActionState = {};

export function DocumentUploadForm({
  complianceRecordId,
  employeeId,
}: Props) {
  const action = uploadDocument.bind(null, complianceRecordId, employeeId);
  const [state, formAction, pending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await formAction(formData);
        formRef.current?.reset();
      }}
      className="flex flex-wrap items-end gap-2"
    >
      {state.error ? (
        <p className="w-full text-xs text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p
          className="w-full text-xs text-[var(--status-success-fg)]"
          role="status"
        >
          Document uploaded.
        </p>
      ) : null}

      <div className="min-w-0 flex-1">
        <label htmlFor={`upload-${complianceRecordId}`} className="sr-only">
          Choose file
        </label>
        <input
          id={`upload-${complianceRecordId}`}
          type="file"
          name="file"
          accept={acceptString}
          required
          className="block w-full text-sm file:mr-2 file:rounded-lg file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-foreground hover:file:bg-muted/80"
        />
        <p className={`mt-0.5 ${typography.meta}`}>
          PDF, PNG, JPG, WEBP. Max {MAX_FILE_SIZE / 1024 / 1024}MB.
        </p>
      </div>

      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Uploading…" : "Upload"}
      </Button>
    </form>
  );
}
