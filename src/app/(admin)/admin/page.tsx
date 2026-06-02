import { MetricsGrid } from "@/components/admin/dashboard/metrics-grid";
import { PageHeader } from "@/components/ui/page-header";
import { getDashboardMetrics } from "@/lib/dashboard/metrics";
import { spacing } from "@/lib/design-tokens";

export const metadata = {
  title: "Dashboard — CareOps",
};

export default async function AdminDashboardPage() {
  const metrics = await getDashboardMetrics();

  return (
    <div className={spacing.page}>
      <PageHeader
        title="Dashboard"
        description="Operational overview across all active employees."
      />
      <MetricsGrid metrics={metrics} />
    </div>
  );
}
