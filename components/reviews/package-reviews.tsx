"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ReviewSubmissionModal } from "./review-submission-modal";
import { formatDate } from "@/lib/utils";
import {
  Star,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  User,
  Plus,
} from "lucide-react";

interface PackageReviewsProps {
  packageId: string;
  packageName: string;
}

export function PackageReviews({ packageId, packageName }: PackageReviewsProps) {
  const [reviews, setReviews] = React.useState<any[]>([]);
  const [totalCount, setTotalCount] = React.useState<number>(0);
  const [averageRating, setAverageRating] = React.useState<number | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // Eligibility state for logged-in user
  const [eligibility, setEligibility] = React.useState<{
    eligible: boolean;
    eligibleBookings: any[];
    message: string;
  } | null>(null);

  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch only APPROVED reviews for this package (no fake testimonials)
      const res = await fetch(`/api/reviews?packageId=${packageId}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews || []);
        setTotalCount(data.totalCount || 0);
        setAverageRating(data.averageRating);
      }

      // 2. Check if current user is eligible to write a review
      const eligRes = await fetch(`/api/reviews/eligibility?packageId=${packageId}`);
      const eligData = await eligRes.json();
      if (eligData.success) {
        setEligibility(eligData);
      }
    } catch (e) {
      console.error("Failed to load package reviews:", e);
    } finally {
      setIsLoading(false);
    }
  }, [packageId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <section className="space-y-6">
      {/* Header & Score Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-600">
              Verified Feedback
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">
              Completed Journeys Only
            </span>
          </div>
          <h2 className="font-heading text-2xl font-bold text-brand-navy-950 mt-1">
            Traveler Ratings & Reviews
          </h2>
        </div>

        {/* Action Button: Visible when user has an eligible completed booking */}
        {eligibility?.eligible && (
          <Button
            variant="luxury"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Star className="h-3.5 w-3.5" />}
            className="text-xs font-bold"
          >
            Write Verified Review
          </Button>
        )}
      </div>

      {/* APPROPRIATE EMPTY STATE: When no genuine approved reviews exist */}
      {totalCount === 0 && !isLoading && (
        <Card className="border border-slate-200 bg-white p-8 sm:p-12 text-center rounded-3xl shadow-luxury-sm space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-2">
            <ShieldCheck className="h-7 w-7" />
          </div>

          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="font-heading text-lg font-bold text-brand-navy-950">
              No Traveler Reviews Published Yet
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Reviews on Sah Tour And Travel are strictly verified. Only customers who have completed verified travel on this tour itinerary may share feedback. We never display fake ratings or unverified testimonials.
            </p>
          </div>

          <div className="pt-2">
            {eligibility?.eligible ? (
              <Button
                variant="luxury"
                size="sm"
                onClick={() => setIsModalOpen(true)}
                leftIcon={<Plus className="h-3.5 w-3.5" />}
              >
                Be The First To Review This Tour
              </Button>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                Review submissions open following tour departure
              </span>
            )}
          </div>
        </Card>
      )}

      {/* APPROVED REVIEWS LIST */}
      {totalCount > 0 && (
        <div className="space-y-6">
          {/* Average Rating Banner */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-brand-gold-500 text-brand-navy-950 flex flex-col items-center justify-center font-heading font-black shadow-md">
                <span className="text-2xl leading-none">{averageRating}</span>
                <span className="text-[10px] uppercase font-bold tracking-tighter">out of 5</span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        averageRating && i < Math.round(averageRating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-600"
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-slate-300 ml-2">
                    {totalCount} Verified {totalCount === 1 ? "Review" : "Reviews"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  100% genuine feedback audited from completed customer bookings.
                </p>
              </div>
            </div>

            {eligibility?.eligible && (
              <Button
                variant="luxury"
                size="sm"
                onClick={() => setIsModalOpen(true)}
                className="text-xs font-bold"
              >
                Share Your Experience
              </Button>
            )}
          </div>

          {/* Individual Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <Card
                key={rev.id}
                className="border border-slate-200 bg-white p-5 rounded-2xl shadow-luxury-xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < rev.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200"
                          }`}
                        />
                      ))}
                      <span className="text-xs font-bold text-slate-800 ml-1.5">
                        {rev.rating}.0
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 block mt-0.5">
                      {rev.authorName} ({rev.authorCountry})
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="h-3 w-3 text-emerald-600" />
                    Verified Traveler
                  </span>
                </div>

                <h4 className="font-heading text-sm font-bold text-brand-navy-950">
                  {rev.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {rev.comment}
                </p>

                {rev.photoUrl && (
                  <div className="pt-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rev.photoUrl}
                      alt={rev.title}
                      className="h-28 w-44 rounded-xl object-cover border border-slate-200 shadow-xs"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                  {rev.travelDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Traveled: {formatDate(rev.travelDate)}</span>
                    </span>
                  )}
                  <span>Reviewed: {formatDate(rev.createdAt)}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Review Submission Modal */}
      {eligibility?.eligible && (
        <ReviewSubmissionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          packageId={packageId}
          packageName={packageName}
          eligibleBooking={eligibility.eligibleBookings[0]}
          onSuccess={loadData}
        />
      )}
    </section>
  );
}
