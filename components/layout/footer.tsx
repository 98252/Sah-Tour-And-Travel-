"use client";

import * as React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/common/logo";
import { PhoneCall, Mail, MapPin, Clock, Compass } from "lucide-react";
import { WhatsAppFooterBox, WhatsAppIcon, WHATSAPP_LINK } from "@/components/common/whatsapp-box";

export function Footer() {
  return (
    <footer className="w-full bg-[#070d1e] text-slate-200 font-sans border-t border-slate-800/80">
      {/* Main Footer Navigation Grid */}
      <div className="section-container py-12 sm:py-16">
        {/* Prominent High-Visibility WhatsApp Contact Box at the Last */}
        <WhatsAppFooterBox className="mb-10 sm:mb-14" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Column 1: Brand & Founder (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Logo variant="light" size="md" />
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-sm">
              Thoughtfully planned journeys, unforgettable places, and bespoke experiences tailored with integrity.
            </p>

            {/* Founder Profile */}
            <div className="inline-flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="h-10 w-10 rounded-xl bg-brand-gold-500/20 text-brand-gold-400 flex items-center justify-center font-serif font-bold text-base border border-brand-gold-500/30">
                RS
              </div>
              <div>
                <p className="text-xs text-brand-gold-400 uppercase font-bold tracking-wider">
                  Founder &amp; Managing Director
                </p>
                <p className="text-sm font-bold text-white">
                  {siteConfig.founder}
                </p>
              </div>
            </div>

            <div className="pt-2 text-xs sm:text-sm text-slate-300 space-y-1">
              <p>Registered Operations: {siteConfig.contact.address}</p>
            </div>
          </div>

          {/* Column 2: Explore (3 cols) */}
          <div className="lg:col-span-2 sm:col-span-1 space-y-4">
            <h4 className="font-serif text-base font-bold text-white tracking-wider uppercase">
              Explore
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>
                <Link href="/destinations" className="hover:text-brand-gold-400 transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/packages" className="hover:text-brand-gold-400 transition-colors">
                  Journeys
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-brand-gold-400 transition-colors">
                  Exclusive Offers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-brand-gold-400 transition-colors">
                  Travel Inspiration
                </Link>
              </li>
              <li>
                <Link href="/packages/luxury-escapes" className="hover:text-brand-gold-400 transition-colors">
                  Luxury Escapes
                </Link>
              </li>
              <li>
                <Link href="/packages/honeymoon-packages" className="hover:text-brand-gold-400 transition-colors">
                  Honeymoon Specials
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company (2 cols) */}
          <div className="lg:col-span-2 sm:col-span-1 space-y-4">
            <h4 className="font-serif text-base font-bold text-white tracking-wider uppercase">
              Company
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>
                <Link href="/about-us" className="hover:text-brand-gold-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-gold-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="hover:text-brand-gold-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-brand-gold-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-brand-gold-400 transition-colors">
                  My Travel Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Direct Contact & Support (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-serif text-base font-bold text-white tracking-wider uppercase">
              Support &amp; Direct Contact
            </h4>
            <div className="space-y-3.5 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <PhoneCall className="h-5 w-5 text-brand-gold-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-semibold">Direct Helpline &amp; WhatsApp</p>
                  <div className="flex flex-col gap-1.5 mt-1">
                    <a
                      href={WHATSAPP_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-bold"
                    >
                      <WhatsAppIcon className="w-4 h-4 fill-current text-[#25D366]" />
                      <span>WhatsApp: 9825284434</span>
                    </a>
                    <a
                      href="tel:+9779825284434"
                      className="text-sm text-slate-200 hover:text-brand-gold-400 transition-colors font-medium"
                    >
                      +977 9825284434 (Nepal Desk)
                    </a>
                    <a
                      href="tel:+919263028848"
                      className="text-sm text-slate-200 hover:text-brand-gold-400 transition-colors font-medium"
                    >
                      +91 9263028848 (India Desk)
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-brand-gold-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-semibold">Direct Email</p>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-sm text-slate-200 hover:text-brand-gold-400 transition-colors font-medium"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-brand-gold-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-semibold">Operating Hours</p>
                  <p className="text-sm text-slate-300">{siteConfig.contact.hours}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-brand-gold-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-semibold">Head Office</p>
                  <p className="text-sm text-slate-300">{siteConfig.contact.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-white/10 bg-black/40 py-6 text-xs sm:text-sm text-slate-400">
        <div className="section-container flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left font-medium">
          <p>© {new Date().getFullYear()} Sah Tour And Travel. All rights reserved.</p>

          <p className="text-slate-300">
            Crafted for extraordinary world journeys.
          </p>
        </div>
      </div>
    </footer>
  );
}
