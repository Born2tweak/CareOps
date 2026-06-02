import { createClient } from "@supabase/supabase-js";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import pg from "pg";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const databaseUrl = process.env.DATABASE_URL;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
if (!databaseUrl) {
  console.error("Missing DATABASE_URL");
  process.exit(1);
}

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error("Usage: node scripts/create-admin.mjs <email> <password>");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const pool = new pg.Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create Supabase auth user
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (authError) {
    if (authError.message.includes("already been registered")) {
      console.log("Auth user already exists, looking up...");
      const { data: listData } = await supabase.auth.admin.listUsers();
      const existing = listData?.users?.find((u) => u.email === email);
      if (!existing) {
        console.error("Could not find existing user");
        process.exit(1);
      }
      const appUser = await prisma.user.upsert({
        where: { supabaseId: existing.id },
        update: { role: "ADMIN" },
        create: {
          supabaseId: existing.id,
          email,
          role: "ADMIN",
        },
      });
      console.log("Admin user ensured:", appUser.id);
      return;
    }
    console.error("Failed to create auth user:", authError.message);
    process.exit(1);
  }

  console.log("Auth user created:", authData.user.id);

  const appUser = await prisma.user.create({
    data: {
      supabaseId: authData.user.id,
      email,
      role: "ADMIN",
    },
  });

  console.log("Admin user created in database:", appUser.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
