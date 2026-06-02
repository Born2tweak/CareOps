import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { spacing, typography } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export default function AdminNotFound() {
  return (
    <div className={cn("mx-auto max-w-lg", spacing.page)}>
      <SurfaceCard className={spacing.section}>
        <h1 className={typography.pageTitle}>Page not found</h1>
        <p className={cn(typography.body, "text-muted-foreground")}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Button render={<Link href="/admin" />}>Back to Dashboard</Button>
      </SurfaceCard>
    </div>
  );
}
