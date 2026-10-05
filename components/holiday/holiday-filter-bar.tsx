"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HOLIDAY_CATEGORIES } from "@/services/package-service";
import { Search, ArrowUpDown, RotateCcw, Star } from "lucide-react";

export interface HolidayFilterBarProps {
  destinations: { id: string; name: string; slug: string; countryName: string }[];
  departureCities: string[];
  countries?: string[];
  mealPlans?: string[];
  activeCategory?: string;
}

export function HolidayFilterBar({
  destinations,
  departureCities,
  countries = [],
  mealPlans = [],
  activeCategory,
}: HolidayFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentSearch = searchParams.get("q") || "";
  const currentDest = searchParams.get("destination") || searchParams.get("dest") || "all";
  const currentCountry = searchParams.get("country") || "all";
  const currentCategory =
    searchParams.get("travelType") || searchParams.get("category") || activeCategory || "all";
  const currentBudget = searchParams.get("budget") || searchParams.get("price") || "all";
  const currentDuration = searchParams.get("duration") || "all";
  const currentCity = searchParams.get("city") || searchParams.get("departureCity") || "all";
  const currentMealPlan = searchParams.get("mealPlan") || "all";
  const currentRating = searchParams.get("rating") || "all";
  const currentSort = searchParams.get("sort") || "popularity";

  const [searchTerm, setSearchTerm] = React.useState(currentSearch);
  const [prevSearch, setPrevSearch] = React.useState(currentSearch);

  if (currentSearch !== prevSearch) {
    setPrevSearch(currentSearch);
    setSearchTerm(currentSearch);
  }

  const updateParam = React.useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page"); // Reset pagination on any filter update

      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
        // Also delete alias keys
        if (key === "destination") params.delete("dest");
        if (key === "dest") params.delete("destination");
        if (key === "category") params.delete("travelType");
        if (key === "travelType") params.delete("category");
        if (key === "budget") params.delete("price");
        if (key === "price") params.delete("budget");
        if (key === "city") params.delete("departureCity");
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  // Debounced search input (350ms)
  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== currentSearch) {
        updateParam("q", searchTerm);
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [searchTerm, currentSearch, updateParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam("q", searchTerm);
  };

  const handleReset = () => {
    setSearchTerm("");
    router.push(pathname);
  };

  const hasFilters =
    Boolean(currentSearch) ||
    currentDest !== "all" ||
    currentCountry !== "all" ||
    (currentCategory !== "all" && currentCategory !== activeCategory) ||
    currentBudget !== "all" ||
    currentDuration !== "all" ||
    currentCity !== "all" ||
    currentMealPlan !== "all" ||
    currentRating !== "all";

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-luxury-sm space-y-4">
      {/* Top Search & Sorting Line */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="w-full md:max-w-md">
          <Input
            placeholder="Search holiday packages, experiences (auto-debounced)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-4 w-4 text-brand-gold-500" />}
            className="h-11"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap flex items-center gap-1">
            <ArrowUpDown className="h-3.5 w-3.5 text-brand-navy-800" />
            <span>Sort by:</span>
          </span>
          <select
            value={currentSort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-800 shadow-xs focus:border-brand-navy-900 focus:outline-none"
          >
            <option value="popularity">Most Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="duration-asc">Duration: Shortest First</option>
            <option value="duration-desc">Duration: Longest First</option>
            <option value="newest">Newest Departures</option>
          </select>
        </div>
      </div>

      {/* Faceted Filters Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-2.5 pt-3 border-t border-slate-100 text-xs">
        {/* Destination Filter */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Destination
          </label>
          <select
            value={currentDest}
            onChange={(e) => updateParam("destination", e.target.value)}
            className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs font-medium text-slate-700"
          >
            <option value="all">All Destinations</option>
            {destinations.map((d) => (
              <option key={d.id} value={d.slug}>
                {d.name} ({d.countryName})
              </option>
            ))}
          </select>
        </div>

        {/* Country Filter */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Country
          </label>
          <select
            value={currentCountry}
            onChange={(e) => updateParam("country", e.target.value)}
            className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs font-medium text-slate-700"
          >
            <option value="all">All Countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Budget Filter */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Max Budget
          </label>
          <select
            value={currentBudget}
            onChange={(e) => updateParam("budget", e.target.value)}
            className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs font-medium text-slate-700"
          >
            <option value="all">Any Budget</option>
            <option value="35000">Up to ₹35,000</option>
            <option value="60000">Up to ₹60,000</option>
            <option value="100000">Up to ₹1,00,000</option>
            <option value="150000">Up to ₹1,50,000</option>
          </select>
        </div>

        {/* Duration Filter */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Duration
          </label>
          <select
            value={currentDuration}
            onChange={(e) => updateParam("duration", e.target.value)}
            className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs font-medium text-slate-700"
          >
            <option value="all">All Durations</option>
            <option value="weekend">1 – 3 Days (Weekend)</option>
            <option value="medium">4 – 6 Days</option>
            <option value="7">7 Days</option>
            <option value="extended">7+ Days</option>
          </select>
        </div>

        {/* Departure City */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Departure City
          </label>
          <select
            value={currentCity}
            onChange={(e) => updateParam("city", e.target.value)}
            className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs font-medium text-slate-700"
          >
            <option value="all">All Departure Hubs</option>
            {departureCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Travel Style (Category) */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Travel Style
          </label>
          <select
            value={currentCategory}
            onChange={(e) => updateParam("category", e.target.value)}
            className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs font-medium text-slate-700"
          >
            <option value="all">All Categories</option>
            {HOLIDAY_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Rating where verified */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1 flex items-center gap-0.5">
            <Star className="h-2.5 w-2.5 text-brand-gold-500 fill-brand-gold-500" />
            <span>Stay Rating</span>
          </label>
          <select
            value={currentRating}
            onChange={(e) => updateParam("rating", e.target.value)}
            className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs font-medium text-slate-700"
          >
            <option value="all">All Ratings</option>
            <option value="3">3★ & Above</option>
            <option value="4">4★ & Above</option>
            <option value="5">5★ Luxury</option>
          </select>
        </div>

        {/* Meal Plan Filter */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Meal Plan
          </label>
          <select
            value={currentMealPlan}
            onChange={(e) => updateParam("mealPlan", e.target.value)}
            className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs font-medium text-slate-700"
          >
            <option value="all">All Meal Plans</option>
            {mealPlans.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Reset Action */}
      {hasFilters && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 text-[11px]">
            Filters active — results automatically updated and shareable via URL.
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleReset}
            leftIcon={<RotateCcw className="h-3 w-3" />}
            className="text-xs text-slate-500 hover:text-brand-navy-900 h-8"
          >
            Reset All Filters
          </Button>
        </div>
      )}
    </div>
  );
}
