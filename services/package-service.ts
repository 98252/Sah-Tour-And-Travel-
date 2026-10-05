import { prisma } from "@/lib/prisma";

export const HOLIDAY_CATEGORIES = [
  "International Holidays",
  "Domestic Holidays",
  "Honeymoon Holidays",
  "Family Holidays",
  "Adventure Holidays",
  "Luxury Holidays",
  "Group Tours",
  "Escorted Tours",
  "Weekend Getaways",
  "Beach Holidays",
  "Cultural Holidays",
  "Wildlife Holidays",
] as const;

export type HolidayCategory = typeof HOLIDAY_CATEGORIES[number];

export interface PackageFilterParams {
  search?: string;
  category?: string;
  destinationSlug?: string;
  destination?: string; // alias or query for destination
  country?: string;
  maxBudget?: number;
  minPrice?: number;
  maxPrice?: number;
  duration?: number; // exact duration in days
  minDuration?: number;
  maxDuration?: number;
  travelStyle?: string;
  travelType?: string; // alias for travelStyle
  departureCity?: string;
  mealPlan?: string;
  minRating?: number; // Verified hotel star rating (e.g. 3, 4, 5)
  sortBy?: "popularity" | "price-asc" | "price-desc" | "duration-asc" | "duration-desc" | "newest";
  page?: number;
  limit?: number;
}

export interface PackageItem {
  id: string;
  name: string;
  slug: string;
  packageDestinationId: string;
  category: string;
  durationDays: number;
  durationNights: number;
  durationText: string;
  travelStyle: string;
  startingPrice: number;
  currency: string;
  priceType: string;
  departureCity: string;
  mealPlan: string;
  shortDescription: string;
  longDescription: string;
  highlightsJson: string;
  highlights: string[];
  cancellationPolicy: string;
  terms: string;
  sourceId: string;
  lastVerifiedDate: Date;
  isFeatured: boolean;
  popularityScore: number;
  createdAt: Date;
  updatedAt: Date;
  destination: {
    id: string;
    name: string;
    slug: string;
    countryName: string;
    regionName: string;
  };
  source: {
    id: string;
    name: string;
    licenseRef: string;
    sourceType: string;
    contactInfo: string;
  };
  images: {
    id: string;
    packageId: string;
    url: string;
    caption: string;
    isHero: boolean;
    source: string;
    license: string;
  }[];
  hotels: {
    id: string;
    packageId: string;
    hotelName: string;
    starRating: number;
    cityName: string;
    roomType: string;
    officialLicenseRef: string;
    nightsCount: number;
  }[];
}

