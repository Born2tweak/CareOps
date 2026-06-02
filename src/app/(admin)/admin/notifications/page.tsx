import { NotificationList } from "@/components/admin/notifications/notification-list";
import { MarkAllReadButton } from "@/components/admin/notifications/mark-all-read-button";
import { PageHeader } from "@/components/ui/page-header";
import { getRecentNotifications } from "@/lib/notifications/queries";
import { spacing } from "@/lib/design-tokens";

export const metadata = {
  title: "Notifications — CareOps",
};

export default async function NotificationsPage() {
  const notifications = await getRecentNotifications(50);

  return (
    <div className={spacing.page}>
      <PageHeader
        title="Notifications"
        description="Automated alerts and system notifications."
        actions={<MarkAllReadButton />}
      />
      <NotificationList notifications={notifications} />
    </div>
  );
}
