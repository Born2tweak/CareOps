import {
  ClipboardList,
  LayoutDashboard,
  ListChecks,
  Users,
  type LucideIcon,
} from "lucide-react";

export type AdminNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Shown on placeholder routes until the milestone ships */
  placeholder?: boolean;
  milestone?: string;
};

export const adminNavItems: AdminNavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Exception Queue",
    href: "/admin/queue",
    icon: ClipboardList,
  },
  {
    title: "Employees",
    href: "/admin/employees",
    icon: Users,
  },
  {
    title: "Compliance Items",
    href: "/admin/compliance-items",
    icon: ListChecks,
  },
];

export function isAdminNavActive(pathname: string, href: string): boolean {
  if (href === "/admin") {
    return pathname === "/admin";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
