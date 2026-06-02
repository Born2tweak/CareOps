import Link from "next/link";
import { EmploymentStatus } from "@prisma/client";

import { EmployeeStatusFilterBar } from "@/components/admin/employees/employee-status-filter";
import { ExportButton } from "@/components/admin/export/export-button";
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
  employmentStatusLabels,
  employmentStatusOperational,
  formatEmployeeName,
  formatHireDate,
  parseStatusFilter,
} from "@/lib/employees/display";
import { spacing, typography } from "@/lib/design-tokens";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

type EmployeesPageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminEmployeesPage({
  searchParams,
}: EmployeesPageProps) {
  const params = await searchParams;
  const filter = parseStatusFilter(params.status);

  const where =
    filter === "ALL"
      ? {}
      : { status: filter as EmploymentStatus };

  const employees = await prisma.employee.findMany({
    where,
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });

  return (
    <div className={cn("mx-auto max-w-5xl", spacing.page)}>
      <PageHeader
        title="Employees"
        description="Roster for compliance tracking. Add and maintain staff before assigning compliance records."
        actions={
          <div className="flex items-center gap-2">
            <ExportButton type="all" label="Export CSV" />
            <Button render={<Link href="/admin/employees/new" />}>
              Add employee
            </Button>
          </div>
        }
      />

      <EmployeeStatusFilterBar current={filter} />

      {employees.length === 0 ? (
        <DataTable>
          <DataTableEmpty
            title="No employees in this view"
            description={
              filter === "ACTIVE"
                ? "Active employees appear here. Add someone new or switch the status filter."
                : "Try another status filter or add a new employee."
            }
            action={
              <Button render={<Link href="/admin/employees/new" />} size="sm">
                Add employee
              </Button>
            }
          />
        </DataTable>
      ) : (
        <DataTable>
          <table className="w-full min-w-[640px] border-collapse text-left">
            <DataTableHeader>
              <DataTableHeadCell>Name</DataTableHeadCell>
              <DataTableHeadCell>Email</DataTableHeadCell>
              <DataTableHeadCell>Status</DataTableHeadCell>
              <DataTableHeadCell>Department</DataTableHeadCell>
              <DataTableHeadCell>Hire date</DataTableHeadCell>
              <DataTableHeadCell className="w-[72px]">
                <span className="sr-only">Actions</span>
              </DataTableHeadCell>
            </DataTableHeader>
            <DataTableBody>
              {employees.map((employee) => (
                <DataTableRow key={employee.id}>
                  <DataTableCell>
                    <Link
                      href={`/admin/employees/${employee.id}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {formatEmployeeName(
                        employee.firstName,
                        employee.lastName,
                      )}
                    </Link>
                    {employee.position ? (
                      <p className={typography.meta}>{employee.position}</p>
                    ) : null}
                  </DataTableCell>
                  <DataTableCell className="text-muted-foreground">
                    {employee.email}
                  </DataTableCell>
                  <DataTableCell>
                    <StatusBadge
                      kind="operational"
                      state={employmentStatusOperational[employee.status]}
                      label={employmentStatusLabels[employee.status]}
                    />
                  </DataTableCell>
                  <DataTableCell className="text-muted-foreground">
                    {employee.department ?? "—"}
                  </DataTableCell>
                  <DataTableCell className="text-muted-foreground tabular-nums">
                    {formatHireDate(employee.hireDate)}
                  </DataTableCell>
                  <DataTableCell align="right">
                    <Link
                      href={`/admin/employees/${employee.id}`}
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
        Showing {employees.length}{" "}
        {employees.length === 1 ? "employee" : "employees"}
        {filter === "ACTIVE" ? " (active)" : ""}.
      </p>
    </div>
  );
}
