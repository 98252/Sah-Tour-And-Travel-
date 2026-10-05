"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import {
  PhoneCall,
  User,
  Phone,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Headphones,
} from "lucide-react";

export interface CallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDestination?: string;
}

const CALLBACK_TIMES = [
  "Immediate (Next 15-30 mins)",
  "Morning (09:00 AM – 12:00 PM IST)",
  "Afternoon (12:00 PM – 04:00 PM IST)",
  "Evening (04:00 PM – 08:00 PM IST)",
];

export function CallbackModal({
  isOpen,
  onClose,
  defaultDestination = "",
}: CallbackModalProps) {
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [destination, setDestination] = React.useState(defaultDestination);
  const [preferredTime, setPreferredTime] = React.useState(CALLBACK_TIMES[0]);
  const [message, setMessage] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successRef, setSuccessRef] = React.useState<string | null>(null);

  // Auto-fill logged in user
  React.useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessRef(null);
      if (defaultDestination) setDestination(defaultDestination);

      fetch("/api/auth/me")
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            if (!name && data.user.name) setName(data.user.name);
            if (!phone && data.user.phone) setPhone(data.user.phone);
          }
        })
        .catch(() => {});
    }
  }, [isOpen, defaultDestination]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please provide your name.");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/callbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          destination,
          preferredCallbackTime: preferredTime,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to schedule callback.");
      }

      setSuccessRef(data.referenceNo);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request a Counselor Callback"
      description="Connect directly with an accredited Sah travel expert at your convenient hour."
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Configurable Official Company Helpline Details (Zero Fake Data) */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-brand-navy-950">
            <Headphones className="h-4 w-4 text-brand-gold-600" />
            <span>Direct Support Desk (Configured Line):</span>
          </div>
          <p className="text-slate-700 font-medium">{siteConfig.contact.helpline}</p>
          <div className="flex flex-wrap items-center gap-x-3 text-[11px] text-slate-500 pt-0.5">
            <span>Hours: {siteConfig.contact.hours}</span>
            <span>•</span>
            <span>{siteConfig.contact.email}</span>
          </div>
        </div>

        {successRef ? (
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-lg font-bold text-slate-900">
                Callback Successfully Scheduled!
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Your request has been prioritized under Reference ID:
              </p>
              <p className="font-mono text-base font-extrabold text-brand-navy-950">
                {successRef}
              </p>
              <p className="text-[11px] text-slate-500 pt-1">
                Our counselor will dial <strong>{phone}</strong> around <strong>{preferredTime}</strong>.
              </p>
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={onClose}
              className="mt-2 text-xs font-bold"
            >
              Done & Continue Browsing
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-800 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Your Full Name"
              required
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="h-4 w-4" />}
            />

            <Input
              label="Phone Number"
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<Phone className="h-4 w-4" />}
            />

            <Input
              label="Destination / Holiday of Interest"
              placeholder="e.g. Switzerland, Dubai, Kerala, Maldives..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              leftIcon={<MapPin className="h-4 w-4" />}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Preferred Callback Time Slot
              </label>
              <div className="relative flex items-center">
                <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
                  <Clock className="h-4 w-4" />
                </div>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3.5 py-2 text-xs text-slate-900 shadow-xs focus:border-brand-navy-900 focus:ring-2 focus:ring-brand-gold-500/50"
                >
                  {CALLBACK_TIMES.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Any specific question? (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Want to enquire about visa processing time and child discounts"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 shadow-xs focus:border-brand-navy-900 focus:ring-2 focus:ring-brand-gold-500/50"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="luxury"
                size="sm"
                disabled={isLoading}
                className="text-xs font-bold"
                leftIcon={<PhoneCall className="h-3.5 w-3.5" />}
              >
                {isLoading ? "Scheduling..." : "Confirm Callback Request"}
              </Button>
            </div>

            <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-emerald-600" />
              <span>Strict Anti-Spam Policy. Verified Travel Desk Contact Only.</span>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
