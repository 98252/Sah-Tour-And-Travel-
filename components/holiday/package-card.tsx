import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import {
  CheckCircle2,
  ArrowRight,
  Utensils,
  PlaneTakeoff,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { WishlistButton } from "@/components/holiday/wishlist-button";

export interface PackageCardProps {
  pkg: {
    id: string;
    name: string;
    slug: string;
    durationText: string;
    travelStyle: string;
    startingPrice: number;
    currency: string;
    priceType: string;
    departureCity: string;
    mealPlan: string;
    shortDescription: string;
    highlights: string[];
    destination: {
      name: string;
      countryName: string;
    };
    source: {
      name: string;
      licenseRef: string;
    };
    images: {
      url: string;
      caption: string;
      source: string;
      license: string;
    }[];
    hotels?: {
      hotelName: string;
      starRating: number;
    }[];
  };
}

export function PackageCard({ pkg }: PackageCardProps) {
  const heroImage =
    pkg.images[0] || {
      url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
      caption: pkg.name,
      source: "Unsplash",
      license: "Commercial License",
    };

  const isStartingPrice = pkg.priceType === "STARTING_FROM";

  return (
    <Card hoverEffect className="flex flex-col group h-full">
      {/* Media Header */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImage.url}
          alt={`${pkg.name} - Sah Tour And Travel`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950 via-brand-navy-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <Badge variant="verified" showIcon className="bg-white/95 backdrop-blur-md shadow-sm text-xs font-semibold">
            {pkg.destination.name}, {pkg.destination.countryName}
          </Badge>

          <div className="flex items-center gap-1.5">
            <span className="rounded-full bg-brand-navy-950/85 px-3 py-1 text-xs font-bold text-brand-gold-300 backdrop-blur-md border border-brand-gold-500/30">
              {pkg.durationText}
            </span>
            <WishlistButton packageId={pkg.id} size="sm" />
          </div>
        </div>

        {/* Image Source & License Tag on Hover */}
        <div className="absolute bottom-2 right-3 z-10 hidden group-hover:block transition-all">
          <span className="rounded bg-black/60 px-2 py-0.5 text-xs text-slate-300 backdrop-blur-sm">
            {heroImage.license}
          </span>
        </div>
      </div>

      {/* Package Content */}
      <CardContent className="p-5 sm:p-6 flex-1 space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-gold-600 block mb-1">
            {pkg.travelStyle}
          </span>
          <h3 className="font-heading text-lg sm:text-xl font-bold text-brand-navy-900 leading-snug group-hover:text-brand-gold-600 transition-colors">
            {pkg.name}
          </h3>
        </div>

        {/* Verified Hotels Snippet */}
        {pkg.hotels && pkg.hotels.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <Building2 className="h-4 w-4 text-brand-navy-800 shrink-0" />
            <span className="truncate">
              <strong>Stay:</strong> {pkg.hotels[0].hotelName} ({pkg.hotels[0].starRating}★)
            </span>
          </div>
        )}

        {/* Highlights Checklist */}
        <div className="space-y-1.5 pt-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Verified Highlights:
          </p>
          <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
            {pkg.highlights.slice(0, 3).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-emerald-600 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Logistics Chips */}
        <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-3 text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <PlaneTakeoff className="h-4 w-4 text-brand-teal-600 shrink-0" />
            <span className="truncate">{pkg.departureCity}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Utensils className="h-4 w-4 text-brand-gold-600 shrink-0" />
            <span className="truncate">{pkg.mealPlan}</span>
          </div>
        </div>

        {/* Verified Inventory Source Badge */}
        <div className="rounded-lg bg-brand-emerald-50/80 border border-brand-emerald-200/80 p-2.5 text-xs text-brand-emerald-900 flex items-center gap-1.5 font-medium">
          <ShieldCheck className="h-4 w-4 text-brand-emerald-600 shrink-0" />
          <span className="truncate">
            Verified Partner: {pkg.source.licenseRef}
          </span>
        </div>
      </CardContent>

      {/* Pricing & CTA Footer */}
      <CardFooter className="p-5 sm:p-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-auto bg-slate-50/40">
        <div>
          {/* Explicit Distinction: "Starting from" vs "Final Price" */}
          <span className="text-xs uppercase font-bold tracking-wider text-slate-500 block">
            {isStartingPrice ? "Starting from" : "Final Price"}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-heading text-xl sm:text-2xl font-extrabold text-brand-navy-900">
              {formatCurrency(pkg.startingPrice, pkg.currency)}
            </span>
            <span className="text-xs text-slate-600 font-medium">/ person</span>
          </div>
        </div>

        <Link href={`/holidays/${pkg.slug}`}>
          <Button
            size="sm"
            variant="luxury"
            className="text-xs sm:text-sm font-semibold shadow-luxury-sm"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
