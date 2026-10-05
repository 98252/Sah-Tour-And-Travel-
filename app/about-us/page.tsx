import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Compass,
  Award,
  Globe2,
  Users,
  CheckCircle2,
  HeartHandshake,
  Clock,
  Sparkles,
  ArrowRight,
  MapPin,
  Building2,
  Headphones,
} from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `About Us | ${siteConfig.name}`,
  description:
    "Learn about Sah Tour And Travel's commitment to original, verified commercial travel curation, transparent pricing, and unforgettable journeys worldwide.",
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-brand-gold-500 selection:text-white">
      <Header />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <section className="relative bg-brand-navy-950 text-white py-20 sm:py-28 overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e09f2b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950 via-transparent to-brand-navy-950/60 pointer-events-none" />

          <div className="relative container mx-auto px-4 sm:px-6 z-10">
            <div className="mb-6">
              <Breadcrumb
                items={[
                  { label: "Home", href: "/" },
                  { label: "About Us", isCurrent: true },
                ]}
                className="text-slate-300 text-xs"
              />
            </div>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold-500/15 border border-brand-gold-400/30 text-brand-gold-400 text-xs font-bold uppercase tracking-widest mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Our Heritage &amp; Commitment</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-tight mb-6">
                Crafting Extraordinary Journeys with Uncompromising Integrity.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed mb-8">
                At {siteConfig.name}, we believe true luxury lies in authenticity, meticulous curation, and total transparency. We curate verified holiday packages across Switzerland, Dubai, Singapore, Vietnam, Kerala, and beyond.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link href="/packages">
                  <Button variant="luxury" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Explore Verified Packages
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                    Contact Travel Desk
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Key Pillars of Distinction */}
        <section className="py-16 sm:py-24 bg-[#fbfbf9] border-b border-slate-200/80">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold tracking-widest uppercase text-brand-gold-600 block mb-2">
                Why Travelers Trust Us
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-brand-navy-950">
                The Sah Tour Commitment
              </h2>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed font-light">
                Every itinerary is built on authentic commercial relationships, real inventory allocations, and certified tourism authority guidelines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: ShieldCheck,
                  title: "100% Verified Inventory",
                  desc: "Zero speculative or fabricated listings. All hotels, ground operators, and flight schedules are vetted under confirmed supplier contracts.",
                  accent: "text-brand-gold-500",
                },
                {
                  icon: Globe2,
                  title: "Official Citations",
                  desc: "Cross-referenced with official national tourism boards (Switzerland Tourism, DET Dubai, Incredible India, TAT Thailand) for accurate guidance.",
                  accent: "text-brand-teal-500",
                },
                {
                  icon: Award,
                  title: "Transparent Inclusions",
                  desc: "Clear itemized inclusions with zero hidden service charges, unannounced resort fees, or fictitious discounts.",
                  accent: "text-brand-emerald-500",
                },
                {
                  icon: Headphones,
                  title: "24/7 Dedicated Support",
                  desc: "Direct access to certified human travel coordinators before, during, and after your trip for effortless peace of mind.",
                  accent: "text-brand-gold-500",
                },
              ].map((pillar, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-8 border border-slate-200/70 shadow-luxury-sm hover:shadow-luxury-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6">
                    <pillar.icon className={`h-6 w-6 ${pillar.accent}`} />
                  </div>
                  <h3 className="font-serif text-xl font-normal text-brand-navy-950 mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Our Story Section */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 relative">
                <div className="relative rounded-3xl overflow-hidden shadow-luxury-lg aspect-4/3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80"
                    alt="Sah Tour Travel Consultation"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/60 via-transparent to-transparent" />
                </div>

                {/* Floating Stats Card */}
                <div className="absolute -bottom-6 -right-6 sm:bottom-8 sm:-right-8 bg-brand-navy-900 text-white p-6 rounded-2xl shadow-luxury-lg border border-brand-gold-500/30 max-w-xs">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-brand-gold-400" />
                    <span className="font-serif text-2xl font-bold text-white">15,000+</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Discerning travelers served across 40+ destinations with guaranteed supplier quality.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-6 lg:pl-6">
                <div className="inline-flex items-center gap-2 text-brand-gold-600 text-xs font-bold tracking-widest uppercase">
                  <Compass className="h-4 w-4" />
                  <span>The Story Behind Our Name</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-brand-navy-950 leading-tight">
                  Born from a Passion for Genuine Exploration.
                </h2>

                <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                  Founded with the conviction that international and domestic travel should be free from algorithmic price manipulation and misleading descriptions, {siteConfig.name} was established to restore trust to holiday planning.
                </p>

                <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                  We maintain direct partnerships with accredited Destination Management Companies (DMCs), 4-star and 5-star hotel chains, and major international air carriers. Whether navigating the glacier peaks of Zermatt, the desert dunes of Dubai, or the backwaters of Alappuzha, our clients travel with the certainty of confirmed arrangements.
                </p>

                <div className="pt-4 grid grid-cols-2 gap-4">
                  <div className="border-l-2 border-brand-gold-500 pl-4">
                    <span className="block font-serif text-2xl font-semibold text-brand-navy-950">100%</span>
                    <span className="text-xs text-slate-500">Confirmed Hotel Allotments</span>
                  </div>
                  <div className="border-l-2 border-brand-gold-500 pl-4">
                    <span className="block font-serif text-2xl font-semibold text-brand-navy-950">24/7</span>
                    <span className="text-xs text-slate-500">Concierge Desk Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Founder & Executive Leadership Profile */}
        <section className="py-20 sm:py-24 bg-[#f8f9fa] border-t border-slate-200/80">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-luxury-md">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Monogram / Avatar */}
                <div className="shrink-0 flex flex-col items-center text-center">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-brand-navy-950 via-brand-navy-900 to-brand-gold-900 flex items-center justify-center text-brand-gold-300 font-serif text-3xl sm:text-4xl font-bold shadow-luxury-md border-2 border-brand-gold-400/40">
                    RKS
                  </div>
                  <div className="mt-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-gold-50 text-brand-gold-700 text-[11px] font-bold uppercase tracking-wider border border-brand-gold-200">
                      Leadership
                    </span>
                  </div>
                </div>

                {/* Details & Statement */}
                <div className="space-y-4 text-center md:text-left flex-1">
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-navy-950">
                      Rahul Kumar Sah
                    </h3>
                    <p className="text-sm font-semibold text-brand-gold-600">
                      Founder &amp; Managing Director — Sah Tour And Travel
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                    &ldquo;My vision in establishing Sah Tour And Travel is to redefine holiday planning through honesty, certified local allotments, and direct personal accountability. We reject opaque markups and unverified claims, ensuring every traveler departs with absolute confidence and returns with memories of a lifetime.&rdquo;
                  </p>

                  <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase block">Phone / WhatsApp</span>
                      <a href="tel:+9779825284434" className="font-bold text-brand-navy-900 hover:text-brand-gold-600 transition-colors block">
                        +977 9825284434
                      </a>
                      <a href="tel:+919263028848" className="font-bold text-brand-navy-900 hover:text-brand-gold-600 transition-colors block">
                        +91 9263028848
                      </a>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase block">Direct Email</span>
                      <a href="mailto:sahr67568@gmail.com" className="font-bold text-brand-navy-900 hover:text-brand-gold-600 transition-colors break-all">
                        sahr67568@gmail.com
                      </a>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase block">Headquarters</span>
                      <span className="font-bold text-brand-navy-900 block">
                        Birgunj Parsa, Nepal
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Official Citations & Regulatory Compliance Banner */}
        <section className="py-14 bg-slate-900 text-white border-y border-slate-800">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center md:text-left">
                <span className="text-xs uppercase font-bold tracking-wider text-brand-gold-400">
                  Regulatory Transparency
                </span>
                <h3 className="font-serif text-2xl font-normal text-white">
                  Official Tourism Board Partnerships &amp; Citations
                </h3>
                <p className="text-xs text-slate-400 max-w-xl">
                  We publicly reference and attribute all travel guidelines, entry requirements, and attraction metadata to official national statutory tourism authorities.
                </p>
              </div>

              <Link href="/about-us/official-partners-and-sources">
                <Button variant="luxury" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                  View Official Citations
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 5. Ready to Plan CTA */}
        <section className="py-20 sm:py-24 bg-white text-center">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-brand-gold-600 text-xs font-bold tracking-widest uppercase mb-3">
              <HeartHandshake className="h-4 w-4" />
              <span>Begin Your Journey</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-brand-navy-950 mb-4">
              Let&apos;s Plan Your Next Unforgettable Holiday.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-light mb-8 max-w-xl mx-auto">
              Connect with our certified regional specialists for tailored recommendations, flight combinations, and guaranteed allotments.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/packages/international-tour-packages">
                <Button variant="luxury" size="lg">
                  International Packages
                </Button>
              </Link>
              <Link href="/packages/domestic-tour-packages">
                <Button variant="outline" size="lg">
                  Domestic Indian Holidays
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
