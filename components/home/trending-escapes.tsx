import * as React from "react";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PackageImage {
  url: string;
  caption?: string;
  isHero?: boolean;
}

interface PackageDestination {
  name: string;
  countryName: string;
}

export interface TrendingPackage {
  id: string;
  name: string;
  slug: string;
  category: string;
  durationText: string;
  startingPrice: number;
  currency: string;
  travelStyle: string;
  shortDescription: string;
  images: PackageImage[];
  destination: PackageDestination;
}

interface TrendingJourneysProps {
  packages: TrendingPackage[];
  title?: string;
  subtitle?: string;
}

export function TrendingEscapes({
  packages,
  title = "Trending Journeys",
  subtitle = "Handcrafted itineraries shaped for unforgettable moments.",
}: TrendingJourneysProps) {
  if (!packages || packages.length === 0) return null;

  return (
    <section className="py-18 sm:py-26 bg-white text-slate-900">
      <div className="section-container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-brand-gold-600 text-xs font-bold tracking-widest uppercase mb-3">
              <Compass className="h-4 w-4" />
              <span>Curated Travel Packages</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-brand-navy-950 leading-tight">
              {title}
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600 font-light leading-relaxed">
              {subtitle}
            </p>
          </div>

          <Link
            href="/packages"
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand-navy-900 hover:text-brand-gold-600 transition-colors uppercase tracking-wider shrink-0"
          >
            <span>View All Journeys</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Visual / Information Package Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-7 lg:gap-8">
          {packages.map((pkg) => {
            const heroImage =
              pkg.images && pkg.images.length > 0
                ? pkg.images.find((img) => img.isHero)?.url || pkg.images[0].url
                : "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80";

            return (
              <div
                key={pkg.id}
                className="group flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-[0_6px_22px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.13)] transition-all duration-400 hover:-translate-y-1.5 aspect-square"
              >
                {/* Visual Section (~52% of square box) */}
                <div className="relative h-[52%] w-full overflow-hidden bg-slate-900 shrink-0">
                  <Link href={`/packages/${pkg.slug}`} className="block w-full h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={heroImage}
                      alt={pkg.name}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-black/20" />

                    {/* Destination Pill on Top Left */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-brand-navy-950 backdrop-blur-md shadow-xs">
                        <MapPin className="h-3.5 w-3.5 text-brand-gold-600" />
                        <span>{pkg.destination.name}</span>
                      </span>
                    </div>

                    {/* Duration on Bottom Left of Image */}
                    <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white/95 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                      <Clock className="h-3.5 w-3.5 text-brand-gold-400" />
                      <span>{pkg.durationText}</span>
                    </div>
                  </Link>
                </div>

                {/* Information Section (~48% of square box) */}
                <div className="p-5 sm:p-6 lg:p-7 flex flex-col justify-between flex-1 bg-white min-h-0">
                  <div className="space-y-2">
                    <Link href={`/packages/${pkg.slug}`}>
                      <h3 className="font-serif text-lg sm:text-xl lg:text-2xl font-bold text-brand-navy-950 group-hover:text-brand-gold-600 transition-colors line-clamp-1 leading-snug">
                        {pkg.name}
                      </h3>
                    </Link>
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed font-normal">
                      {pkg.shortDescription}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-xs text-slate-400 uppercase font-bold block tracking-wider">
                        Starting from
                      </span>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-brand-navy-950 truncate tracking-tight">
                        ₹{pkg.startingPrice.toLocaleString("en-IN")}
                        <span className="text-xs sm:text-sm font-medium text-slate-500"> / person</span>
                      </p>
                    </div>

                    <Link href={`/packages/${pkg.slug}`} className="shrink-0">
                      <Button
                        variant="default"
                        size="sm"
                        className="rounded-xl px-5 py-2.5 h-10 text-xs sm:text-sm font-bold group-hover:bg-brand-gold-500 group-hover:text-slate-950 transition-colors shadow-sm"
                      >
                        View Journey
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Export both names for backwards compatibility
export { TrendingEscapes as TrendingJourneys };
