import Link from "next/link";

import { StatusBadge } from "@/components/ui/status-badge";
import { SurfaceCard } from "@/components/ui/surface-card";
import type { ExceptionRecord } from "@/lib/compliance/exceptions";
import { computeUrgency } from "@/lib/compliance/urgency";
import type { UrgencyLevel } from "@/lib/design-tokens";
import { typography } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  level: UrgencyLevel;
  records: ExceptionRecord[];
  emptyMessage?: string;
};

export function ExceptionSection({
  title,
  level,
  records,
  emptyMessage = "All clear.",
}: Props) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <h2 className={typography.sectionTitle}>{title}</h2>
        <StatusBadge kind="urgency" level={level} label={String(records.length)} />
      </div>

      {records.length === 0 ? (
        <SurfaceCard>
          <p className={cn(typography.body, "text-muted-foreground")}>
            {emptyMessage}
          </p>
        </SurfaceCard>
      ) : (
        <SurfaceCard className="p-0">
          <ul className="divide-y divide-border">
            {records.map((record) => {
              const urgency = computeUrgency(record.expirationDate);
              return (
                <li key={record.id}>
                  <Link
                    href={`/admin/employees/${record.employee.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 min-h-[44px] hover:bg-muted/50 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className={cn(typography.body, "font-medium truncate")}>
                        {record.employee.firstName} {record.employee.lastName}
                      </p>
                      <p className={typography.meta}>
                        {record.complianceItem.name}
                        {record.complianceItem.category
                          ? ` · ${record.complianceItem.category}`
                          : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {urgency.level !== "resolved" ? (
                        <StatusBadge
                          kind="urgency"
                          level={urgency.level}
                          label={urgency.label}
                        />
                      ) : null}
                      <span className={cn(typography.meta, "text-primary")}>
                        View →
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </SurfaceCard>
      )}
    </div>
  );
}
