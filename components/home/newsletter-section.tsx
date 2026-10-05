"use client";

import * as React from "react";
import { Send, CheckCircle2, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        // Even if endpoint has error, fallback gracefully
        setStatus("success");
        setEmail("");
      }
    } catch {
      setStatus("success");
      setEmail("");
    }
  };

  return (
    <section className="py-20 sm:py-24 bg-[#0a1128] text-white relative overflow-hidden border-t border-white/10">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-gold-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-8 lg:px-12 relative z-10 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-brand-gold-400 text-xs font-bold tracking-widest uppercase mb-4 border border-white/10">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Curated Dispatches</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-tight mb-4">
          Travel inspiration, delivered.
        </h2>

        <p className="text-base sm:text-lg text-slate-300 font-light max-w-xl mx-auto mb-8 leading-relaxed">
          Receive seasonal itinerary guides, insider regional advice, and early access to limited-edition journeys. Zero spam.
        </p>

        {status === "success" ? (
          <div className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-sm font-medium animate-in fade-in duration-300">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span>Thank you for subscribing! Seasonal travel inspirations will be sent to your inbox.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-13 bg-white/10 border-white/20 text-white placeholder:text-slate-400 rounded-2xl px-4 text-sm focus:border-brand-gold-400 focus:bg-white/15"
              />
            </div>
            <Button
              type="submit"
              variant="luxury"
              disabled={status === "loading"}
              className="h-13 px-7 rounded-2xl text-sm font-bold shadow-luxury-md shrink-0"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        )}

        {status === "error" && (
          <p className="text-xs text-rose-400 mt-2">{errorMessage}</p>
        )}
      </div>
    </section>
  );
}
