import * as React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { PackageCard } from "@/components/holiday/package-card";
import { HolidayFilterBar } from "@/components/holiday/holiday-filter-bar";
import {
  getPackagesWithPagination,
  getDistinctDepartureCities,
  getPackageDestinations,
  getDistinctCountries,
  getDistinctMealPlans,
} from "@/services/package-service";
import { ShieldCheck, Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "Holiday Tour Packages | Verified Commercial Travel Inventory",
  description:
    "Explore authentic holiday packages curated by Sah Tour And Travel. Featuring verified hotel contracts, transparent itineraries, and real pricing with zero fictional data.",
};

interface HolidaysPageProps {
  searchParams: Promise<{
    q?: string;
    destination?: string;
    dest?: string;
    country?: string;
    category?: string;
    travelType?: string;
    theme?: string;
    style?: string;
    budget?: string;
    price?: string;
    duration?: string;
    city?: string;
    departureCity?: string;
    rating?: string;
    mealPlan?: string;
    sort?: "popularity" | "price-asc" | "price-desc" | "duration-asc" | "duration-desc" | "newest";
    page?: string;
  }>;
}

export default async function HolidaysPage({ searchParams }: HolidaysPageProps) {
  const resolved = await searchParams;
  const {
    q,
    destination,
    dest,
    country,
    category,
    travelType,
    theme,
    style,
    budget,
    price,
    duration,
    city,
    departureCity,
    rating,
    mealPlan,
    sort,
    page = "1",
  } = resolved;

  const targetDest = destination || dest;
  const targetCategory = category || travelType || theme || style;
  const targetBudget = budget || price;
  const targetCity = city || departureCity;
  const targetRating = rating && rating !== "all" ? parseInt(rating, 10) : undefined;
  const currentPage = parseInt(page, 10) || 1;

  // Compute duration min/max or exact
  let minDuration: number | undefined;
  let maxDuration: number | undefined;
  let exactDuration: number | undefined;

  if (duration === "weekend") {
    minDuration = 1;
    maxDuration = 3;
  } else if (duration === "medium") {
    minDuration = 4;
    maxDuration = 6;
  } else if (duration === "extended") {
    minDuration = 7;
  } else if (duration && !isNaN(parseInt(duration, 10))) {
    exactDuration = parseInt(duration, 10);
  }

  // Database-backed query with pagination
  const [paginatedResult, destinations, departureCities, countries, mealPlans] = await Promise.all([
    getPackagesWithPagination({
      search: q,
      destination: targetDest,
      country: country,
      category: targetCategory,
      maxBudget: targetBudget && targetBudget !== "all" ? parseFloat(targetBudget) : undefined,
      duration: exactDuration,
      minDuration,
      maxDuration,
      departureCity: targetCity,
      mealPlan: mealPlan,
      minRating: targetRating,
      sortBy: sort,
      page: currentPage,
      limit: 9,
    }),
    getPackageDestinations(),
    getDistinctDepartureCities(),
    getDistinctCountries(),
    getDistinctMealPlans(),
  ]);

  const { packages, totalCount, totalPages, limit } = paginatedResult;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="border-b border-slate-200/80 bg-white py-10 px-4 sm:px-6">
          <div className="container mx-auto">
            <div className="mb-4">
              <Breadcrumb items={[{ label: "Holiday Packages", isCurrent: true }]} />
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="verified" showIcon>
                    Verified Inventory Only
                  </Badge>
                  <Badge variant="luxury" showIcon>
                    Sah Tour And Travel Catalogue
                  </Badge>
                </div>
                <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy-900 tracking-tight">
                  {targetCategory && targetCategory !== "all"
                    ? targetCategory.toLowerCase().includes("luxury")
                      ? "Luxury & Bespoke Escapes"
                      : targetCategory.toLowerCase().includes("honeymoon")
                        ? "Honeymoon & Romantic Packages"
                        : targetCategory.toLowerCase().includes("cruise")
                          ? "Cruise & Yachting Holidays"
                          : targetCategory.toLowerCase().includes("adventure")
                            ? "Adventure & Expedition Packages"
                            : targetCategory.toLowerCase().includes("wildlife")
                              ? "Wildlife & Safari Packages"
                              : targetCategory.toLowerCase().includes("beach")
                                ? "Beach Escapes & Tropical Holidays"
                                : targetCategory.toLowerCase().includes("family")
                                  ? "Family Vacation Packages"
                                  : `${targetCategory.charAt(0).toUpperCase() + targetCategory.slice(1)} Packages`
                    : "Handcrafted Holiday Packages"}
                </h1>
                <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                  {targetCategory && targetCategory.toLowerCase().includes("luxury")
                    ? "Handpicked 5-star palace stays, private chauffeur transfers, and bespoke VIP concierge care worldwide."
                    : targetCategory && targetCategory.toLowerCase().includes("honeymoon")
                      ? "Romantic getaways, secluded cliffside suites, private pool sanctuaries, and candlelit dining."
                      : targetCategory && targetCategory.toLowerCase().includes("cruise")
                        ? "Luxury cruise voyages, private catamaran charters, scenic backwater houseboats, and ocean adventures."
                        : targetCategory && targetCategory.toLowerCase().includes("adventure")
                          ? "Adrenaline-charged expeditions, glacier crossings, desert safaris, and exhilarating journeys."
                          : targetCategory && targetCategory.toLowerCase().includes("wildlife")
                            ? "Thrilling wildlife safaris, jungle lodge stays, guided game drives, and untamed natural sanctuaries."
                            : targetCategory && targetCategory.toLowerCase().includes("beach")
                              ? "Sun-kissed coastlines, azure lagoons, overwater pool villas, and tropical island bliss."
                              : "Real verified packages backed by registered DMC supplier allotments, official hotel contracts, and certified itinerary pacing."}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                <Compass className="h-4 w-4 text-brand-gold-500 shrink-0" />
                <span>
                  Showing <strong className="text-brand-navy-900">{packages.length}</strong> of{" "}
                  <strong className="text-brand-navy-900">{totalCount}</strong> verified packages
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Content Body */}
        <section className="container mx-auto px-4 sm:px-6 py-8">
          {/* Filter Bar with URL-synced Filters */}
          <div className="mb-8">
            <HolidayFilterBar
              destinations={destinations}
              departureCities={departureCities}
              countries={countries}
              mealPlans={mealPlans}
              activeCategory={targetCategory}
            />
          </div>

          {/* Packages Grid */}
          {packages.length > 0 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                {packages.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>

              {/* Server-Side Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                pageSize={limit}
              />
            </div>
          ) : (
            <EmptyState
              type="search"
              title="No Packages Matching Selected Criteria"
              description="We could not find verified packages matching your specific budget, duration, star rating, or departure filters. Adjust your filters or explore other destinations."
            />
          )}

          {/* Real Data Policy Assurance Banner */}
          <div className="mt-12 rounded-2xl border border-brand-emerald-500/20 bg-brand-emerald-50/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-6 w-6 text-brand-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-heading text-sm font-bold text-brand-emerald-950">
                  Real Commercial Inventory Guarantee
                </h4>
                <p className="text-xs text-brand-emerald-800 leading-relaxed mt-0.5">
                  All published packages feature confirmed hotel partners, registered supplier codes,
                  and authentic starting prices. Sah Tour And Travel never publishes fictional discounts.
                </p>
              </div>
            </div>
            <span className="shrink-0 text-xs font-semibold text-brand-emerald-700 bg-white px-3 py-1.5 rounded-lg border border-brand-emerald-200">
              Contract Verified
            </span>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
