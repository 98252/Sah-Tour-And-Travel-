import * as React from "react";
import { cn } from "@/lib/utils";
import { Compass, Loader2 } from "lucide-react";

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  variant?: "navy" | "gold" | "white" | "teal";
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

const variantColorMap = {
  navy: "text-brand-navy-900",
  gold: "text-brand-gold-500",
  white: "text-white",
  teal: "text-brand-teal-600",
};

export function LoadingSpinner({
  size = "md",
  className,
  variant = "navy",
}: LoadingSpinnerProps) {
  return (
    <Loader2
      className={cn(
        "animate-spin",
        sizeMap[size],
        variantColorMap[variant],
        className
      )}
    />
  );
}

export interface PageLoaderProps {
  message?: string;
  subtext?: string;
}

export function PageLoader({
  message = "Loading verified travel itineraries...",
  subtext = "Sourcing authentic packages from certified suppliers",
}: PageLoaderProps) {
  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center p-8 text-center">
      <div className="relative flex items-center justify-center mb-6">
        <div className="absolute h-20 w-20 rounded-full border-4 border-brand-gold-200 border-t-brand-gold-500 animate-spin" />
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-navy-900 text-brand-gold-400 shadow-luxury-md">
          <Compass className="h-7 w-7 animate-pulse" />
        </div>
      </div>
      <h3 className="font-heading text-lg font-bold text-brand-navy-900 mb-1">
        {message}
      </h3>
      <p className="text-xs text-slate-500 max-w-sm">
        {subtext}
      </p>
    </div>
  );
}
