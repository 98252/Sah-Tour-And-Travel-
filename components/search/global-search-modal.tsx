"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  MapPin,
  Compass,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { GlobalSearchResult } from "@/services/search-service";

export interface GlobalSearchModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function GlobalSearchModal({ isOpen: controlledIsOpen, onClose: controlledOnClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const [internalIsOpen, setInternalIsOpen] = React.useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const [query, setQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const [results, setResults] = React.useState<GlobalSearchResult | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"all" | "destinations" | "packages" | "activities">("all");

  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClose = React.useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
    setResults(null);
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
    }
  }, [controlledOnClose]);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K & ESC)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          handleClose();
        } else {
          setInternalIsOpen(true);
        }
      } else if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  // Listen for custom trigger event
  React.useEffect(() => {
    const handleTrigger = () => {
      setInternalIsOpen(true);
    };

    window.addEventListener("open-global-search", handleTrigger);
    return () => window.removeEventListener("open-global-search", handleTrigger);
  }, []);

  // Focus input when opened
  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Debounce search query (300ms)
  React.useEffect(() => {
    const trimmed = query.trim();
    const handler = setTimeout(() => {
      setDebouncedQuery(trimmed);
      if (trimmed) {
        setIsLoading(true);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  // Execute database search via API
  React.useEffect(() => {
    if (!debouncedQuery) {
      return;
    }

    let isCancelled = false;
    const controller = new AbortController();

    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&limit=6`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data: GlobalSearchResult) => {
        if (!isCancelled) {
          setResults(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!isCancelled && err.name !== "AbortError") {
          console.error("Search error:", err);
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [debouncedQuery]);

  const activeResults = debouncedQuery ? results : null;
  const isSearching = debouncedQuery ? isLoading : false;

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (!val.trim()) {
      setDebouncedQuery("");
      setResults(null);
    }
  };

  const handleNavigate = (url: string) => {
    handleClose();
    router.push(url);
  };

  const handleFullSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleClose();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  if (!isOpen) return null;

  const popularQueries = [
    { label: "Dubai Skyline & Safari", url: "/holidays/dubai-skyline-desert-safari" },
    { label: "Switzerland Scenic Rail", url: "/holidays/switzerland-scenic-rail-alps" },
    { label: "Kerala Backwaters & Munnar", url: "/holidays/kerala-backwaters-munnar-tea-hills" },
    { label: "Singapore Gardens & Sentosa", url: "/holidays/singapore-gardens-sentosa-wonder" },
    { label: "Phuket & Bangkok Escape", url: "/holidays/thailand-phuket-bangkok-escape" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-brand-navy-950/70 backdrop-blur-md animate-in fade-in-0 duration-200"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col max-h-[82vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <form
          onSubmit={handleFullSearch}
          className="relative flex items-center border-b border-slate-200 px-4 py-3.5 bg-slate-50/50"
        >
          <Search className="h-5 w-5 text-brand-gold-500 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search destinations, packages, countries, tours, or activities..."
            value={query}
            onChange={handleQueryChange}
            className="flex-1 bg-transparent text-sm sm:text-base font-medium text-brand-navy-900 placeholder:text-slate-400 focus:outline-none"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setDebouncedQuery("");
                setResults(null);
              }}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 mr-2"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
            <span>ESC</span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="sm:hidden p-1 text-slate-500 ml-2"
          >
            <X className="h-5 w-5" />
          </button>
        </form>

        {/* Tab Filters (when results present) */}
        {activeResults && activeResults.totalCount > 0 && (
          <div className="flex items-center gap-1 border-b border-slate-100 px-4 py-2 bg-slate-50/70 text-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1 rounded-full font-semibold transition-colors ${
                activeTab === "all"
                  ? "bg-brand-navy-900 text-white"
                  : "text-slate-600 hover:bg-slate-200/60"
              }`}
            >
              All ({activeResults.totalCount})
            </button>
            <button
              onClick={() => setActiveTab("packages")}
              className={`px-3 py-1 rounded-full font-semibold transition-colors ${
                activeTab === "packages"
                  ? "bg-brand-navy-900 text-white"
                  : "text-slate-600 hover:bg-slate-200/60"
              }`}
            >
              Packages ({activeResults.packages.length})
            </button>
            <button
              onClick={() => setActiveTab("destinations")}
              className={`px-3 py-1 rounded-full font-semibold transition-colors ${
                activeTab === "destinations"
                  ? "bg-brand-navy-900 text-white"
                  : "text-slate-600 hover:bg-slate-200/60"
              }`}
            >
              Destinations ({activeResults.destinations.length})
            </button>
            <button
              onClick={() => setActiveTab("activities")}
              className={`px-3 py-1 rounded-full font-semibold transition-colors ${
                activeTab === "activities"
                  ? "bg-brand-navy-900 text-white"
                  : "text-slate-600 hover:bg-slate-200/60"
              }`}
            >
              Activities ({activeResults.activities.length})
            </button>
          </div>
        )}

        {/* Search Results Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {isSearching && (
            <div className="py-12 text-center space-y-3">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-brand-gold-500 border-t-transparent" />
              <p className="text-xs text-slate-500">Searching verified database inventory...</p>
            </div>
          )}

          {!isSearching && !query && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Sparkles className="h-3.5 w-3.5 text-brand-gold-500" />
                <span>Popular Verified Searches</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {popularQueries.map((pop, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleNavigate(pop.url)}
                    className="flex items-center justify-between text-left p-2.5 rounded-xl border border-slate-100 hover:border-brand-gold-500/30 hover:bg-brand-gold-50/20 text-xs font-semibold text-brand-navy-900 transition-all group"
                  >
                    <span>{pop.label}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-brand-gold-600 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isSearching && query && activeResults && activeResults.totalCount === 0 && (
            <div className="py-10 text-center space-y-2">
              <Compass className="h-8 w-8 text-slate-300 mx-auto" />
              <h4 className="font-heading text-sm font-bold text-slate-700">
                No matching verified results for &ldquo;{query}&rdquo;
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching for destination countries like Switzerland, Dubai, Kerala, or Singapore.
              </p>
            </div>
          )}

          {!isSearching && activeResults && activeResults.totalCount > 0 && (
            <div className="space-y-6">
              {/* Packages Section */}
              {(activeTab === "all" || activeTab === "packages") && activeResults.packages.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                    <span>Holiday Tour Packages ({activeResults.packages.length})</span>
                    <button
                      onClick={() => handleNavigate(`/holidays?q=${encodeURIComponent(query)}`)}
                      className="text-brand-gold-600 hover:underline normal-case text-xs font-medium"
                    >
                      View all in catalogue →
                    </button>
                  </div>
                  <div className="space-y-2">
                    {activeResults.packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        onClick={() => handleNavigate(pkg.url)}
                        className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-100 hover:border-brand-gold-500/40 hover:bg-slate-50/80 cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={pkg.image}
                            alt={pkg.name}
                            className="h-12 w-12 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-brand-gold-600 uppercase tracking-wider block">
                              {pkg.travelStyle} • {pkg.durationText}
                            </span>
                            <h5 className="font-heading text-xs sm:text-sm font-bold text-brand-navy-900 truncate group-hover:text-brand-gold-600 transition-colors">
                              {pkg.name}
                            </h5>
                            <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3 text-brand-teal-600 shrink-0" />
                              {pkg.destinationName}, {pkg.countryName}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">
                            Starting from
                          </span>
                          <span className="font-heading text-xs sm:text-sm font-extrabold text-brand-navy-900">
                            {formatCurrency(pkg.startingPrice, pkg.currency)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Destinations Section */}
              {(activeTab === "all" || activeTab === "destinations") && activeResults.destinations.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Destinations ({activeResults.destinations.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeResults.destinations.map((dest) => (
                      <div
                        key={dest.id}
                        onClick={() => handleNavigate(dest.url)}
                        className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-brand-gold-500/40 hover:bg-slate-50/80 cursor-pointer transition-all group"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className="h-10 w-10 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <h5 className="font-heading text-xs font-bold text-brand-navy-900 truncate group-hover:text-brand-gold-600 transition-colors">
                            {dest.name}
                          </h5>
                          <span className="text-[11px] text-slate-500 truncate block">
                            {dest.countryName} • {dest.subtitle}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activities Section */}
              {(activeTab === "all" || activeTab === "activities") && activeResults.activities.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Activities & Excursions ({activeResults.activities.length})
                  </div>
                  <div className="space-y-2">
                    {activeResults.activities.map((act) => (
                      <div
                        key={act.id}
                        onClick={() => handleNavigate(act.url)}
                        className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-brand-gold-500/40 hover:bg-slate-50/80 cursor-pointer transition-all group"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-brand-navy-50 text-brand-navy-700">
                              {act.type}
                            </span>
                            <h5 className="font-heading text-xs font-bold text-brand-navy-900 truncate group-hover:text-brand-gold-600 transition-colors">
                              {act.title}
                            </h5>
                          </div>
                          <span className="text-[11px] text-slate-500 truncate block mt-0.5">
                            {act.locationName} {act.duration ? `• ${act.duration}` : ""}{" "}
                            {act.packageName ? `• Included in ${act.packageName}` : ""}
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-brand-gold-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-200 px-4 py-3 bg-slate-50/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <ShieldCheck className="h-4 w-4 text-brand-emerald-600 shrink-0" />
            <span>Real verified database inventory</span>
          </div>

          {query.trim() && (
            <button
              onClick={handleFullSearch}
              className="font-semibold text-brand-gold-600 hover:text-brand-gold-700 flex items-center gap-1"
            >
              <span>See all results for &ldquo;{query}&rdquo;</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
