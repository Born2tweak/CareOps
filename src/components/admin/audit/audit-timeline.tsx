import { SurfaceCard } from "@/components/ui/surface-card";
import { spacing, typography } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

type AuditEntry = {
  id: string;
  action: string;
  entityType: string;
  details: unknown;
  createdAt: Date;
};

type Props = {
  entries: AuditEntry[];
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatAction(action: string): string {
  return action
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getDetailSummary(details: unknown): string | null {
  if (!details || typeof details !== "object") return null;
  const d = details as Record<string, unknown>;
  const parts: string[] = [];
  if (d.field) parts.push(`Field: ${d.field}`);
  if (d.from !== undefined && d.to !== undefined) {
    parts.push(`${String(d.from)} → ${String(d.to)}`);
  }
  if (d.status) parts.push(`Status: ${d.status}`);
  if (d.notes && typeof d.notes === "string") {
    parts.push(d.notes.length > 80 ? `${d.notes.slice(0, 80)}…` : d.notes);
  }
  return parts.length > 0 ? parts.join(" · ") : null;
}

export function AuditTimeline({ entries }: Props) {
  if (entries.length === 0) {
    return (
      <div className={spacing.section}>
        <h2 className={typography.sectionTitle}>Activity Log</h2>
        <SurfaceCard>
          <p className={cn(typography.body, "text-muted-foreground")}>
            No activity recorded yet.
          </p>
        </SurfaceCard>
      </div>
    );
  }

  return (
    <div className={spacing.section}>
      <h2 className={typography.sectionTitle}>Activity Log</h2>
      <SurfaceCard className="p-0">
        <ul className="divide-y divide-border">
          {entries.map((entry) => {
            const detail = getDetailSummary(entry.details);
            return (
              <li key={entry.id} className="px-4 py-3">
                <div className="flex items-baseline justify-between gap-2">
                  <p className={cn(typography.body, "font-medium")}>
                    {formatAction(entry.action)}
                  </p>
                  <span className={cn(typography.meta, "shrink-0")}>
                    {formatDate(entry.createdAt)}
                  </span>
                </div>
                {detail ? (
                  <p className={cn(typography.meta, "mt-0.5")}>{detail}</p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </SurfaceCard>
    </div>
  );
}