export interface PaginatedPackagesResult {
  packages: PackageItem[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

function buildWhereClause(params?: PackageFilterParams): Record<string, unknown> {
  const {
    search,
    category,
    destinationSlug,
    destination,
    country,
    maxBudget,
    minPrice,
    maxPrice,
    duration,
    minDuration,
    maxDuration,
    travelStyle,
    travelType,
    departureCity,
    mealPlan,
    minRating,
  } = params || {};

  const whereClause: Record<string, unknown> = {};

  // Category / Travel Type filter
  const effectiveCategory = category || travelType;
  if (effectiveCategory && effectiveCategory !== "all") {
    const catLower = effectiveCategory.toLowerCase();
    if (catLower.includes("international")) {
      whereClause.OR = [
        { category: { contains: "International" } },
        { destination: { countryName: { not: "India" } } },
      ];
    } else if (catLower.includes("domestic")) {
      whereClause.OR = [
        { category: { contains: "Domestic" } },
        { destination: { countryName: "India" } },
      ];
    } else if (catLower.includes("luxury")) {
      whereClause.OR = [
        { category: { contains: "Luxury" } },
        { travelStyle: { contains: "Luxury" } },
        { name: { contains: "Luxury" } },
        { name: { contains: "Palace" } },
        { shortDescription: { contains: "Luxury" } },
        { shortDescription: { contains: "palace" } },
        { startingPrice: { gte: 50000 } },
      ];
    } else if (catLower.includes("honeymoon") || catLower.includes("romantic")) {
      whereClause.OR = [
        { category: { contains: "Honeymoon" } },
        { travelStyle: { contains: "Honeymoon" } },
        { travelStyle: { contains: "Romantic" } },
        { travelStyle: { contains: "Villa" } },
        { travelStyle: { contains: "Overwater" } },
        { name: { contains: "Honeymoon" } },
        { name: { contains: "Romantic" } },
        { name: { contains: "Maldives" } },
        { name: { contains: "Santorini" } },
        { shortDescription: { contains: "Honeymoon" } },
        { shortDescription: { contains: "Romantic" } },
        { shortDescription: { contains: "couples" } },
        { shortDescription: { contains: "honeymoon" } },
        { shortDescription: { contains: "romantic" } },
      ];
    } else if (catLower.includes("cruise") || catLower.includes("yacht") || catLower.includes("boat")) {
      whereClause.OR = [
        { category: { contains: "Cruise" } },
        { travelStyle: { contains: "Cruise" } },
        { travelStyle: { contains: "Yacht" } },
        { travelStyle: { contains: "Houseboat" } },
        { name: { contains: "Cruise" } },
        { name: { contains: "Yacht" } },
        { name: { contains: "Houseboat" } },
        { shortDescription: { contains: "Cruise" } },
        { shortDescription: { contains: "yacht" } },
        { shortDescription: { contains: "houseboat" } },
      ];
    } else if (catLower.includes("adventure") || catLower.includes("expedition")) {
      whereClause.OR = [
        { category: { contains: "Adventure" } },
        { travelStyle: { contains: "Adventure" } },
        { travelStyle: { contains: "Glacier" } },
        { travelStyle: { contains: "Mountain" } },
        { travelStyle: { contains: "Safari" } },
        { name: { contains: "Adventure" } },
        { name: { contains: "Safari" } },
        { shortDescription: { contains: "adventure" } },
        { shortDescription: { contains: "glacier" } },
      ];
    } else if (catLower.includes("wildlife") || catLower.includes("safari")) {
      whereClause.OR = [
        { category: { contains: "Wildlife" } },
        { travelStyle: { contains: "Wildlife" } },
        { travelStyle: { contains: "Safari" } },
        { travelStyle: { contains: "Nature" } },
        { name: { contains: "Safari" } },
        { name: { contains: "Wildlife" } },
        { shortDescription: { contains: "safari" } },
        { shortDescription: { contains: "wildlife" } },
        { shortDescription: { contains: "sanctuary" } },
      ];
    } else if (catLower.includes("beach") || catLower.includes("island")) {
      whereClause.OR = [
        { category: { contains: "Beach" } },
        { travelStyle: { contains: "Beach" } },
        { travelStyle: { contains: "Island" } },
        { name: { contains: "Beach" } },
        { name: { contains: "Island" } },
        { shortDescription: { contains: "beach" } },
        { shortDescription: { contains: "island" } },
      ];
    } else if (catLower.includes("family")) {
      whereClause.OR = [
        { category: { contains: "Family" } },
        { travelStyle: { contains: "Family" } },
        { name: { contains: "Family" } },
      ];
    } else {
      whereClause.OR = [
        { category: { contains: effectiveCategory } },
        { travelStyle: { contains: effectiveCategory } },
        { name: { contains: effectiveCategory } },
        { shortDescription: { contains: effectiveCategory } },
      ];
    }
  }

  // Destination filter (by slug or name)
  const destVal = destinationSlug || destination;
  if (destVal && destVal !== "all") {
    whereClause.destination = {
      OR: [
        { slug: destVal },
        { name: { contains: destVal } },
      ],
    };
  }

  // Country filter
  if (country && country !== "all") {
    whereClause.destination = {
      ...(whereClause.destination as object || {}),
      countryName: { contains: country },
    };
  }

  // Price / Budget Filter
  const upperPrice = maxBudget || maxPrice;
  if (upperPrice && upperPrice > 0) {
    whereClause.startingPrice = {
      ...(whereClause.startingPrice as object || {}),
      lte: upperPrice,
    };
  }
  if (minPrice && minPrice > 0) {
    whereClause.startingPrice = {
      ...(whereClause.startingPrice as object || {}),
      gte: minPrice,
    };
  }

  // Duration Filter
  if (duration && duration > 0) {
    whereClause.durationDays = duration;
  } else if (minDuration || maxDuration) {
    const durationFilter: Record<string, number> = {};
    if (minDuration) durationFilter.gte = minDuration;
    if (maxDuration) durationFilter.lte = maxDuration;
    whereClause.durationDays = durationFilter;
  }

  // Departure City Filter
  if (departureCity && departureCity !== "all") {
    whereClause.departureCity = {
      contains: departureCity,
    };
  }

  // Meal Plan Filter
  if (mealPlan && mealPlan !== "all") {
    whereClause.mealPlan = {
      contains: mealPlan,
    };
  }

  // Travel Style Filter (only when explicitly provided and distinct from category)
  if (travelStyle && travelStyle !== "all" && travelStyle !== category && travelStyle !== travelType) {
    whereClause.travelStyle = {
      contains: travelStyle,
    };
  }

  // Hotel Star Rating Filter (Verified Hotels)
  if (minRating && minRating > 0) {
    whereClause.hotels = {
      some: {
        starRating: {
          gte: minRating,
        },
      },
    };
  }

  // Search keyword across name, description, travel style, and destination
  if (search && search.trim()) {
    const q = search.trim();
    whereClause.OR = [
      { name: { contains: q } },
      { shortDescription: { contains: q } },
      { travelStyle: { contains: q } },
      { destination: { name: { contains: q } } },
      { destination: { countryName: { contains: q } } },
    ];
  }

  return whereClause;
}

function buildOrderByClause(sortBy: string): Record<string, "asc" | "desc"> {
  switch (sortBy) {
    case "price-asc":
      return { startingPrice: "asc" };
    case "price-desc":
      return { startingPrice: "desc" };
    case "duration-asc":
      return { durationDays: "asc" };
    case "duration-desc":
      return { durationDays: "desc" };
    case "newest":
      return { createdAt: "desc" };
    case "popularity":
    default:
      return { popularityScore: "desc" };
  }
}

/**
 * High-performance paginated package query with server-side filtering and counting
 */
export async function getPackagesWithPagination(
  params?: PackageFilterParams
): Promise<PaginatedPackagesResult> {
  const whereClause = buildWhereClause(params);
  const orderByClause = buildOrderByClause(params?.sortBy || "popularity");

  const page = Math.max(1, params?.page || 1);
  const limit = Math.max(1, params?.limit || 9);
  const skip = (page - 1) * limit;

  const [packages, totalCount] = await Promise.all([
    prisma.package.findMany({
      where: whereClause,
      include: {
        destination: true,
        source: true,
        images: {
          orderBy: {
            isHero: "desc",
          },
        },
        hotels: true,
      },
      orderBy: orderByClause,
      skip,
      take: limit,
    }),
    prisma.package.count({
      where: whereClause,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    packages: packages.map((pkg) => ({
      ...pkg,
      highlights: JSON.parse(pkg.highlightsJson) as string[],
    })),
    totalCount,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

/**
 * Standard getPackages function (returns all matching packages without pagination limit)
 */
export async function getPackages(params?: PackageFilterParams): Promise<PackageItem[]> {
  const res = await getPackagesWithPagination({
    ...params,
    limit: 100, // Safe upper bound for full catalogue queries
  });
  return res.packages;
}

/**
 * Fetch a single package by unique slug with all relations
 */
export async function getPackageBySlug(slug: string) {
  const pkg = await prisma.package.findUnique({
    where: { slug },
    include: {
      destination: true,
      source: true,
      images: {
        orderBy: { isHero: "desc" },
      },
      itinerary: {
        orderBy: { dayNumber: "asc" },
      },
      hotels: true,
      activities: true,
      inclusions: true,
      exclusions: true,
      faqs: true,
    },
  });

  if (!pkg) return null;

  return {
    ...pkg,
    highlights: JSON.parse(pkg.highlightsJson) as string[],
  };
}

/**
 * Fetch distinct departure cities from database for filter dropdown
 */
export async function getDistinctDepartureCities() {
  const pkgs = await prisma.package.findMany({
    select: { departureCity: true },
    distinct: ["departureCity"],
    orderBy: { departureCity: "asc" },
  });
  return pkgs.map((p) => p.departureCity);
}

/**
 * Fetch distinct destinations with package counts
 */
export async function getPackageDestinations() {
  return prisma.packageDestination.findMany({
    include: {
      _count: {
        select: { packages: true },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}

/**
 * Fetch distinct countries from package destinations for filter dropdown
 */
export async function getDistinctCountries() {
  const dests = await prisma.packageDestination.findMany({
    select: { countryName: true },
    distinct: ["countryName"],
    orderBy: { countryName: "asc" },
  });
  return dests.map((d) => d.countryName);
}

/**
 * Fetch distinct meal plans from packages for filter dropdown
 */
export async function getDistinctMealPlans() {
  const pkgs = await prisma.package.findMany({
    select: { mealPlan: true },
    distinct: ["mealPlan"],
    orderBy: { mealPlan: "asc" },
  });
  return pkgs.map((p) => p.mealPlan);
}
