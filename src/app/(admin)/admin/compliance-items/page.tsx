import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableEmpty,
  DataTableHeadCell,
  DataTableHeader,
  DataTableRow,
} from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  formatExpirationRule,
  parseComplianceItemFilter,
} from "@/lib/compliance/display";
import { spacing, typography } from "@/lib/design-tokens";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

import { ComplianceItemFilterBar } from "@/components/admin/compliance-items/compliance-item-filter";

type Props = {
  searchParams: Promise<{ filter?: string }>;
};

export default async function AdminComplianceItemsPage({
  searchParams,
}: Props) {
  const params = await searchParams;
  const filter = parseComplianceItemFilter(params.filter);

  const where =
    filter === "ALL"
      ? {}
      : filter === "REQUIRED"
        ? { isRequired: true }
        : { isRequired: false };

  const items = await prisma.complianceItem.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <div className={cn("mx-auto max-w-5xl", spacing.page)}>
      <PageHeader
        title="Compliance Items"
        description="Define which compliance requirements apply across the organization. Required items are auto-assigned to employees."
        actions={
          <Button render={<Link href="/admin/compliance-items/new" />}>
            Add item
          </Button>
        }
      />

      <ComplianceItemFilterBar current={filter} />

      {items.length === 0 ? (
        <DataTable>
          <DataTableEmpty
            title="No compliance items in this view"
            description={
              filter === "ALL"
                ? "Add your first compliance item to start tracking."
                : "Try another filter or add a new item."
            }
            action={
              <Button
                render={<Link href="/admin/compliance-items/new" />}
                size="sm"
              >
                Add item
              </Button>
            }
          />
        </DataTable>
      ) : (
        <DataTable>
          <table className="w-full min-w-[640px] border-collapse text-left">
            <DataTableHeader>
              <DataTableHeadCell>Name</DataTableHeadCell>
              <DataTableHeadCell>Category</DataTableHeadCell>
              <DataTableHeadCell>Expiration</DataTableHeadCell>
              <DataTableHeadCell>Required</DataTableHeadCell>
              <DataTableHeadCell>Source</DataTableHeadCell>
              <DataTableHeadCell className="w-[72px]">
                <span className="sr-only">Actions</span>
              </DataTableHeadCell>
            </DataTableHeader>
            <DataTableBody>
              {items.map((item) => (
                <DataTableRow key={item.id}>
                  <DataTableCell>
                    <Link
                      href={`/admin/compliance-items/${item.id}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {item.name}
                    </Link>
                    {item.description ? (
                      <p className={cn(typography.meta, "max-w-xs truncate")}>
                        {item.description}
                      </p>
                    ) : null}
                  </DataTableCell>
                  <DataTableCell className="text-muted-foreground">
                    {item.category ?? "—"}
                  </DataTableCell>
                  <DataTableCell className="text-muted-foreground tabular-nums">
                    {formatExpirationRule(item.expiresAfterDays)}
                  </DataTableCell>
                  <DataTableCell>
                    <StatusBadge
                      kind="operational"
                      state={item.isRequired ? "success" : "neutral"}
                      label={item.isRequired ? "Required" : "Optional"}
                    />
                  </DataTableCell>
                  <DataTableCell className="text-muted-foreground">
                    {item.isDefault ? "Default" : "Custom"}
                  </DataTableCell>
                  <DataTableCell align="right">
                    <Link
                      href={`/admin/compliance-items/${item.id}`}
                      className={cn(
                        typography.meta,
                        "font-medium text-primary hover:underline",
                      )}
                    >
                      Edit
                    </Link>
                  </DataTableCell>
                </DataTableRow>
              ))}
            </DataTableBody>
          </table>
        </DataTable>
      )}

      <p className={typography.meta}>
        Showing {items.length} {items.length === 1 ? "item" : "items"}
        {filter !== "ALL" ? ` (${filter.toLowerCase()})` : ""}.
      </p>
    </div>
  );
}
