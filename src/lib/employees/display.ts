import { EmploymentStatus } from "@prisma/client";

import type { OperationalState } from "@/lib/design-tokens";

export const employmentStatusLabels: Record<EmploymentStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  ONBOARDING: "Onboarding",
  TERMINATED: "Terminated",
};

export const employmentStatusOperational: Record<
  EmploymentStatus,
  OperationalState
> = {
  ACTIVE: "success",
  ONBOARDING: "pending",
  INACTIVE: "neutral",
  TERMINATED: "danger",
};

export type EmployeeStatusFilter =
  | "ACTIVE"
  | "ALL"
  | "ONBOARDING"
  | "INACTIVE"
  | "TERMINATED";

export const employeeStatusFilterOptions: {
  value: EmployeeStatusFilter;
  label: string;
}[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "ALL", label: "All statuses" },
  { value: "ONBOARDING", label: "Onboarding" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "TERMINATED", label: "Terminated" },
];

export function parseStatusFilter(
  raw: string | undefined,
): EmployeeStatusFilter {
  if (
    raw === "ALL" ||
    raw === "ONBOARDING" ||
    raw === "INACTIVE" ||
    raw === "TERMINATED"
  ) {
    return raw;
  }
  return "ACTIVE";
}

export function formatEmployeeName(
  firstName: string,
  lastName: string,
): string {
  return `${firstName} ${lastName}`;
}

export function formatHireDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
