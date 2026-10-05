import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DestinationCard } from "@/components/destination/destination-card";
import {
  getDestinationBySlug,
  getRelatedDestinations,
} from "@/services/destination-service";
import { formatDate } from "@/lib/utils";
import {
  MapPin,
  Calendar,
  Clock,
  Coins,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ChevronRight,
  Info,
} from "lucide-react";

interface DestinationDetailProps {
  params: Promise<{
    country: string;
    destination: string;
  }>;
}

export async function generateMetadata({
  params,
}: DestinationDetailProps): Promise<Metadata> {
  const { country, destination } = await params;
  const data = await getDestinationBySlug(country, destination);

  if (!data) {
    return {
      title: "Destination Not Found | Sah Tour And Travel",
    };
  }

  return {
    title: `${data.name}, ${data.country.name} - Travel Guide & Itineraries | Sah Tour And Travel`,
    description: `${data.shortDescription} Verified by ${data.primarySource?.sourceName || "official national tourism board"}.`,
    openGraph: {
      title: `${data.name}, ${data.country.name} - Official Travel Guide`,
      description: data.shortDescription,
      images: [{ url: data.heroImage }],
    },
  };
}

export default async function DestinationDetailPage({
  params,
}: DestinationDetailProps) {
  const { country, destination } = await params;
  const data = await getDestinationBySlug(country, destination);

  if (!data) {
    notFound();
  }

  const relatedDestinations = await getRelatedDestinations(
    data.slug,
    data.regionId,
    3
  );

  // Schema.org Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: `${data.name}, ${data.country.name}`,
    description: data.shortDescription,
    image: data.heroImage,
    touristType: data.travelStyle,
    address: {
      "@type": "PostalAddress",
      addressCountry: data.country.name,
      addressRegion: data.region.name,
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Schema.org JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="relative h-[480px] sm:h-[540px] w-full overflow-hidden bg-brand-navy-950 text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.heroImage}
            alt={`${data.name}, ${data.country.name} - Official Sah Tour And Travel Guide`}
            className="h-full w-full object-cover opacity-60"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950 via-brand-navy-950/40 to-transparent" />

          {/* Top Breadcrumb & Attribution in Hero */}
          <div className="absolute top-6 left-0 right-0 z-10">
            <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
              <Breadcrumb
                className="text-white/80"
                items={[
                  { label: "Destinations", href: "/destinations" },
                  { label: data.country.name, href: `/destinations?country=${data.country.slug}` },
                  { label: data.name, isCurrent: true },
                ]}
              />

              <span className="hidden sm:inline-block text-[10px] text-white/60 bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
                License: {data.heroImageLicense} ({data.heroImageSource})
              </span>
            </div>
          </div>

          {/* Hero Main Content */}
          <div className="absolute bottom-8 left-0 right-0 z-10">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="max-w-3xl space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="verified" showIcon className="bg-white/95 text-brand-emerald-800 shadow-sm">
                    {data.country.name}
                  </Badge>
                  <span className="rounded-full bg-brand-navy-900/90 px-3 py-0.5 text-xs font-semibold text-brand-gold-300 border border-brand-gold-500/30 backdrop-blur-sm">
                    {data.region.name}
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                    {data.travelStyle}
                  </span>
                </div>

                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-md">
                  {data.name}
                </h1>

                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans max-w-2xl drop-shadow">
                  {data.shortDescription}
                </p>

                {/* Quick Logistics Bar */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-3 text-xs text-white/90">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-brand-gold-400" />
                    <span>Best Time: <strong>{data.bestTimeToVisit.split("(")[0]}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-brand-teal-400" />
                    <span>Duration: <strong>{data.recommendedDuration}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Coins className="h-4 w-4 text-brand-gold-400" />
                    <span>Currency: <strong>{data.currency.split("(")[0]}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. OFFICIAL TOURISM SOURCE CITATION BANNER */}
        {data.primarySource && (
          <section className="border-b border-brand-emerald-500/30 bg-brand-emerald-50/70 py-3.5 px-4 sm:px-6">
            <div className="container mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 text-brand-emerald-600 shrink-0" />
                <span className="text-brand-emerald-950 font-medium">
                  <strong>Official Source Citation: </strong>
                  Factual data validated via {data.primarySource.sourceName}
                </span>
              </div>
              <div className="flex items-center gap-4 text-brand-emerald-800">
                <span className="text-[11px]">
                  Last Checked: {formatDate(data.primarySource.lastCheckedAt)}
                </span>
                <a
                  href={data.primarySource.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-brand-emerald-700 hover:text-brand-emerald-900 underline underline-offset-2"
                >
                  <span>Visit Authority Website</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </section>
        )}

        {/* 3. DESTINATION OVERVIEW & WHY VISIT */}
        <section className="container mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Column */}
            <div className="lg:col-span-8 space-y-12">
              {/* Destination Overview */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="luxury">Official Overview</Badge>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-brand-navy-900 mb-4">
                  About {data.name}
                </h2>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-sans whitespace-pre-line">
                  {data.longDescription}
                </p>
              </div>

              {/* Why Visit */}
              <div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-brand-navy-900 mb-4">
                  Why Visit {data.name}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.whyVisit.map((reason, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs"
                    >
                      <CheckCircle2 className="h-5 w-5 text-brand-gold-500 shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. TOP ATTRACTIONS */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-brand-navy-900">
                      Top Verified Attractions
                    </h3>
                    <p className="text-xs text-slate-500">
                      Directly certified from official attraction sites and municipal boards.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-brand-gold-600 bg-brand-gold-50 px-2.5 py-1 rounded-lg border border-brand-gold-200">
                    {data.attractions.length} Registered
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.attractions.map((attraction) => (
                    <Card key={attraction.id} className="flex flex-col overflow-hidden">
                      <div className="relative h-48 w-full bg-slate-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={attraction.imageUrl}
                          alt={`${attraction.name} - ${data.name}`}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <span className="rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-white backdrop-blur-sm">
                            {attraction.imageLicense}
                          </span>
                        </div>
                      </div>

                      <CardContent className="p-4 flex-1 space-y-3">
                        <div>
                          <h4 className="font-heading text-lg font-bold text-brand-navy-900">
                            {attraction.name}
                          </h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3 text-brand-gold-500" />
                            <span>{attraction.locationName}</span>
                          </p>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {attraction.description}
                        </p>

                        <div className="space-y-1 text-[11px] border-t border-slate-100 pt-2 text-slate-600">
                          <p>
                            <strong>Hours:</strong> {attraction.timings}
                          </p>
                          <p>
                            <strong>Entry:</strong> {attraction.entryFeePolicy}
                          </p>
                        </div>
                      </CardContent>

                      <div className="p-4 pt-0 mt-auto border-t border-slate-100">
                        <a
                          href={attraction.officialWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-gold-600 hover:text-brand-gold-700 hover:underline"
                        >
                          <span>Official Attraction Site</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* 5. THINGS TO DO */}
              <div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-brand-navy-900 mb-4">
                  Recommended Experiences & Things to Do
                </h3>
                <div className="space-y-4">
                  {data.thingsToDo.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-luxury-sm space-y-2"
                    >
                      <h4 className="font-heading text-base font-bold text-brand-navy-900 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-brand-gold-500 shrink-0" />
                        <span>{item.title}</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                      {item.officialTip && (
                        <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-2.5 text-xs text-slate-600 flex items-start gap-2">
                          <Info className="h-4 w-4 text-brand-teal-600 shrink-0 mt-0.5" />
                          <span>
                            <strong>Official Tip:</strong> {item.officialTip}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. BEST TIME TO VISIT */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-luxury-sm space-y-3">
                <div className="flex items-center gap-2 text-brand-gold-600">
                  <Calendar className="h-5 w-5" />
                  <h3 className="font-heading text-xl font-bold text-brand-navy-900">
                    Best Time to Visit
                  </h3>
                </div>
                <p className="text-sm font-semibold text-brand-navy-900">
                  {data.bestTimeToVisit}
                </p>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <p className="font-semibold text-slate-800">Travel Advice:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {data.travelTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 7. TRAVEL INFORMATION & VISA */}
              {data.travelInfo && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-luxury-sm space-y-6">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-brand-navy-900" />
                    <h3 className="font-heading text-xl font-bold text-brand-navy-900">
                      Essential Travel Information & Consular Advisory
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
                    <div className="space-y-1.5 rounded-xl bg-slate-50 p-4 border border-slate-200/60">
                      <h4 className="font-bold text-brand-navy-900 uppercase tracking-wider text-[11px]">
                        Visa & Entry Regulations
                      </h4>
                      <p className="leading-relaxed">{data.travelInfo.visaPolicy}</p>
                    </div>

                    <div className="space-y-1.5 rounded-xl bg-slate-50 p-4 border border-slate-200/60">
                      <h4 className="font-bold text-brand-navy-900 uppercase tracking-wider text-[11px]">
                        Customs & Prohibited Items
                      </h4>
                      <p className="leading-relaxed">{data.travelInfo.customsGuidelines}</p>
                    </div>

                    <div className="space-y-1.5 rounded-xl bg-slate-50 p-4 border border-slate-200/60">
                      <h4 className="font-bold text-brand-navy-900 uppercase tracking-wider text-[11px]">
                        Currency & Banking
                      </h4>
                      <p className="leading-relaxed">{data.travelInfo.currencyExchangeTips}</p>
                    </div>

                    <div className="space-y-1.5 rounded-xl bg-slate-50 p-4 border border-slate-200/60">
                      <h4 className="font-bold text-brand-navy-900 uppercase tracking-wider text-[11px]">
                        Emergency Helplines & Safety
                      </h4>
                      <p className="leading-relaxed font-semibold text-brand-navy-900">
                        {data.travelInfo.emergencyNumbers}
                      </p>
                      <p className="leading-relaxed text-slate-500 pt-1">
                        {data.travelInfo.healthSafetyAdvisory}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 8. FAQS ACCORDION */}
              {data.faqs.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-brand-gold-500" />
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-brand-navy-900">
                      Frequently Asked Questions
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {data.faqs.map((faq) => (
                      <div
                        key={faq.id}
                        className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-2"
                      >
                        <h4 className="font-heading text-sm font-bold text-brand-navy-900">
                          {faq.question}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {faq.answer}
                        </p>
                        <div className="pt-2 text-[10px] text-slate-400 flex items-center gap-1.5">
                          <ShieldCheck className="h-3 w-3 text-brand-emerald-600" />
                          <span>
                            Source: {faq.sourceName} (
                            <a
                              href={faq.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand-emerald-700 underline"
                            >
                              Verify
                            </a>
                            )
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Sidebar: Holiday Packages Callout & Quick Facts */}
            <div className="lg:col-span-4 space-y-6">
              {/* Holiday Packages CTA Card */}
              <Card className="border-brand-gold-500/40 shadow-luxury-md bg-gradient-to-b from-brand-navy-950 via-brand-navy-900 to-brand-navy-950 text-white">
                <CardHeader className="pb-3">
                  <Badge variant="luxury" showIcon className="w-fit mb-1">
                    Commercial Bookings
                  </Badge>
                  <CardTitle className="text-white text-xl">
                    {data.name} Tour Packages
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs text-slate-300">
                  <p className="leading-relaxed">
                    Explore curated {data.name} itineraries featuring verified flights,
                    4★/5★ hotels, sightseeing passes, and certified local tour guides.
                  </p>

                  <div className="rounded-xl bg-white/10 p-3 space-y-1.5 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center justify-between text-xs">
                      <span>Pacing:</span>
                      <strong className="text-white">{data.recommendedDuration}</strong>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Travel Style:</span>
                      <strong className="text-brand-gold-300">{data.travelStyle}</strong>
                    </div>
                  </div>

                  <Link href={`/packages?dest=${data.slug}`} className="block">
                    <Button variant="luxury" className="w-full h-11 text-xs font-bold shadow-luxury-sm">
                      View Available {data.name} Packages
                    </Button>
                  </Link>

                  <Link href="/contact" className="block text-center">
                    <span className="text-[11px] text-slate-400 hover:text-white underline">
                      Speak to a {data.name} Travel Specialist
                    </span>
                  </Link>
                </CardContent>
              </Card>

              {/* Factual Summary Quick Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-luxury-sm space-y-4 text-xs">
                <h4 className="font-heading text-sm font-bold text-brand-navy-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                  Destination Factual Summary
                </h4>

                <div className="space-y-3 text-slate-600">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-400">Country:</span>
                    <strong className="text-brand-navy-900 text-right">{data.country.name}</strong>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-400">Region:</span>
                    <strong className="text-brand-navy-900 text-right">{data.region.name}</strong>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-400">Languages:</span>
                    <strong className="text-brand-navy-900 text-right">{data.languages}</strong>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-400">Time Zone:</span>
                    <strong className="text-brand-navy-900 text-right">{data.timeZone}</strong>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-400">Currency:</span>
                    <strong className="text-brand-navy-900 text-right">{data.currency}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 9. RELATED DESTINATIONS */}
          {relatedDestinations.length > 0 && (
            <div className="mt-16 pt-12 border-t border-slate-200">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-brand-navy-900">
                    Related Destinations in {data.region.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Expand your journey with verified travel itineraries nearby.
                  </p>
                </div>
                <Link
                  href={`/destinations?region=${data.region.slug}`}
                  className="text-xs font-semibold text-brand-gold-600 hover:underline flex items-center gap-1"
                >
                  <span>Explore Region</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedDestinations.map((related) => (
                  <DestinationCard key={related.id} destination={related} />
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
