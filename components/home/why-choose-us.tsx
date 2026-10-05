import * as React from "react";
import { Compass, Sparkles, Headphones, Shield, UserCheck } from "lucide-react";

const PILLARS = [
  {
    icon: Compass,
    title: "Personalized Travel Planning",
    description:
      "Every itinerary is thoughtfully shaped around your pace, preferences, and style. We tailor private transfers, panoramic rail connections, and bespoke local excursions.",
  },
  {
    icon: UserCheck,
    title: "Direct Founder Accountability",
    description:
      "Founded and personally directed by Rahul Kumar Sah, ensuring personal integrity, responsive communication, and direct responsibility for every booking.",
  },
  {
    icon: Shield,
    title: "Vetted Stays & Verified Allotments",
    description:
      "Confirmed reservations with accredited 4★ & 5★ luxury hoteliers, private island villas, and licensed Destination Management Companies across Asia, Europe, and the Middle East.",
  },
  {
    icon: Headphones,
    title: "Dedicated On-Trip Concierge Support",
    description:
      "Accessible human travel counselors reachable before, during, and after your trip. Never deal with confusing automated bots during active travel days.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-18 sm:py-26 bg-[#fbfbf9] text-slate-900 border-t border-slate-200/60">
      <div className="section-container">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 text-brand-gold-600 text-xs font-bold tracking-widest uppercase mb-3">
            <Sparkles className="h-4 w-4" />
            <span>The Sah Standard</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-brand-navy-950 leading-tight">
            Why Sah Tour And Travel
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-light leading-relaxed">
            Authentic travel curation built on direct personal accountability, confirmed stays, and thoughtful pacing.
          </p>
        </div>

        {/* 4 Clean Value Proposition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {PILLARS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl bg-white p-8 border border-slate-200/80 shadow-luxury-sm hover:shadow-luxury-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-brand-gold-50 text-brand-gold-600 flex items-center justify-center mb-6">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-xl font-normal text-brand-navy-950 mb-3 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
