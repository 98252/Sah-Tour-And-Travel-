"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  MapPin,
  Sparkles,
  Plane,
  Hotel,
  ShieldCheck,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface DestinationOption {
  id: string;
  name: string;
  slug: string;
  countryName?: string;
}

interface WaterHeroProps {
  destinations?: DestinationOption[];
  departureCities?: string[];
}

const VIDEOS = [
  {
    id: "main",
    label: "Lake Drive",
    src: "/videos/main.mp4",
  },
  {
    id: "solo",
    label: "Solo Wanderer",
    src: "/videos/327169_medium.mp4",
  },
  {
    id: "alpine",
    label: "Alpine Escape",
    src: "/videos/223363_medium.mp4",
  },
  {
    id: "coastal",
    label: "Coastal Wonder",
    src: "/videos/traveling-alone-1.mp4",
  },
  {
    id: "golden",
    label: "Golden Horizon",
    src: "/videos/218215_medium2.mp4",
  },
];

const PLACEHOLDERS = [
  'Search "Dubai"',
  'Search "Switzerland"',
  'Search "Europe"',
  'Search "Bali"',
  'Search "Japan"',
  'Search "Singapore"',
  'Search "Kerala"',
  'Search "Australia"',
];

const POPULAR_DESTINATIONS = [
  "Switzerland",
  "Dubai",
  "Japan",
  "Europe",
  "Vietnam",
  "Kerala",
  "Singapore",
];

