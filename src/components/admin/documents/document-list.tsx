"use client";

import { useActionState, useState } from "react";
import { FileText, Image, Trash2, RefreshCw, ExternalLink } from "lucide-react";

import {
  removeDocument,
  replaceDocument,
  type DocumentActionState,
} from "@/app/(admin)/admin/employees/[id]/document-actions";
import { Button } from "@/components/ui/button";
import { ALLOWED_EXTENSIONS, MAX_FILE_SIZE } from "@/lib/documents/storage";
import { typography } from "@/lib/design-tokens";
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
  documents: DocumentRow[];
  employeeId: string;
  viewUrlMap: Record<string, string>;
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileIcon({ fileType }: { fileType: string }) {
  if (fileType.startsWith("image/")) {
    return <Image className="h-4 w-4 shrink-0 text-muted-foreground" />;
  }
  return <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />;
}

const acceptString = Array.from(ALLOWED_EXTENSIONS)
  .map((ext) => `.${ext}`)
  .join(",");

function DocumentItem({
  doc,
  employeeId,
  viewUrl,
}: {
  doc: DocumentRow;
  employeeId: string;
  viewUrl: string | undefined;
}) {
  const [replacing, setReplacing] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const replaceAction = replaceDocument.bind(null, doc.id, employeeId);
  const [replaceState, replaceFormAction, replacePending] = useActionState(
    replaceAction,
    {} as DocumentActionState,
  );

  async function handleRemove() {
    await removeDocument(doc.id, employeeId);
  }

  return (
    <li className="flex flex-col gap-2 px-3 py-2">
      <div className="flex items-center gap-2">
        <FileIcon fileType={doc.fileType} />
        <div className="min-w-0 flex-1">
          <p className={cn(typography.body, "truncate font-medium")}>
            {doc.fileName}
          </p>
          <p className={typography.meta}>
            {formatFileSize(doc.fileSize)} ·{" "}
            {doc.createdAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {viewUrl ? (
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title="Open document"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => setReplacing((v) => !v)}
            className="inline-flex items-center justify-center rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Replace document"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          {confirmRemove ? (
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={handleRemove}
            >
              Confirm
            </Button>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmRemove(true)}
              className="inline-flex items-center justify-center rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
              title="Remove document"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {replacing ? (
        <form action={replaceFormAction} className="flex items-end gap-2">
          {replaceState.error ? (
            <p className="w-full text-xs text-destructive">{replaceState.error}</p>
          ) : null}
          <input
            type="file"
            name="file"
            accept={acceptString}
            required
            className="block min-w-0 flex-1 text-sm file:mr-2 file:rounded-lg file:border-0 file:bg-muted file:px-2 file:py-1 file:text-xs file:font-medium"
          />
          <Button type="submit" size="sm" disabled={replacePending}>
            {replacePending ? "Replacing…" : "Replace"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setReplacing(false)}
          >
            Cancel
          </Button>
        </form>
      ) : null}
    </li>
  );
}

export function DocumentList({ documents, employeeId, viewUrlMap }: Props) {
  if (documents.length === 0) {
    return (
      <p className={cn(typography.meta, "text-muted-foreground")}>
        No documents uploaded.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border rounded-lg border border-border">
      {documents.map((doc) => (
        <DocumentItem
          key={doc.id}
          doc={doc}
          employeeId={employeeId}
          viewUrl={viewUrlMap[doc.id]}
        />
      ))}
    </ul>
  );
}
