import { config } from "dotenv";
import { createPrismaClient } from "../src/lib/prisma-client-factory";

config({ path: ".env.local" });
config();

const prisma = createPrismaClient(
  process.env.DIRECT_URL ?? process.env.DATABASE_URL,
);

const defaultComplianceItems = [
  {
    name: "CPR/First Aid",
    description: "CPR and First Aid certification",
    category: "Medical",
    expiresAfterDays: 730,
    isRequired: true,
    isDefault: true,
    sortOrder: 1,
  },
  {
    name: "TB Test",
    description: "Tuberculosis screening test",
    category: "Medical",
    expiresAfterDays: 365,
    isRequired: true,
    isDefault: true,
    sortOrder: 2,
  },
  {
    name: "Driver's License",
    description: "Valid state driver's license",
    category: "Legal",
    expiresAfterDays: null,
    isRequired: true,
    isDefault: true,
    sortOrder: 3,
  },
  {
    name: "Auto Insurance",
    description: "Valid auto insurance documentation",
    category: "Legal",
    expiresAfterDays: 180,
    isRequired: true,
    isDefault: true,
    sortOrder: 4,
  },
  {
    name: "BMV Record",
    description: "Bureau of Motor Vehicles driving record",
    category: "Legal",
    expiresAfterDays: 365,
    isRequired: true,
    isDefault: true,
    sortOrder: 5,
  },
  {
    name: "Proof of Citizenship",
    description: "US citizenship or work authorization documentation",
    category: "Legal",
    expiresAfterDays: null,
    isRequired: true,
    isDefault: true,
    sortOrder: 6,
  },
  {
    name: "HCSP Training",
    description: "Home and Community Services Provider training",
    category: "Training",
    expiresAfterDays: 365,
    isRequired: true,
    isDefault: true,
    sortOrder: 7,
  },
  {
    name: "Background Check",
    description: "Criminal background check clearance",
    category: "Legal",
    expiresAfterDays: 365,
    isRequired: true,
    isDefault: true,
    sortOrder: 8,
  },
];

async function main() {
  console.log("Seeding default compliance items...");

  for (const item of defaultComplianceItems) {
    await prisma.complianceItem.upsert({
      where: { name: item.name },
      update: {},
      create: item,
    });
  }

  const count = await prisma.complianceItem.count();
  console.log(`Seeded ${count} compliance items.`);
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
