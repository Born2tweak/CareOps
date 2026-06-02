import type { FollowUpStatus } from "@prisma/client";

import type { OperationalState } from "@/lib/design-tokens";

export const followUpStatusLabels: Record<FollowUpStatus, string> = {
  NOT_CONTACTED: "Not Contacted",
  CONTACTED: "Contacted",
  AWAITING_RENEWAL: "Awaiting Renewal",
  PENDING_REVIEW: "Pending Review",
  ESCALATED: "Escalated",
  RESOLVED: "Resolved",
};

export const followUpStatusOperational: Record<FollowUpStatus, OperationalState> = {
  NOT_CONTACTED: "neutral",
  CONTACTED: "info",
  AWAITING_RENEWAL: "pending",
  PENDING_REVIEW: "warning",
  ESCALATED: "danger",
  RESOLVED: "success",
};

export const followUpStatusOptions: { value: FollowUpStatus; label: string }[] = [
  { value: "NOT_CONTACTED", label: "Not Contacted" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "AWAITING_RENEWAL", label: "Awaiting Renewal" },
  { value: "PENDING_REVIEW", label: "Pending Review" },
  { value: "ESCALATED", label: "Escalated" },
  { value: "RESOLVED", label: "Resolved" },
];
