import * as React from "react";
import type { Metadata } from "next";
import PackageDetailPage, { generateMetadata as generatePackageMetadata } from "@/app/holidays/[slug]/page";
import InternationalHolidaysPage, { metadata as internationalMetadata } from "@/app/holidays/international/page";
import DomesticHolidaysPage, { metadata as domesticMetadata } from "@/app/holidays/domestic/page";
import HolidaysPage from "@/app/holidays/page";
import { getPackageBySlug } from "@/services/package-service";

interface PackagesSlugProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

export async function generateMetadata({ params }: PackagesSlugProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "international-tour-packages") {
    return internationalMetadata;
  }
  if (slug === "domestic-tour-packages") {
    return domesticMetadata;
  }
  if (slug === "honeymoon-packages") {
    return {
      title: "Honeymoon & Romantic Packages | Sah Tour And Travel",
      description: "Handcrafted romantic getaways, private hideaways, and unforgettable luxury couples moments.",
    };
  }
  if (slug === "family-vacations") {
    return {
      title: "Family Vacation Packages | Sah Tour And Travel",
      description: "Thoughtfully paced multi-generational retreats with verified stays and family-friendly activities.",
    };
  }
  if (slug === "luxury-escapes") {
    return {
      title: "Luxury & Bespoke Escapes | Sah Tour And Travel",
      description: "5-star palace hotels, private transfers, and VIP concierge care worldwide.",
    };
  }
  if (slug === "cruise-packages") {
    return {
      title: "Luxury Cruise & Yachting Holidays | Sah Tour And Travel",
      description: "Ocean balcony liners, catamaran charters, and backwater houseboats with verified allotments.",
    };
  }
  if (slug === "adventure-packages") {
    return {
      title: "Adventure & Expedition Packages | Sah Tour And Travel",
      description: "Adrenaline-charged expeditions, glacier crossings, desert safaris, and exhilarating journeys.",
    };
  }
  if (slug === "wildlife-packages") {
    return {
      title: "Wildlife & Safari Packages | Sah Tour And Travel",
      description: "Thrilling wildlife safaris, jungle lodge stays, guided game drives, and untamed natural sanctuaries.",
    };
  }
  if (slug === "beach-escapes" || slug === "beach-packages") {
    return {
      title: "Beach Escapes & Tropical Holidays | Sah Tour And Travel",
      description: "Pristine coastlines, azure lagoons, overwater pool villas, and tropical island bliss.",
    };
  }
  return generatePackageMetadata({ params });
}

export default async function PackagesSlugPage({ params, searchParams }: PackagesSlugProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  if (slug === "international-tour-packages") {
    return <InternationalHolidaysPage searchParams={Promise.resolve(resolvedSearchParams)} />;
  }

  if (slug === "domestic-tour-packages") {
    return <DomesticHolidaysPage searchParams={Promise.resolve(resolvedSearchParams)} />;
  }

  if (slug === "honeymoon-packages") {
    return (
      <HolidaysPage
        searchParams={Promise.resolve({
          ...resolvedSearchParams,
          category: "honeymoon",
          travelType: "honeymoon",
        })}
      />
    );
  }

  if (slug === "family-vacations") {
    return (
      <HolidaysPage
        searchParams={Promise.resolve({
          ...resolvedSearchParams,
          category: "family",
          travelType: "family",
        })}
      />
    );
  }

  if (slug === "luxury-escapes") {
    return (
      <HolidaysPage
        searchParams={Promise.resolve({
          ...resolvedSearchParams,
          category: "luxury",
          travelType: "luxury",
        })}
      />
    );
  }

  if (slug === "cruise-packages") {
    return (
      <HolidaysPage
        searchParams={Promise.resolve({
          ...resolvedSearchParams,
          category: "cruise",
          travelType: "cruise",
          theme: "cruise",
        })}
      />
    );
  }

  if (slug === "adventure-packages") {
    return (
      <HolidaysPage
        searchParams={Promise.resolve({
          ...resolvedSearchParams,
          category: "adventure",
          travelType: "adventure",
          theme: "adventure",
        })}
      />
    );
  }

  if (slug === "wildlife-packages") {
    return (
      <HolidaysPage
        searchParams={Promise.resolve({
          ...resolvedSearchParams,
          category: "wildlife",
          travelType: "wildlife",
          theme: "wildlife",
        })}
      />
    );
  }

  if (slug === "beach-escapes" || slug === "beach-packages") {
    return (
      <HolidaysPage
        searchParams={Promise.resolve({
          ...resolvedSearchParams,
          category: "beach",
          travelType: "beach",
          theme: "beach",
        })}
      />
    );
  }

  // Otherwise, check if it is a specific package slug
  const pkg = await getPackageBySlug(slug);
  if (pkg) {
    return <PackageDetailPage params={params} />;
  }

  // Fallback to searching packages with this slug as keyword
  return (
    <HolidaysPage
      searchParams={Promise.resolve({
        ...resolvedSearchParams,
        q: slug.replace(/-/g, " "),
      })}
    />
  );
}
