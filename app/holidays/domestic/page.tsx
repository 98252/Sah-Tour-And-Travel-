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
import { MapPin, ShieldCheck, Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "Domestic Indian Holidays | Verified Heritage & Nature Tours",
  description:
    "Explore authentic domestic holiday packages across India curated by Sah Tour And Travel. Featuring verified hotel stays, state tourism accredited DMCs, and transparent itineraries.",
};

interface DomesticHolidaysProps {
  searchParams: Promise<{
    q?: string;
    destination?: string;
    dest?: string;
    country?: string;
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

export default async function DomesticHolidaysPage({
  searchParams,
}: DomesticHolidaysProps) {
  const resolved = await searchParams;
  const {
    q,
    destination,
    dest,
    country,
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
  const targetBudget = budget || price;
  const targetCity = city || departureCity;
  const targetRating = rating && rating !== "all" ? parseInt(rating, 10) : undefined;
  const currentPage = parseInt(page, 10) || 1;

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

  // Pre-filtered for Domestic with pagination
  const [paginatedResult, destinations, departureCities, countries, mealPlans] = await Promise.all([
    getPackagesWithPagination({
      search: q,
      destination: targetDest,
      country: country,
      category: "domestic",
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
        {/* Page Hero */}
        <section className="border-b border-slate-200/80 bg-white py-10 px-4 sm:px-6">
          <div className="container mx-auto">
            <div className="mb-4">
              <Breadcrumb
                items={[
                  { label: "Holidays", href: "/holidays" },
                  { label: "Incredible India Holidays", isCurrent: true },
                ]}
              />
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="verified" showIcon>
                    Ministry & State Tourism Accredited
                  </Badge>
                  <Badge variant="luxury">Indian Subcontinent</Badge>
                </div>
                <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy-900 tracking-tight flex items-center gap-3">
                  <MapPin className="h-8 w-8 sm:h-10 sm:w-10 text-brand-teal-600" />
                  Domestic Holiday Packages
                </h1>
                <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                  Discover the timeless heritage, serene backwaters, and pristine hills of India. All
                  packages feature verified transport vendors and certified heritage stays.
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
          <div className="mb-8">
            <HolidayFilterBar
              destinations={destinations}
              departureCities={departureCities}
              countries={countries}
              mealPlans={mealPlans}
              activeCategory="Domestic Holidays"
            />
          </div>

          {packages.length > 0 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                {packages.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>

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
              title="No Domestic Packages Matching Filters"
              description="Adjust your budget, duration, star rating, or destination filter to explore other verified domestic packages across India."
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
