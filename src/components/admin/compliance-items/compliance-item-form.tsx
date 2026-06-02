"use client";

import { useActionState } from "react";

import {
  createComplianceItem,
  updateComplianceItem,
  type ComplianceItemActionState,
} from "@/app/(admin)/admin/compliance-items/actions";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { complianceCategoryOptions } from "@/lib/compliance/display";
import type { ComplianceItemFormValues } from "@/lib/compliance/validation";
import {
  inputClassName,
  selectClassName,
  spacing,
  typography,
} from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

const initialState: ComplianceItemActionState = {};

type ComplianceItemFormProps = {
  mode: "create" | "edit";
  itemId?: string;
  defaultValues?: ComplianceItemFormValues;
};

export function ComplianceItemForm({
  mode,
  itemId,
  defaultValues,
}: ComplianceItemFormProps) {
  const action =
    mode === "create"
      ? createComplianceItem
      : updateComplianceItem.bind(null, itemId!);

  const [state, formAction, pending] = useActionState(action, initialState);

  const values = defaultValues ?? {
    name: "",
    description: "",
    category: "",
    expiresAfterDays: "",
    isRequired: true,
    sortOrder: "0",
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

        <FormField
          id="name"
          label="Name"
          name="name"
          defaultValue={values.name}
          required
          errors={state.fieldErrors?.name}
          placeholder="e.g. CPR/First Aid"
        />

        <div className={spacing.stack}>
          <label htmlFor="description" className={typography.label}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={values.description}
            rows={2}
            className={cn(inputClassName, "h-auto py-2")}
            placeholder="Brief description of this requirement"
          />
          <FieldErrors messages={state.fieldErrors?.description} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className={spacing.stack}>
            <label htmlFor="category" className={typography.label}>
              Category
            </label>
            <select
              id="category"
              name="category"
              defaultValue={values.category}
              className={selectClassName}
            >
              <option value="">No category</option>
              {complianceCategoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <FieldErrors messages={state.fieldErrors?.category} />
          </div>

          <FormField
            id="expiresAfterDays"
            label="Expires after (days)"
            name="expiresAfterDays"
            type="number"
            defaultValue={values.expiresAfterDays}
            errors={state.fieldErrors?.expiresAfterDays}
            placeholder="Leave empty for no expiration"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="sortOrder"
            label="Sort order"
            name="sortOrder"
            type="number"
            defaultValue={values.sortOrder}
            errors={state.fieldErrors?.sortOrder}
          />

          <div className={cn(spacing.stack, "justify-center pt-5")}>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isRequired"
                defaultChecked={values.isRequired}
                className="h-4 w-4 rounded border-input accent-primary"
              />
              <span className={typography.label}>Required for all employees</span>
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <Button type="submit" disabled={pending}>
            {pending
              ? "Saving…"
              : mode === "create"
                ? "Create item"
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
  placeholder,
}: {
  id: string;
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  errors?: string[];
  placeholder?: string;
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
        placeholder={placeholder}
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
