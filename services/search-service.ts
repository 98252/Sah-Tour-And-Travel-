import { prisma } from "@/lib/prisma";

export interface GlobalSearchResult {
  query: string;
  destinations: {
    id: string;
    name: string;
    slug: string;
    countryName: string;
    regionName?: string;
    url: string;
    image: string;
    subtitle: string;
  }[];
  countries: {
    id: string;
    name: string;
    slug: string;
    regionName: string;
    url: string;
    packageCount?: number;
  }[];
  packages: {
    id: string;
    name: string;
    slug: string;
    category: string;
    travelStyle: string;
    durationText: string;
    startingPrice: number;
    currency: string;
    departureCity: string;
    mealPlan: string;
    shortDescription: string;
    highlights: string[];
    destinationName: string;
    countryName: string;
    url: string;
    image: string;
    priceType: string;
  }[];
  activities: {
    id: string;
    title: string;
    description: string;
    locationName: string;
    duration?: string;
    packageName?: string;
    packageSlug?: string;
    url: string;
    type: "Activity" | "Attraction";
  }[];
  totalCount: number;
}

/**
 * Powerful global database search querying destinations, countries, packages, tours, and activities
 */
export async function performGlobalSearch(rawQuery: string, limitPerType = 6): Promise<GlobalSearchResult> {
  const query = (rawQuery || "").trim();

  if (!query) {
    return {
      query: "",
      destinations: [],
      countries: [],
      packages: [],
      activities: [],
      totalCount: 0,
    };
  }

  const [destinations, countries, packages, packageActivities, destinationAttractions] =
    await Promise.all([
      // 1. Search Destinations
      prisma.destination.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { shortDescription: { contains: query } },
            { travelStyle: { contains: query } },
          ],
        },
        include: {
          country: true,
          region: true,
        },
        take: limitPerType,
      }),

      // 2. Search Countries
      prisma.country.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { slug: { contains: query } },
          ],
        },
        include: {
          region: true,
        },
        take: limitPerType,
      }),

      // 3. Search Packages & Tours
      prisma.package.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { shortDescription: { contains: query } },
            { travelStyle: { contains: query } },
            { category: { contains: query } },
            { departureCity: { contains: query } },
            { destination: { name: { contains: query } } },
            { destination: { countryName: { contains: query } } },
          ],
        },
        include: {
          destination: true,
          images: {
            where: { isHero: true },
            take: 1,
          },
        },
        take: limitPerType,
      }),

      // 4. Search Package Activities
      prisma.packageActivity.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            { locationName: { contains: query } },
          ],
        },
        include: {
          package: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
        take: limitPerType,
      }),

      // 5. Search Destination Attractions (Activities)
      prisma.attraction.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
            { locationName: { contains: query } },
          ],
        },
        include: {
          destination: {
            include: {
              country: true,
            },
          },
        },
        take: limitPerType,
      }),
    ]);

  const formattedDestinations = destinations.map((d) => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    countryName: d.country.name,
    regionName: d.region.name,
    url: `/destinations/${d.country.slug}/${d.slug}`,
    image: d.heroImage,
    subtitle: `${d.travelStyle} • Best: ${d.bestTimeToVisit}`,
  }));

  const formattedCountries = countries.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    regionName: c.region.name,
    url: `/holidays?country=${encodeURIComponent(c.name)}`,
  }));

  const formattedPackages = packages.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category,
    travelStyle: p.travelStyle,
    durationText: p.durationText,
    startingPrice: p.startingPrice,
    currency: p.currency,
    departureCity: p.departureCity,
    mealPlan: p.mealPlan,
    shortDescription: p.shortDescription,
    highlights: JSON.parse(p.highlightsJson) as string[],
    destinationName: p.destination.name,
    countryName: p.destination.countryName,
    url: `/holidays/${p.slug}`,
    image:
      p.images[0]?.url ||
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    priceType: p.priceType,
  }));

  const formattedActivities = [
    ...packageActivities.map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      locationName: a.locationName,
      duration: a.duration,
      packageName: a.package.name,
      packageSlug: a.package.slug,
      url: `/holidays/${a.package.slug}`,
      type: "Activity" as const,
    })),
    ...destinationAttractions.map((att) => ({
      id: att.id,
      title: att.name,
      description: att.description,
      locationName: att.locationName,
      duration: att.timings,
      packageName: undefined,
      packageSlug: undefined,
      url: `/destinations/${att.destination.country.slug}/${att.destination.slug}`,
      type: "Attraction" as const,
    })),
  ].slice(0, limitPerType);

  const totalCount =
    formattedDestinations.length +
    formattedCountries.length +
    formattedPackages.length +
    formattedActivities.length;

  return {
    query,
    destinations: formattedDestinations,
    countries: formattedCountries,
    packages: formattedPackages,
    activities: formattedActivities,
    totalCount,
  };
}
