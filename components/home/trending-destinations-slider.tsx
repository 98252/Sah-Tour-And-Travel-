"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DestinationCard {
  id: string;
  name: string;
  country: string;
  region: "international" | "india";
  href: string;
  image: string;
  renderTitle: () => React.ReactNode;
  hasDarkTopOverlay?: boolean;
}

const DESTINATIONS: DestinationCard[] = [
  // INTERNATIONAL DESTINATIONS (Matches user screenshot 1:1)
  {
    id: "europe",
    name: "Europe",
    country: "Italy",
    region: "international",
    href: "/destinations/europe/switzerland",
    image: "https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=700&q=80", // Pisa Leaning Tower with clear blue sky
    hasDarkTopOverlay: false,
    renderTitle: () => (
      <span
        style={{ fontFamily: "'Oswald', sans-serif" }}
        className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-[0.14em] text-[#1E40AF] uppercase select-none drop-shadow-xs"
      >
        EUROPE
      </span>
    ),
  },
  {
    id: "australia",
    name: "Australia",
    country: "Australia",
    region: "international",
    href: "/destinations",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=700&q=80", // Sydney Opera House
    hasDarkTopOverlay: true,
    renderTitle: () => (
      <span
        style={{ fontFamily: "'Dancing Script', cursive" }}
        className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)] tracking-wide select-none"
      >
        Australia
      </span>
    ),
  },
  {
    id: "japan",
    name: "Japan",
    country: "Japan",
    region: "international",
    href: "/destinations/japan/japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=700&q=80", // Pagoda & Cherry Blossoms
    hasDarkTopOverlay: false,
    renderTitle: () => (
      <span
        style={{ fontFamily: "'Oswald', sans-serif" }}
        className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-[0.18em] text-[#DC2626] uppercase drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)] select-none"
      >
        JAPAN
      </span>
    ),
  },
  {
    id: "vietnam",
    name: "Vietnam",
    country: "Vietnam",
    region: "international",
    href: "/destinations/vietnam/vietnam",
    image: "https://images.unsplash.com/photo-1574950578143-858c6fc58922?auto=format&fit=crop&w=700&q=80", // Saigon Bitexco tower skyline at dusk
    hasDarkTopOverlay: true,
    renderTitle: () => (
      <span
        style={{ fontFamily: "'Cinzel', Georgia, serif" }}
        className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] tracking-wider uppercase select-none"
      >
        VIETNAM
      </span>
    ),
  },
  {
    id: "new-zealand",
    name: "New Zealand",
    country: "New Zealand",
    region: "international",
    href: "/destinations",
    image: "https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=700&q=80", // Waterfront city reflections at dusk
    hasDarkTopOverlay: true,
    renderTitle: () => (
      <div
        style={{ fontFamily: "'Cinzel', Georgia, serif" }}
        className="flex flex-col items-center leading-tight font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] tracking-widest select-none"
      >
        <span className="text-lg sm:text-xl lg:text-2xl">NEW</span>
        <span className="text-lg sm:text-xl lg:text-2xl">ZEALAND</span>
      </div>
    ),
  },
  {
    id: "antarctica",
    name: "Antarctica",
    country: "Antarctica",
    region: "international",
    href: "/destinations",
    image: "https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=700&q=80", // Penguins on ice
    hasDarkTopOverlay: true,
    renderTitle: () => (
      <span
        style={{ fontFamily: "'Oswald', sans-serif" }}
        className="text-xl sm:text-2xl lg:text-3xl font-black tracking-[0.16em] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] uppercase select-none"
      >
        ANTARCTICA
      </span>
    ),
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "UAE",
    region: "international",
    href: "/destinations/uae/dubai",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=700&q=80", // Dubai Burj Khalifa
    hasDarkTopOverlay: true,
    renderTitle: () => (
      <span
        style={{ fontFamily: "'Oswald', sans-serif" }}
        className="text-2xl sm:text-3xl lg:text-[36px] font-bold tracking-[0.14em] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] uppercase select-none"
      >
        DUBAI
      </span>
    ),
  },
  {
    id: "switzerland",
    name: "Switzerland",
    country: "Switzerland",
    region: "international",
    href: "/destinations/europe/switzerland",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=700&q=80", // Swiss alpine chalets & mountains
    hasDarkTopOverlay: true,
    renderTitle: () => (
      <span
        style={{ fontFamily: "'Cinzel', Georgia, serif" }}
        className="text-lg sm:text-xl lg:text-2xl font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] tracking-wider uppercase select-none"
      >
        SWITZERLAND
      </span>
    ),
  },
  {
    id: "singapore",
    name: "Singapore",
    country: "Singapore",
    region: "international",
    href: "/destinations/singapore/singapore",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=700&q=80", // Singapore Marina Bay Sands
    hasDarkTopOverlay: true,
    renderTitle: () => (
      <span
        style={{ fontFamily: "'Oswald', sans-serif" }}
        className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-[0.14em] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] uppercase select-none"
      >
        SINGAPORE
      </span>
    ),
  },
  {
    id: "maldives",
    name: "Maldives",
    country: "Maldives",
    region: "international",
    href: "/destinations/maldives/maldives",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=700&q=80", // Maldives overwater bungalow
    hasDarkTopOverlay: true,
    renderTitle: () => (
      <span
        style={{ fontFamily: "'Dancing Script', cursive" }}
        className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)] tracking-wide select-none"
      >
        Maldives
      </span>
    ),
  },

  // INDIA & AROUND DESTINATIONS
  {
    id: "kashmir",
    name: "Kashmir",
    country: "India",
    region: "india",
    href: "/destinations/india/kashmir",
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=700&q=80", // Dal lake shikara
    hasDarkTopOverlay: true,
    renderTitle: () => (
      <span
        style={{ fontFamily: "'Cinzel', Georgia, serif" }}
        className="text-xl sm:text-2xl font-bold text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.7)] tracking-widest uppercase select-none"
      >
        KASHMIR
      </span>
    ),
  },
  {
    id: "kerala",
    name: "Kerala",
    country: "India",
    region: "india",
    href: "/destinations/india/kerala",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=700&q=80", // Kerala Houseboat
    hasDarkTopOverlay: true,
    renderTitle: () => (
      <span
        style={{ fontFamily: "'Dancing Script', cursive" }}
        className="text-3xl sm:text-4xl font-bold text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.65)] tracking-wide select-none"
      >
        Kerala
      </span>
    ),
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    country: "India",
    region: "india",
    href: "/destinations/india/rajasthan",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=700&q=80", // Hawa Mahal Jaipur
    hasDarkTopOverlay: true,
    renderTitle: () => (
      <span
        style={{ fontFamily: "'Cinzel', Georgia, serif" }}
        className="text-lg sm:text-xl font-bold text-amber-100 drop-shadow-[0_2px_5px_rgba(0,0,0,0.75)] tracking-widest uppercase select-none"
      >
        RAJASTHAN
      </span>
    ),
  },
  {
    id: "goa",
    name: "Goa",
    country: "India",
    region: "india",
    href: "/destinations/india/goa",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=700&q=80", // Goa beach & palms
    hasDarkTopOverlay: true,
    renderTitle: () => (
      <span
        style={{ fontFamily: "'Dancing Script', cursive" }}
        className="text-3xl sm:text-4xl font-bold text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.65)] tracking-wide select-none"
      >
        Goa
      </span>
    ),
  },
  {
    id: "himachal",
    name: "Himachal",
    country: "India",
    region: "india",
    href: "/destinations/india/himachal",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=700&q=80", // Manali Snow Himalayas
    hasDarkTopOverlay: true,
    renderTitle: () => (
      <span
        style={{ fontFamily: "'Oswald', sans-serif" }}
        className="text-xl sm:text-2xl font-bold tracking-[0.14em] text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.7)] uppercase select-none"
      >
        HIMACHAL
      </span>
    ),
  },
  {
    id: "ladakh",
    name: "Ladakh",
    country: "India",
    region: "india",
    href: "/holidays/domestic",
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=700&q=80", // Pangong Lake Ladakh
    hasDarkTopOverlay: true,
    renderTitle: () => (
      <span
        style={{ fontFamily: "'Oswald', sans-serif" }}
        className="text-xl sm:text-2xl font-black tracking-[0.18em] text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.7)] uppercase select-none"
      >
        LADAKH
      </span>
    ),
  },
  {
    id: "andaman",
    name: "Andaman",
    country: "India",
    region: "india",
    href: "/destinations/india/andaman",
    image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=700&q=80", // Andaman Havelock beach
    hasDarkTopOverlay: true,
    renderTitle: () => (
      <span
        style={{ fontFamily: "'Dancing Script', cursive" }}
        className="text-3xl sm:text-4xl font-bold text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.65)] tracking-wide select-none"
      >
        Andaman
      </span>
    ),
  },
  {
    id: "varanasi",
    name: "Varanasi",
    country: "India",
    region: "india",
    href: "/holidays/domestic",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=700&q=80", // Varanasi Ghats
    hasDarkTopOverlay: true,
    renderTitle: () => (
      <span
        style={{ fontFamily: "'Cinzel', Georgia, serif" }}
        className="text-lg sm:text-xl font-bold text-amber-200 drop-shadow-[0_2px_5px_rgba(0,0,0,0.75)] tracking-widest uppercase select-none"
      >
        VARANASI
      </span>
    ),
  },
];

