import { StatusBadge } from "@/components/ui/status-badge";
import { computeUrgency } from "@/lib/compliance/urgency";

type Props = {
  expirationDate: Date | null;
};

export function ExpirationIndicator({ expirationDate }: Props) {
  const urgency = computeUrgency(expirationDate);

  if (urgency.level === "resolved") {
    return null;
  }

  return (
    <StatusBadge
      kind="urgency"
      level={urgency.level}
      label={urgency.label}
    />
  );
}
