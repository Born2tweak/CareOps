import Link from "next/link";
import { Bell } from "lucide-react";

import { getUnreadNotificationCount } from "@/lib/notifications/queries";

export async function NotificationBell() {
  const count = await getUnreadNotificationCount();

  return (
    <Link
      href="/admin/notifications"
      className="relative inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label={`Notifications${count > 0 ? ` (${count} unread)` : ""}`}
    >
      <Bell className="h-5 w-5" />
      {count > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
