"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  PlaneTakeoff,
  Calendar,
  Users,
  Wallet,
  Clock,
  Compass,
  Search,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HOLIDAY_CATEGORIES } from "@/services/package-service";

export interface HolidaySearchBoxProps {
  destinations?: { id: string; name: string; slug: string; countryName: string }[];
  departureCities?: string[];
  initialValues?: {
    destination?: string;
    city?: string;
    date?: string;
    returnDate?: string;
    adults?: string;
    children?: string;
    budget?: string;
    duration?: string;
    travelStyle?: string;
  };
  variant?: "hero" | "compact" | "horizontal";
  className?: string;
}

export function HolidaySearchBox({
  destinations = [
    { id: "1", name: "Dubai", slug: "dubai", countryName: "United Arab Emirates" },
    { id: "2", name: "Switzerland", slug: "switzerland", countryName: "Switzerland" },
    { id: "3", name: "Singapore", slug: "singapore", countryName: "Singapore" },
    { id: "4", name: "Kerala", slug: "kerala", countryName: "India" },
    { id: "5", name: "Thailand", slug: "thailand", countryName: "Thailand" },
  ],
  departureCities = ["Mumbai", "Delhi", "Bengaluru", "Chennai", "Kolkata", "Hyderabad", "Cochin"],
  initialValues = {},
  variant = "hero",
  className = "",
}: HolidaySearchBoxProps) {
  const router = useRouter();

  const [destination, setDestination] = React.useState(initialValues.destination || "");
  const [city, setCity] = React.useState(initialValues.city || "");
  const [date, setDate] = React.useState(initialValues.date || "");
  const [returnDate, setReturnDate] = React.useState(initialValues.returnDate || "");
  const [adults, setAdults] = React.useState(initialValues.adults || "2");
  const [children, setChildren] = React.useState(initialValues.children || "0");
  const [budget, setBudget] = React.useState(initialValues.budget || "");
  const [duration, setDuration] = React.useState(initialValues.duration || "");
  const [travelStyle, setTravelStyle] = React.useState(initialValues.travelStyle || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (destination && destination !== "all") params.set("destination", destination);
    if (city && city !== "all") params.set("city", city);
    if (date) params.set("date", date);
    if (returnDate) params.set("returnDate", returnDate);
    if (adults && adults !== "2") params.set("adults", adults);
    if (children && children !== "0") params.set("children", children);
    if (budget && budget !== "all") params.set("budget", budget);
    if (duration && duration !== "all") params.set("duration", duration);
    if (travelStyle && travelStyle !== "all") params.set("category", travelStyle);

    router.push(`/holidays?${params.toString()}`);
  };

  const paddingClass = variant === "compact" ? "p-4" : "p-5 sm:p-6";

  return (
    <div
      className={`rounded-2xl border border-white/20 bg-white/95 ${paddingClass} shadow-2xl backdrop-blur-xl transition-all ${className}`}
    >
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-gold-600">
          <Sparkles className="h-4 w-4 text-brand-gold-500" />
          <span>Advanced Holiday Tour Search</span>
        </div>
        <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">
          Real Inventory Guaranteed
        </span>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        {/* Row 1: Destination & Departure City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Destination */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <MapPin className="h-3 w-3 text-brand-gold-500" />
              <span>Destination</span>
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-brand-navy-900 focus:border-brand-gold-500 focus:outline-none"
            >
              <option value="">Where would you like to go?</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.slug}>
                  {d.name} ({d.countryName})
                </option>
              ))}
            </select>
          </div>

          {/* Departure City */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <PlaneTakeoff className="h-3 w-3 text-brand-teal-600" />
              <span>Departure City</span>
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-brand-navy-900 focus:border-brand-gold-500 focus:outline-none"
            >
              <option value="">Any Departure City</option>
              {departureCities.map((c) => (
                <option key={c} value={c}>
                  Ex-{c}
                </option>
              ))}
            </select>
          </div>

          {/* Travel Date */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Calendar className="h-3 w-3 text-brand-gold-500" />
              <span>Travel Date</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-brand-navy-900 focus:border-brand-gold-500 focus:outline-none"
            />
          </div>

          {/* Return Date */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Calendar className="h-3 w-3 text-brand-gold-500" />
              <span>Return Date</span>
            </label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-brand-navy-900 focus:border-brand-gold-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Row 2: Guests, Budget, Duration, Travel Style */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-1">
          {/* Adults */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Users className="h-3 w-3 text-brand-navy-800" />
              <span>Adults (12y+)</span>
            </label>
            <select
              value={adults}
              onChange={(e) => setAdults(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-brand-navy-900 focus:border-brand-gold-500 focus:outline-none"
            >
              <option value="1">1 Adult</option>
              <option value="2">2 Adults</option>
              <option value="3">3 Adults</option>
              <option value="4">4 Adults</option>
              <option value="5">5+ Adults (Group)</option>
            </select>
          </div>

          {/* Children */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Users className="h-3 w-3 text-brand-navy-800" />
              <span>Children (0-11y)</span>
            </label>
            <select
              value={children}
              onChange={(e) => setChildren(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-brand-navy-900 focus:border-brand-gold-500 focus:outline-none"
            >
              <option value="0">0 Children</option>
              <option value="1">1 Child</option>
              <option value="2">2 Children</option>
              <option value="3">3+ Children</option>
            </select>
          </div>

          {/* Budget */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Wallet className="h-3 w-3 text-brand-emerald-600" />
              <span>Budget / Person</span>
            </label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-brand-navy-900 focus:border-brand-gold-500 focus:outline-none"
            >
              <option value="">Any Budget</option>
              <option value="35000">Up to ₹35,000</option>
              <option value="60000">Up to ₹60,000</option>
              <option value="100000">Up to ₹1,00,000</option>
              <option value="150000">Up to ₹1,50,000</option>
            </select>
          </div>

          {/* Duration */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Clock className="h-3 w-3 text-brand-gold-600" />
              <span>Duration</span>
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-brand-navy-900 focus:border-brand-gold-500 focus:outline-none"
            >
              <option value="">Any Duration</option>
              <option value="weekend">1 – 3 Days (Weekend)</option>
              <option value="medium">4 – 6 Days</option>
              <option value="extended">7+ Days</option>
            </select>
          </div>

          {/* Travel Style */}
          <div className="space-y-1 col-span-2 sm:col-span-4 lg:col-span-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Compass className="h-3 w-3 text-brand-gold-500" />
              <span>Travel Style</span>
            </label>
            <select
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-brand-navy-900 focus:border-brand-gold-500 focus:outline-none"
            >
              <option value="">All Travel Styles</option>
              {HOLIDAY_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-2 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 hidden md:block">
            Filter matches confirmed allotments, verified hotel partners, and real-time departure hubs.
          </div>

          <Button
            type="submit"
            variant="luxury"
            size="lg"
            className="w-full sm:w-auto px-8 h-12 text-sm font-bold shadow-luxury-md"
            leftIcon={<Search className="h-4 w-4" />}
          >
            Search Holidays
          </Button>
        </div>
      </form>
    </div>
  );
}
