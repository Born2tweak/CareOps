import { EmployeeForm } from "@/components/admin/employees/employee-form";
import { PageHeader } from "@/components/ui/page-header";
import { spacing } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export default function NewEmployeePage() {
  return (
    <div className={cn("mx-auto max-w-2xl", spacing.page)}>
      <PageHeader
        title="Add employee"
        description="Create a roster entry. Compliance records are added separately in a later milestone."
        backHref="/admin/employees"
        backLabel="Employees"
      />
      <EmployeeForm mode="create" />
    </div>
  );
}
