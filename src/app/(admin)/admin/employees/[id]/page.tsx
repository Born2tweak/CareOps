import { notFound } from "next/navigation";

import { AuditTimeline } from "@/components/admin/audit/audit-timeline";
import { EmployeeComplianceChecklist } from "@/components/admin/compliance/employee-checklist";
import { DeactivatePanel } from "@/components/admin/employees/deactivate-panel";
import { EmployeeForm } from "@/components/admin/employees/employee-form";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  employmentStatusLabels,
  employmentStatusOperational,
  formatEmployeeName,
} from "@/lib/employees/display";
import { formValuesFromEmployee } from "@/lib/employees/validation";
import { getAuditLogsForEntity } from "@/lib/audit";
import { getSignedUrl } from "@/lib/documents/storage";
import { spacing } from "@/lib/design-tokens";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

type EditEmployeePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditEmployeePage({ params }: EditEmployeePageProps) {
  const { id } = await params;

  const employee = await prisma.employee.findUnique({
    where: { id },
    include: {
      complianceRecords: {
        include: {
          complianceItem: { select: { name: true, category: true } },
          documents: { orderBy: { createdAt: "desc" } },
        },
        orderBy: { complianceItem: { sortOrder: "asc" } },
      },
    },
  });

  if (!employee) {
    notFound();
  }

  const name = formatEmployeeName(employee.firstName, employee.lastName);
  const auditEntries = await getAuditLogsForEntity("employee", id);

  // Build signed URL map for all documents across all records
  const allDocs = employee.complianceRecords.flatMap((r) => r.documents);
  const urlEntries = await Promise.all(
    allDocs.map(async (doc) => {
      try {
        const url = await getSignedUrl(doc.storagePath, 3600);
        return [doc.id, url] as const;
      } catch {
        return [doc.id, ""] as const;
      }
    }),
  );
  const documentViewUrls: Record<string, string> = Object.fromEntries(urlEntries);

  return (
    <div className={cn("mx-auto max-w-2xl", spacing.page)}>
      <PageHeader
        title={name}
        description={employee.email}
        backHref="/admin/employees"
        backLabel="Employees"
        actions={
          <StatusBadge
            kind="operational"
            state={employmentStatusOperational[employee.status]}
            label={employmentStatusLabels[employee.status]}
          />
        }
      />
      <EmployeeComplianceChecklist employeeId={employee.id} employeeName={name} employeeEmail={employee.email} records={employee.complianceRecords} documentViewUrls={documentViewUrls} />
      <EmployeeForm
        mode="edit"
        employeeId={employee.id}
        defaultValues={formValuesFromEmployee(employee)}
      />
      <AuditTimeline entries={auditEntries} />
      <DeactivatePanel
        employeeId={employee.id}
        currentStatus={employee.status}
      />
    </div>
  );
}
