import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExperienceItem {
  id: string;
  title: string;
  destination: string;
  duration: string;
  startingPrice: number;
  slug: string;
  image: string;
  tag: string;
}

const MOST_LOVED: ExperienceItem[] = [
  {
    id: "swiss-glacier",
    title: "Swiss Grand Luxury: St. Moritz Palace & Glacier Express Excellence",
    destination: "Switzerland",
    duration: "8 Days / 7 Nights",
    startingPrice: 245000,
    slug: "switzerland-grand-palace-scenic-rail-escape",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1000&q=80",
    tag: "Signature Alpine Journey",
  },
  {
    id: "dubai-royal",
    title: "Dubai Royal Palace: 5★ Atlantis The Royal & VIP Desert Safari",
    destination: "Dubai, UAE",
    duration: "6 Days / 5 Nights",
    startingPrice: 135000,
    slug: "dubai-royal-palace-atlantis-luxury-escape",
    image: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1000&q=80",
    tag: "Iconic Arabian Luxury",
  },
  {
    id: "maldives-water-villa",
    title: "Maldives Private Island: Overwater Pool Villa & Underwater Dining",
    destination: "Maldives",
    duration: "5 Days / 4 Nights",
    startingPrice: 175000,
    slug: "maldives-luxury-overwater-pool-villa-sanctuary",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1000&q=80",
    tag: "Secluded Island Bliss",
  },
  {
    id: "santorini-cave",
    title: "Santorini & Mykonos: Caldera Cave Suites & Private Catamaran",
    destination: "Greece & Santorini",
    duration: "7 Days / 6 Nights",
    startingPrice: 165000,
    slug: "santorini-mykonos-caldera-cave-suite-escape",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1000&q=80",
    tag: "Aegean Romance",
  },
];

export function MostLovedExperiences() {
  return (
    <section className="py-20 sm:py-28 bg-[#fbfbf9] text-slate-900 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-brand-gold-600 text-xs font-bold tracking-widest uppercase mb-3">
              <Sparkles className="h-4 w-4" />
              <span>Signature Itineraries</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-brand-navy-950 leading-tight">
              Most Loved Experiences
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600 font-light leading-relaxed">
              Timeless journeys and signature stays cherished for their extraordinary setting and flawless pacing.
            </p>
          </div>

          <Link
            href="/packages/luxury-escapes"
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand-navy-900 hover:text-brand-gold-600 transition-colors uppercase tracking-wider shrink-0"
          >
            <span>Explore Luxury Escapes</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOST_LOVED.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-luxury-sm hover:shadow-luxury-lg transition-all duration-400 hover:-translate-y-1"
            >
              <div className="relative h-60 overflow-hidden bg-slate-900">
                <Link href={`/packages/${item.slug}`} className="block w-full h-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-semibold text-brand-navy-950 shadow-xs">
                      {item.tag}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 z-10 flex items-center gap-1.5 text-xs text-white">
                    <MapPin className="h-3.5 w-3.5 text-brand-gold-400" />
                    <span>{item.destination}</span>
                  </div>
                </Link>
              </div>

              <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{item.duration}</span>
                  </div>

                  <Link href={`/packages/${item.slug}`}>
                    <h3 className="font-serif text-lg font-normal text-brand-navy-950 group-hover:text-brand-gold-600 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                  </Link>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      From
                    </span>
                    <p className="text-base font-bold text-brand-navy-950">
                      ₹{item.startingPrice.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <Link
                    href={`/packages/${item.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-navy-900 hover:text-brand-gold-600 transition-colors"
                  >
                    <span>View Journey</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
