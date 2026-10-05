import * as React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { DestinationFilterBar } from "@/components/destination/destination-filter-bar";
import { DestinationCard } from "@/components/destination/destination-card";
import {
  getDestinations,
  getAllRegions,
  getAllCountries,
} from "@/services/destination-service";
import { ShieldCheck, Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "Explore World Destinations | Verified Guides",
  description:
    "Discover authentic holiday destinations with zero fabricated information. All attractions, visa policies, and travel logistics are certified directly from official national tourism authorities.",
};

interface DestinationsPageProps {
  searchParams: Promise<{
    q?: string;
    region?: string;
    country?: string;
  }>;
}

export default async function DestinationsPage({
  searchParams,
}: DestinationsPageProps) {
  const resolvedParams = await searchParams;
  const { q, region, country } = resolvedParams;

  // Database-backed queries
  const [destinations, regions, countries] = await Promise.all([
    getDestinations({
      search: q,
      regionSlug: region,
      countrySlug: country,
    }),
    getAllRegions(),
    getAllCountries(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        {/* Hero Header */}
        <section className="border-b border-slate-200/80 bg-white py-10 px-4 sm:px-6">
          <div className="container mx-auto">
            {/* Breadcrumb */}
            <div className="mb-4">
              <Breadcrumb
                items={[
                  { label: "Destinations", isCurrent: true },
                ]}
              />
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="verified" showIcon>
                    100% Official Tourism Board Data
                  </Badge>
                  <Badge variant="luxury" showIcon>
                    Sah Tour And Travel
                  </Badge>
                </div>
                <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy-900 tracking-tight">
                  Explore Verified Destinations
                </h1>
                <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                  Every destination profile is backed by official government tourism boards,
                  attraction registries, and certified consular visa authorities.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                <Compass className="h-4 w-4 text-brand-gold-500 shrink-0" />
                <span>
                  Showing <strong className="text-brand-navy-900">{destinations.length}</strong> verified destinations
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Content Body */}
        <section className="container mx-auto px-4 sm:px-6 py-8">
          {/* Database-Backed Filter Bar */}
          <div className="mb-8">
            <DestinationFilterBar regions={regions} countries={countries} />
          </div>

          {/* Destination Results Grid */}
          {destinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          ) : (
            <EmptyState
              type="search"
              title="No Destinations Found"
              description={`We could not find verified destinations matching your criteria. Try resetting your search filters or choosing a different global region.`}
            />
          )}

          {/* Official Verification Notice */}
          <div className="mt-12 rounded-2xl border border-brand-emerald-500/20 bg-brand-emerald-50/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-6 w-6 text-brand-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-heading text-sm font-bold text-brand-emerald-950">
                  Zero Fabricated Travel Information Policy
                </h4>
                <p className="text-xs text-brand-emerald-800 leading-relaxed mt-0.5">
                  All publicly displayed destination facts, attractions, entry policies, and visa requirements are validated against official government portals.
                </p>
              </div>
            </div>
            <span className="shrink-0 text-xs font-semibold text-brand-emerald-700 bg-white px-3 py-1.5 rounded-lg border border-brand-emerald-200">
              Verified & Audit-Traceable
            </span>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
