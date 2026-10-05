import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { getArticleBySlug, getRelatedArticles } from "@/lib/content";
import { siteConfig } from "@/config/site";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  ShieldCheck,
  Clock,
  Calendar,
  ExternalLink,
  MapPin,
  Compass,
  ArrowRight,
  Share2,
  BookOpen,
  CheckCircle2,
  Sparkles,
  PlaneTakeoff,
  Award,
  ChevronRight,
} from "lucide-react";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found | Sah Tour And Travel",
    };
  }

  const articleUrl = `${siteConfig.url}/blog/${article.slug}`;

  return {
    title: `${article.title} | Sah Tour And Travel`,
    description: article.summary,
    keywords: article.tags,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: article.title,
      description: article.summary,
      url: articleUrl,
      siteName: siteConfig.name,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author],
      section: article.category,
      tags: article.tags,
      images: article.coverImage
        ? [
            {
              url: article.coverImage,
              width: 1200,
              height: 630,
              alt: article.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
      images: article.coverImage ? [article.coverImage] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(article.slug, article.category, 3);

  // Schema: Article & BreadcrumbList
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${siteConfig.url}/blog/${article.slug}`,
        headline: article.title,
        description: article.summary,
        image: article.coverImage ? [article.coverImage] : [],
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        author: {
          "@type": "Person",
          name: article.author,
          jobTitle: article.authorRole || "Travel Specialist",
        },
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
          logo: `${siteConfig.url}/logo.png`,
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${siteConfig.url}/blog/${article.slug}`,
        },
        articleSection: article.category,
        keywords: article.tags.join(", "),
        citation: article.sources.map((s) => s.url),
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
          {
            "@type": "ListItem",
            position: 3,
            name: article.category,
            item: `${siteConfig.url}/blog?category=${encodeURIComponent(article.category)}`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: article.title,
            item: `${siteConfig.url}/blog/${article.slug}`,
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
        {/* Breadcrumb Navigation Bar */}
        <section className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6">
          <div className="container mx-auto">
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Travel Guides", href: "/blog" },
                {
                  label: article.category,
                  href: `/blog?category=${encodeURIComponent(article.category)}`,
                },
                { label: article.title, isCurrent: true },
              ]}
            />
          </div>
        </section>

        {/* Article Header & Masthead */}
        <article className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-5xl">
          <header className="space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <Link
                href={`/blog?category=${encodeURIComponent(article.category)}`}
                className="rounded-full bg-brand-navy-950 text-brand-gold-300 font-bold px-3 py-1 hover:bg-brand-navy-900 transition-colors uppercase tracking-wider text-[11px]"
              >
                {article.category}
              </Link>

              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{article.readingTime}</span>
              </span>

              <span className="text-slate-300">•</span>

              <span className="text-slate-500 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>Published: {formatDate(article.publishedAt)}</span>
              </span>

              {article.updatedAt !== article.publishedAt && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-brand-emerald-700 font-medium">
                    Updated: {formatDate(article.updatedAt)}
                  </span>
                </>
              )}
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy-950 leading-tight">
              {article.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-sans max-w-3xl">
              {article.summary}
            </p>

            {/* Author Credentials & Verification Banner */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3">
                {article.authorAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={article.authorAvatar}
                    alt={article.author}
                    className="h-11 w-11 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="h-11 w-11 rounded-full bg-brand-navy-900 text-brand-gold-400 flex items-center justify-center font-bold text-sm">
                    {article.author[0]}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-sm">
                      {article.author}
                    </span>
                    <span className="rounded bg-brand-gold-100 text-brand-gold-800 text-[10px] font-bold px-1.5 py-0.2">
                      Verified Author
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {article.authorRole || "Senior Travel Specialist"}
                  </p>
                </div>
              </div>

              {article.sources.length > 0 && (
                <div className="flex items-center gap-2 rounded-xl bg-brand-emerald-50 px-3 py-1.5 text-xs text-brand-emerald-900 border border-brand-emerald-200">
                  <ShieldCheck className="h-4 w-4 text-brand-emerald-600 shrink-0" />
                  <span>
                    <strong>{article.sources.length} Official Citations</strong> Cited
                  </span>
                </div>
              )}
            </div>

            {/* Cover Image with Attribution */}
            {article.coverImage && (
              <figure className="space-y-2 pt-2">
                <div className="relative rounded-3xl overflow-hidden shadow-luxury-md bg-slate-900 max-h-[500px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 px-2 gap-2">
                  <span>{article.coverImageCaption || article.title}</span>
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    Source: {article.coverImageSource} • {article.coverImageLicense}
                  </span>
                </figcaption>
              </figure>
            )}
          </header>

          {/* Article Main Grid: Content (Left) & Sidebar (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10">
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-10">
              {/* Mandatory Verification Advisory Box */}
              <div className="rounded-2xl border border-brand-emerald-300 bg-brand-emerald-50/60 p-5 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-brand-emerald-950 font-bold text-sm font-heading">
                  <ShieldCheck className="h-5 w-5 text-brand-emerald-700" />
                  <span>Official Verification & Source Integrity Notice</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  In compliance with Sah Tour And Travel&apos;s editorial standards, this guide contains only verifiable travel facts. Visa requirements, baggage limits, and consular processing rules are linked to sovereign authorities below.
                </p>
              </div>

              {/* Formatted Article Body */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-luxury-xs space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base font-sans prose prose-slate max-w-none">
                {article.body.split("\n\n").map((para, idx) => {
                  // Check for H2
                  if (para.startsWith("## ")) {
                    return (
                      <h2
                        key={idx}
                        className="font-heading text-2xl font-bold text-brand-navy-950 border-b border-slate-100 pb-2 mt-6 first:mt-0"
                      >
                        {para.replace("## ", "")}
                      </h2>
                    );
                  }
                  // Check for H3
                  if (para.startsWith("### ")) {
                    return (
                      <h3
                        key={idx}
                        className="font-heading text-lg font-bold text-brand-navy-900 mt-4 text-brand-gold-700"
                      >
                        {para.replace("### ", "")}
                      </h3>
                    );
                  }
                  // Check for bullet lists
                  if (para.includes("\n- ") || para.startsWith("- ")) {
                    const items = para.split("\n").filter((l) => l.trim().startsWith("- "));
                    return (
                      <ul key={idx} className="space-y-2 my-3 pl-2">
                        {items.map((it, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                            <CheckCircle2 className="h-4 w-4 text-brand-emerald-600 shrink-0 mt-0.5" />
                            <span>{it.replace("- ", "")}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  // Standard paragraph
                  return (
                    <p key={idx} className="text-slate-700 leading-relaxed text-xs sm:text-sm">
                      {para}
                    </p>
                  );
                })}
              </div>

              {/* MANDATORY VERIFIED SOURCES SECTION */}
              <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-luxury-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-600">
                    Authoritative Reference Citations
                  </span>
                  <h3 className="font-heading text-xl font-bold text-brand-navy-950 flex items-center gap-2 mt-0.5">
                    <ShieldCheck className="h-5 w-5 text-brand-emerald-600" />
                    <span>Verified Official Sources</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    To maintain strict transparency, all visa protocols, immigration laws, and mountain safety advisories are corroborated with the following authoritative bodies:
                  </p>
                </div>

                <div className="space-y-3">
                  {article.sources.map((source, sIdx) => (
                    <a
                      key={sIdx}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 hover:bg-slate-100 hover:border-brand-gold-500/40 transition-all text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-brand-navy-950 group-hover:text-brand-gold-600 transition-colors">
                            {source.title}
                          </span>
                          {source.isVerified && (
                            <span className="rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.2 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                              Official Authority
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono">
                          {source.type}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 text-brand-gold-600 font-bold shrink-0">
                        <span>Visit Official Portal</span>
                        <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </a>
                  ))}
                </div>
              </section>

              {/* Tags */}
              {article.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs text-slate-400 font-semibold">Tags:</span>
                  {article.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?search=${encodeURIComponent(tag)}`}
                      className="rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs px-2.5 py-1 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Related Packages & Destinations */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Related Holiday Packages */}
              {article.relatedPackages.length > 0 && (
                <div className="rounded-3xl border border-brand-gold-500/30 bg-white p-6 shadow-luxury-sm space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-600">
                      Recommended Holiday Package
                    </span>
                    <h4 className="font-heading text-base font-bold text-brand-navy-950 mt-0.5 flex items-center gap-2">
                      <PlaneTakeoff className="h-4 w-4 text-brand-gold-500" />
                      <span>Experience This Itinerary</span>
                    </h4>
                  </div>

                  <div className="space-y-4">
                    {article.relatedPackages.map((pkg, pIdx) => (
                      <div
                        key={pIdx}
                        className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-3"
                      >
                        <div>
                          <p className="font-heading text-xs font-bold text-brand-navy-950">
                            {pkg.name}
                          </p>
                          {pkg.durationText && (
                            <span className="text-[11px] text-slate-500 block mt-0.5">
                              {pkg.durationText}
                            </span>
                          )}
                        </div>

                        {pkg.startingPrice && (
                          <div className="flex items-baseline gap-1">
                            <span className="text-[10px] text-slate-400">Starting from</span>
                            <span className="font-heading text-lg font-bold text-brand-navy-900">
                              {formatCurrency(pkg.startingPrice, pkg.currency || "INR")}
                            </span>
                          </div>
                        )}

                        <Link href={`/holidays/${pkg.slug}`} className="block">
                          <Button
                            variant="luxury"
                            size="sm"
                            className="w-full text-xs font-bold gap-1.5"
                          >
                            <span>View Verified Tour</span>
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Destinations */}
              {article.relatedDestinations.length > 0 && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-luxury-xs space-y-3">
                  <h4 className="font-heading text-base font-bold text-brand-navy-950 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <MapPin className="h-4 w-4 text-brand-gold-600" />
                    <span>Related Destinations</span>
                  </h4>

                  <div className="space-y-2">
                    {article.relatedDestinations.map((dest, dIdx) => (
                      <Link
                        key={dIdx}
                        href={`/destinations/${dest.slug}`}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-xs group"
                      >
                        <span className="font-bold text-slate-800 group-hover:text-brand-gold-600">
                          {dest.name} {dest.country && `(${dest.country})`}
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-brand-gold-600 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Inquiry CTA */}
              <div className="rounded-3xl bg-brand-navy-950 text-white p-6 shadow-luxury-md space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-400">
                  Certified Concierge
                </span>
                <h4 className="font-heading text-base font-bold text-white">
                  Need Help Planning This Journey?
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Our certified travel advisors can customize your visa filing, scenic rail passes, and 5-star hotel allotments.
                </p>
                <Link href="/contact" className="block pt-1">
                  <Button variant="luxury" size="sm" className="w-full text-xs font-bold">
                    Request Custom Consultation
                  </Button>
                </Link>
              </div>
            </aside>
          </div>

          {/* RELATED ARTICLES CAROUSEL / GRID */}
          {relatedArticles.length > 0 && (
            <section className="mt-16 pt-10 border-t border-slate-200 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-600">
                    Complementary Reading
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-brand-navy-950 mt-0.5">
                    Related Travel & Visa Guides
                  </h3>
                </div>

                <Link
                  href="/blog"
                  className="text-xs font-bold text-brand-gold-600 hover:text-brand-gold-700 flex items-center gap-1"
                >
                  <span>Explore All Guides</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((rel) => (
                  <Card
                    key={rel.id}
                    className="overflow-hidden border border-slate-200 bg-white rounded-3xl shadow-luxury-xs hover:shadow-luxury-md transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                        {rel.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={rel.coverImage}
                            alt={rel.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-brand-navy-950 text-brand-gold-400">
                            <BookOpen className="h-8 w-8" />
                          </div>
                        )}
                        <span className="absolute top-3 left-3 rounded-full bg-brand-navy-950/80 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold text-white border border-white/20">
                          {rel.category}
                        </span>
                      </div>

                      <CardContent className="p-5 space-y-2">
                        <Link href={`/blog/${rel.slug}`}>
                          <h4 className="font-heading text-sm font-bold text-brand-navy-950 group-hover:text-brand-gold-600 transition-colors line-clamp-2">
                            {rel.title}
                          </h4>
                        </Link>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {rel.summary}
                        </p>
                      </CardContent>
                    </div>

                    <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span>{rel.readingTime}</span>
                      <Link
                        href={`/blog/${rel.slug}`}
                        className="text-xs font-bold text-brand-gold-600 hover:text-brand-gold-700 flex items-center gap-1"
                      >
                        <span>Read</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}
