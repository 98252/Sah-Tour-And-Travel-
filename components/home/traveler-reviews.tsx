import * as React from "react";
import Link from "next/link";
import { Star, Quote, MessageSquare } from "lucide-react";

interface ReviewItem {
  id: string;
  rating: number;
  title: string;
  comment: string;
  authorName: string;
  authorCountry?: string;
  packageName?: string;
  packageSlug?: string;
  isVerified?: boolean;
}

interface TravelerReviewsProps {
  reviews: ReviewItem[];
}

export function TravelerReviews({ reviews }: TravelerReviewsProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <section className="py-16 bg-white text-center border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-md">
          <MessageSquare className="h-8 w-8 text-brand-gold-500 mx-auto mb-3 opacity-60" />
          <h3 className="font-serif text-xl font-normal text-slate-800">
            Customer stories coming soon.
          </h3>
          <p className="text-xs text-slate-500 font-light mt-1">
            Real guest reflections are published following verified trip completion.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-18 sm:py-26 bg-white text-slate-900 border-t border-slate-100">
      <div className="section-container">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-14 sm:mb-18">
          <span className="text-xs font-bold tracking-widest uppercase text-brand-gold-600 block mb-2">
            Guest Experiences
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-brand-navy-950">
            Stories from our Travelers
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-light leading-relaxed">
            Real impressions from travelers who have explored the world with Sah Tour And Travel.
          </p>
        </div>

        {/* Reviews Presentation */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="relative rounded-3xl border border-slate-200/80 bg-slate-50/60 p-8 sm:p-10 shadow-luxury-sm hover:shadow-luxury-md transition-all duration-300 flex flex-col justify-between"
            >
              <Quote className="absolute top-6 right-6 h-10 w-10 text-slate-200 -scale-x-100 pointer-events-none" />

              <div className="space-y-4">
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 text-brand-gold-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < rev.rating ? "fill-brand-gold-400 text-brand-gold-400" : "text-slate-300"
                        }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-1.5">{rev.rating}.0</span>
                </div>

                <h3 className="font-serif text-lg font-normal text-brand-navy-950 leading-snug">
                  &ldquo;{rev.title}&rdquo;
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                  {rev.comment}
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-6 mt-6 border-t border-slate-200/70 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-brand-navy-950">{rev.authorName}</h4>
                  <p className="text-[11px] text-slate-400 font-light">
                    {rev.authorCountry || "India"}
                  </p>
                </div>

                {rev.packageName && (
                  <div className="text-right max-w-[180px]">
                    <span className="text-[11px] text-brand-gold-600 font-medium block truncate">
                      {rev.packageName}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
