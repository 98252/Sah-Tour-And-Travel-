"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Compass } from "lucide-react";

interface CategoryItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  image: string;
  tags: string[];
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "luxury",
    title: "Luxury Escapes",
    subtitle: "Where comfort, class, and exclusivity come together in 5-star palace hotels.",
    href: "/packages/luxury-escapes",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    tags: ["5★ Palace Stays", "Private Villa", "Butler Service"],
  },
  {
    id: "honeymoon",
    title: "Honeymoon & Romance",
    subtitle: "Celebrate love with dreamy getaways, overwater pool villas, and candlelit sunsets.",
    href: "/packages/honeymoon-packages",
    image:
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80",
    tags: ["Sunset Cruise", "Overwater Villa", "Couple Spa"],
  },
  {
    id: "cruise",
    title: "Cruise & Yachting",
    subtitle: "A floating holiday like no other with luxury ocean balconies and private catamarans.",
    href: "/packages/cruise-packages",
    image:
      "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=1200&q=80",
    tags: ["Ocean Liner", "Catamaran Cruise", "All-Inclusive"],
  },
  {
    id: "adventure",
    title: "Adventure & Alpine",
    subtitle: "Push limits and create unforgettable stories across glaciers, peaks, and dunes.",
    href: "/packages/adventure-packages",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    tags: ["Glacier Rail", "Desert Safari", "Mountain Trek"],
  },
  {
    id: "wildlife",
    title: "Wildlife & Safaris",
    subtitle: "Thrilling game drives and untamed natural wonders in guided jungle reserves.",
    href: "/packages/wildlife-packages",
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
    tags: ["Jungle Lodges", "Game Drives", "Guided Safaris"],
  },
  {
    id: "beach",
    title: "Beach & Islands",
    subtitle: "Pristine coastlines, azure lagoons, coral atolls, and tropical island bliss.",
    href: "/packages/beach-escapes",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    tags: ["Private Island", "Reef Snorkeling", "Sunset Yacht"],
  },
];

interface ChooseYourJourneyProps {
  className?: string;
}

export function ChooseYourJourney({ className = "" }: ChooseYourJourneyProps) {
  const router = useRouter();
  const [activeId, setActiveId] = React.useState<string>("luxury");

  const handleCardClick = (href: string, id: string) => {
    setActiveId(id);
    router.push(href);
  };

  return (
    <section className={`py-18 sm:py-26 bg-[#fbfbf9] overflow-hidden w-full ${className}`}>
      <div className="section-container">
        {/* Section Header */}
        <div className="mb-14 sm:mb-20 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-brand-gold-600 text-xs font-bold tracking-widest uppercase mb-3">
            <Compass className="h-4 w-4" />
            <span>Travel Themes</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-slate-900 tracking-tight leading-tight">
            Choose Your Journey
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-light mt-3 leading-relaxed">
            Itineraries designed around the way you love to travel.
          </p>
        </div>

        {/* Desktop / Tablet: Smooth Horizontal Expanding Accordion - 30% increased length */}
        <div className="hidden md:flex gap-3 lg:gap-4 w-full h-[625px] lg:h-[700px] xl:h-[780px] 2xl:h-[830px] items-stretch">
          {CATEGORIES.map((cat) => {
            const isActive = activeId === cat.id;

            return (
              <div
                key={cat.id}
                onMouseEnter={() => setActiveId(cat.id)}
                onClick={() => handleCardClick(cat.href, cat.id)}
                role="link"
                tabIndex={0}
                aria-label={`Explore ${cat.title} packages`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCardClick(cat.href, cat.id);
                  }
                }}
                className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] select-none shadow-luxury-md group ${isActive
                  ? "flex-[3.5] lg:flex-[4] shadow-2xl ring-2 ring-brand-gold-400/40"
                  : "flex-[1] hover:flex-[1.2] opacity-90 hover:opacity-100"
                  }`}
              >
                {/* Background Image with 1.03x Scale Animation */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${isActive ? "scale-105" : "scale-100 filter brightness-90"
                      }`}
                  />

                  {/* Contrast Gradient */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-500 ${isActive
                      ? "bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-black/20"
                      : "bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-slate-950/20"
                      }`}
                  />
                </div>

                {/* EXPANDED CONTENT VIEW */}
                <div
                  className={`absolute inset-0 p-6 sm:p-8 flex flex-col justify-between z-10 transition-opacity duration-300 ${isActive ? "opacity-100 pointer-events-auto delay-100" : "opacity-0 pointer-events-none"
                    }`}
                >
                  {/* Top Bar: Pill Tags & Signature Arrow Button */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 max-w-[80%]">
                      {cat.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/20 text-[11px] font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={cat.href}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Explore ${cat.title} packages`}
                      className="h-11 w-11 rounded-full bg-[#FFD13B] hover:bg-[#ffc814] flex items-center justify-center text-slate-950 font-bold shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95 shrink-0"
                    >
                      <ArrowUpRight className="h-5 w-5 stroke-[2.5]" />
                    </Link>
                  </div>

                  {/* Bottom Text Details */}
                  <div className="space-y-2">
                    <h3 className="font-serif text-3xl lg:text-4xl font-normal text-white tracking-tight">
                      {cat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-200 font-light max-w-lg leading-relaxed line-clamp-2">
                      {cat.subtitle}
                    </p>
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFD13B] group-hover:text-white uppercase tracking-wider transition-colors">
                        <span>Explore Journeys</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* COLLAPSED CONTENT VIEW */}
                <div
                  className={`absolute inset-0 flex flex-col justify-end p-5 z-10 transition-opacity duration-300 ${!isActive ? "opacity-100 pointer-events-none" : "opacity-0 pointer-events-none"
                    }`}
                >
                  <div className="flex flex-col items-center justify-end h-full pb-4">
                    <span
                      style={{
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                      }}
                      className="font-serif text-lg lg:text-xl font-normal text-white tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] select-none whitespace-nowrap"
                    >
                      {cat.title}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile View (< md) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCardClick(cat.href, cat.id)}
              role="link"
              tabIndex={0}
              aria-label={`Explore ${cat.title} packages`}
              className="relative h-56 rounded-2xl overflow-hidden shadow-luxury-md cursor-pointer group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-black/20" />

              <div className="absolute inset-0 p-5 flex flex-col justify-between z-10 text-white">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-md border border-white/20 text-[10px] font-semibold">
                    {cat.tags[0]}
                  </span>
                  <div className="h-8 w-8 rounded-full bg-[#FFD13B] flex items-center justify-center text-slate-950 shadow-md">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-normal text-white">{cat.title}</h3>
                  <p className="text-xs text-slate-300 line-clamp-1 mt-0.5 font-light">
                    {cat.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Export both names for backwards compatibility
export { ChooseYourJourney as ThemesInspireTravel };
