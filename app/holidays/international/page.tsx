import * as React from "react";
import Link from "next/link";
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
import { Globe2, ShieldCheck, Compass, Sparkles, PhoneCall } from "lucide-react";
import { InternationalVideoHero } from "@/components/holiday/international-video-hero";
import { TrendingDestinationsSlider } from "@/components/home/trending-destinations-slider";
import { ThemesInspireTravel } from "@/components/home/themes-inspire-travel";

export const metadata: Metadata = {
  title: "International Holiday Packages | Verified World Tours",
  description:
    "Curated international tour packages across Europe, Southeast Asia, and the Middle East with verified hotel contracts, transparent itineraries, and real pricing.",
};

interface InternationalHolidaysProps {
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

export default async function InternationalHolidaysPage({
  searchParams,
}: InternationalHolidaysProps) {
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

  // Pre-filtered for International with pagination
  const [paginatedResult, destinations, departureCities, countries, mealPlans] = await Promise.all([
    getPackagesWithPagination({
      search: q,
      destination: targetDest,
      country: country,
      category: "international",
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
        {/* 1. Thomas Cook-Style Cinematic International Video Hero */}
        <InternationalVideoHero totalCount={totalCount} />

        {/* 2. Trending Destinations Capsule Carousel (Thomas Cook Layout) */}
        <div className="border-b border-slate-200/80 bg-white">
          <TrendingDestinationsSlider />
        </div>

        {/* 3. Explore Themes that Inspire Travel (Thomas Cook Expanding Accordion) */}
        <div className="border-b border-slate-200/80 bg-white">
          <ThemesInspireTravel />
        </div>


        {/* Content Body */}
        <section className="container mx-auto px-4 sm:px-6 py-8">
          <div className="mb-8">
            <HolidayFilterBar
              destinations={destinations}
              departureCities={departureCities}
              countries={countries}
              mealPlans={mealPlans}
              activeCategory="International Holidays"
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
              title="No International Packages Matching Filters"
              description="Adjust your budget, duration, star rating, or destination filter to explore other verified worldwide packages."
            />
          )}

          {/* Thomas Cook-Style Travel Expert Helpline */}
          <div className="mt-8 rounded-2xl bg-[#0a1b33] text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-luxury-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-gold-500/20 border border-brand-gold-400/40 flex items-center justify-center text-brand-gold-400 shrink-0">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading text-lg font-bold text-white">
                  Need Help Planning Your Dream International Trip?
                </h4>
                <p className="text-xs sm:text-sm text-slate-300">
                  Talk to our certified holiday specialists for personalized itineraries and exclusive corporate/family discounts.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="tel:18002099100"
                className="bg-[#0B4B8E] hover:bg-[#083a6f] text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-full transition-all shadow-md inline-flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call 1800-2099-100</span>
              </a>
              <Link
                href="/enquire"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-full border border-white/20 transition-all"
              >
                Request Callback
              </Link>
            </div>
          </div>

          {/* Supplier Guarantee Banner */}
          <div className="mt-8 rounded-2xl border border-brand-emerald-500/20 bg-brand-emerald-50/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-6 w-6 text-brand-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-heading text-sm font-bold text-brand-emerald-950">
                  Global Partner Guarantee
                </h4>
                <p className="text-xs text-brand-emerald-800 leading-relaxed mt-0.5">
                  Every international itinerary is verified with local tourism authorities and certified
                  receptive operators. Real flight schedules, verified city taxes, and contracted stays.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
