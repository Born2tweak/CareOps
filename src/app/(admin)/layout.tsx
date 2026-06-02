import { requireAdmin } from "@/lib/auth";

import { adminSignOut } from "@/app/(admin)/actions";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { appUser } = await requireAdmin();

  return (
    <AdminShell userEmail={appUser.email} signOutAction={adminSignOut}>
      {children}
    </AdminShell>
  );
}
