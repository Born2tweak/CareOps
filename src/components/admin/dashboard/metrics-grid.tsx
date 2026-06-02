import { StatsCard } from "@/components/admin/dashboard/stats-card";
import type { DashboardMetrics } from "@/lib/dashboard/metrics";

type Props = {
  metrics: DashboardMetrics;
};

export function MetricsGrid({ metrics }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        label="Active Employees"
        value={metrics.totalActiveEmployees}
        href="/admin/employees"
      />
      <StatsCard
        label="Fully Compliant"
        value={metrics.fullyCompliant}
        state="success"
        href="/admin/employees"
      />
      <StatsCard
        label="Incomplete"
        value={metrics.incompleteEmployees}
        state={metrics.incompleteEmployees > 0 ? "warning" : "success"}
        href="/admin/queue"
      />
      <StatsCard
        label="Compliance Rate"
        value={`${metrics.compliancePercentage}%`}
        state={
          metrics.compliancePercentage >= 90
            ? "success"
            : metrics.compliancePercentage >= 70
              ? "warning"
              : "danger"
        }
      />
      <StatsCard
        label="Expired"
        value={metrics.expiredCount}
        state={metrics.expiredCount > 0 ? "danger" : "success"}
        href="/admin/queue"
      />
      <StatsCard
        label="Expiring Soon (30d)"
        value={metrics.expiringSoonCount}
        state={metrics.expiringSoonCount > 0 ? "warning" : "success"}
        href="/admin/queue"
      />
      <StatsCard
        label="Onboarding Incomplete"
        value={metrics.onboardingIncomplete}
        state={metrics.onboardingIncomplete > 0 ? "pending" : "success"}
        href="/admin/employees"
      />
    </div>
  );
}
