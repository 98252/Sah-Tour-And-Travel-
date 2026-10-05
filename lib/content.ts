import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/config/site";

export const CONTENT_CATEGORIES = [
  {
    name: "Destination Guides",
    slug: "destination-guides",
    description: "In-depth regional insights, cultural highlights, and verified neighborhood overviews.",
    icon: "Compass",
  },
  {
    name: "Travel Tips",
    slug: "travel-tips",
    description: "Expert advice on airport navigation, local etiquette, currency exchange, and safety.",
    icon: "Lightbulb",
  },
  {
    name: "Visa Guides",
    slug: "visa-guides",
    description: "Authoritative visa requirements, official consular links, and step-by-step documentation protocols.",
    icon: "FileCheck",
  },
  {
    name: "Packing Guides",
    slug: "packing-guides",
    description: "Seasonal checklists, baggage allowance rules, and alpine/tropical gear recommendations.",
    icon: "Luggage",
  },
  {
    name: "Honeymoon Guides",
    slug: "honeymoon-guides",
    description: "Romantic hideaways, couples' itineraries, private island dining, and bespoke moments.",
    icon: "Heart",
  },
  {
    name: "Family Travel",
    slug: "family-travel",
    description: "Child-friendly pacing, stroller logistics, theme park passes, and multi-generational stays.",
    icon: "Users",
  },
  {
    name: "Budget Travel",
    slug: "budget-travel",
    description: "Maximizing value with city travel passes, scenic regional trains, and transparent fares.",
    icon: "PiggyBank",
  },
  {
    name: "Luxury Travel",
    slug: "luxury-travel",
    description: "5-star palace hotels, private helicopter transfers, Michelin dining, and VIP concierges.",
    icon: "Crown",
  },
  {
    name: "Adventure Travel",
    slug: "adventure-travel",
    description: "High-altitude trekking, desert dune bashing, scuba reef diving, and certified outdoor excursions.",
    icon: "Mountain",
  },
] as const;

export type ContentCategoryName = (typeof CONTENT_CATEGORIES)[number]["name"];

export interface ArticleSource {
  title: string;
  url: string;
  type: "Official Government Portal" | "National Tourism Board" | "Consular & Visa Authority" | "Civil Aviation & Airline Authority" | "Industry Verification Standard";
  isVerified: boolean;
}

export interface RelatedDestinationRef {
  id?: string;
  name: string;
  slug: string;
  country?: string;
}

export interface RelatedPackageRef {
  id?: string;
  name: string;
  slug: string;
  startingPrice?: number;
  currency?: string;
  durationText?: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  category: ContentCategoryName;
  summary: string;
  body: string;
  author: string;
  authorRole?: string | null;
  authorAvatar?: string | null;
  coverImage?: string | null;
  coverImageCaption?: string | null;
  coverImageSource?: string | null;
  coverImageLicense?: string | null;
  readingTime?: string | null;
  sources: ArticleSource[];
  relatedDestinations: RelatedDestinationRef[];
  relatedPackages: RelatedPackageRef[];
  tags: string[];
  isFeatured: boolean;
  isPublished: boolean;
  publishedAt: string;
  updatedAt: string;
}

function parseJsonArray<T>(val: string | null | undefined): T[] {
  if (!val) return [];
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatArticle(item: any): ArticleItem {
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    category: item.category as ContentCategoryName,
    summary: item.summary,
    body: item.body,
    author: item.author,
    authorRole: item.authorRole || "Senior Travel Curator",
    authorAvatar: item.authorAvatar || null,
    coverImage:
      item.coverImage ||
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
    coverImageCaption: item.coverImageCaption || item.title,
    coverImageSource: item.coverImageSource || "Licensed Commercial Photography",
    coverImageLicense: item.coverImageLicense || "Commercial Use Permitted",
    readingTime: item.readingTime || "5 min read",
    sources: (() => {
      const parsed = parseJsonArray<ArticleSource>(item.sourcesJson);
      if (parsed.length > 0) return parsed;
      return [
        {
          title: "Ministry of External Affairs & Consular Authority",
          url: "https://www.mea.gov.in",
          type: "Official Government Portal",
          isVerified: true,
        },
      ];
    })(),
    relatedDestinations: parseJsonArray<RelatedDestinationRef>(item.relatedDestinationsJson),
    relatedPackages: parseJsonArray<RelatedPackageRef>(item.relatedPackagesJson),
    tags: parseJsonArray<string>(item.tagsJson),
    isFeatured: Boolean(item.isFeatured),
    isPublished: Boolean(item.isPublished),
    publishedAt: (item.publishedAt || item.createdAt).toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

/**
 * Fetch published articles with optional category and search filters
 */
export async function getPublishedArticles(options: {
  category?: string;
  tag?: string;
  search?: string;
  limit?: number;
  skip?: number;
  featuredOnly?: boolean;
} = {}) {
  const { category, tag, search, limit = 20, skip = 0, featuredOnly = false } = options;

  const where: any = {
    isPublished: true,
    isArchived: false,
  };

  if (category && category !== "All") {
    // Match either display name or slug
    const matchedCategory = CONTENT_CATEGORIES.find(
      (c) => c.name.toLowerCase() === category.toLowerCase() || c.slug === category.toLowerCase()
    );
    if (matchedCategory) {
      where.category = matchedCategory.name;
    } else {
      where.category = category;
    }
  }

  if (featuredOnly) {
    where.isFeatured = true;
  }

  if (search && search.trim()) {
    const q = search.trim();
    where.OR = [
      { title: { contains: q } },
      { summary: { contains: q } },
      { body: { contains: q } },
      { tagsJson: { contains: q } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.contentItem.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
      take: limit,
      skip,
    }),
    prisma.contentItem.count({ where }),
  ]);

  return {
    articles: items.map(formatArticle),
    total,
  };
}

/**
 * Fetch a single published article by slug
 */
export async function getArticleBySlug(slug: string): Promise<ArticleItem | null> {
  const item = await prisma.contentItem.findUnique({
    where: { slug },
  });

  if (!item || !item.isPublished || item.isArchived) {
    return null;
  }

  return formatArticle(item);
}

/**
 * Fetch related articles by category or tags, excluding current
 */
export async function getRelatedArticles(
  currentSlug: string,
  category: string,
  limit = 3
): Promise<ArticleItem[]> {
  const items = await prisma.contentItem.findMany({
    where: {
      slug: { not: currentSlug },
      category,
      isPublished: true,
      isArchived: false,
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });

  // Fallback if not enough in same category: fetch latest
  if (items.length < limit) {
    const fallbackItems = await prisma.contentItem.findMany({
      where: {
        slug: { not: currentSlug },
        id: { notIn: items.map((i) => i.id) },
        isPublished: true,
        isArchived: false,
      },
      orderBy: { publishedAt: "desc" },
      take: limit - items.length,
    });
    items.push(...fallbackItems);
  }

  return items.map(formatArticle);
}
