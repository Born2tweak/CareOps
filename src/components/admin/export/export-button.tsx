"use client";

import { Button } from "@/components/ui/button";

type ExportType = "all" | "incomplete" | "expiring" | "exceptions";

type Props = {
  type: ExportType;
  label?: string;
};

const defaultLabels: Record<ExportType, string> = {
  all: "Export All",
  incomplete: "Export Incomplete",
  expiring: "Export Expiring",
  exceptions: "Export Exceptions",
};

export function ExportButton({ type, label }: Props) {
  function handleExport() {
    window.open(`/api/export?type=${type}`, "_blank");
  }

  return (
    <Button type="button" size="sm" variant="outline" onClick={handleExport}>
      {label ?? defaultLabels[type]}
    </Button>
  );
}
