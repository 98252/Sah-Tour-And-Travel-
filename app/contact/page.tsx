import * as React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { EnquiryForm } from "@/components/enquiry/enquiry-form";
import { siteConfig } from "@/config/site";
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Headphones,
  CheckCircle2,
  Sparkles,
  Building2,
  FileCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Customized Travel Enquiries | Sah Tour And Travel",
  description:
    "Speak with accredited holiday counselors. Request custom tour quotations, hotel upgrades, group discounts, and private itineraries with verified supplier inventory.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: Promise<{ destination?: string; packageId?: string; packageName?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const initialDestination = resolvedParams.destination || "";
  const initialPackageId = resolvedParams.packageId || "";
  const initialPackageName = resolvedParams.packageName || "";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-brand-navy-950 via-brand-navy-900 to-brand-navy-800 text-white py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-gold-500/10 blur-3xl" />
        <div className="container mx-auto max-w-6xl relative z-10 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-gold-500/20 text-brand-gold-300 border border-brand-gold-400/40">
            <Sparkles className="h-3.5 w-3.5 text-brand-gold-400" />
            Verified Commercial Travel Desk
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight">
            Speak to a Dedicated Travel Specialist
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Whether you desire a scenic Swiss rail journey, a luxury Arabian desert escape, or an idyllic Kerala houseboat retreat, our counselors craft flawless itineraries tailored to you.
          </p>
        </div>
      </section>

      {/* Main Content Grid: Enquiry Form & Official Contact Details */}
      <main className="flex-1 py-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: The Comprehensive Enquiry Form */}
            <div className="lg:col-span-7">
              <EnquiryForm
                initialDestination={initialDestination}
                initialPackageId={initialPackageId}
                initialPackageName={initialPackageName}
              />
            </div>

            {/* Right 5 Columns: Configurable Official Company Information & Trust Cards */}
            <div className="lg:col-span-5 space-y-6">
              {/* Official Contact Cards (Using Configurable Site Config with ZERO fake data) */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-luxury-md space-y-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-600 block mb-1">
                    Direct Assistance
                  </span>
                  <h3 className="font-heading text-xl font-bold text-brand-navy-950">
                    Official Travel Desk Channels
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Headquartered in Birgunj Parsa, Nepal, serving travelers across Nepal, India, and worldwide.
                  </p>
                </div>

                {/* Founder & Managing Director Profile Card */}
                <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-gradient-to-r from-brand-navy-950 to-brand-navy-900 text-white shadow-sm">
                  <div className="h-12 w-12 rounded-xl bg-brand-gold-500/20 text-brand-gold-400 flex items-center justify-center font-bold text-base shrink-0 border border-brand-gold-500/40">
                    RS
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-brand-gold-400 tracking-wider">
                      Founder &amp; Managing Director
                    </span>
                    <h4 className="font-heading text-base font-bold text-white">
                      Rahul Kumar Sah
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      Sah Tour And Travel
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Helpline */}
                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gold-100 text-brand-gold-700">
                      <PhoneCall className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase">
                        Customer Helpline &amp; WhatsApp
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <a
                          href="tel:+9779825284434"
                          className="text-sm font-bold text-brand-navy-900 hover:text-brand-gold-600 transition-colors"
                        >
                          +977 9825284434 <span className="text-xs font-normal text-slate-500">(Nepal)</span>
                        </a>
                        <a
                          href="tel:+919263028848"
                          className="text-sm font-bold text-brand-navy-900 hover:text-brand-gold-600 transition-colors"
                        >
                          +91 9263028848 <span className="text-xs font-normal text-slate-500">(India)</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Email Support */}
                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-teal-100 text-brand-teal-700">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase">
                        Official Direct Email
                      </span>
                      <p className="text-sm font-bold text-brand-navy-900">
                        <a
                          href="mailto:sahr67568@gmail.com"
                          className="hover:text-brand-gold-600 transition-colors"
                        >
                          sahr67568@gmail.com
                        </a>
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Quick response for itinerary quotations &amp; bookings
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-navy-100 text-brand-navy-800">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase">
                        Operating Hours
                      </span>
                      <p className="text-xs font-bold text-brand-navy-900">
                        {siteConfig.contact.hours}
                      </p>
                      <p className="text-[11px] text-brand-emerald-600 font-semibold">
                        {siteConfig.contact.emergencySupport}
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-700">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase">
                        Head Office / Operations Center
                      </span>
                      <p className="text-sm font-bold text-slate-800 leading-relaxed">
                        Birgunj Parsa, Nepal
                      </p>
                    </div>
                  </div>
                </div>

                {/* Regulatory Registration Badges */}
                <div className="pt-2 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-brand-gold-600" />
                    <span>Registered Operations: Birgunj Parsa, Nepal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-brand-emerald-600" />
                    <span>Direct Founder Accountability &amp; Zero Fabricated Listings</span>
                  </div>
                </div>
              </div>

              {/* Service Protocol Box */}
              <div className="rounded-3xl border border-brand-gold-200 bg-brand-gold-50/70 p-6 space-y-3 text-xs text-slate-700">
                <div className="flex items-center gap-2 font-bold text-brand-navy-950 uppercase tracking-wider text-[11px]">
                  <ShieldCheck className="h-4 w-4 text-brand-gold-600" />
                  <span>The Sah Traveler Guarantee</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-emerald-600 shrink-0 mt-0.5" />
                    <span>100% itemized inclusions with zero concealed add-ons.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-emerald-600 shrink-0 mt-0.5" />
                    <span>Contracted allotments with accredited hoteliers and scenic rail lines.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-emerald-600 shrink-0 mt-0.5" />
                    <span>Dedicated WhatsApp and phone support during active travel days.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
