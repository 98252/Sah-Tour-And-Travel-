"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CinematicHeroProps {
  className?: string;
}

export function CinematicHero({ className = "" }: CinematicHeroProps) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = React.useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = React.useState(false);

  React.useEffect(() => {
    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section className={`relative w-full overflow-hidden bg-slate-950 ${className}`}>
      {/* Hero Visual Container — Responsive Portrait/Landscape Cinema Treatment */}
      <div className="relative w-full h-[82vh] sm:h-[86vh] lg:h-[90vh] min-h-[580px] max-h-[920px] overflow-hidden rounded-b-2xl sm:rounded-b-[36px] lg:rounded-b-[44px]">
        {/* Background Video with Poster Fallback */}
        {!prefersReducedMotion ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            poster="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=2000&q=85"
            onLoadedData={() => setIsVideoLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
              isVideoLoaded ? "opacity-100" : "opacity-80"
            }`}
          >
            <source src="/videos/IMG_5407.mp4" type="video/mp4" />
            <source src="/videos/ref_whatsapp.mp4" type="video/mp4" />
            <source src="/videos/main.mp4" type="video/mp4" />
          </video>
        ) : (
          // Static visual for users who prefer reduced motion
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=2000&q=85"
            alt="Sah Tour And Travel Destinations"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        )}

        {/* Multi-Stop Cinematic Contrast Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/25 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40 pointer-events-none" />

        {/* Hero Copy & Core Call-To-Actions */}
        <div className="relative z-10 container mx-auto h-full px-4 sm:px-8 lg:px-12 flex flex-col justify-end pb-20 sm:pb-24 lg:pb-28">
          <div className="max-w-3xl space-y-4 sm:space-y-6">
            {/* Elegant Travel Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-white backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-medium tracking-widest uppercase">
              <Sparkles className="h-3.5 w-3.5 text-brand-gold-400" />
              <span>Curated International &amp; Domestic Journeys</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-white tracking-tight leading-[1.08] drop-shadow-md">
              Discover Your Next Journey
            </h1>

            {/* Concise Supporting Editorial Line */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-200 font-light max-w-2xl leading-relaxed drop-shadow-sm">
              Thoughtfully planned journeys, unforgettable places, and experiences made for you.
            </p>

            {/* Clear Primary & Secondary CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link href="/packages">
                <Button
                  variant="luxury"
                  size="lg"
                  className="h-12 sm:h-13 px-6 sm:px-8 text-sm sm:text-base font-semibold shadow-luxury-md"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Explore Journeys
                </Button>
              </Link>

              <Link href="#plan-trip">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 sm:h-13 px-6 sm:px-8 text-sm sm:text-base font-medium border-white/40 text-white bg-black/25 hover:bg-white/20 backdrop-blur-md"
                >
                  Plan My Trip
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Subtle Video Audio Control Button */}
        {!prefersReducedMotion && (
          <button
            type="button"
            onClick={toggleSound}
            aria-label={isMuted ? "Unmute cinematic ambient sound" : "Mute audio"}
            className="absolute bottom-6 right-6 z-20 h-10 w-10 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 hover:scale-105"
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-slate-300" /> : <Volume2 className="h-4 w-4 text-brand-gold-400" />}
          </button>
        )}
      </div>
    </section>
  );
}
