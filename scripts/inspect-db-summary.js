const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const destinations = await prisma.destination.findMany({
    include: { country: true },
    orderBy: { name: 'asc' }
  });
  console.log(`Total Destinations: ${destinations.length}`);
  destinations.forEach(d => {
    console.log(`- ${d.name} (${d.country ? d.country.name : 'Unknown'}) [slug: ${d.slug}]`);
  });

  const packages = await prisma.package.findMany({
    select: { id: true, name: true, slug: true, category: true, startingPrice: true, durationDays: true, destination: { select: { name: true } } }
  });
  console.log(`\nTotal Packages: ${packages.length}`);
  packages.forEach(p => {
    console.log(`- ${p.name} | ${p.destination?.name} | ₹${p.startingPrice} | ${p.durationDays}D`);
  });

  const offers = await prisma.offer.findMany({ where: { isArchived: false } });
  console.log(`\nTotal Active Offers: ${offers.length}`);
  offers.forEach(o => console.log(`- ${o.title} | ${o.discountPercentage}% OFF`));

  const reviews = await prisma.review.findMany({
    include: { user: { select: { name: true } }, package: { select: { name: true } } },
    take: 6
  });
  console.log(`\nTotal Reviews in DB: ${reviews.length}`);
  reviews.forEach(r => console.log(`- ${r.user?.name || 'Traveler'}: ${r.rating}★ "${r.title}" (${r.package?.name})`));
}

main().finally(() => prisma.$disconnect());