export function WaterHero({
  destinations = [
    { id: "1", name: "Switzerland", slug: "switzerland", countryName: "Switzerland" },
    { id: "2", name: "Dubai", slug: "dubai", countryName: "United Arab Emirates" },
    { id: "3", name: "Singapore", slug: "singapore", countryName: "Singapore" },
    { id: "4", name: "Kerala", slug: "kerala", countryName: "India" },
    { id: "5", name: "Thailand", slug: "thailand", countryName: "Thailand" },
  ],
}: WaterHeroProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [placeholderIndex, setPlaceholderIndex] = React.useState(0);
  const [activeVideoIndex, setActiveVideoIndex] = React.useState(0);
  const [isMuted, setIsMuted] = React.useState(true);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  // Cycling placeholder like Thomas Cook
  React.useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 2600);
    return () => clearInterval(timer);
  }, []);

  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const handleNextVideo = React.useCallback(() => {
    setActiveVideoIndex((prev) => (prev + 1) % VIDEOS.length);
  }, []);

  const handlePrevVideo = React.useCallback(() => {
    setActiveVideoIndex((prev) => (prev - 1 + VIDEOS.length) % VIDEOS.length);
  }, []);

  // When a video ends, automatically play the next video in sequence
  const handleVideoEnded = React.useCallback(() => {
    handleNextVideo();
  }, [handleNextVideo]);

  // Auto-advance to next video every 12 seconds so all videos change one after another
  React.useEffect(() => {
    const timer = setInterval(() => {
      handleNextVideo();
    }, 12000);
    return () => clearInterval(timer);
  }, [handleNextVideo, activeVideoIndex]);

  React.useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => { });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => { });
        setIsFullscreen(false);
      }
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      router.push("/holidays");
      return;
    }
    const q = searchQuery.trim().toLowerCase();
    const matched = destinations.find(
      (d) =>
        d.name.toLowerCase() === q ||
        d.slug.toLowerCase() === q ||
        (d.countryName && d.countryName.toLowerCase() === q)
    );
    if (matched) {
      router.push(`/holidays?destination=${matched.slug}`);
    } else {
      router.push(`/holidays?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleChipClick = (dest: string) => {
    setSearchQuery(dest);
    router.push(`/holidays?destination=${dest.toLowerCase()}`);
  };

  return (
    <div className={`w-full transition-all duration-300 ${isFullscreen ? "p-0" : "px-3 sm:px-5 lg:px-7 pt-2 sm:pt-3 pb-4 sm:pb-6"}`}>
      <section className={`w-full relative overflow-hidden min-h-[88vh] lg:min-h-[92vh] bg-slate-950 text-white flex flex-col justify-between items-center select-none shadow-2xl transition-all duration-300 ${isFullscreen ? "rounded-none min-h-screen" : "rounded-3xl sm:rounded-[2.5rem] lg:rounded-[3rem] border border-slate-800/50"}`}>
      {/* 1. HTML5 Video Layer with Smooth Transitions */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <video
          key={VIDEOS[activeVideoIndex].src}
          ref={videoRef}
          src={VIDEOS[activeVideoIndex].src}
          autoPlay
          muted={isMuted}
          playsInline
          onEnded={handleVideoEnded}
          className="w-full h-full object-cover scale-105 transition-opacity duration-700"
        />

        {/* Multi-Stop Cinematic Contrast Gradients */}
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-slate-950/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-transparent to-slate-950/40" />
      </div>

      {/* Floating Side Nav Chevrons for Quick Switching */}
      <button
        type="button"
        onClick={handlePrevVideo}
        aria-label="Previous video"
        className="hidden md:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-md border border-white/20 items-center justify-center text-white/80 hover:text-white transition-all shadow-xl cursor-pointer hover:scale-110 active:scale-95"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={handleNextVideo}
        aria-label="Next video"
        className="hidden md:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-md border border-white/20 items-center justify-center text-white/80 hover:text-white transition-all shadow-xl cursor-pointer hover:scale-110 active:scale-95"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Video Mode Selector, Audio Toggle & Fullscreen Toggle in Top Right */}
      <div className="relative z-20 section-container pt-5 sm:pt-7 pb-2 flex flex-wrap justify-end items-center gap-2">
        {/* Scenic Video Switcher with Prev/Next Controls */}
        <div className="flex items-center bg-black/55 backdrop-blur-md rounded-full border border-white/20 p-1 text-xs shadow-xl gap-0.5">
          <button
            type="button"
            onClick={handlePrevVideo}
            aria-label="Previous Video"
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Previous Video"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[320px] sm:max-w-none">
            {VIDEOS.map((v, idx) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setActiveVideoIndex(idx)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${activeVideoIndex === idx
                  ? "bg-brand-gold-500 text-brand-navy-950 font-bold shadow-md"
                  : "text-slate-300 hover:text-white"
                  }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleNextVideo}
            aria-label="Next Video"
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Next Video"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Audio Toggle */}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
          className="flex items-center gap-1.5 bg-black/55 hover:bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs text-white transition-all cursor-pointer shadow-xl"
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-brand-gold-400" />
          )}
          <span className="text-xs font-medium hidden sm:inline">
            {isMuted ? "Muted" : "Sound"}
          </span>
        </button>

        {/* Native Full-Screen Toggle */}
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          className="flex items-center gap-1.5 bg-black/55 hover:bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs text-white transition-all cursor-pointer shadow-xl"
        >
          {isFullscreen ? (
            <Minimize className="w-3.5 h-3.5 text-brand-gold-400" />
          ) : (
            <Maximize className="w-3.5 h-3.5 text-slate-300" />
          )}
          <span className="text-xs font-medium hidden sm:inline">
            {isFullscreen ? "Exit Full Screen" : "Full Screen"}
          </span>
        </button>
      </div>

      {/* 2. Center Editorial Copy & Flagship Search Pill */}
      <div className="relative z-10 w-full px-4 sm:px-8 max-w-4xl 2xl:max-w-5xl mx-auto flex flex-col items-center justify-center text-center py-12 sm:py-18 lg:py-24 my-auto">
        {/* Luminous Trust Tagline Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-black/50 px-4 py-1 text-xs sm:text-sm text-amber-200 shadow-luxury-md backdrop-blur-md tracking-wider uppercase mb-3 sm:mb-4">
          <Sparkles className="h-3.5 w-3.5 text-brand-gold-400" />
          <span className="font-semibold">SAH TOUR AND TRAVEL</span>
          <span className="text-white/30">|</span>
          <span className="text-slate-200 capitalize font-serif italic tracking-normal">
            Bespoke Holiday Curation
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-normal tracking-tight text-white mb-3 text-center drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)] leading-[1.12]">
          Around the World,{" "}
          <span className="italic font-normal text-amber-200/95 drop-shadow-sm font-serif">
            Crafted
          </span>{" "}
          Just for You
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg lg:text-xl text-slate-100 font-normal tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] max-w-2xl mx-auto mb-6 leading-relaxed">
          Global Getaways, Perfectly Planned with Guaranteed Allotments & Bespoke Care
        </p>

        {/* Sleek Flagship Pill Search Bar (Expanded Breadth) */}
        <div className="w-full max-w-[860px] 2xl:max-w-[980px]">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center bg-white/95 backdrop-blur-xl rounded-full p-2 sm:p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/50 transition-all focus-within:ring-4 focus-within:ring-amber-300/40 focus-within:bg-white"
          >
            <div className="pl-4 pr-2 text-brand-gold-500">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-brand-gold-500" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={PLACEHOLDERS[placeholderIndex]}
              className="w-full bg-transparent text-slate-900 placeholder:text-slate-500 text-base sm:text-lg font-medium focus:outline-none"
            />

            <button
              type="submit"
              aria-label="Search destination packages"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0B4B8E] hover:bg-[#083a6f] flex items-center justify-center text-white shrink-0 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer ml-2"
            >
              <Search className="w-5 h-5 text-white stroke-[2.2]" />
            </button>
          </form>

          {/* Quick Trending Inspiration Chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
            <span className="text-slate-200 font-semibold uppercase tracking-wider text-xs">
              Popular:
            </span>
            {POPULAR_DESTINATIONS.map((dest) => (
              <button
                key={dest}
                type="button"
                onClick={() => handleChipClick(dest)}
                className="px-3.5 py-1.5 rounded-full bg-black/50 hover:bg-white/25 text-slate-100 hover:text-white backdrop-blur-md border border-white/25 text-xs sm:text-sm font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                {dest}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Docked 4-Pillar Trust Strip (Thomas Cook Luxury Style) */}
      <div className="relative z-10 w-full border-t border-white/20 bg-black/60 backdrop-blur-md py-4 sm:py-5">
        <div className="section-container grid grid-cols-2 md:grid-cols-4 gap-4 text-xs sm:text-sm md:text-base text-slate-100 font-semibold">
          <div className="flex items-center gap-2.5 justify-center sm:justify-start">
            <Plane className="w-5 h-5 text-brand-gold-400 shrink-0" />
            <span>Flight-Inclusive Packages</span>
          </div>
          <div className="flex items-center gap-2.5 justify-center sm:justify-start">
            <Hotel className="w-5 h-5 text-brand-teal-400 shrink-0" />
            <span>Handpicked 4★ & 5★ Stays</span>
          </div>
          <div className="flex items-center gap-2.5 justify-center sm:justify-start">
            <ShieldCheck className="w-5 h-5 text-brand-emerald-400 shrink-0" />
            <span>100% Visa Assistance</span>
          </div>
          <div className="flex items-center gap-2.5 justify-center sm:justify-start">
            <Clock className="w-5 h-5 text-amber-300 shrink-0" />
            <span>24/7 Dedicated Concierge</span>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}

