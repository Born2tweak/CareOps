import { ExceptionSection } from "@/components/admin/exceptions/exception-section";
import { ExportButton } from "@/components/admin/export/export-button";
import { PageHeader } from "@/components/ui/page-header";
import { getExceptionGroups } from "@/lib/compliance/exceptions";
import type { UrgencyLevel } from "@/lib/design-tokens";
import { spacing } from "@/lib/design-tokens";

export const metadata = {
  title: "Exception Queue — CareOps",
};

type SectionConfig = {
  title: string;
  level: UrgencyLevel;
  key: keyof Awaited<ReturnType<typeof getExceptionGroups>>;
  emptyMessage: string;
};

const sections: SectionConfig[] = [
  {
    title: "Critical Issues",
    level: "critical",
    key: "critical",
    emptyMessage: "No critical issues.",
  },
  {
    title: "Expiring Soon",
    level: "warning",
    key: "expiringSoon",
    emptyMessage: "Nothing expiring in the next 30 days.",
  },
  {
    title: "Missing Items",
    level: "critical",
    key: "missing",
    emptyMessage: "No missing compliance items.",
  },
  {
    title: "Pending Follow-Ups",
    level: "normal",
    key: "pending",
    emptyMessage: "No pending follow-ups.",
  },
  {
    title: "Recently Resolved",
    level: "resolved",
    key: "recentlyResolved",
    emptyMessage: "No recent resolutions.",
  },
];

export default async function AdminQueuePage() {
  const groups = await getExceptionGroups();

  return (
    <div className={spacing.page}>
      <PageHeader
        title="Exception Queue"
        description="What needs attention right now — sorted by urgency."
        actions={<ExportButton type="exceptions" />}
      />

      {sections.map((section) => (
        <ExceptionSection
          key={section.key}
          title={section.title}
          level={section.level}
          records={groups[section.key]}
          emptyMessage={section.emptyMessage}
        />
      ))}
    </div>
  );
}
