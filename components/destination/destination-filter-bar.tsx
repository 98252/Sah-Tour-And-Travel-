"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Globe, RotateCcw } from "lucide-react";

export interface FilterBarProps {
  regions: { id: string; name: string; slug: string; _count: { destinations: number } }[];
  countries: { id: string; name: string; slug: string; _count: { destinations: number } }[];
}

export function DestinationFilterBar({ regions, countries }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentSearch = searchParams.get("q") || "";
  const currentRegion = searchParams.get("region") || "all";
  const currentCountry = searchParams.get("country") || "all";

  const [searchTerm, setSearchTerm] = React.useState(currentSearch);
  const [prevCurrentSearch, setPrevCurrentSearch] = React.useState(currentSearch);

  if (currentSearch !== prevCurrentSearch) {
    setPrevCurrentSearch(currentSearch);
    setSearchTerm(currentSearch);
  }

  const updateFilters = (newParams: { q?: string; region?: string; country?: string }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newParams.q !== undefined) {
      if (newParams.q.trim()) {
        params.set("q", newParams.q.trim());
      } else {
        params.delete("q");
      }
    }

    if (newParams.region !== undefined) {
      if (newParams.region && newParams.region !== "all") {
        params.set("region", newParams.region);
      } else {
        params.delete("region");
      }
    }

    if (newParams.country !== undefined) {
      if (newParams.country && newParams.country !== "all") {
        params.set("country", newParams.country);
      } else {
        params.delete("country");
      }
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ q: searchTerm });
  };

  const handleReset = () => {
    setSearchTerm("");
    router.push(pathname);
  };

  const hasActiveFilters = currentSearch || currentRegion !== "all" || currentCountry !== "all";

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-luxury-sm space-y-4">
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search Input */}
        <div className="sm:col-span-6">
          <Input
            placeholder="Search by destination name, city, or experience..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-4 w-4 text-brand-gold-500" />}
            className="h-11"
          />
        </div>

        {/* Region Filter */}
        <div className="sm:col-span-3">
          <div className="relative">
            <select
              value={currentRegion}
              onChange={(e) => updateFilters({ region: e.target.value })}
              className="flex h-11 w-full appearance-none rounded-xl border border-slate-300 bg-white px-3.5 pr-8 text-xs font-semibold text-slate-700 shadow-xs focus:border-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-gold-500/50 cursor-pointer"
            >
              <option value="all">All Global Regions</option>
              {regions.map((reg) => (
                <option key={reg.id} value={reg.slug}>
                  {reg.name} ({reg._count.destinations})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Globe className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Country Filter */}
        <div className="sm:col-span-3">
          <div className="relative">
            <select
              value={currentCountry}
              onChange={(e) => updateFilters({ country: e.target.value })}
              className="flex h-11 w-full appearance-none rounded-xl border border-slate-300 bg-white px-3.5 pr-8 text-xs font-semibold text-slate-700 shadow-xs focus:border-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-gold-500/50 cursor-pointer"
            >
              <option value="all">All Countries</option>
              {countries.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name} ({c._count.destinations})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <MapPin className="h-4 w-4" />
            </div>
          </div>
        </div>
      </form>

      {/* Filter Quick Pills and Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 font-medium mr-1">Quick Regions:</span>
          <button
            type="button"
            onClick={() => updateFilters({ region: "all" })}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              currentRegion === "all"
                ? "bg-brand-navy-900 text-white font-semibold shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All
          </button>
          {regions.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => updateFilters({ region: r.slug })}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                currentRegion === r.slug
                  ? "bg-brand-navy-900 text-white font-semibold shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleReset}
            leftIcon={<RotateCcw className="h-3 w-3" />}
            className="text-xs text-slate-500 hover:text-brand-navy-900 h-8 px-2"
          >
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
}
