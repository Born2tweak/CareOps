"use client";

import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { spacing, typography } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminError({ error, reset }: Props) {
  return (
    <div className={cn("mx-auto max-w-lg", spacing.page)}>
      <SurfaceCard className={spacing.section}>
        <h1 className={typography.pageTitle}>Something went wrong</h1>
        <p className={cn(typography.body, "text-muted-foreground")}>
          An unexpected error occurred. Please try again or contact support if the problem persists.
        </p>
        {error.digest ? (
          <p className={typography.meta}>Error ID: {error.digest}</p>
        ) : null}
        <Button onClick={reset}>Try again</Button>
      </SurfaceCard>
    </div>
  );
}
