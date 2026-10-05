import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Compass } from "lucide-react";

interface DestinationData {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  heroImage: string;
  country: {
    name: string;
    slug?: string;
  };
}

interface ExploreWorldGridProps {
  destinations: DestinationData[];
}

export function ExploreWorldGrid({ destinations }: ExploreWorldGridProps) {
  if (!destinations || destinations.length === 0) return null;

  // Primary featured destination (e.g. Switzerland or first)
  const featured =
    destinations.find((d) => d.slug.toLowerCase().includes("switzerland")) || destinations[0];
  const others = destinations.filter((d) => d.id !== featured.id);

  const mediumItems = others.slice(0, 2);
  const smallItems = others.slice(2, 5);

  return (
    <section className="py-18 sm:py-26 bg-[#fbfbf9] text-brand-navy-950 overflow-hidden">
      <div className="section-container">
        {/* Section Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-brand-gold-600 text-xs font-bold tracking-widest uppercase mb-3">
              <Compass className="h-4 w-4" />
              <span>Destination Portfolio</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-brand-navy-950 leading-tight">
              Explore the World
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600 font-light leading-relaxed">
              Places worth travelling for.
            </p>
          </div>

          <Link
            href="/destinations"
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand-navy-900 hover:text-brand-gold-600 transition-colors uppercase tracking-wider shrink-0"
          >
            <span>View All Destinations</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Asymmetric Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* 1. Large Featured Destination (Spans 7 cols on Desktop) - 30% Increased Length */}
          <div className="lg:col-span-7 group relative min-h-[620px] sm:min-h-[750px] lg:min-h-[830px] xl:min-h-[910px] rounded-3xl overflow-hidden shadow-luxury-md transition-all duration-500 hover:shadow-luxury-lg">
            <Link
              href={`/destinations/${featured.country.slug || "europe"}/${featured.slug}`}
              className="block w-full h-full"
            >
              {/* Image with subtle 1.03x hover zoom */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.heroImage}
                alt={featured.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Editorial Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/90 via-brand-navy-950/30 to-black/10 transition-opacity duration-500 group-hover:opacity-90" />

              {/* Bottom Editorial Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10 text-white z-10 transition-transform duration-300 group-hover:-translate-y-1">
                <span className="text-xs font-semibold tracking-widest uppercase text-brand-gold-400 block mb-2">
                  {featured.country.name}
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-normal text-white mb-3">
                  {featured.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg line-clamp-2 mb-6 font-light leading-relaxed">
                  {featured.shortDescription}
                </p>

                <div className="inline-flex items-center gap-2 text-xs font-semibold text-white group-hover:text-brand-gold-300 transition-colors">
                  <span>Explore Destination</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>

          {/* 2. Two Medium Destinations Stacked (Spans 5 cols on Desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {mediumItems.map((item) => (
              <div
                key={item.id}
                className="group relative flex-1 min-h-[290px] sm:min-h-[355px] lg:min-h-[395px] xl:min-h-[435px] rounded-3xl overflow-hidden shadow-luxury-md transition-all duration-500 hover:shadow-luxury-lg"
              >
                <Link
                  href={`/destinations/${item.country.slug || "destinations"}/${item.slug}`}
                  className="block w-full h-full"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.heroImage}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/90 via-brand-navy-950/30 to-black/10 transition-opacity duration-500" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7 text-white z-10 transition-transform duration-300 group-hover:-translate-y-1">
                    <span className="text-[11px] font-semibold tracking-widest uppercase text-brand-gold-400 block mb-1">
                      {item.country.name}
                    </span>
                    <h4 className="font-serif text-2xl font-normal text-white mb-1.5">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-300 line-clamp-1 font-light mb-3">
                      {item.shortDescription}
                    </p>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-white group-hover:text-brand-gold-300 transition-colors">
                      <span>View Journeys</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Smaller Companion Destinations (Row below) */}
        {smallItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {smallItems.map((item) => (
              <div
                key={item.id}
                className="group relative h-80 sm:h-96 lg:h-[420px] xl:h-[460px] rounded-3xl overflow-hidden shadow-luxury-sm hover:shadow-luxury-md transition-all duration-500"
              >
                <Link
                  href={`/destinations/${item.country.slug || "destinations"}/${item.slug}`}
                  className="block w-full h-full"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.heroImage}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/85 via-brand-navy-950/30 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10 transition-transform duration-300 group-hover:-translate-y-1">
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-brand-gold-400 block mb-1">
                      {item.country.name}
                    </span>
                    <h5 className="font-serif text-xl font-normal text-white mb-1">
                      {item.name}
                    </h5>
                    <p className="text-xs text-slate-300 line-clamp-1 font-light">
                      {item.shortDescription}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
