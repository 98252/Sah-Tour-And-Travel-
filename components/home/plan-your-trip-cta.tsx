"use client";

import * as React from "react";
import Link from "next/link";
import { PhoneCall, MessageCircle, ArrowRight, Sparkles, MapPin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PlanYourTripCTA() {
  return (
    <section id="plan-trip" className="py-20 sm:py-28 bg-brand-navy-950 text-white relative overflow-hidden">
      {/* Background Subtle Ambient Lighting */}
      <div className="absolute -top-32 right-10 h-96 w-96 rounded-full bg-brand-gold-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-10 h-96 w-96 rounded-full bg-brand-teal-500/10 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto rounded-3xl bg-white/5 border border-white/10 p-8 sm:p-14 lg:p-16 backdrop-blur-xl text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold-500/15 border border-brand-gold-400/30 text-brand-gold-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Bespoke Itinerary Planning</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-tight">
              Have a journey in mind?
            </h2>

            <p className="text-base sm:text-lg text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
              Tell us where you want to go, and we&apos;ll help you plan the journey.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact">
              <Button
                variant="luxury"
                size="lg"
                className="h-13 px-8 text-sm sm:text-base font-semibold shadow-luxury-md"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Plan My Trip
              </Button>
            </Link>

            <a
              href="https://wa.me/9779825284434"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-13 px-7 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm sm:text-base transition-colors shadow-md"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp Us (+977 9825284434)</span>
            </a>
          </div>

          {/* Direct Specialist Contacts Bar */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="flex items-center justify-center gap-2">
              <PhoneCall className="h-4 w-4 text-brand-gold-400 shrink-0" />
              <span>
                Helpline:{" "}
                <a href="tel:+9779825284434" className="hover:text-white font-medium">
                  +977 9825284434
                </a>{" "}
                /{" "}
                <a href="tel:+919263028848" className="hover:text-white font-medium">
                  +91 9263028848
                </a>
              </span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Mail className="h-4 w-4 text-brand-gold-400 shrink-0" />
              <a href="mailto:sahr67568@gmail.com" className="hover:text-white font-medium">
                sahr67568@gmail.com
              </a>
            </div>

            <div className="flex items-center justify-center gap-2">
              <MapPin className="h-4 w-4 text-brand-gold-400 shrink-0" />
              <span>Birgunj Parsa, Nepal</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
