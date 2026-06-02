import { ComplianceItemForm } from "@/components/admin/compliance-items/compliance-item-form";
import { PageHeader } from "@/components/ui/page-header";
import { spacing } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export default function NewComplianceItemPage() {
  return (
    <div className={cn("mx-auto max-w-2xl", spacing.page)}>
      <PageHeader
        title="New Compliance Item"
        description="Add a custom compliance requirement for your organization."
        backHref="/admin/compliance-items"
        backLabel="Compliance Items"
      />
      <ComplianceItemForm mode="create" />
    </div>
  );
}
