"use client";

import { EmploymentStatus } from "@prisma/client";
import { useActionState } from "react";

import {
  createEmployee,
  updateEmployee,
  type EmployeeActionState,
} from "@/app/(admin)/admin/employees/actions";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { employmentStatusLabels } from "@/lib/employees/display";
import type { EmployeeFormValues } from "@/lib/employees/validation";
import { inputClassName, selectClassName, spacing, typography } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

const initialState: EmployeeActionState = {};

const statusOptions = Object.values(EmploymentStatus);

type EmployeeFormProps = {
  mode: "create" | "edit";
  employeeId?: string;
  defaultValues?: EmployeeFormValues;
};

export function EmployeeForm({
  mode,
  employeeId,
  defaultValues,
}: EmployeeFormProps) {
  const action =
    mode === "create"
      ? createEmployee
      : updateEmployee.bind(null, employeeId!);

  const [state, formAction, pending] = useActionState(action, initialState);

  const values = defaultValues ?? {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    hireDate: new Date().toISOString().slice(0, 10),
    status: EmploymentStatus.ONBOARDING,
    position: "",
    department: "",
  };

  return (
    <SurfaceCard>
      <form action={formAction} className={cn(spacing.section)}>
        {state.error ? (
          <p className="text-sm text-destructive" role="alert">
            {state.error}
          </p>
        ) : null}
        {state.success ? (
          <p
            className="rounded-lg border border-[var(--status-success-border)] bg-[var(--status-success-bg)] px-3 py-2 text-sm text-[var(--status-success-fg)]"
            role="status"
          >
            Changes saved.
          </p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="firstName"
            label="First name"
            name="firstName"
            defaultValue={values.firstName}
            required
            errors={state.fieldErrors?.firstName}
          />
          <FormField
            id="lastName"
            label="Last name"
            name="lastName"
            defaultValue={values.lastName}
            required
            errors={state.fieldErrors?.lastName}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="email"
            label="Email"
            name="email"
            type="email"
            defaultValue={values.email}
            required
            errors={state.fieldErrors?.email}
          />
          <FormField
            id="phone"
            label="Phone"
            name="phone"
            type="tel"
            defaultValue={values.phone}
            errors={state.fieldErrors?.phone}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="hireDate"
            label="Hire date"
            name="hireDate"
            type="date"
            defaultValue={values.hireDate}
            required
            errors={state.fieldErrors?.hireDate}
          />
          <div className={spacing.stack}>
            <label htmlFor="status" className={typography.label}>
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={values.status}
              className={selectClassName}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {employmentStatusLabels[status]}
                </option>
              ))}
            </select>
            <FieldErrors messages={state.fieldErrors?.status} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="position"
            label="Position"
            name="position"
            defaultValue={values.position}
            errors={state.fieldErrors?.position}
          />
          <FormField
            id="department"
            label="Department"
            name="department"
            defaultValue={values.department}
            errors={state.fieldErrors?.department}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <Button type="submit" disabled={pending}>
            {pending
              ? "Saving…"
              : mode === "create"
                ? "Create employee"
                : "Save changes"}
          </Button>
        </div>
      </form>
    </SurfaceCard>
  );
}

function FormField({
  id,
  label,
  name,
  type = "text",
  defaultValue,
  required,
  errors,
}: {
  id: string;
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  errors?: string[];
}) {
  return (
    <div className={spacing.stack}>
      <label htmlFor={id} className={typography.label}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className={inputClassName}
        aria-invalid={errors?.length ? true : undefined}
      />
      <FieldErrors messages={errors} />
    </div>
  );
}

function FieldErrors({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <p className="text-xs text-destructive" role="alert">
      {messages[0]}
    </p>
  );
}
