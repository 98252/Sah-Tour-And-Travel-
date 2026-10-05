"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WishlistButtonProps {
  packageId: string;
  initialSaved?: boolean;
  className?: string;
  variant?: "icon" | "button" | "badge";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  onToggle?: (isSaved: boolean) => void;
}

export function WishlistButton({
  packageId,
  initialSaved = false,
  className,
  variant = "icon",
  size = "md",
  showLabel = false,
  onToggle,
}: WishlistButtonProps) {
  const [isSaved, setIsSaved] = React.useState(initialSaved);
  const [isLoading, setIsLoading] = React.useState(false);
  const [animate, setAnimate] = React.useState(false);

  // Sync state if initialSaved changes
  React.useEffect(() => {
    setIsSaved(initialSaved);
  }, [initialSaved]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    // Optimistic toggle
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 400);

    setIsLoading(true);

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });

      if (res.status === 401) {
        // Revert optimistic update
        setIsSaved(!nextSaved);
        alert("Please sign in to save holiday packages to your wishlist.");
        window.location.href = `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update wishlist.");
      }

      setIsSaved(data.saved);
      if (onToggle) onToggle(data.saved);

      // Notify header and any listening components
      window.dispatchEvent(
        new CustomEvent("sah:wishlist-updated", {
          detail: { count: data.count, packageId, saved: data.saved },
        })
      );
    } catch (err) {
      console.error("Wishlist error:", err);
      // Revert optimistic update on failure
      setIsSaved(!nextSaved);
    } finally {
      setIsLoading(false);
    }
  };

  const heartIcon = (
    <Heart
      className={cn(
        "transition-all duration-300",
        size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-5 w-5" : "h-4 w-4",
        isSaved
          ? "fill-rose-500 text-rose-500"
          : "text-slate-600 hover:text-rose-500 group-hover:scale-110",
        animate && "scale-125 transition-transform"
      )}
    />
  );

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={handleToggle}
        disabled={isLoading}
        aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
        className={cn(
          "group flex items-center justify-center gap-2 rounded-xl border font-semibold transition-all shadow-xs",
          isSaved
            ? "border-rose-200 bg-rose-50/80 text-rose-700 hover:bg-rose-100"
            : "border-slate-300 bg-white text-slate-700 hover:border-rose-300 hover:bg-slate-50",
          size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm",
          className
        )}
      >
        {heartIcon}
        <span>{isSaved ? "Saved to Wishlist" : "Save Package"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isLoading}
      aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
      className={cn(
        "group relative flex items-center justify-center rounded-full transition-all shadow-sm",
        isSaved
          ? "bg-rose-50 border border-rose-200"
          : "bg-white/90 backdrop-blur-md border border-slate-200/80 hover:bg-white",
        size === "sm" ? "h-8 w-8" : size === "lg" ? "h-11 w-11" : "h-9 w-9",
        className
      )}
    >
      {heartIcon}
      {showLabel && (
        <span className="sr-only">
          {isSaved ? "Remove from Wishlist" : "Add to Wishlist"}
        </span>
      )}
    </button>
  );
}
