"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
  complianceItemFilterOptions,
  type ComplianceItemFilter,
} from "@/lib/compliance/display";
import { cn } from "@/lib/utils";

type Props = {
  current: ComplianceItemFilter;
};

export function ComplianceItemFilterBar({ current }: Props) {
  const searchParams = useSearchParams();

  function hrefFor(value: ComplianceItemFilter) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "ALL") {
      params.delete("filter");
    } else {
      params.set("filter", value);
    }
    const qs = params.toString();
    return qs ? `/admin/compliance-items?${qs}` : "/admin/compliance-items";
  }

  return (
    <nav className="flex flex-wrap gap-1" aria-label="Filter compliance items">
      {complianceItemFilterOptions.map((opt) => (
        <Link
          key={opt.value}
          href={hrefFor(opt.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            current === opt.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          {opt.label}
        </Link>
      ))}
    </nav>
  );
}
