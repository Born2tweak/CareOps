import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

export function createPrismaClient(connectionString?: string): PrismaClient {
  const url =
    connectionString ?? process.env.DATABASE_URL ?? process.env.DIRECT_URL;
  if (!url) {
    throw new Error("Missing DATABASE_URL or DIRECT_URL");
  }

  const pool = new Pool({ connectionString: url });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}
