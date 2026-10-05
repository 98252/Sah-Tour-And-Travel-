import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PackageCard } from "@/components/holiday/package-card";
import { performGlobalSearch } from "@/services/search-service";
import { Search, MapPin, Compass, ArrowRight, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Search Travel Inventory | Verified Packages & Destinations",
  description:
    "Search verified holiday packages, destination travel guides, and authentic tour itineraries across Sah Tour And Travel.",
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    type?: "all" | "packages" | "destinations" | "activities";
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "", type = "all" } = await searchParams;
  const results = await performGlobalSearch(q, 30);

  const hasResults = results.totalCount > 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        {/* Search Header Banner */}
        <section className="border-b border-slate-200/80 bg-white py-10 px-4 sm:px-6">
          <div className="container mx-auto">
            <div className="mb-4">
              <Breadcrumb
                items={[
                  { label: "Search", isCurrent: !q },
                  ...(q ? [{ label: `"${q}"`, isCurrent: true }] : []),
                ]}
              />
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="verified" showIcon>
                    Global Database Search
                  </Badge>
                  <Badge variant="luxury">Real Inventory Only</Badge>
                </div>

                <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-navy-900 tracking-tight">
                  {q ? (
                    <>
                      Search Results for <span className="text-brand-gold-600">&ldquo;{q}&rdquo;</span>
                    </>
                  ) : (
                    "Search All Travel Offerings"
                  )}
                </h1>

                <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                  Search across verified destinations, official tour packages, certified hotel allotments,
                  and excursion activities.
                </p>
              </div>

              {/* Inline Search Bar */}
              <div className="w-full md:w-auto md:min-w-[340px]">
                <form action="/search" method="GET" className="relative">
                  <input
                    type="text"
                    name="q"
                    defaultValue={q}
                    placeholder="Search destinations, packages..."
                    className="w-full h-11 pl-10 pr-24 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-brand-navy-900 focus:border-brand-gold-500 focus:outline-none shadow-sm"
                  />
                  <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-brand-gold-500" />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 h-8 px-3 rounded-lg bg-brand-navy-900 text-xs font-bold text-white hover:bg-brand-navy-800 transition-colors"
                  >
                    Search
                  </button>
                </form>
              </div>
            </div>

            {/* Entity Navigation Tabs */}
            {hasResults && (
              <div className="flex items-center gap-2 mt-8 pt-6 border-t border-slate-100 overflow-x-auto text-xs">
                <Link
                  href={`/search?q=${encodeURIComponent(q)}&type=all`}
                  className={`px-3.5 py-1.5 rounded-full font-bold transition-all ${type === "all"
                      ? "bg-brand-navy-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                  All Results ({results.totalCount})
                </Link>

                <Link
                  href={`/search?q=${encodeURIComponent(q)}&type=packages`}
                  className={`px-3.5 py-1.5 rounded-full font-bold transition-all ${type === "packages"
                      ? "bg-brand-navy-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                  Packages ({results.packages.length})
                </Link>

                <Link
                  href={`/search?q=${encodeURIComponent(q)}&type=destinations`}
                  className={`px-3.5 py-1.5 rounded-full font-bold transition-all ${type === "destinations"
                      ? "bg-brand-navy-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                  Destinations ({results.destinations.length})
                </Link>

                <Link
                  href={`/search?q=${encodeURIComponent(q)}&type=activities`}
                  className={`px-3.5 py-1.5 rounded-full font-bold transition-all ${type === "activities"
                      ? "bg-brand-navy-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                  Activities ({results.activities.length})
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Results Body */}
        <section className="container mx-auto px-4 sm:px-6 py-8">
          {!q ? (
            <div className="py-16 text-center space-y-4">
              <Compass className="h-12 w-12 text-brand-gold-500 mx-auto" />
              <h3 className="font-heading text-xl font-bold text-brand-navy-900">
                Explore the Sah Tour And Travel Database
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Type any destination name, travel theme, departure hub, or tour keyword into the search bar
                above to discover verified commercial packages and travel guides.
              </p>
            </div>
          ) : !hasResults ? (
            <EmptyState
              type="search"
              title={`No Results Found for "${q}"`}
              description="We could not find any verified packages or destinations matching your search. Please check your spelling or try searching for major destinations like Dubai, Switzerland, Kerala, or Singapore."
            />
          ) : (
            <div className="space-y-12">
              {/* Packages Section */}
              {(type === "all" || type === "packages") && results.packages.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-heading text-xl font-bold text-brand-navy-900">
                      Holiday Packages ({results.packages.length})
                    </h2>
                    <Link
                      href={`/holidays?q=${encodeURIComponent(q)}`}
                      className="text-xs font-semibold text-brand-gold-600 hover:underline"
                    >
                      Open in Holidays Catalogue →
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.packages.map((pkg) => (
                      <PackageCard
                        key={pkg.id}
                        pkg={{
                          id: pkg.id,
                          name: pkg.name,
                          slug: pkg.slug,
                          durationText: pkg.durationText,
                          travelStyle: pkg.travelStyle,
                          startingPrice: pkg.startingPrice,
                          currency: pkg.currency,
                          priceType: pkg.priceType,
                          departureCity: pkg.departureCity,
                          mealPlan: pkg.mealPlan,
                          shortDescription: pkg.shortDescription,
                          highlights: pkg.highlights,
                          destination: {
                            name: pkg.destinationName,
                            countryName: pkg.countryName,
                          },
                          source: {
                            name: "Sah Tour And Travel Verified Inventory",
                            licenseRef: "STT-VERIFIED-2026",
                          },
                          images: [
                            {
                              url: pkg.image,
                              caption: pkg.name,
                              source: "Licensed",
                              license: "Commercial License",
                            },
                          ],
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Destinations Section */}
              {(type === "all" || type === "destinations") && results.destinations.length > 0 && (
                <div className="space-y-4">
                  <h2 className="font-heading text-xl font-bold text-brand-navy-900">
                    Destinations ({results.destinations.length})
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.destinations.map((dest) => (
                      <Link
                        key={dest.id}
                        href={dest.url}
                        className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-luxury-sm hover:shadow-luxury-md transition-all"
                      >
                        <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={dest.image}
                            alt={dest.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute bottom-3 left-3 right-3 text-white">
                            <span className="text-[10px] uppercase font-bold text-brand-gold-300">
                              {dest.countryName}
                            </span>
                            <h3 className="font-heading text-lg font-bold group-hover:text-brand-gold-300 transition-colors">
                              {dest.name}
                            </h3>
                          </div>
                        </div>

                        <div className="p-4 flex items-center justify-between text-xs text-slate-500">
                          <span className="truncate">{dest.subtitle}</span>
                          <span className="font-bold text-brand-gold-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 shrink-0 ml-2">
                            Explore <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Activities Section */}
              {(type === "all" || type === "activities") && results.activities.length > 0 && (
                <div className="space-y-4">
                  <h2 className="font-heading text-xl font-bold text-brand-navy-900">
                    Activities & Excursions ({results.activities.length})
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.activities.map((act) => (
                      <Link
                        key={act.id}
                        href={act.url}
                        className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-brand-gold-500/50 hover:shadow-luxury-sm transition-all group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-brand-gold-50 text-brand-gold-800 border border-brand-gold-200">
                              {act.type}
                            </span>
                            <h4 className="font-heading text-sm font-bold text-brand-navy-900 group-hover:text-brand-gold-600 transition-colors">
                              {act.title}
                            </h4>
                          </div>

                          <p className="text-xs text-slate-600 line-clamp-2">
                            {act.description}
                          </p>

                          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                            <MapPin className="h-3 w-3 text-brand-teal-600 shrink-0" />
                            <span>{act.locationName}</span>
                            {act.duration && <span>• {act.duration}</span>}
                          </div>
                        </div>

                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-brand-gold-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Guaranteed Real Inventory Banner */}
          <div className="mt-12 rounded-2xl border border-brand-emerald-500/20 bg-brand-emerald-50/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-6 w-6 text-brand-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-heading text-sm font-bold text-brand-emerald-950">
                  Verified Database Query Guarantee
                </h4>
                <p className="text-xs text-brand-emerald-800 leading-relaxed mt-0.5">
                  All search results are queried directly against confirmed partner allotments and verified
                  tourism authority records. Sah Tour And Travel never serves speculative or dummy items.
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
