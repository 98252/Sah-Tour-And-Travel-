import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Compass, SearchX, HeartCrack, CalendarX } from "lucide-react";

export type EmptyStateType = "search" | "wishlist" | "bookings" | "general";

export interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const defaultContent: Record<
  EmptyStateType,
  { icon: React.ReactNode; title: string; description: string; action: string }
> = {
  search: {
    icon: <SearchX className="h-10 w-10 text-brand-gold-600" />,
    title: "No Matching Holidays Found",
    description:
      "We could not find packages matching your exact criteria. Try adjusting your travel dates, departure city, or budget range.",
    action: "Reset All Filters",
  },
  wishlist: {
    icon: <HeartCrack className="h-10 w-10 text-brand-gold-600" />,
    title: "Your Saved Packages List is Empty",
    description:
      "Save packages you love while browsing to compare itineraries and share with your travel companions.",
    action: "Explore Trending Destinations",
  },
  bookings: {
    icon: <CalendarX className="h-10 w-10 text-brand-teal-600" />,
    title: "No Active Bookings",
    description:
      "You do not have any upcoming holiday departures right now. Start planning your next dream journey today.",
    action: "Discover Holiday Packages",
  },
  general: {
    icon: <Compass className="h-10 w-10 text-brand-navy-700" />,
    title: "No Records Available",
    description: "There is currently no information to display in this section.",
    action: "Return to Homepage",
  },
};

export function EmptyState({
  type = "general",
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  const content = defaultContent[type];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center shadow-xs",
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 border border-slate-200/80 mb-4 shadow-xs">
        {content.icon}
      </div>

      <h3 className="font-heading text-xl font-bold text-brand-navy-900 mb-2">
        {title || content.title}
      </h3>

      <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
        {description || content.description}
      </p>

      {onAction && (
        <Button
          variant="luxury"
          onClick={onAction}
          className="shadow-luxury-sm"
        >
          {actionLabel || content.action}
        </Button>
      )}
    </div>
  );
}
