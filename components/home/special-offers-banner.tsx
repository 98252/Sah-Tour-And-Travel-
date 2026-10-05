import * as React from "react";
import Link from "next/link";
import { ArrowRight, Tag, Compass, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OfferData {
  id?: string;
  title: string;
  slug?: string;
  badge: string;
  description: string;
  discountType: string;
  discountVal: number;
  bannerImage: string | null;
  validUntil?: Date | string | null;
  terms?: string | null;
}

interface SpecialOffersBannerProps {
  offers: OfferData[];
}

export function SpecialOffersBanner({ offers }: SpecialOffersBannerProps) {
  // Filter only real offers with high-res banner images
  const verifiedOffers = offers?.filter((o) => o.bannerImage && o.bannerImage.trim().length > 0) || [];

  return (
    <section className="py-18 sm:py-26 bg-slate-950 text-white relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-brand-gold-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-brand-teal-500/10 blur-3xl pointer-events-none" />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-brand-gold-400 text-xs font-bold tracking-widest uppercase mb-3">
              <Sparkles className="h-4 w-4" />
              <span>Seasonal Privileges</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-tight">
              Special Offers
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-300 font-light leading-relaxed">
              Curated travel privileges, seasonal allotments, and limited-edition itineraries.
            </p>
          </div>

          {verifiedOffers.length > 0 && (
            <Link
              href="/offers"
              className="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand-gold-400 hover:text-white transition-colors uppercase tracking-wider shrink-0"
            >
              <span>View All Offers</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {verifiedOffers.length > 0 ? (
          /* Real Verified Offer Display */
          <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Left Image - 30% Increased Height */}
              <div className="lg:col-span-7 relative min-h-[440px] sm:min-h-[570px] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={verifiedOffers[0].bannerImage!}
                  alt={verifiedOffers[0].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950/80 via-transparent to-transparent" />

                {/* Offer Badge */}
                <div className="absolute top-6 left-6 z-10">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold-500 text-slate-950 font-bold px-3.5 py-1 text-xs shadow-md">
                    <Tag className="h-3.5 w-3.5" />
                    <span>{verifiedOffers[0].badge}</span>
                  </span>
                </div>
              </div>

              {/* Right Information */}
              <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-white leading-snug">
                    {verifiedOffers[0].title}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                    {verifiedOffers[0].description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <Link href="/packages">
                    <Button variant="luxury" size="lg" className="rounded-2xl px-6 text-xs font-semibold">
                      Explore This Offer
                    </Button>
                  </Link>

                  <Link href="/contact" className="text-xs text-slate-400 hover:text-white transition-colors">
                    Custom Itinerary Enquiry &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Graceful Empty State as requested by Prompt */
          <div className="rounded-3xl border border-white/10 bg-white/5 p-12 sm:p-16 text-center max-w-2xl mx-auto backdrop-blur-md">
            <Compass className="h-10 w-10 text-brand-gold-400 mx-auto mb-4 opacity-80" />
            <h3 className="font-serif text-2xl font-normal text-white mb-2">
              New journeys and seasonal offers are coming soon.
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-light max-w-md mx-auto mb-6">
              Our travel specialists are curating upcoming season privileges with partner airlines and luxury resorts.
            </p>
            <Link href="/packages">
              <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10 text-xs">
                Browse All Current Packages
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
