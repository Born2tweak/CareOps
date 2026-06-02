/**
 * Validate required environment variables at import time.
 * Import this module early (e.g., in layout.tsx) to fail fast.
 */

const required = [
  "DATABASE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

const optional = [
  "RESEND_API_KEY",
  "RESEND_FROM_ADDRESS",
  "CRON_SECRET",
] as const;

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}. ` +
    "Check your .env.local file or deployment environment settings.",
  );
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  RESEND_API_KEY: process.env.RESEND_API_KEY ?? null,
  RESEND_FROM_ADDRESS: process.env.RESEND_FROM_ADDRESS ?? null,
  CRON_SECRET: process.env.CRON_SECRET ?? null,
} as const;

// Log optional missing vars as warnings (not errors)
if (typeof process !== "undefined" && process.env.NODE_ENV === "development") {
  const missingOptional = optional.filter((key) => !process.env[key]);
  if (missingOptional.length > 0) {
    console.warn(
      `[CareOps] Optional env vars not set: ${missingOptional.join(", ")}`,
    );
  }
}
