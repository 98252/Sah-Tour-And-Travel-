"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArticleItem, CONTENT_CATEGORIES } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Compass,
  Lightbulb,
  FileCheck,
  Luggage,
  Heart,
  Users,
  PiggyBank,
  Crown,
  Mountain,
  Search,
  Clock,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Sparkles,
  Calendar,
  CheckCircle2,
  X,
} from "lucide-react";

interface BlogHubClientProps {
  initialArticles: ArticleItem[];
  totalArticles: number;
}

export function BlogHubClient({ initialArticles, totalArticles }: BlogHubClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategoryQuery = searchParams.get("category") || "All";

  const [selectedCategory, setSelectedCategory] = React.useState<string>(activeCategoryQuery);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [articles, setArticles] = React.useState<ArticleItem[]>(initialArticles);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // Sync category with URL
  React.useEffect(() => {
    if (activeCategoryQuery && activeCategoryQuery !== selectedCategory) {
      setSelectedCategory(activeCategoryQuery);
    }
  }, [activeCategoryQuery]);

  // Fetch filtered articles when category or search changes
  const fetchArticles = React.useCallback(async (cat: string, search: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (cat !== "All") params.set("category", cat);
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/content?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setArticles(data.articles || []);
      }
    } catch (err) {
      console.error("Failed to filter articles:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    const newParams = new URLSearchParams(searchParams.toString());
    if (categoryName === "All") {
      newParams.delete("category");
    } else {
      newParams.set("category", categoryName);
    }
    router.push(`/blog?${newParams.toString()}`, { scroll: false });
    fetchArticles(categoryName, searchTerm);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchArticles(selectedCategory, searchTerm);
  };

  const getCategoryIcon = (catName: string) => {
    switch (catName) {
      case "Destination Guides":
        return <Compass className="h-4 w-4" />;
      case "Travel Tips":
        return <Lightbulb className="h-4 w-4" />;
      case "Visa Guides":
        return <FileCheck className="h-4 w-4" />;
      case "Packing Guides":
        return <Luggage className="h-4 w-4" />;
      case "Honeymoon Guides":
        return <Heart className="h-4 w-4" />;
      case "Family Travel":
        return <Users className="h-4 w-4" />;
      case "Budget Travel":
        return <PiggyBank className="h-4 w-4" />;
      case "Luxury Travel":
        return <Crown className="h-4 w-4" />;
      case "Adventure Travel":
        return <Mountain className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  // Find primary featured article
  const featuredArticle = articles.find((a) => a.isFeatured) || articles[0];
  const gridArticles = articles.filter((a) => a.id !== featuredArticle?.id);

  return (
    <div className="space-y-10">
      {/* Category Pills & Search Toolbar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search destination guides, visa rules, packing checklists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-20 h-11 text-xs rounded-2xl bg-white border-slate-200 shadow-xs focus:ring-2 focus:ring-brand-gold-500/50"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  fetchArticles(selectedCategory, "");
                }}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <Button
              type="submit"
              size="sm"
              variant="luxury"
              className="absolute right-1.5 top-1.5 h-8 px-3 text-xs"
            >
              Search
            </Button>
          </form>

          {/* Quick Counter */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-brand-emerald-600" />
            <span>
              <strong>{articles.length}</strong> Verified Editorial Guides Published
            </span>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => handleCategorySelect("All")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === "All"
                ? "bg-brand-navy-950 text-white shadow-md"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>All Categories</span>
          </button>

          {CONTENT_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.name || selectedCategory === cat.slug;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => handleCategorySelect(cat.name)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-brand-navy-950 text-white shadow-md ring-2 ring-brand-gold-500/40"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {getCategoryIcon(cat.name)}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-400 text-xs">
          Loading verified travel articles...
        </div>
      ) : articles.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-slate-300 rounded-3xl bg-white space-y-3">
          <Compass className="h-10 w-10 text-slate-400 mx-auto" />
          <h3 className="font-heading text-lg font-bold text-brand-navy-900">
            No Guides Found
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No verified guides match your current filter or search criteria. Try selecting another category or clearing search terms.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedCategory("All");
              setSearchTerm("");
              fetchArticles("All", "");
            }}
          >
            Reset Filters
          </Button>
        </Card>
      ) : (
        <div className="space-y-10">
          {/* Featured Article Hero Banner */}
          {featuredArticle && selectedCategory === "All" && !searchTerm && (
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-luxury-md grid grid-cols-1 lg:grid-cols-12 group">
              <div className="lg:col-span-7 relative h-72 lg:h-[420px] overflow-hidden bg-slate-900">
                {featuredArticle.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featuredArticle.coverImage}
                    alt={featuredArticle.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-brand-navy-950 text-brand-gold-400">
                    <Compass className="h-16 w-16" />
                  </div>
                )}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="rounded-full bg-brand-gold-500 text-brand-navy-950 text-[10px] font-extrabold uppercase px-3 py-1 shadow-sm flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Editor&apos;s Featured Guide
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-brand-gold-600 uppercase tracking-wider text-[11px]">
                      {featuredArticle.category}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                      <Clock className="h-3 w-3" />
                      {featuredArticle.readingTime}
                    </span>
                  </div>

                  <Link href={`/blog/${featuredArticle.slug}`}>
                    <h2 className="font-heading text-xl sm:text-2xl font-bold text-brand-navy-950 group-hover:text-brand-gold-600 transition-colors leading-snug">
                      {featuredArticle.title}
                    </h2>
                  </Link>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {featuredArticle.summary}
                  </p>

                  {/* Verification Tag */}
                  {featuredArticle.sources.length > 0 && (
                    <div className="flex items-center gap-1.5 text-[11px] text-brand-emerald-800 bg-brand-emerald-50/80 px-2.5 py-1 rounded-lg border border-brand-emerald-200/60 w-fit">
                      <ShieldCheck className="h-3.5 w-3.5 text-brand-emerald-600" />
                      <span>{featuredArticle.sources.length} Authoritative Sources Cited</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {featuredArticle.authorAvatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={featuredArticle.authorAvatar}
                        alt={featuredArticle.author}
                        className="h-8 w-8 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                        {featuredArticle.author[0]}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-none">
                        {featuredArticle.author}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {formatDate(featuredArticle.publishedAt)}
                      </p>
                    </div>
                  </div>

                  <Link href={`/blog/${featuredArticle.slug}`}>
                    <Button variant="luxury" size="sm" className="text-xs font-bold gap-1.5">
                      <span>Read Guide</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Grid of Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(selectedCategory !== "All" || searchTerm ? articles : gridArticles).map((article) => (
              <Card
                key={article.id}
                className="overflow-hidden border border-slate-200 bg-white rounded-3xl shadow-luxury-xs hover:shadow-luxury-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    {article.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-brand-navy-950 text-brand-gold-400">
                        {getCategoryIcon(article.category)}
                      </div>
                    )}
                    <span className="absolute top-3 left-3 rounded-full bg-brand-navy-950/80 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold text-white border border-white/20">
                      {article.category}
                    </span>
                    <span className="absolute bottom-3 right-3 rounded-full bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-white/90">
                      {article.readingTime}
                    </span>
                  </div>

                  <CardContent className="p-5 space-y-2.5">
                    <Link href={`/blog/${article.slug}`}>
                      <h3 className="font-heading text-base font-bold text-brand-navy-950 group-hover:text-brand-gold-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {article.summary}
                    </p>

                    {article.sources.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[10px] text-brand-emerald-800 pt-1">
                        <CheckCircle2 className="h-3 w-3 text-brand-emerald-600" />
                        <span>Sourced from {article.sources[0].title}</span>
                      </div>
                    )}
                  </CardContent>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    {article.authorAvatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={article.authorAvatar}
                        alt={article.author}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                        {article.author[0]}
                      </div>
                    )}
                    <span className="truncate max-w-[100px] text-[11px] font-semibold text-slate-700">
                      {article.author}
                    </span>
                  </div>

                  <Link
                    href={`/blog/${article.slug}`}
                    className="text-xs font-bold text-brand-gold-600 hover:text-brand-gold-700 flex items-center gap-1"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
