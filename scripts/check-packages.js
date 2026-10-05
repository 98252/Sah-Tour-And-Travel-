const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const pkgs = await prisma.package.findMany({
    select: { id: true, name: true, category: true, travelStyle: true, slug: true, shortDescription: true }
  });
  console.log(`Total packages: ${pkgs.length}`);
  pkgs.forEach(p => console.log(`- [${p.category}] [${p.travelStyle}] ${p.name} (${p.slug})`));
}

main().finally(() => prisma.$disconnect());
