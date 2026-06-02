import Link from "next/link";

import { typography } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  className?: string;
};

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  backHref,
  backLabel = "Back",
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div className="min-w-0 space-y-1">
        {backHref ? (
          <Link
            href={backHref}
            className={cn(typography.meta, "inline-flex font-medium text-primary hover:underline")}
          >
            ← {backLabel}
          </Link>
        ) : null}
        {eyebrow ? <p className={typography.eyebrow}>{eyebrow}</p> : null}
        <h1 className={typography.pageTitle}>{title}</h1>
        {description ? (
          <p className={cn(typography.meta, "max-w-2xl")}>{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
