import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ExternalLink, ArrowLeft, Building2 } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Official Partners & Tourism Board Citations | Sah Tour And Travel",
  description:
    "Public registry of official statutory national tourism boards, accredited hotel partners, and airline alliances referenced across Sah Tour And Travel.",
};

export default async function OfficialPartnersAndSourcesPage() {
  const sources = await prisma.tourismSource.findMany({
    orderBy: { sourceName: "asc" },
  });

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-brand-gold-500 selection:text-white">
      <Header />

      <main className="flex-1 py-14 sm:py-20 bg-[#fbfbf9]">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div className="mb-6">
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about-us" },
                { label: "Official Partners & Citations", isCurrent: true },
              ]}
              className="text-xs text-slate-500"
            />
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-luxury-sm">
            <div className="inline-flex items-center gap-2 text-brand-gold-600 text-xs font-bold tracking-widest uppercase mb-3">
              <ShieldCheck className="h-4 w-4" />
              <span>Attribution &amp; Regulatory Verification</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-brand-navy-950 mb-4">
              Official Partners &amp; Tourism Board Citations
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed font-light mb-8">
              In accordance with our strict verification standards, all destination guides, visa regulations, and entry protocols published on Sah Tour And Travel are cited directly from the following official national tourism authorities and government statutory bodies:
            </p>

            <div className="space-y-4 mb-10">
              {sources.length > 0 ? (
                sources.map((src) => (
                  <div
                    key={src.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="h-4 w-4 text-brand-navy-800" />
                        <h3 className="font-semibold text-sm text-brand-navy-950">{src.sourceName}</h3>
                      </div>
                      <span className="text-xs text-brand-gold-600 font-medium">
                        Authority: {src.authorityType}
                      </span>
                    </div>

                    <a
                      href={src.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-navy-900 hover:text-brand-gold-600 transition-colors shrink-0"
                    >
                      <span>Visit Official Portal</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-500">
                  Tourism authorities verified directly by Sah Tour &amp; Travel Quality Assurance Desk.
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <Link href="/about-us">
                <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}>
                  Back to About Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
