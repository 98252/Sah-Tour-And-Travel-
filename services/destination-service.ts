import { prisma } from "@/lib/prisma";

export interface DestinationFilterParams {
  search?: string;
  countrySlug?: string;
  regionSlug?: string;
}

export interface GalleryItem {
  url: string;
  caption: string;
  source: string;
  license: string;
}

export interface ThingToDoItem {
  title: string;
  description: string;
  officialTip?: string;
}

/**
 * Service to query verified destinations from the database
 */
export async function getDestinations(params?: DestinationFilterParams) {
  const { search, countrySlug, regionSlug } = params || {};

  const whereClause: Record<string, unknown> = {};

  if (regionSlug && regionSlug !== "all") {
    whereClause.region = {
      slug: regionSlug,
    };
  }

  if (countrySlug && countrySlug !== "all") {
    whereClause.country = {
      slug: countrySlug,
    };
  }

  if (search && search.trim()) {
    const q = search.trim();
    whereClause.OR = [
      { name: { contains: q } },
      { shortDescription: { contains: q } },
      { country: { name: { contains: q } } },
      { region: { name: { contains: q } } },
    ];
  }

  const destinations = await prisma.destination.findMany({
    where: whereClause,
    include: {
      country: true,
      region: true,
      primarySource: true,
      attractions: {
        take: 3,
      },
    },
    orderBy: {
      isFeatured: "desc",
    },
  });

  return destinations.map((d) => ({
    ...d,
    gallery: JSON.parse(d.galleryJson) as GalleryItem[],
    whyVisit: JSON.parse(d.whyVisitJson) as string[],
    thingsToDo: JSON.parse(d.thingsToDoJson) as ThingToDoItem[],
    travelTips: JSON.parse(d.travelTipsJson) as string[],
  }));
}

/**
 * Fetch a single verified destination by country and destination slug
 */
export async function getDestinationBySlug(
  countrySlug: string,
  destinationSlug: string
) {
  const destination = await prisma.destination.findFirst({
    where: {
      slug: destinationSlug,
      country: {
        slug: countrySlug,
      },
    },
    include: {
      country: true,
      region: true,
      primarySource: true,
      attractions: {
        include: {
          source: true,
        },
      },
      faqs: true,
      travelInfo: {
        include: {
          source: true,
        },
      },
    },
  });

  if (!destination) return null;

  return {
    ...destination,
    gallery: JSON.parse(destination.galleryJson) as GalleryItem[],
    whyVisit: JSON.parse(destination.whyVisitJson) as string[],
    thingsToDo: JSON.parse(destination.thingsToDoJson) as ThingToDoItem[],
    travelTips: JSON.parse(destination.travelTipsJson) as string[],
  };
}

/**
 * Fetch related destinations within the same region or country
 */
export async function getRelatedDestinations(
  currentSlug: string,
  regionId: string,
  limit: number = 3
) {
  const related = await prisma.destination.findMany({
    where: {
      slug: { not: currentSlug },
      regionId: regionId,
    },
    include: {
      country: true,
      region: true,
      primarySource: true,
    },
    take: limit,
  });

  // If fewer than limit in region, fill with other featured destinations
  if (related.length < limit) {
    const additional = await prisma.destination.findMany({
      where: {
        slug: { notIn: [currentSlug, ...related.map((r) => r.slug)] },
      },
      include: {
        country: true,
        region: true,
        primarySource: true,
      },
      take: limit - related.length,
    });
    related.push(...additional);
  }

  return related.map((d) => ({
    ...d,
    gallery: JSON.parse(d.galleryJson) as GalleryItem[],
    whyVisit: JSON.parse(d.whyVisitJson) as string[],
    thingsToDo: JSON.parse(d.thingsToDoJson) as ThingToDoItem[],
    travelTips: JSON.parse(d.travelTipsJson) as string[],
  }));
}

/**
 * Fetch all available regions for filters
 */
export async function getAllRegions() {
  return prisma.region.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: { destinations: true },
      },
    },
  });
}

/**
 * Fetch all available countries for filters
 */
export async function getAllCountries() {
  return prisma.country.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      region: true,
      _count: {
        select: { destinations: true },
      },
    },
  });
}
