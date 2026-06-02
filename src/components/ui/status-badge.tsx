import {
  operationalBadgeStyles,
  type OperationalState,
  urgencyBadgeStyles,
  type UrgencyLevel,
} from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  label: string;
  className?: string;
} & (
  | { kind: "operational"; state: OperationalState }
  | { kind: "urgency"; level: UrgencyLevel }
);

export function StatusBadge(props: StatusBadgeProps) {
  const styles =
    props.kind === "operational"
      ? operationalBadgeStyles[props.state]
      : urgencyBadgeStyles[props.level];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        styles.bg,
        styles.text,
        styles.ring,
        props.className,
      )}
    >
      {props.label}
    </span>
  );
}
