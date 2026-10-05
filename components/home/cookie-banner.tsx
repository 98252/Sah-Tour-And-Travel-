"use client";

import * as React from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CookieBanner() {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    // Check localStorage
    const consent = localStorage.getItem("sah_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("sah_cookie_consent", "accepted");
    setIsVisible(false);
  };

  const handlePreferences = () => {
    localStorage.setItem("sah_cookie_consent", "essential_only");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie consent banner"
      className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100%-3rem)] rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-2xl bg-brand-gold-50 text-brand-gold-600 flex items-center justify-center shrink-0 mt-0.5">
            <Cookie className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-brand-navy-950 uppercase tracking-wider mb-1">
              Privacy & Cookies
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-light">
              We use necessary cookies and anonymous telemetry to ensure a seamless holiday planning
              experience. Review our{" "}
              <Link
                href="/legal/cookie-policy"
                className="text-brand-gold-600 underline underline-offset-2 hover:text-brand-gold-700 font-normal"
              >
                Cookie Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/legal/privacy-policy"
                className="text-brand-gold-600 underline underline-offset-2 hover:text-brand-gold-700 font-normal"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          aria-label="Dismiss cookie notice"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={handlePreferences}
          className="text-xs font-semibold text-slate-500 hover:text-brand-navy-900 px-3 py-1.5 transition-colors"
        >
          Manage Preferences
        </button>
        <Button
          type="button"
          variant="luxury"
          size="sm"
          onClick={handleAccept}
          className="rounded-xl px-4 py-1.5 text-xs font-bold"
        >
          Accept All
        </Button>
      </div>
    </aside>
  );
}
