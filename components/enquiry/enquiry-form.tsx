"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Compass,
  Send,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Banknote,
} from "lucide-react";

export interface EnquiryFormProps {
  initialDestination?: string;
  initialPackageId?: string;
  initialPackageName?: string;
  className?: string;
}

const POPULAR_DESTINATIONS = [
  "Switzerland & The Alps",
  "Dubai & UAE Desert",
  "Singapore City & Sentosa",
  "Kerala Backwaters & Munnar",
  "Thailand Beach & Bangkok",
  "Bali, Indonesia",
  "Europe Grand Tour",
  "Kashmir Valley Serenity",
];

const BUDGET_RANGES = [
  "Under ₹40,000 / person",
  "₹40,000 – ₹75,000 / person",
  "₹75,000 – ₹1,50,000 / person",
  "₹1,50,000 – ₹3,00,000 / person",
  "Luxury Bespoke (₹3,00,000+ / person)",
];

const TRAVEL_TYPES = [
  "Family Vacation",
  "Honeymoon & Couple",
  "Luxury Escapes",
  "Alpine Scenic Rail",
  "Beach & Island Retreat",
  "Solo Discovery",
  "Group / Friends Tour",
  "Corporate / MICE",
];

export function EnquiryForm({
  initialDestination = "",
  initialPackageId,
  initialPackageName,
  className,
}: EnquiryFormProps) {
  const router = useRouter();

  // Form states
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [destination, setDestination] = React.useState(initialDestination);
  const [travelDate, setTravelDate] = React.useState("");
  const [travelersCount, setTravelersCount] = React.useState(2);
  const [budgetRange, setBudgetRange] = React.useState(BUDGET_RANGES[1]);
  const [travelType, setTravelType] = React.useState(TRAVEL_TYPES[0]);
  const [message, setMessage] = React.useState(
    initialPackageName
      ? `I am interested in customizing the "${initialPackageName}" package. Please provide tailored flight and hotel options.`
      : ""
  );

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Auto-fill logged in user info if available
  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          if (!name && data.user.name) setName(data.user.name);
          if (!email && data.user.email) setEmail(data.user.email);
          if (!phone && data.user.phone) setPhone(data.user.phone);
        }
      })
      .catch(() => {});
  }, []);

  const todayString = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please provide your full name.");
      return;
    }
    if (!email.trim()) {
      setError("Please provide a valid email address.");
      return;
    }
    if (!phone.trim()) {
      setError("Please provide your contact phone number.");
      return;
    }
    if (!destination.trim()) {
      setError("Please select or enter your target travel destination.");
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      setError("Please provide at least 10 characters detailing your travel requirements.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          destination,
          travelDate: travelDate || null,
          travelersCount,
          budgetRange,
          travelType,
          message,
          packageId: initialPackageId || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit travel enquiry.");
      }

      // Redirect to dedicated success page
      router.push(`/enquiry/success?ref=${encodeURIComponent(data.referenceNo)}`);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`border border-slate-200/90 shadow-luxury-lg bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden ${className}`}>
      <div className="h-2 bg-gradient-to-r from-brand-gold-500 via-brand-navy-900 to-brand-gold-400" />

      <CardContent className="p-6 sm:p-10 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-gold-600 mb-1">
            <Sparkles className="h-4 w-4" />
            <span>Tailor-Made Holiday Consultation</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-brand-navy-950">
            Request a Custom Tour Quotation
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Share your itinerary ideas. Our certified travel specialists will craft a personalized day-by-day plan with transparent fares and verified hotel allotments.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800 flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: Name, Email, Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Full Name"
              required
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="h-4 w-4" />}
            />

            <Input
              label="Email Address"
              type="email"
              required
              placeholder="rahul@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="h-4 w-4" />}
            />

            <Input
              label="Contact Phone (with WhatsApp)"
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<Phone className="h-4 w-4" />}
            />
          </div>

          {/* Row 2: Destination and Quick Chips */}
          <div className="space-y-2">
            <Input
              label="Destination of Interest"
              required
              placeholder="e.g. Switzerland, Dubai, Singapore, Kashmir..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              leftIcon={<MapPin className="h-4 w-4 text-brand-gold-500" />}
            />

            {/* Quick popular destination chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 mr-1">Popular:</span>
              {POPULAR_DESTINATIONS.map((dest) => (
                <button
                  key={dest}
                  type="button"
                  onClick={() => setDestination(dest)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    destination === dest
                      ? "bg-brand-navy-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {dest}
                </button>
              ))}
            </div>
          </div>

          {/* Row 3: Travel Date & Number of Travellers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Estimated Travel Date"
              type="date"
              min={todayString}
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              leftIcon={<Calendar className="h-4 w-4" />}
              helperText="Flexible dates? Leave blank or mention in note"
            />

            <div className="w-full space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Number of Travellers
              </label>
              <div className="relative flex items-center">
                <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
                  <Users className="h-4 w-4" />
                </div>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={travelersCount}
                  onChange={(e) => setTravelersCount(parseInt(e.target.value, 10) || 1)}
                  className="flex h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-brand-navy-900 focus:ring-2 focus:ring-brand-gold-500/50"
                />
                <span className="absolute right-3 text-xs text-slate-500 font-medium">
                  Adults / Kids
                </span>
              </div>
            </div>
          </div>

          {/* Row 4: Budget Range & Travel Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="w-full space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Budget Range per Person
              </label>
              <div className="relative flex items-center">
                <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
                  <Banknote className="h-4 w-4" />
                </div>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-brand-navy-900 focus:ring-2 focus:ring-brand-gold-500/50"
                >
                  {BUDGET_RANGES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="w-full space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Travel Style / Holiday Type
              </label>
              <div className="relative flex items-center">
                <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
                  <Compass className="h-4 w-4" />
                </div>
                <select
                  value={travelType}
                  onChange={(e) => setTravelType(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-brand-navy-900 focus:ring-2 focus:ring-brand-gold-500/50"
                >
                  {TRAVEL_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Row 5: Detailed Message */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Specific Travel Preferences & Special Requests <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Tell us about departure airport (e.g. Ex-Mumbai, Ex-Delhi), preferred hotel rating (4-star / 5-star), dietary preferences (Vegetarian/Jain), sightseeing wishlist, or flight requirements."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 p-4 text-sm text-slate-900 shadow-xs focus:border-brand-navy-900 focus:ring-2 focus:ring-brand-gold-500/50 placeholder:text-slate-400"
            />
            <p className="text-[11px] text-slate-400">
              Minimum 10 characters. The more details you share, the more tailored your quotation will be.
            </p>
          </div>

          {/* Trust Guarantees */}
          <div className="rounded-2xl border border-brand-emerald-200/80 bg-brand-emerald-50/60 p-4 flex items-start gap-3 text-xs text-brand-emerald-950">
            <ShieldCheck className="h-5 w-5 text-brand-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>4-Hour Response Guarantee:</strong> Your enquiry is routed directly to a verified destination specialist. No automated bot replies, zero spam, and no fake pricing teasers.
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="luxury"
            disabled={isLoading}
            className="w-full h-12 text-sm font-bold shadow-luxury-md"
            rightIcon={<Send className="h-4 w-4" />}
          >
            {isLoading ? "Dispatching Your Travel Enquiry..." : "Submit Travel Enquiry for Free Quote"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
