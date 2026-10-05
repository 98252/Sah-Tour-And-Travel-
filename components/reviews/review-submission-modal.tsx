"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Star, X, ShieldCheck, CheckCircle2, AlertCircle, Camera } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ReviewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageId: string;
  packageName: string;
  eligibleBooking?: {
    bookingId: string;
    bookingReference: string;
    travelDate: string;
  };
  onSuccess?: () => void;
}

export function ReviewSubmissionModal({
  isOpen,
  onClose,
  packageId,
  packageName,
  eligibleBooking,
  onSuccess,
}: ReviewSubmissionModalProps) {
  const [rating, setRating] = React.useState<number>(5);
  const [hoverRating, setHoverRating] = React.useState<number>(0);
  const [title, setTitle] = React.useState<string>("");
  const [comment, setComment] = React.useState<string>("");
  const [photoUrl, setPhotoUrl] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (comment.trim().length < 10) {
      setErrorMsg("Please write at least 10 characters describing your tour experience.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId,
          bookingId: eligibleBooking?.bookingId,
          rating,
          title: title.trim() || "Verified Tour Experience",
          comment: comment.trim(),
          photoUrl: photoUrl.trim() || undefined,
          travelDate: eligibleBooking?.travelDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review.");
      }

      setSuccessMsg(
        "Thank you! Your verified review has been submitted for moderation. It will be published publicly upon quality desk verification."
      );
      if (onSuccess) onSuccess();

      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Verified Customer Review</span>
            </div>
            <h3 className="font-heading text-base font-bold text-brand-navy-950 mt-0.5">
              Review: {packageName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Verification Context */}
        {eligibleBooking && (
          <div className="px-6 py-2.5 bg-emerald-50/50 border-b border-emerald-100 text-xs flex flex-wrap items-center justify-between gap-2 text-emerald-900">
            <span>
              Booking: <strong>{eligibleBooking.bookingReference}</strong>
            </span>
            <span>
              Traveled: <strong>{formatDate(eligibleBooking.travelDate)}</strong>
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Rating Selection */}
          <div className="space-y-1.5 text-center sm:text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Overall Tour Rating
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`h-7 w-7 ${
                        filled
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-200"
                      }`}
                    />
                  </button>
                );
              })}
              <span className="ml-2 font-heading font-bold text-sm text-slate-700">
                {rating} of 5 Stars
              </span>
            </div>
          </div>

          {/* Review Title */}
          <Input
            label="Review Title"
            placeholder="e.g. Unforgettable Swiss Alps Family Journey"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Review Comment Body */}
          <div className="space-y-1.5 text-xs">
            <label className="text-slate-700 font-bold block">
              Your Authentic Experience *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Tell fellow travelers about the itinerary pace, hotel standards, transport coordination, and key highlights..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-gold-500 focus:border-brand-gold-500 resize-none"
            />
            <p className="text-[10px] text-slate-400">Minimum 10 characters required.</p>
          </div>

          {/* Optional Photo URL */}
          <div className="space-y-1.5 text-xs">
            <label className="text-slate-700 font-bold flex items-center gap-1.5">
              <Camera className="h-3.5 w-3.5 text-brand-gold-600" />
              <span>Travel Photo (Optional)</span>
            </label>
            <Input
              placeholder="https://example.com/your-holiday-photo.jpg"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
          </div>

          {/* Moderation Policy Notice */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1">
            <span className="font-bold text-brand-navy-900 block">
              Editorial Moderation Notice
            </span>
            <p>
              To safeguard travel trust, all customer submissions are audited against our verified booking registry and held in <strong>Pending</strong> moderation before appearing publicly.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end items-center gap-3 pt-2 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="luxury" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Verified Review"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
