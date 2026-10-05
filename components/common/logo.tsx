import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface LogoProps {
  variant?: "default" | "light" | "icon-only";
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({
  variant = "default",
  showTagline = true,
  size = "md",
  className,
}: LogoProps) {
  const isLight = variant === "light";
  const isIconOnly = variant === "icon-only";

  const sizeClasses = {
    sm: "h-8",
    md: "h-11",
    lg: "h-14",
  };

  const emblemSizes = {
    sm: 32,
    md: 42,
    lg: 52,
  };

  const dim = emblemSizes[size];

  return (
    <Link
      href="/"
      aria-label="Sah Tour And Travel - Homepage"
      className={cn(
        "group inline-flex items-center gap-3 select-none transition-transform active:scale-[0.99]",
        sizeClasses[size],
        className
      )}
    >
      {/* Original Geometric Emblem: Interlocking Compass Star, Mountain & Sun */}
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:rotate-6"
      >
        <defs>
          <linearGradient id="sahGoldGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f7cd7e" />
            <stop offset="50%" stopColor="#e09f2b" />
            <stop offset="100%" stopColor="#a76d0d" />
          </linearGradient>
          <linearGradient id="sahNavyGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2c416e" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <filter id="sahGlow" x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#e09f2b" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Outer Circular Boundary */}
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke="url(#sahGoldGrad)"
          strokeWidth="2.5"
          strokeDasharray="4 2"
          className="opacity-70"
        />

        {/* Inner Solid Crest */}
        <circle
          cx="50"
          cy="50"
          r="41"
          fill={isLight ? "#111a28" : "#18253d"}
          stroke="url(#sahGoldGrad)"
          strokeWidth="1.5"
        />

        {/* Mountain Peak Vector */}
        <path
          d="M24 68L50 26L76 68H24Z"
          fill="url(#sahNavyGrad)"
          stroke="url(#sahGoldGrad)"
          strokeWidth="1.5"
        />

        {/* Sun / Compass Zenith Star */}
        <circle cx="50" cy="38" r="6" fill="url(#sahGoldGrad)" filter="url(#sahGlow)" />
        
        {/* Dynamic Journey Wing / Swoosh */}
        <path
          d="M20 54C34 46 66 46 80 54C68 62 32 62 20 54Z"
          fill="url(#sahGoldGrad)"
          opacity="0.9"
        />

        {/* Compass Cardinal Points */}
        <polygon points="50,14 53,23 50,21 47,23" fill="#e09f2b" />
        <polygon points="50,86 53,77 50,79 47,77" fill="#e09f2b" />
        <polygon points="14,50 23,53 21,50 23,47" fill="#e09f2b" />
        <polygon points="86,50 77,53 79,50 77,47" fill="#e09f2b" />
      </svg>

      {/* Typography Block */}
      {!isIconOnly && (
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline gap-1.5 leading-none">
            <span
              className={cn(
                "font-heading font-extrabold tracking-tight",
                size === "sm" && "text-lg",
                size === "md" && "text-xl",
                size === "lg" && "text-2xl",
                isLight ? "text-white" : "text-brand-navy-900"
              )}
            >
              SAH
            </span>
            <span
              className={cn(
                "font-heading font-semibold tracking-widest uppercase text-brand-gold-500",
                size === "sm" && "text-xs",
                size === "md" && "text-sm",
                size === "lg" && "text-base"
              )}
            >
              Tour & Travel
            </span>
          </div>

          {showTagline && (
            <span
              className={cn(
                "text-[10px] tracking-wider uppercase font-medium mt-0.5",
                isLight ? "text-slate-400" : "text-slate-500"
              )}
            >
              Your Journey. Our Expertise.
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
