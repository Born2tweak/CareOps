import Link from "next/link";

import {
  employeeStatusFilterOptions,
  type EmployeeStatusFilter,
} from "@/lib/employees/display";
import { cn } from "@/lib/utils";

type EmployeeStatusFilterBarProps = {
  current: EmployeeStatusFilter;
};

export function EmployeeStatusFilterBar({
  current,
}: EmployeeStatusFilterBarProps) {
  return (
    <div
      className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted/30 p-1"
      role="tablist"
      aria-label="Filter by employment status"
    >
      {employeeStatusFilterOptions.map((option) => {
        const href =
          option.value === "ACTIVE"
            ? "/admin/employees"
            : `/admin/employees?status=${option.value}`;
        const active = current === option.value;

        return (
          <Link
            key={option.value}
            href={href}
            role="tab"
            aria-selected={active}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
