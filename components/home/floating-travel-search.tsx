"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar, Users, ChevronDown, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DestinationItem {
  id: string;
  name: string;
  slug: string;
  countryName?: string;
}

interface FloatingTravelSearchProps {
  destinations?: DestinationItem[];
  className?: string;
}

const DEFAULT_DESTINATIONS: DestinationItem[] = [
  { id: "1", name: "Switzerland", slug: "switzerland", countryName: "Switzerland" },
  { id: "2", name: "Dubai", slug: "dubai", countryName: "United Arab Emirates" },
  { id: "3", name: "Maldives", slug: "maldives", countryName: "Maldives" },
  { id: "4", name: "Singapore", slug: "singapore", countryName: "Singapore" },
  { id: "5", name: "Bali", slug: "bali", countryName: "Indonesia" },
  { id: "6", name: "Kerala", slug: "kerala", countryName: "India" },
  { id: "7", name: "Kashmir", slug: "kashmir", countryName: "India" },
  { id: "8", name: "Thailand", slug: "thailand", countryName: "Thailand" },
];

const MONTHS = [
  "Anytime",
  "April 2026",
  "May 2026",
  "June 2026",
  "July 2026",
  "August 2026",
  "September 2026",
  "October 2026",
  "November 2026",
  "December 2026",
];

const GUEST_OPTIONS = [
  "1 Solo Traveler",
  "2 Travelers (1 Room)",
  "Family (3-4 Travelers)",
  "Group (5+ Travelers)",
];

export function FloatingTravelSearch({
  destinations = DEFAULT_DESTINATIONS,
  className = "",
}: FloatingTravelSearchProps) {
  const router = useRouter();

  const [query, setQuery] = React.useState("");
  const [selectedDestination, setSelectedDestination] = React.useState<string>("");
  const [selectedDate, setSelectedDate] = React.useState<string>("Anytime");
  const [selectedGuests, setSelectedGuests] = React.useState<string>("2 Travelers (1 Room)");

  // Active popup controls
  const [isDestOpen, setIsDestOpen] = React.useState(false);
  const [isDateOpen, setIsDateOpen] = React.useState(false);
  const [isGuestsOpen, setIsGuestsOpen] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDestOpen(false);
        setIsDateOpen(false);
        setIsGuestsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedDestination) {
      params.set("destination", selectedDestination);
    } else if (query.trim()) {
      params.set("q", query.trim());
    }
    router.push(`/packages?${params.toString()}`);
  };

  const filteredDestinations = destinations.filter((d) =>
    d.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      ref={containerRef}
      className={`relative z-20 w-full -mt-10 sm:-mt-14 px-4 sm:px-6 max-w-5xl mx-auto ${className}`}
    >
      <form
        onSubmit={handleSearch}
        className="rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_20px_50px_rgba(8,15,30,0.15)] p-2.5 sm:p-4 text-slate-800"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 items-center">
          {/* 1. Destination Field */}
          <div className="relative md:col-span-5">
            <div
              onClick={() => {
                setIsDestOpen(true);
                setIsDateOpen(false);
                setIsGuestsOpen(false);
              }}
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 border border-slate-100/80 transition-colors cursor-pointer"
            >
              <div className="h-10 w-10 rounded-xl bg-brand-gold-50 text-brand-gold-600 flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Where to?
                </span>
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  value={selectedDestination ? selectedDestination : query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedDestination("");
                    setIsDestOpen(true);
                  }}
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Destination Dropdown */}
            {isDestOpen && (
              <div className="absolute left-0 top-full mt-2 w-full sm:w-80 rounded-2xl bg-white border border-slate-200/90 shadow-2xl p-2 z-50 animate-in fade-in duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center gap-1.5">
                  <Compass className="h-3 w-3 text-brand-gold-500" />
                  <span>Popular Destinations</span>
                </div>
                <div className="max-h-56 overflow-y-auto py-1">
                  {filteredDestinations.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        setSelectedDestination(d.name);
                        setQuery("");
                        setIsDestOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-brand-gold-50 hover:text-brand-navy-950 flex items-center justify-between transition-colors"
                    >
                      <span>{d.name}</span>
                      {d.countryName && (
                        <span className="text-[10px] text-slate-400 font-normal">
                          {d.countryName}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Travel Dates Field */}
          <div className="relative md:col-span-3">
            <div
              onClick={() => {
                setIsDateOpen(!isDateOpen);
                setIsDestOpen(false);
                setIsGuestsOpen(false);
              }}
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 border border-slate-100/80 transition-colors cursor-pointer"
            >
              <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Travel Dates
                </span>
                <span className="block text-sm font-semibold text-slate-800 truncate">
                  {selectedDate}
                </span>
              </div>
            </div>

            {/* Date Dropdown */}
            {isDateOpen && (
              <div className="absolute left-0 top-full mt-2 w-56 rounded-2xl bg-white border border-slate-200/90 shadow-2xl p-2 z-50 animate-in fade-in duration-150">
                <div className="max-h-56 overflow-y-auto py-1">
                  {MONTHS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setSelectedDate(m);
                        setIsDateOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-brand-gold-50 hover:text-brand-navy-950 transition-colors"
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. Travellers Field */}
          <div className="relative md:col-span-2">
            <div
              onClick={() => {
                setIsGuestsOpen(!isGuestsOpen);
                setIsDestOpen(false);
                setIsDateOpen(false);
              }}
              className="flex items-center gap-2 p-3 rounded-2xl hover:bg-slate-50 border border-slate-100/80 transition-colors cursor-pointer"
            >
              <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Travellers
                </span>
                <span className="block text-xs font-semibold text-slate-800 truncate">
                  {selectedGuests.split(" ")[0]} {selectedGuests.split(" ")[1]}
                </span>
              </div>
            </div>

            {/* Guests Dropdown */}
            {isGuestsOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl bg-white border border-slate-200/90 shadow-2xl p-2 z-50 animate-in fade-in duration-150">
                <div className="py-1">
                  {GUEST_OPTIONS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        setSelectedGuests(g);
                        setIsGuestsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-brand-gold-50 hover:text-brand-navy-950 transition-colors"
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4. Search CTA Button */}
          <div className="md:col-span-2">
            <Button
              type="submit"
              variant="luxury"
              className="w-full h-13 rounded-2xl text-sm font-bold shadow-luxury-md flex items-center justify-center gap-2"
            >
              <Search className="h-4 w-4 stroke-[2.5]" />
              <span>Search</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
