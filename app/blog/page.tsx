import * as React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { BlogHubClient } from "./blog-hub-client";
import { getPublishedArticles } from "@/lib/content";
import { siteConfig } from "@/config/site";
import { ShieldCheck, BookOpen, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Verified Travel Guides, Visa Protocols & Packing Insights | Sah Tour And Travel",
  description:
    "Comprehensive destination guides, official visa documentation protocols, seasonal packing checklists, and authentic travel insights cross-referenced with official consular and tourism authorities.",
  keywords: [
    "travel guides",
    "visa guides",
    "Schengen visa requirements",
    "destination guides",
    "packing checklists",
    "honeymoon travel guides",
    "family vacation tips",
    "budget travel advice",
    "luxury travel curations",
    "adventure travel safety",
  ],
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
  openGraph: {
    title: "Verified Travel Guides, Visa Protocols & Packing Insights | Sah Tour And Travel",
    description:
      "Comprehensive destination guides, official consular visa documentation, and seasonal packing checklists cross-referenced with national tourism boards.",
    url: `${siteConfig.url}/blog`,
    siteName: siteConfig.name,
    images: [
      {
        url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Sah Tour And Travel Editorial Guides",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Verified Travel Guides & Visa Protocols | Sah Tour And Travel",
    description:
      "Official visa documentation, alpine packing guides, and authentic destination insights cross-referenced with national tourism authorities.",
    images: ["https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80"],
  },
};

export default async function BlogHubPage() {
  const { articles, total } = await getPublishedArticles({ limit: 50 });

  // Schema: CollectionPage & BreadcrumbList
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${siteConfig.url}/blog`,
        name: "Sah Tour And Travel Editorial Hub",
        description:
          "Authoritative travel guides, official visa documentation, and packing insights verified by certified tour managers.",
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
          logo: `${siteConfig.url}/logo.png`,
        },
        hasPart: articles.map((a) => ({
          "@type": "Article",
          headline: a.title,
          url: `${siteConfig.url}/blog/${a.slug}`,
          datePublished: a.publishedAt,
          dateModified: a.updatedAt,
          author: {
            "@type": "Person",
            name: a.author,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteConfig.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Travel Guides",
            item: `${siteConfig.url}/blog`,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main className="flex-1">
        {/* Editorial Masthead */}
        <section className="bg-brand-navy-950 text-white py-12 sm:py-16 border-b border-slate-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-gradient from-brand-gold-500/10 via-transparent to-transparent opacity-50" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10 space-y-4">
            <Breadcrumb
              className="text-white/70"
              items={[
                { label: "Home", href: "/" },
                { label: "Travel Guides & Editorial Desk", isCurrent: true },
              ]}
            />

            <div className="max-w-3xl space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-brand-gold-500/20 text-brand-gold-300 border border-brand-gold-500/30 px-3 py-1 text-xs font-bold font-heading uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand-gold-400" />
                  <span>100% Fact-Checked Travel Journalism</span>
                </span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Authentic Travel Guides & Verified Consular Protocols
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-sans">
                Every visa requirement, packing recommendation, and destination itinerary on Sah Tour And Travel is cross-referenced with national tourism boards, international aviation authorities, and sovereign consular portals.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <section className="container mx-auto px-4 sm:px-6 py-10">
          <BlogHubClient initialArticles={articles} totalArticles={total} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