export function TrendingDestinationsSlider() {
  const [activeTab, setActiveTab] = React.useState<"international" | "india">("international");
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const filteredDestinations = React.useMemo(() => {
    return DESTINATIONS.filter((d) => d.region === activeTab);
  }, [activeTab]);

  const updateScrollButtons = React.useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);
  }, []);

  React.useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    // Reset scroll when tab changes
    el.scrollTo({ left: 0, behavior: "smooth" });
    // Trigger scroll check on next animation frame
    requestAnimationFrame(updateScrollButtons);

    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [activeTab, updateScrollButtons]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 880;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="section py-14 sm:py-20 bg-white overflow-hidden trending w-full">
      <div className="section-container">
        {/* Header matching user reference */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-slate-900 tracking-tight">
              Trending Holidays Destinations
            </h2>
          </div>

          {/* Region Tabs (International vs India & Around) */}
          <div className="inline-flex items-center bg-[#F3F4F6] p-1.5 rounded-full border border-slate-200/80 shadow-xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("international")}
              className={`px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 cursor-pointer ${activeTab === "international"
                ? "bg-[#0B4B8E] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
                }`}
            >
              International
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("india")}
              className={`px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 cursor-pointer ${activeTab === "india"
                ? "bg-[#0B4B8E] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
                }`}
            >
              India & Around
            </button>
          </div>
        </div>

        {/* Capsule / Arch Carousel Slider Container */}
        <div className="relative w-full group/slider">
          {/* Circular Left Arrow (<) */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => handleScroll("left")}
              aria-label="Scroll left"
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/95 text-slate-700 hover:text-slate-900 shadow-2xl border border-slate-200/80 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-xs"
            >
              <ChevronLeft className="w-7 h-7 stroke-[2.5]" />
            </button>
          )}

          {/* Carousel Track with all 10 cards in place, increased 30% more breadth and length */}
          <div
            ref={scrollContainerRef}
            className="flex items-center justify-start 2xl:justify-between gap-5 sm:gap-6 lg:gap-7 xl:gap-8 overflow-x-auto scroll-smooth py-8 px-2 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {filteredDestinations.map((dest) => (
              <Link
                key={dest.id}
                href={dest.href}
                className="group relative flex-shrink-0 w-[310px] sm:w-[345px] md:w-[380px] lg:w-[410px] xl:w-[440px] 2xl:w-[480px] h-[715px] sm:h-[790px] md:h-[870px] lg:h-[950px] xl:h-[1030px] 2xl:h-[1100px] rounded-[999px] overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.14)] hover:shadow-[0_28px_64px_rgba(0,0,0,0.24)] transition-all duration-500 hover:-translate-y-3.5 select-none bg-slate-100 block"
              >
                {/* Background Image filling the capsule arch */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-106"
                  loading="lazy"
                />

                {/* Subtle top vignette gradient for white text contrast */}
                {dest.hasDarkTopOverlay && (
                  <div className="absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-black/45 via-black/15 to-transparent pointer-events-none" />
                )}

                {/* Japan Special Cherry Blossom Branch Overlay (Matches Screenshot) */}
                {dest.id === "japan" && (
                  <div className="absolute top-0 left-0 w-36 h-48 pointer-events-none z-10 overflow-hidden">
                    <svg viewBox="0 0 100 130" className="w-full h-full" fill="none">
                      <path
                        d="M-5 10 Q25 30 40 65 Q45 80 50 110"
                        stroke="#8B4513"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        opacity="0.85"
                      />
                      <path
                        d="M20 25 Q35 15 55 20"
                        stroke="#8B4513"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        opacity="0.85"
                      />
                      <path
                        d="M32 45 Q50 40 68 52"
                        stroke="#8B4513"
                        strokeWidth="2"
                        strokeLinecap="round"
                        opacity="0.8"
                      />
                      <circle cx="55" cy="20" r="7" fill="#F472B6" opacity="0.95" />
                      <circle cx="55" cy="20" r="3" fill="#FCE7F3" />
                      <circle cx="55" cy="20" r="1.5" fill="#DC2626" />
                      <circle cx="28" cy="18" r="8" fill="#F472B6" opacity="0.9" />
                      <circle cx="28" cy="18" r="3.5" fill="#FCE7F3" />
                      <circle cx="42" cy="40" r="9" fill="#F472B6" opacity="0.95" />
                      <circle cx="42" cy="40" r="4" fill="#FCE7F3" />
                      <circle cx="42" cy="40" r="2" fill="#DC2626" />
                      <circle cx="68" cy="52" r="7.5" fill="#F472B6" opacity="0.9" />
                      <circle cx="68" cy="52" r="3" fill="#FBCFE8" />
                      <circle cx="46" cy="85" r="7" fill="#F472B6" opacity="0.85" />
                      <ellipse
                        cx="62"
                        cy="70"
                        rx="3.5"
                        ry="2"
                        transform="rotate(30 62 70)"
                        fill="#FBCFE8"
                        opacity="0.9"
                      />
                      <ellipse
                        cx="25"
                        cy="65"
                        rx="3"
                        ry="1.8"
                        transform="rotate(-20 25 65)"
                        fill="#FBCFE8"
                        opacity="0.8"
                      />
                    </svg>
                  </div>
                )}

                {/* Stylized Destination Typography at the top */}
                <div className="relative z-10 pt-12 sm:pt-14 lg:pt-16 px-4 sm:px-6 flex flex-col items-center justify-start text-center">
                  {dest.renderTitle()}
                </div>
              </Link>
            ))}

            {/* Circular Right Blue Arrow (>) matching user screenshot */}
            <button
              type="button"
              onClick={() => handleScroll("right")}
              aria-label="Scroll right"
              className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0B4B8E] hover:bg-[#083a6f] text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer ml-3 sm:ml-4"
            >
              <ChevronRight className="w-8 h-8 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

