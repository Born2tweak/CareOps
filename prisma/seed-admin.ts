/**
 * Links an existing Supabase Auth user to a CareOps ADMIN row.
 *
 * Prerequisites:
 * 1. Create the user in Supabase Dashboard → Authentication → Users (email + password).
 * 2. Copy the user's UUID from that screen.
 *
 * Usage:
 *   ADMIN_EMAIL=you@example.com ADMIN_SUPABASE_ID=<uuid> npm run db:seed-admin
 */
import { UserRole } from "@prisma/client";
import { config } from "dotenv";

import { createPrismaClient } from "../src/lib/prisma-client-factory";

config({ path: ".env.local" });
config();

const email = process.env.ADMIN_EMAIL?.trim();
const supabaseId = process.env.ADMIN_SUPABASE_ID?.trim();

if (!email || !supabaseId) {
  console.error(
    "Set ADMIN_EMAIL and ADMIN_SUPABASE_ID (Supabase Auth user UUID) before running.",
  );
  process.exit(1);
}

const prisma = createPrismaClient(
  process.env.DIRECT_URL ?? process.env.DATABASE_URL,
);

async function main() {
  const user = await prisma.user.upsert({
    where: { supabaseId },
    update: {
      email,
      role: UserRole.ADMIN,
    },
    create: {
      supabaseId,
      email,
      role: UserRole.ADMIN,
    },
  });

  console.log(`Admin user ready: ${user.email} (${user.id})`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
