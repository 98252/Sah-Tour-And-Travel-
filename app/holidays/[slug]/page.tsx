import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { getPackageBySlug } from "@/services/package-service";
import { formatCurrency, formatDate } from "@/lib/utils";
import { WishlistButton } from "@/components/holiday/wishlist-button";
import { PackageReviews } from "@/components/reviews/package-reviews";
import {
  CheckCircle2,
  XCircle,
  Building2,
  Utensils,
  PlaneTakeoff,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  FileText,
  Check,
  Clock,
} from "lucide-react";

interface PackageDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PackageDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);

  if (!pkg) {
    return {
      title: "Package Not Found | Sah Tour And Travel",
    };
  }

  return {
    title: `${pkg.name} (${pkg.durationText}) | Sah Tour And Travel`,
    description: `${pkg.shortDescription} Starting from ${formatCurrency(pkg.startingPrice, pkg.currency)} per person. Verified inventory ref: ${pkg.source.licenseRef}.`,
  };
}

export default async function PackageDetailPage({
  params,
}: PackageDetailPageProps) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);

  if (!pkg) {
    notFound();
  }

  const heroImage =
    pkg.images.find((img) => img.isHero) ||
    pkg.images[0] || {
      url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
      caption: pkg.name,
      source: "Unsplash",
      license: "Commercial License",
    };

  const isStartingPrice = pkg.priceType === "STARTING_FROM";

  // Schema.org Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: pkg.name,
    description: pkg.shortDescription,
    touristType: pkg.travelStyle,
    offers: {
      "@type": "Offer",
      price: pkg.startingPrice,
      priceCurrency: pkg.currency,
      availability: "https://schema.org/InStock",
      priceValidUntil: "2027-12-31",
    },
    itinerary: pkg.itinerary.map((day) => ({
      "@type": "Day",
      name: `Day ${day.dayNumber}: ${day.title}`,
      description: day.description,
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[420px] sm:h-[480px] w-full overflow-hidden bg-brand-navy-950 text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage.url}
            alt={pkg.name}
            className="h-full w-full object-cover opacity-60"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950 via-brand-navy-950/40 to-transparent" />

          {/* Top Breadcrumb */}
          <div className="absolute top-6 left-0 right-0 z-10">
            <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
              <Breadcrumb
                className="text-white/80"
                items={[
                  { label: "Holidays", href: "/holidays" },
                  { label: pkg.category, href: `/holidays?category=${encodeURIComponent(pkg.category)}` },
                  { label: pkg.name, isCurrent: true },
                ]}
              />

              <span className="hidden sm:inline-block text-[10px] text-white/60 bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
                License: {heroImage.license}
              </span>
            </div>
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-8 left-0 right-0 z-10">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="max-w-3xl space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="verified" showIcon className="bg-white/95 text-brand-emerald-800 shadow-sm">
                    {pkg.destination.name}, {pkg.destination.countryName}
                  </Badge>
                  <span className="rounded-full bg-brand-navy-900/90 px-3 py-0.5 text-xs font-semibold text-brand-gold-300 border border-brand-gold-500/30 backdrop-blur-sm">
                    {pkg.durationText}
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                    {pkg.travelStyle}
                  </span>
                </div>

                <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
                  {pkg.name}
                </h1>

                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans max-w-2xl drop-shadow">
                  {pkg.shortDescription}
                </p>

                {/* Quick Logistics Badges */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs text-white/90">
                  <div className="flex items-center gap-1.5">
                    <PlaneTakeoff className="h-4 w-4 text-brand-teal-400" />
                    <span>Departure Hub: <strong>{pkg.departureCity}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Utensils className="h-4 w-4 text-brand-gold-400" />
                    <span>Meal Plan: <strong>{pkg.mealPlan}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Verified Inventory Source Bar */}
        <section className="border-b border-brand-emerald-500/30 bg-brand-emerald-50/70 py-3 px-4 sm:px-6 text-xs">
          <div className="container mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-emerald-600 shrink-0" />
              <span className="text-brand-emerald-950 font-medium">
                <strong>Verified Inventory Source: </strong>
                {pkg.source.name} (License Ref: {pkg.source.licenseRef})
              </span>
            </div>
            <span className="text-brand-emerald-800 text-[11px]">
              Last Verified: {formatDate(pkg.lastVerifiedDate)}
            </span>
          </div>
        </section>

        {/* Main Content Layout */}
        <section className="container mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Itinerary, Hotels, Inclusions */}
            <div className="lg:col-span-8 space-y-10">
              {/* Highlights */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-luxury-sm space-y-3">
                <h3 className="font-heading text-lg font-bold text-brand-navy-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-brand-gold-500" />
                  <span>Verified Package Highlights</span>
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
                  {pkg.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-brand-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Day-by-Day Itinerary */}
              <div>
                <div className="mb-4">
                  <h3 className="font-heading text-2xl font-bold text-brand-navy-900">
                    Day-by-Day Itinerary
                  </h3>
                  <p className="text-xs text-slate-500">
                    Carefully planned daily activities with certified timings and transfer details.
                  </p>
                </div>

                <div className="space-y-4">
                  {pkg.itinerary.map((day) => (
                    <div
                      key={day.dayNumber}
                      className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="rounded-full bg-brand-navy-900 text-brand-gold-300 px-3 py-1 text-xs font-bold font-heading">
                          Day {day.dayNumber}
                        </span>
                        <span className="text-xs font-medium text-slate-500">
                          Meals: {day.mealsIncluded}
                        </span>
                      </div>

                      <h4 className="font-heading text-base font-bold text-brand-navy-900">
                        {day.title}
                      </h4>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {day.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-[11px] text-slate-500 border-t border-slate-100">
                        {day.stayDetails && (
                          <div className="flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5 text-brand-navy-800 shrink-0" />
                            <span>{day.stayDetails}</span>
                          </div>
                        )}
                        {day.transferDetails && (
                          <div className="flex items-center gap-1.5">
                            <PlaneTakeoff className="h-3.5 w-3.5 text-brand-teal-600 shrink-0" />
                            <span>{day.transferDetails}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Accommodations */}
              {pkg.hotels.length > 0 && (
                <div>
                  <div className="mb-4">
                    <h3 className="font-heading text-2xl font-bold text-brand-navy-900">
                      Verified Hotel Accommodations
                    </h3>
                    <p className="text-xs text-slate-500">
                      Properties contracted directly with official hotel registry licensing.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pkg.hotels.map((hotel) => (
                      <div
                        key={hotel.id}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-brand-gold-600">
                            {hotel.starRating}★ Property
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {hotel.nightsCount} Nights
                          </span>
                        </div>
                        <h4 className="font-heading text-base font-bold text-brand-navy-900">
                          {hotel.hotelName}
                        </h4>
                        <p className="text-xs text-slate-600">
                          Room: {hotel.roomType} in {hotel.cityName}
                        </p>
                        <div className="pt-2 text-[10px] text-brand-emerald-700 flex items-center gap-1 border-t border-slate-100">
                          <ShieldCheck className="h-3.5 w-3.5 text-brand-emerald-600 shrink-0" />
                          <span>License Ref: {hotel.officialLicenseRef}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inclusions and Exclusions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inclusions */}
                <div className="rounded-2xl border border-brand-emerald-500/30 bg-white p-5 shadow-xs space-y-3">
                  <h4 className="font-heading text-base font-bold text-brand-navy-900 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-brand-emerald-600" />
                    <span>Inclusions ({pkg.inclusions.length})</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {pkg.inclusions.map((inc) => (
                      <li key={inc.id} className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-brand-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>{inc.title}:</strong>{" "}
                          <span className="text-slate-600">{inc.description}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exclusions */}
                <div className="rounded-2xl border border-rose-200 bg-white p-5 shadow-xs space-y-3">
                  <h4 className="font-heading text-base font-bold text-brand-navy-900 flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-rose-500" />
                    <span>Exclusions ({pkg.exclusions.length})</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {pkg.exclusions.map((exc) => (
                      <li key={exc.id} className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold shrink-0">✕</span>
                        <div>
                          <strong>{exc.title}:</strong>{" "}
                          <span className="text-slate-600">{exc.description}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Policies & Terms */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 text-xs text-slate-600">
                <h4 className="font-heading text-base font-bold text-brand-navy-900 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brand-navy-800" />
                  <span>Cancellation Policy & Terms</span>
                </h4>
                <div className="space-y-2">
                  <p>
                    <strong>Cancellation Policy:</strong> {pkg.cancellationPolicy}
                  </p>
                  <p>
                    <strong>Terms & Conditions:</strong> {pkg.terms}
                  </p>
                </div>
              </div>

              {/* Package FAQs */}
              {pkg.faqs.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-heading text-lg font-bold text-brand-navy-900 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-brand-gold-500" />
                    <span>Package Questions</span>
                  </h4>
                  {pkg.faqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="rounded-xl border border-slate-200/90 bg-white p-4 text-xs space-y-1"
                    >
                      <p className="font-bold text-brand-navy-900">{faq.question}</p>
                      <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              )}
              {/* Verified Customer Reviews (Phase 12) */}
              <PackageReviews packageId={pkg.id} packageName={pkg.name} />
            </div>

            {/* Right Column: Sticky Commercial Pricing Box */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-4">
                <Card className="border-brand-gold-500/40 shadow-luxury-md bg-white">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {isStartingPrice ? "Starting from Price" : "Final Price"}
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="font-heading text-3xl font-extrabold text-brand-navy-900">
                        {formatCurrency(pkg.startingPrice, pkg.currency)}
                      </span>
                      <span className="text-xs text-slate-500">/ adult twin sharing</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Transparent commercial fare. Government GST & TCS calculated at checkout.
                    </p>
                  </CardHeader>

                  <CardContent className="p-5 space-y-4 text-xs text-slate-600">
                    <div className="space-y-2 rounded-xl bg-slate-50 p-3 border border-slate-100">
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <strong className="text-slate-900">{pkg.durationText}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Departure City:</span>
                        <strong className="text-slate-900">{pkg.departureCity}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Meal Plan:</span>
                        <strong className="text-slate-900">{pkg.mealPlan}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Travel Style:</span>
                        <strong className="text-brand-gold-600">{pkg.travelStyle}</strong>
                      </div>
                    </div>

                    <div className="space-y-2.5 pt-2">
                      {pkg.hasLiveAvailability ? (
                        <>
                          <Link href={`/book/${pkg.slug}`} className="block">
                            <Button variant="luxury" className="w-full h-11 text-xs font-bold shadow-luxury-sm">
                              Book Tour Now (Instant Allotment)
                            </Button>
                          </Link>

                          <Link
                            href={`/contact?destination=${encodeURIComponent(
                              pkg.destination.name
                            )}&packageId=${pkg.id}&packageName=${encodeURIComponent(pkg.name)}`}
                            className="block"
                          >
                            <Button variant="outline" className="w-full h-10 text-xs">
                              Request Custom Quotation
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <>
                          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 space-y-1">
                            <span className="font-bold flex items-center gap-1.5 text-amber-950">
                              <Clock className="h-3.5 w-3.5 text-amber-600" />
                              <span>Live Allotment Verification Required</span>
                            </span>
                            <p className="text-[11px] text-amber-800 leading-relaxed">
                              {pkg.inventoryNotice ||
                                "This seasonal departure requires operator confirmation prior to booking."}
                            </p>
                          </div>

                          <Link
                            href={`/contact?destination=${encodeURIComponent(
                              pkg.destination.name
                            )}&packageId=${pkg.id}&packageName=${encodeURIComponent(
                              pkg.name
                            )}&mode=availability_request`}
                            className="block"
                          >
                            <Button
                              variant="luxury"
                              className="w-full h-11 text-xs font-bold shadow-luxury-sm bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white"
                            >
                              Request Availability
                            </Button>
                          </Link>
                        </>
                      )}

                      <WishlistButton
                        packageId={pkg.id}
                        variant="button"
                        className="w-full h-10 text-xs"
                      />

                      <Link href={`/destinations/${pkg.destination.slug}/${pkg.destination.slug}`} className="block">
                        <Button variant="outline" className="w-full h-10 text-xs">
                          View Destination Guide
                        </Button>
                      </Link>
                    </div>

                    <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-brand-emerald-600" />
                      <span>Zero Hidden Charges & 100% Contracted Allotment</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
