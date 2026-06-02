"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { adminNavItems, isAdminNavActive } from "@/components/admin/nav-config";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AdminNavProps = {
  userEmail: string;
  signOutAction: () => Promise<void>;
};

export function AdminNav({ userEmail, signOutAction }: AdminNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = (
    <nav className="flex flex-1 flex-col gap-0.5 px-2 py-3" aria-label="Admin">
      {adminNavItems.map((item) => {
        const active = isAdminNavActive(pathname, item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
              active
                ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon className="size-4 shrink-0 opacity-80" aria-hidden />
            <span className="min-w-0 flex-1 truncate">{item.title}</span>
            {item.placeholder ? (
              <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {item.milestone}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );

  const sidebarInner = (
    <>
      <div className="border-b border-sidebar-border px-4 py-4">
        <p className="text-sm font-semibold tracking-tight text-sidebar-foreground">
          CareOps
        </p>
        <p className="text-xs text-sidebar-foreground/60">Admin</p>
      </div>
      {navLinks}
      <div className="mt-auto border-t border-sidebar-border px-4 py-4">
        <p className="truncate text-xs text-sidebar-foreground/70">{userEmail}</p>
        <form action={signOutAction} className="mt-3">
          <Button type="submit" variant="outline" size="sm" className="w-full">
            Sign out
          </Button>
        </form>
      </div>
    </>
  );

  return (
    <>
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border bg-background px-4 lg:hidden">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-expanded={mobileOpen}
          aria-controls="admin-mobile-nav"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? (
            <X className="size-4" aria-hidden />
          ) : (
            <Menu className="size-4" aria-hidden />
          )}
          <span className="sr-only">
            {mobileOpen ? "Close navigation" : "Open navigation"}
          </span>
        </Button>
        <span className="text-sm font-medium">CareOps Admin</span>
      </div>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-foreground/20 lg:hidden"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        id="admin-mobile-nav"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:static lg:z-auto lg:h-auto lg:min-h-screen lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {sidebarInner}
      </aside>
    </>
  );
}
