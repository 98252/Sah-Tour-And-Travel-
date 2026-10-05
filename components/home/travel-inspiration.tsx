import * as React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Compass } from "lucide-react";

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  coverImage?: string | null;
  readingTime?: string | null;
  author: string;
  publishedAt: string;
}

interface TravelInspirationProps {
  articles: ArticleItem[];
}

const DEFAULT_ARTICLES: ArticleItem[] = [
  {
    id: "guide-swiss-rail",
    title: "The Ultimate Guide to Switzerland's Glacier Express and Panoramic Rail",
    slug: "ultimate-guide-switzerland-glacier-express",
    category: "Destination Guide",
    summary:
      "Everything you need to know about traversing 291 bridges and 91 tunnels across the Swiss Alps in Excellence Class comfort.",
    coverImage: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
    readingTime: "6 min read",
    author: "Sah Editorial Desk",
    publishedAt: "2026-03-15",
  },
  {
    id: "guide-dubai-desert",
    title: "Beyond the Skyline: Curating an Authentic Arabian Desert Safari",
    slug: "curating-authentic-arabian-desert-safari",
    category: "Travel Insights",
    summary:
      "Private desert conservation reserves, luxury Bedouin majlis dining, and stargazing away from the tourist crowds.",
    coverImage: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&w=800&q=80",
    readingTime: "4 min read",
    author: "Rahul Kumar Sah",
    publishedAt: "2026-03-20",
  },
  {
    id: "guide-kerala-houseboat",
    title: "Navigating the Emerald Backwaters: Choosing the Right Houseboat in Alappuzha",
    slug: "navigating-emerald-backwaters-alappuzha-houseboat",
    category: "Insider Advice",
    summary:
      "How to distinguish authentic eco-certified presidential houseboats from crowded commercial vessels in Kumarakom.",
    coverImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    readingTime: "5 min read",
    author: "Sah Editorial Desk",
    publishedAt: "2026-03-28",
  },
];

export function TravelInspiration({ articles }: TravelInspirationProps) {
  const displayArticles = articles && articles.length > 0 ? articles : DEFAULT_ARTICLES;

  const featured = displayArticles[0];
  const companions = displayArticles.slice(1, 3);

  return (
    <section className="py-18 sm:py-26 bg-white text-slate-900">
      <div className="section-container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-brand-gold-600 text-xs font-bold tracking-widest uppercase mb-3">
              <BookOpen className="h-4 w-4" />
              <span>Editorial Journal</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-brand-navy-950 leading-tight">
              Travel Inspiration
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600 font-light leading-relaxed">
              Editorial stories, destination guides, and insider advice from our travel desk.
            </p>
          </div>

          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand-navy-900 hover:text-brand-gold-600 transition-colors uppercase tracking-wider shrink-0"
          >
            <span>View All Guides &amp; Stories</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Magazine Editorial Layout: 1 Large Left + 2 Companion Cards Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Large Featured Article (7 cols) */}
          <div className="lg:col-span-7 group flex flex-col rounded-3xl overflow-hidden border border-slate-200/80 bg-slate-50/50 shadow-luxury-sm hover:shadow-luxury-md transition-all duration-400">
            {/* 30% Increased Image Height */}
            <div className="relative h-96 sm:h-[460px] lg:h-[500px] overflow-hidden">
              <Link href={`/blog/${featured.slug}`} className="block w-full h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    featured.coverImage ||
                    "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                <div className="absolute top-5 left-5">
                  <span className="rounded-full bg-white/95 px-3.5 py-1 text-xs font-semibold text-brand-navy-900 backdrop-blur-md shadow-xs">
                    {featured.category}
                  </span>
                </div>
              </Link>
            </div>

            <div className="p-8 sm:p-10 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                  <span>By {featured.author}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{featured.readingTime || "5 min read"}</span>
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-brand-navy-950 group-hover:text-brand-gold-600 transition-colors leading-snug">
                  <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
                </h3>

                <p className="text-sm text-slate-600 font-light leading-relaxed line-clamp-3">
                  {featured.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/70 flex items-center justify-between">
                <Link
                  href={`/blog/${featured.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-brand-navy-950 hover:text-brand-gold-600 transition-colors uppercase tracking-wider"
                >
                  <span>Read Full Guide</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* 2 Companion Cards Right (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {companions.map((article) => (
              <div
                key={article.id}
                className="group flex flex-col sm:flex-row gap-5 rounded-3xl p-5 border border-slate-200/80 bg-white shadow-luxury-sm hover:shadow-luxury-md transition-all duration-400 flex-1"
              >
                <div className="relative w-full sm:w-56 h-60 sm:h-auto rounded-2xl overflow-hidden shrink-0">
                  <Link href={`/blog/${article.slug}`} className="block w-full h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        article.coverImage ||
                        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                </div>

                <div className="flex flex-col justify-between flex-1 py-1 space-y-2">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-brand-gold-600">
                      {article.category}
                    </span>
                    <h4 className="font-serif text-lg font-normal text-brand-navy-950 group-hover:text-brand-gold-600 transition-colors leading-snug line-clamp-2">
                      <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                    </h4>
                    <p className="text-xs text-slate-500 font-light line-clamp-2 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{article.readingTime || "4 min read"}</span>
                    <Link
                      href={`/blog/${article.slug}`}
                      className="font-semibold text-brand-navy-950 group-hover:text-brand-gold-600 flex items-center gap-1"
                    >
                      Read
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
