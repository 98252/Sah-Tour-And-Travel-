"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowUpRight, Compass, MapPin } from "lucide-react";

interface DestinationItem {
  id: string;
  name: string;
  country: string;
  region: string;
  href: string;
  image: string;
  curatedHighlight: string;
  packagesCount?: number;
}

const POPULAR_DESTINATIONS: DestinationItem[] = [
  {
    id: "switzerland",
    name: "Switzerland & The Alps",
    country: "Switzerland",
    region: "Europe",
    href: "/destinations/europe/switzerland",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
    curatedHighlight: "Scenic Rail & Alpine Glaciers",
    packagesCount: 2,
  },
  {
    id: "dubai",
    name: "Dubai & Emirates",
    country: "United Arab Emirates",
    region: "Middle East",
    href: "/destinations/uae/dubai",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    curatedHighlight: "Desert Safaris & Royal Palaces",
    packagesCount: 2,
  },
  {
    id: "maldives",
    name: "Maldives Private Island",
    country: "Maldives",
    region: "Indian Ocean",
    href: "/packages/honeymoon-packages",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
    curatedHighlight: "Overwater Villas & Coral Lagoons",
    packagesCount: 1,
  },
  {
    id: "singapore",
    name: "Singapore City",
    country: "Singapore",
    region: "Southeast Asia",
    href: "/destinations/asia/singapore",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
    curatedHighlight: "Gardens by the Bay & Marina Bay",
    packagesCount: 2,
  },
  {
    id: "bali",
    name: "Bali Sanctuary",
    country: "Indonesia",
    region: "Southeast Asia",
    href: "/packages/luxury-escapes",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    curatedHighlight: "Ubud Wellness & Cliffside Villas",
    packagesCount: 1,
  },
  {
    id: "kerala",
    name: "Kerala Backwaters",
    country: "India",
    region: "India & Nepal",
    href: "/destinations/asia/india",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    curatedHighlight: "Kumarakom Houseboats & Tea Hills",
    packagesCount: 2,
  },
  {
    id: "santorini",
    name: "Santorini & Greek Isles",
    country: "Greece",
    region: "Europe",
    href: "/packages/honeymoon-packages",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
    curatedHighlight: "Caldera Cave Suites & Sunset Catamaran",
    packagesCount: 1,
  },
  {
    id: "kashmir",
    name: "Kashmir Valley",
    country: "India",
    region: "India & Nepal",
    href: "/packages/luxury-escapes",
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80",
    curatedHighlight: "The Khyber Gulmarg & Dal Houseboat",
    packagesCount: 1,
  },
  {
    id: "thailand",
    name: "Thailand & Phuket",
    country: "Thailand",
    region: "Southeast Asia",
    href: "/destinations/asia/thailand",
    image: "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=800&q=80",
    curatedHighlight: "Island Hopping & Bangkok Temples",
    packagesCount: 1,
  },
];

const REGION_TABS = [
  "All",
  "Europe",
  "Middle East",
  "Southeast Asia",
  "Indian Ocean",
  "India & Nepal",
];

export function PopularDestinationsSlider() {
  const [activeTab, setActiveTab] = React.useState("All");
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);

  const filtered = React.useMemo(() => {
    if (activeTab === "All") return POPULAR_DESTINATIONS;
    return POPULAR_DESTINATIONS.filter((d) => d.region === activeTab);
  }, [activeTab]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 360;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-20 sm:py-28 bg-white text-slate-900 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-brand-gold-600 text-xs font-bold tracking-widest uppercase mb-3">
              <Compass className="h-4 w-4" />
              <span>Worldwide Curations</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-brand-navy-950 leading-tight">
              Popular Destinations
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600 font-light leading-relaxed">
              Curated places shaped by genuine cultural depth, scenic grandeur, and verified stays.
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Scroll destinations left"
              className="h-11 w-11 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Scroll destinations right"
              className="h-11 w-11 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105 active:scale-95"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Region Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-6 mb-2">
          {REGION_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-brand-navy-950 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Horizontal Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-2 -mx-4 px-4 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12"
        >
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative w-[280px] sm:w-[320px] lg:w-[340px] shrink-0 rounded-3xl overflow-hidden shadow-luxury-sm hover:shadow-luxury-lg transition-all duration-500 bg-slate-900"
            >
              <Link href={item.href} className="block w-full h-[400px] sm:h-[440px]">
                {/* Image with subtle 1.03x hover zoom */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Multi-Stop Cinematic Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-black/10 transition-opacity duration-300 group-hover:opacity-90" />

                {/* Country / Region Badge on Top */}
                <div className="absolute top-5 left-5 z-10 flex items-center justify-between right-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-medium border border-white/20">
                    <MapPin className="h-3 w-3 text-brand-gold-400" />
                    <span>{item.country}</span>
                  </span>

                  <div className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>

                {/* Content on Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7 text-white z-10 transition-transform duration-300 group-hover:-translate-y-1">
                  <p className="text-xs text-brand-gold-400 font-medium tracking-wide uppercase mb-1">
                    {item.curatedHighlight}
                  </p>
                  <h3 className="font-serif text-2xl font-normal text-white mb-2 leading-tight">
                    {item.name}
                  </h3>

                  <div className="flex items-center justify-between pt-2 border-t border-white/15 text-xs text-slate-300">
                    <span>
                      {item.packagesCount
                        ? `${item.packagesCount} Curated Itinerar${item.packagesCount > 1 ? "ies" : "y"}`
                        : "Verified Itineraries"}
                    </span>
                    <span className="font-semibold text-white group-hover:text-brand-gold-400 transition-colors flex items-center gap-1">
                      Explore
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
