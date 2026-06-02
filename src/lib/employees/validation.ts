import { EmploymentStatus } from "@prisma/client";
import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .max(120)
  .optional()
  .or(z.literal(""))
  .transform((v) => (v === "" ? undefined : v));

export const employeeFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required.").max(80),
  lastName: z.string().trim().min(1, "Last name is required.").max(80),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email address.")
    .max(255),
  phone: z
    .string()
    .trim()
    .max(30)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v ?? null)),
  hireDate: z
    .string()
    .min(1, "Hire date is required.")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Enter a valid hire date."),
  status: z.nativeEnum(EmploymentStatus),
  position: optionalText,
  department: optionalText,
});

export type EmployeeFormInput = z.infer<typeof employeeFormSchema>;

export type EmployeeFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  hireDate: string;
  status: EmploymentStatus;
  position: string;
  department: string;
};

export function parseEmployeeFormData(formData: FormData) {
  return employeeFormSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    hireDate: formData.get("hireDate"),
    status: formData.get("status"),
    position: formData.get("position"),
    department: formData.get("department"),
  });
}

export function formValuesFromEmployee(employee: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  hireDate: Date;
  status: EmploymentStatus;
  position: string | null;
  department: string | null;
}): EmployeeFormValues {
  return {
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    phone: employee.phone ?? "",
    hireDate: employee.hireDate.toISOString().slice(0, 10),
    status: employee.status,
    position: employee.position ?? "",
    department: employee.department ?? "",
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
