import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Tag, Sparkles, ArrowRight, Clock, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Special Travel Offers & Seasonal Privileges | Sah Tour And Travel",
  description:
    "Explore limited-time promotional advantages, early-bird privileges, and festival savings across verified international and domestic holiday packages.",
};

export default async function OffersPage() {
  const offers = await prisma.offer.findMany({
    where: { isArchived: false },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-brand-gold-500 selection:text-white">
      <Header />

      <main className="flex-1 py-12 sm:py-20 bg-[#fbfbf9]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-6">
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Seasonal Offers", isCurrent: true },
              ]}
              className="text-xs text-slate-500"
            />
          </div>

          <div className="max-w-2xl mb-12">
            <div className="inline-flex items-center gap-2 text-brand-gold-600 text-xs font-bold tracking-widest uppercase mb-2">
              <Sparkles className="h-4 w-4" />
              <span>Exclusive Travel Privileges</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-brand-navy-950 mb-3">
              Seasonal Offers &amp; Early-Bird Deals
            </h1>
            <p className="text-sm text-slate-600 font-light leading-relaxed">
              Genuine commercial privileges negotiated directly with our airline partners and 5-star hotel alliances. Zero inflated base prices or fake countdowns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {offers.length > 0 ? (
              offers.map((offer) => (
                <div
                  key={offer.id}
                  className="rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-luxury-sm hover:shadow-luxury-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        offer.bannerImage ||
                        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={offer.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#0B4B8E] text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                        {offer.badge || (offer.discountVal ? `${offer.discountVal}% OFF` : "SPECIAL OFFER")}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-serif text-xl font-normal text-brand-navy-950 mb-2">
                        {offer.title}
                      </h3>
                      <p className="text-xs text-slate-600 font-light leading-relaxed">
                        {offer.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-brand-navy-900 font-semibold">
                        {offer.discountType ? `${offer.discountType}` : "Verified Privilege"}
                      </span>

                      <Link href="/packages/international-tour-packages">
                        <Button variant="luxury" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                          Explore Holidays
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-200 p-8">
                <Tag className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h3 className="font-serif text-xl text-slate-800 mb-2">No Active Offers Right Now</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Check back soon for upcoming holiday season and festival early-bird privileges.
                </p>
                <Link href="/packages">
                  <Button variant="luxury" size="sm">Browse Verified Packages</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
