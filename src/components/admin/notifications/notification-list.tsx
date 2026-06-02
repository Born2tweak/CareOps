import Link from "next/link";

import { StatusBadge } from "@/components/ui/status-badge";
import { SurfaceCard } from "@/components/ui/surface-card";
import type { NotificationType } from "@prisma/client";
import type { OperationalState } from "@/lib/design-tokens";
import { typography } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

const typeState: Record<NotificationType, OperationalState> = {
  EXPIRED: "danger",
  EXPIRING_SOON: "warning",
  MISSING_ITEM: "danger",
  SYSTEM: "info",
};

const typeLabel: Record<NotificationType, string> = {
  EXPIRED: "Expired",
  EXPIRING_SOON: "Expiring",
  MISSING_ITEM: "Missing",
  SYSTEM: "System",
};

type NotificationRow = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  sentAt: Date;
  employee: { id: string; firstName: string; lastName: string } | null;
};

type Props = {
  notifications: NotificationRow[];
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function NotificationList({ notifications }: Props) {
  if (notifications.length === 0) {
    return (
      <SurfaceCard>
        <p className={cn(typography.body, "text-muted-foreground")}>
          No notifications yet.
        </p>
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard className="p-0">
      <ul className="divide-y divide-border">
        {notifications.map((n) => (
          <li key={n.id}>
            <div
              className={cn(
                "flex items-start gap-3 px-4 py-3",
                !n.isRead && "bg-muted/30",
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <StatusBadge
                    kind="operational"
                    state={typeState[n.type]}
                    label={typeLabel[n.type]}
                  />
                  {!n.isRead ? (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  ) : null}
                </div>
                <p className={cn(typography.body, "mt-1 font-medium")}>
                  {n.title}
                </p>
                <p className={typography.meta}>{n.message}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className={typography.meta}>
                    {formatTimeAgo(n.sentAt)}
                  </span>
                  {n.employee ? (
                    <Link
                      href={`/admin/employees/${n.employee.id}`}
                      className={cn(typography.meta, "text-primary hover:underline")}
                    >
                      View employee →
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </SurfaceCard>
  );
}
