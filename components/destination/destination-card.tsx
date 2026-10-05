import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  ShieldCheck,
  ArrowRight,
  Compass,
} from "lucide-react";

export interface DestinationCardProps {
  destination: {
    id: string;
    name: string;
    slug: string;
    shortDescription: string;
    heroImage: string;
    heroImageSource: string;
    heroImageLicense: string;
    bestTimeToVisit: string;
    recommendedDuration: string;
    travelStyle: string;
    country: {
      name: string;
      slug: string;
    };
    region: {
      name: string;
      slug: string;
    };
    primarySource?: {
      sourceName: string;
      sourceUrl: string;
    } | null;
    attractions?: { id: string; name: string }[];
  };
}

export function DestinationCard({ destination }: DestinationCardProps) {
  const detailUrl = `/destinations/${destination.country.slug}/${destination.slug}`;
  const packagesUrl = `/packages?dest=${destination.slug}`;

  return (
    <Card hoverEffect className="flex flex-col group h-full">
      {/* Visual Header / Hero Media */}
      <div className="relative h-60 w-full overflow-hidden bg-slate-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={destination.heroImage}
          alt={`${destination.name}, ${destination.country.name} - Sah Tour And Travel`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950 via-brand-navy-950/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <Badge variant="verified" showIcon className="bg-white/95 backdrop-blur-md shadow-sm">
            {destination.country.name}
          </Badge>

          <span className="rounded-full bg-brand-navy-950/80 px-2.5 py-1 text-[10px] font-semibold text-brand-gold-300 backdrop-blur-md border border-brand-gold-500/30">
            {destination.region.name}
          </span>
        </div>

        {/* Bottom Hero Info */}
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <h3 className="font-heading text-2xl font-extrabold text-white tracking-tight drop-shadow-md">
            {destination.name}
          </h3>
          <p className="text-[11px] font-medium text-brand-gold-300 flex items-center gap-1.5 mt-0.5">
            <Compass className="h-3 w-3" />
            <span>{destination.travelStyle}</span>
          </p>
        </div>

        {/* Image Source & License Tag */}
        <div className="absolute top-3 right-3 hidden group-hover:block transition-all">
          <span
            title={`Source: ${destination.heroImageSource} (${destination.heroImageLicense})`}
            className="rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-slate-300 backdrop-blur-sm"
          >
            {destination.heroImageLicense}
          </span>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-5 flex-1 space-y-4">
        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
          {destination.shortDescription}
        </p>

        {/* Key Logistics Chips */}
        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Calendar className="h-3.5 w-3.5 text-brand-gold-600 shrink-0" />
            <span className="truncate">{destination.bestTimeToVisit.split("(")[0]}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Clock className="h-3.5 w-3.5 text-brand-teal-600 shrink-0" />
            <span>{destination.recommendedDuration}</span>
          </div>
        </div>

        {/* Official Tourism Board Verification Citation */}
        {destination.primarySource && (
          <div className="rounded-xl border border-brand-emerald-500/20 bg-brand-emerald-50/60 p-2.5 text-[11px] text-brand-emerald-800 flex items-start gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-emerald-600 shrink-0 mt-0.5" />
            <div className="truncate">
              <span className="font-semibold block text-[10px] uppercase tracking-wider text-brand-emerald-900">
                Official Tourism Authority
              </span>
              <span className="truncate block font-medium">
                {destination.primarySource.sourceName}
              </span>
            </div>
          </div>
        )}
      </CardContent>

      {/* Card Actions */}
      <CardFooter className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 mt-auto">
        <Link href={packagesUrl} className="flex-1">
          <Button variant="outline" size="sm" className="w-full text-xs">
            Holidays
          </Button>
        </Link>
        <Link href={detailUrl} className="flex-1">
          <Button
            variant="default"
            size="sm"
            className="w-full text-xs font-semibold"
            rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
          >
            Explore Guide
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
