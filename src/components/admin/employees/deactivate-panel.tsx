"use client";

import { EmploymentStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { deactivateEmployee } from "@/app/(admin)/admin/employees/actions";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { typography } from "@/lib/design-tokens";

type DeactivatePanelProps = {
  employeeId: string;
  currentStatus: EmploymentStatus;
};

export function DeactivatePanel({
  employeeId,
  currentStatus,
}: DeactivatePanelProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();

  if (
    currentStatus === EmploymentStatus.INACTIVE ||
    currentStatus === EmploymentStatus.TERMINATED
  ) {
    return (
      <SurfaceCard className="border-dashed">
        <p className={typography.body}>
          This employee is already marked{" "}
          <span className="font-medium">
            {currentStatus === EmploymentStatus.TERMINATED
              ? "terminated"
              : "inactive"}
          </span>
          . Update status above if you need to change it.
        </p>
      </SurfaceCard>
    );
  }

  async function runDeactivate(status: "INACTIVE" | "TERMINATED") {
    setError(undefined);
    const result = await deactivateEmployee(employeeId, status);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <SurfaceCard className="border-dashed">
      <div className="space-y-3">
        <div>
          <h2 className={typography.sectionTitle}>Deactivate employee</h2>
          <p className={typography.meta}>
            Removes them from the active roster without deleting history.
            Compliance records are unchanged.
          </p>
        </div>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={() =>
              startTransition(() => runDeactivate("INACTIVE"))
            }
          >
            Mark inactive
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={pending}
            onClick={() =>
              startTransition(() => runDeactivate("TERMINATED"))
            }
          >
            Mark terminated
          </Button>
        </div>
      </div>
    </SurfaceCard>
  );
}
