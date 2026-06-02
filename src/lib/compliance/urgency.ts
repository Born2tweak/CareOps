import type { UrgencyLevel } from "@/lib/design-tokens";

export type UrgencyResult = {
  level: UrgencyLevel;
  label: string;
  daysUntilExpiration: number | null;
};

/**
 * Compute urgency from an expiration date relative to today.
 *
 * - critical: expired or expires within 7 days
 * - urgent: expires within 7 days (alias, same visual as critical)
 * - warning: expires within 30 days
 * - normal: more than 30 days out
 * - resolved: no expiration date set (never expires)
 */
export function computeUrgency(
  expirationDate: Date | null,
  now: Date = new Date(),
): UrgencyResult {
  if (!expirationDate) {
    return { level: "resolved", label: "No expiration", daysUntilExpiration: null };
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const diffMs = expirationDate.getTime() - now.getTime();
  const daysUntil = Math.ceil(diffMs / msPerDay);

  if (daysUntil < 0) {
    return {
      level: "critical",
      label: `Expired ${Math.abs(daysUntil)}d ago`,
      daysUntilExpiration: daysUntil,
    };
  }

  if (daysUntil <= 7) {
    return {
      level: "critical",
      label: daysUntil === 0 ? "Expires today" : `Expires in ${daysUntil}d`,
      daysUntilExpiration: daysUntil,
    };
  }

  if (daysUntil <= 30) {
    return {
      level: "warning",
      label: `Expires in ${daysUntil}d`,
      daysUntilExpiration: daysUntil,
    };
  }

  return {
    level: "normal",
    label: `Expires in ${daysUntil}d`,
    daysUntilExpiration: daysUntil,
  };
}

/**
 * Determine the effective compliance status considering expiration.
 * If a record is marked COMPLETE but its expiration has passed, it's effectively EXPIRED.
 */
export function effectiveStatus(
  status: string,
  expirationDate: Date | null,
  now: Date = new Date(),
): string {
  if (
    status === "COMPLETE" &&
    expirationDate &&
    expirationDate.getTime() < now.getTime()
  ) {
    return "EXPIRED";
  }
  return status;
}
