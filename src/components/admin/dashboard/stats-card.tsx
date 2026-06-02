import Link from "next/link";

import { SurfaceCard } from "@/components/ui/surface-card";
import type { OperationalState } from "@/lib/design-tokens";
import { operationalBadgeStyles, typography } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string | number;
  href?: string;
  state?: OperationalState;
};

export function StatsCard({ label, value, href, state }: Props) {
  const content = (
    <SurfaceCard
      className={cn(
        "flex flex-col gap-1 p-4",
        href && "transition-colors hover:bg-muted/50",
      )}
    >
      <span className={typography.meta}>{label}</span>
      <span
        className={cn(
          "text-2xl font-semibold tracking-tight",
          state ? operationalBadgeStyles[state].text : "text-foreground",
        )}
      >
        {value}
      </span>
    </SurfaceCard>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
