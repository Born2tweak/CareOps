/**
 * CareOps admin design tokens — use these maps instead of ad-hoc colors in UI.
 */

export const typography = {
  pageTitle: "text-2xl font-semibold tracking-tight text-foreground",
  sectionTitle: "text-sm font-medium text-foreground",
  label: "text-sm font-medium text-foreground",
  body: "text-sm text-foreground",
  meta: "text-xs text-muted-foreground",
  eyebrow: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
} as const;

export const spacing = {
  page: "space-y-6",
  section: "space-y-4",
  stack: "space-y-2",
  inline: "gap-2",
  toolbar: "gap-3",
} as const;

export const operationalStates = [
  "success",
  "warning",
  "danger",
  "pending",
  "info",
  "neutral",
] as const;

export type OperationalState = (typeof operationalStates)[number];

export const urgencyLevels = [
  "critical",
  "urgent",
  "warning",
  "normal",
  "resolved",
] as const;

export type UrgencyLevel = (typeof urgencyLevels)[number];

/** Tailwind classes for operational status badges */
export const operationalBadgeStyles: Record<
  OperationalState,
  { bg: string; text: string; ring: string }
> = {
  success: {
    bg: "bg-[var(--status-success-bg)]",
    text: "text-[var(--status-success-fg)]",
    ring: "ring-[var(--status-success-border)]",
  },
  warning: {
    bg: "bg-[var(--status-warning-bg)]",
    text: "text-[var(--status-warning-fg)]",
    ring: "ring-[var(--status-warning-border)]",
  },
  danger: {
    bg: "bg-[var(--status-danger-bg)]",
    text: "text-[var(--status-danger-fg)]",
    ring: "ring-[var(--status-danger-border)]",
  },
  pending: {
    bg: "bg-[var(--status-pending-bg)]",
    text: "text-[var(--status-pending-fg)]",
    ring: "ring-[var(--status-pending-border)]",
  },
  info: {
    bg: "bg-[var(--status-info-bg)]",
    text: "text-[var(--status-info-fg)]",
    ring: "ring-[var(--status-info-border)]",
  },
  neutral: {
    bg: "bg-[var(--status-neutral-bg)]",
    text: "text-[var(--status-neutral-fg)]",
    ring: "ring-[var(--status-neutral-border)]",
  },
};

export const urgencyBadgeStyles: Record<
  UrgencyLevel,
  { bg: string; text: string; ring: string }
> = {
  critical: {
    bg: "bg-[var(--urgency-critical-bg)]",
    text: "text-[var(--urgency-critical-fg)]",
    ring: "ring-[var(--urgency-critical-border)]",
  },
  urgent: {
    bg: "bg-[var(--urgency-urgent-bg)]",
    text: "text-[var(--urgency-urgent-fg)]",
    ring: "ring-[var(--urgency-urgent-border)]",
  },
  warning: {
    bg: "bg-[var(--urgency-warning-bg)]",
    text: "text-[var(--urgency-warning-fg)]",
    ring: "ring-[var(--urgency-warning-border)]",
  },
  normal: {
    bg: "bg-[var(--urgency-normal-bg)]",
    text: "text-[var(--urgency-normal-fg)]",
    ring: "ring-[var(--urgency-normal-border)]",
  },
  resolved: {
    bg: "bg-[var(--urgency-resolved-bg)]",
    text: "text-[var(--urgency-resolved-fg)]",
    ring: "ring-[var(--urgency-resolved-border)]",
  },
};

export const inputClassName =
  "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

export const selectClassName = inputClassName;
