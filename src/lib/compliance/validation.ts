import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .max(500)
  .optional()
  .or(z.literal(""))
  .transform((v) => (v === "" ? undefined : v));

const optionalCategory = z
  .string()
  .trim()
  .max(100)
  .optional()
  .or(z.literal(""))
  .transform((v) => (v === "" ? undefined : v));

export const complianceItemFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(255),
  description: optionalText,
  category: optionalCategory,
  expiresAfterDays: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => {
      if (!v || v === "") return null;
      const n = Number(v);
      if (Number.isNaN(n) || !Number.isInteger(n) || n < 1) return undefined;
      return n;
    })
    .refine((v) => v !== undefined, "Enter a valid number of days (or leave empty for no expiration)."),
  isRequired: z
    .string()
    .optional()
    .transform((v) => v === "on" || v === "true"),
  sortOrder: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => {
      if (!v || v === "") return 0;
      const n = Number(v);
      return Number.isNaN(n) || !Number.isInteger(n) ? 0 : n;
    }),
});

export type ComplianceItemFormInput = z.infer<typeof complianceItemFormSchema>;

export type ComplianceItemFormValues = {
  name: string;
  description: string;
  category: string;
  expiresAfterDays: string;
  isRequired: boolean;
  sortOrder: string;
};

export function parseComplianceItemFormData(formData: FormData) {
  return complianceItemFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
    expiresAfterDays: formData.get("expiresAfterDays"),
    isRequired: formData.get("isRequired"),
    sortOrder: formData.get("sortOrder"),
  });
}

export function formValuesFromComplianceItem(item: {
  name: string;
  description: string | null;
  category: string | null;
  expiresAfterDays: number | null;
  isRequired: boolean;
  sortOrder: number;
}): ComplianceItemFormValues {
  return {
    name: item.name,
    description: item.description ?? "",
    category: item.category ?? "",
    expiresAfterDays:
      item.expiresAfterDays !== null ? String(item.expiresAfterDays) : "",
    isRequired: item.isRequired,
    sortOrder: String(item.sortOrder),
  };
}

export function fieldErrorsFromZod(
  error: z.ZodError,
): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string") {
      out[key] ??= [];
      out[key].push(issue.message);
    }
  }
  return out;
}
