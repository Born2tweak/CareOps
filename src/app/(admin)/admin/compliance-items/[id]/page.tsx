import { notFound } from "next/navigation";

import { ComplianceItemForm } from "@/components/admin/compliance-items/compliance-item-form";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formValuesFromComplianceItem } from "@/lib/compliance/validation";
import { spacing } from "@/lib/design-tokens";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditComplianceItemPage({ params }: Props) {
  const { id } = await params;

  const item = await prisma.complianceItem.findUnique({ where: { id } });
  if (!item) notFound();

  const values = formValuesFromComplianceItem(item);

  return (
    <div className={cn("mx-auto max-w-2xl", spacing.page)}>
      <PageHeader
        title={item.name}
        description={item.isDefault ? "Default compliance item (seeded)." : "Custom compliance item."}
        backHref="/admin/compliance-items"
        backLabel="Compliance Items"
        actions={
          <StatusBadge
            kind="operational"
            state={item.isRequired ? "success" : "neutral"}
            label={item.isRequired ? "Required" : "Optional"}
          />
        }
      />
      <ComplianceItemForm
        mode="edit"
        itemId={item.id}
        defaultValues={values}
      />
    </div>
  );
}
