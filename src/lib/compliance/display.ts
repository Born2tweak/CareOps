export const complianceCategoryLabels: Record<string, string> = {
  Medical: "Medical",
  Legal: "Legal",
  Training: "Training",
};

export const complianceCategoryOptions = [
  { value: "Medical", label: "Medical" },
  { value: "Legal", label: "Legal" },
  { value: "Training", label: "Training" },
];

export type ComplianceItemFilter = "ALL" | "REQUIRED" | "OPTIONAL";

export const complianceItemFilterOptions: {
  value: ComplianceItemFilter;
  label: string;
}[] = [
  { value: "ALL", label: "All items" },
  { value: "REQUIRED", label: "Required" },
  { value: "OPTIONAL", label: "Optional" },
];

export function parseComplianceItemFilter(
  raw: string | undefined,
): ComplianceItemFilter {
  if (raw === "REQUIRED" || raw === "OPTIONAL") {
    return raw;
  }
  return "ALL";
}

export function formatExpirationRule(days: number | null): string {
  if (days === null) return "Never expires";
  if (days >= 730) {
    const years = Math.round(days / 365);
    return `${years} year${years === 1 ? "" : "s"}`;
  }
  if (days >= 60) {
    const months = Math.round(days / 30);
    return `${months} month${months === 1 ? "" : "s"}`;
  }
  return `${days} day${days === 1 ? "" : "s"}`;
}
