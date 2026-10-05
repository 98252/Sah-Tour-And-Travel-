import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ShieldCheck, ArrowLeft, FileText } from "lucide-react";
import { siteConfig } from "@/config/site";

interface LegalPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const LEGAL_DOCS: Record<
  string,
  { title: string; subtitle: string; lastUpdated: string; content: string[] }
> = {
  "privacy-policy": {
    title: "Privacy Policy",
    subtitle: "How we collect, protect, and handle your travel booking and identity data.",
    lastUpdated: "January 2026",
    content: [
      "1. Information Collection: We collect only the information necessary to fulfill verified airline ticketing, hotel allotments, visa processing, and statutory compliance (e.g. passport details, travel dates, passenger contact numbers).",
      "2. Data Protection: All personal data is encrypted in transit using industry-standard TLS 1.3 and stored in secure, access-controlled cloud infrastructure.",
      "3. Third-Party Sharing: Your data is shared exclusively with confirmed airline partners, licensed Destination Management Companies (DMCs), and accredited hotel partners for the sole purpose of booking execution.",
      "4. Your Rights: You have the right to request access to, correction of, or deletion of your personal booking history and marketing preferences at any time by contacting our privacy compliance desk.",
    ],
  },
  "terms-and-conditions": {
    title: "Terms & Conditions",
    subtitle: "Commercial guidelines, booking agreements, and passenger responsibilities.",
    lastUpdated: "January 2026",
    content: [
      "1. Booking Confirmation: A booking is considered verified only upon successful payment authorization and issuance of an official booking confirmation voucher.",
      "2. Pricing Integrity: Published prices include all statutory taxes, fuel surcharges, and specified inclusions. Zero fictitious discounts or hidden mandatory booking charges.",
      "3. Passport & Visa Validity: Travelers are responsible for possessing a passport valid for at least 6 months beyond the departure date and appropriate entry visas.",
      "4. Supplier Allotments: Flight schedules and hotel rooms are provided through confirmed DMC contracts and airline inventory subject to carrier terms.",
    ],
  },
  "cancellation-policy": {
    title: "Refund & Cancellation Policy",
    subtitle: "Clear, transparent cancellation terms and refund timelines.",
    lastUpdated: "January 2026",
    content: [
      "1. Transparent Cancellation Fees: Cancellation terms depend on the departure timeline. 30+ days prior to departure: nominal administrative fee. 15-30 days: 25% cancellation fee. Less than 15 days: subject to airline and hotel non-refundable allotments.",
      "2. Refund Processing: Eligible refunds are processed directly to the original payment source within 7-10 business days of cancellation approval.",
      "3. Unforeseen Events: In the event of statutory travel bans or carrier cancellations, full credit shells or refunds will be facilitated per carrier and regulatory mandates.",
    ],
  },
  "cookie-policy": {
    title: "Cookie Policy",
    subtitle: "How we utilize cookies to enhance your travel browsing experience.",
    lastUpdated: "January 2026",
    content: [
      "1. Essential Cookies: Required for core website security, session persistence, and booking wizard progress.",
      "2. Preference Cookies: Store your preferred currency, language, and departure city for faster search convenience.",
      "3. Analytics Cookies: Anonymous, aggregated data to improve site navigation speed, search accuracy, and package relevance.",
    ],
  },
  disclaimer: {
    title: "Source Verification Disclaimer",
    subtitle: "Our commitment to authentic citations and verified tourism data.",
    lastUpdated: "January 2026",
    content: [
      siteConfig.disclaimer,
      "Official Tourism Sources: All country overviews, visa rules, and sightseeing descriptions cite statutory national tourism authorities including Switzerland Tourism, DET Dubai, Incredible India, and TAT Thailand.",
      "Accuracy Commitment: While every effort is made to maintain real-time accuracy, airline schedules, seasonal visa fees, and hotel facilities remain subject to operational adjustments by their respective service providers.",
    ],
  },
};

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = LEGAL_DOCS[slug] || { title: "Legal Information" };
  return {
    title: `${doc.title} | ${siteConfig.name}`,
    description: `Official legal disclosures, terms, and policies for ${siteConfig.name}.`,
  };
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { slug } = await params;
  const doc = LEGAL_DOCS[slug] || LEGAL_DOCS["terms-and-conditions"];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-brand-gold-500 selection:text-white">
      <Header />

      <main className="flex-1 py-14 sm:py-20 bg-[#fbfbf9]">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div className="mb-6">
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Legal", href: "/legal/terms-and-conditions" },
                { label: doc.title, isCurrent: true },
              ]}
              className="text-xs text-slate-500"
            />
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-luxury-sm">
            <div className="inline-flex items-center gap-2 text-brand-gold-600 text-xs font-bold tracking-widest uppercase mb-3">
              <ShieldCheck className="h-4 w-4" />
              <span>Official Policy Document • Last Updated {doc.lastUpdated}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-brand-navy-950 mb-3">
              {doc.title}
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed font-light mb-8 pb-6 border-b border-slate-100">
              {doc.subtitle}
            </p>

            <div className="space-y-6 text-sm text-slate-700 leading-relaxed font-light mb-10">
              {doc.content.map((paragraph, index) => (
                <div key={index} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p>{paragraph}</p>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-brand-navy-900 hover:text-brand-gold-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Home</span>
              </Link>

              <span className="text-xs text-slate-400">
                {siteConfig.name} Quality Assurance Division
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
