import { Suspense } from "react";

import { AdminNav } from "@/components/admin/admin-nav";
import { NotificationBell } from "@/components/admin/notifications/notification-bell";

type AdminShellProps = {
  userEmail: string;
  signOutAction: () => Promise<void>;
  children: React.ReactNode;
};

export function AdminShell({
  userEmail,
  signOutAction,
  children,
}: AdminShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <AdminNav userEmail={userEmail} signOutAction={signOutAction} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-end border-b border-border px-4 py-2 sm:px-6 lg:px-8">
          <Suspense>
            <NotificationBell />
          </Suspense>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
