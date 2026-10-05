import { seedContentDatabase } from "../lib/seed-content";
import { prisma } from "../lib/prisma";

async function main() {
  try {
    const count = await seedContentDatabase();
    console.log(`Phase 13 Content Seed Completed: ${count} verified articles created.`);
  } catch (e) {
    console.error("Seed error:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
