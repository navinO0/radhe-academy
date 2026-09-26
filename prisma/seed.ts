import { prisma } from "@/lib/db/prisma";
import { runStartupSeeder, OFFICIAL_COURSES } from "@/lib/db/startup-seeder";

export { OFFICIAL_COURSES };

async function main() {
  await runStartupSeeder();
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
