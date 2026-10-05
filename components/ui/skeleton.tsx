import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shimmer?: boolean;
}

export function Skeleton({
  className,
  shimmer = true,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-slate-200/80",
        shimmer && "animate-shimmer",
        className
      )}
      {...props}
    />
  );
}

/**
 * High-fidelity Skeleton for Tour Package Cards
 */
export function PackageCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-luxury-sm">
      {/* Image Skeleton */}
      <Skeleton className="h-52 w-full rounded-none" />

      {/* Content Skeleton */}
      <div className="p-5 space-y-4">
        {/* Badges row */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>

        {/* Inclusions chips */}
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-4 w-12 rounded-sm" />
          <Skeleton className="h-4 w-16 rounded-sm" />
          <Skeleton className="h-4 w-14 rounded-sm" />
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for Destination Cards
 */
export function DestinationCardSkeleton() {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-luxury-sm h-72">
      <Skeleton className="h-full w-full rounded-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-5 flex flex-col justify-end space-y-2">
        <Skeleton className="h-6 w-32 bg-white/40" />
        <Skeleton className="h-4 w-48 bg-white/30" />
      </div>
    </div>
  );
}
