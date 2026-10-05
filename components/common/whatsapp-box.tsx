"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const WHATSAPP_NUMBER = "9825284434";
export const WHATSAPP_FULL_NUMBER = "+9779825284434";
export const WHATSAPP_LINK = `https://wa.me/9779825284434?text=Hi%20Sah%20Tour%20and%20Travel%2C%20I%20would%20like%20to%20plan%20a%20holiday%20journey.`;

export function WhatsAppIcon({ className = "w-4 h-4", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413z" />
    </svg>
  );
}

/**
 * Top/Header WhatsApp Box
 */
export function WhatsAppHeaderBox({ className }: { className?: string }) {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Sah Tour and Travel on WhatsApp: 9825284434"
      className={cn(
        "group flex items-center gap-2 rounded-xl bg-emerald-500/10 hover:bg-[#25D366] border border-emerald-500/30 px-3 py-1.5 transition-all shadow-xs hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer text-emerald-900 hover:text-white",
        className
      )}
    >
      <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-[#25D366] text-white shadow-xs group-hover:bg-white group-hover:text-[#25D366] transition-colors shrink-0">
        <WhatsAppIcon className="h-4 w-4 fill-current" />
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
      </div>
      <div className="flex flex-col text-left leading-tight">
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 group-hover:text-emerald-100 transition-colors">
          WhatsApp
        </span>
        <span className="text-xs font-extrabold text-slate-900 group-hover:text-white tracking-wide transition-colors">
          {WHATSAPP_NUMBER}
        </span>
      </div>
    </a>
  );
}

/**
 * Top Micro-Bar Pill
 */
export function WhatsAppTopBarPill({ className }: { className?: string }) {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1.5 bg-[#25D366]/20 hover:bg-[#25D366] text-emerald-300 hover:text-white px-2.5 py-0.5 rounded-full border border-[#25D366]/40 text-xs font-bold transition-all shadow-xs cursor-pointer",
        className
      )}
    >
      <WhatsAppIcon className="w-3.5 h-3.5 fill-current text-[#25D366] group-hover:text-white" />
      <span>WhatsApp: {WHATSAPP_NUMBER}</span>
    </a>
  );
}

/**
 * Footer / Pre-Footer High Visibility WhatsApp Box
 */
export function WhatsAppFooterBox({ className }: { className?: string }) {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Direct WhatsApp Contact: 9825284434"
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-[#0d2a1b] to-brand-navy-950 border border-emerald-500/40 hover:border-emerald-400 hover:shadow-[0_10px_35px_rgba(37,211,102,0.25)] transition-all group cursor-pointer shadow-xl",
        className
      )}
    >
      <div className="flex items-center gap-3.5 text-center sm:text-left">
        <div className="relative h-12 w-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform shrink-0">
          <WhatsAppIcon className="w-7 h-7 fill-white" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-200" />
          </span>
        </div>
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Official WhatsApp Desk
            </span>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
              Online 24/7
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">
            {WHATSAPP_FULL_NUMBER}
          </div>
          <p className="text-xs text-slate-300">
            Instant Custom Itineraries, Live Seat Quotes &amp; Visa Assistance
          </p>
        </div>
      </div>

      <div className="px-5 py-2.5 rounded-xl bg-[#25D366] group-hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-md group-hover:scale-105 shrink-0">
        <span>Chat on WhatsApp</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </a>
  );
}

/**
 * Floating WhatsApp Action Bubble (Always Accessible at the Bottom/Last)
 */
export function WhatsAppFloatingBox() {
  return (
    <aside
      aria-label="WhatsApp quick contact"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 group"
    >
      {/* Tooltip Pill */}
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Support: 9825284434"
        className="hidden md:flex items-center gap-2 bg-slate-950/90 text-white backdrop-blur-md px-3.5 py-2 rounded-full border border-emerald-500/40 shadow-2xl transition-all duration-300 hover:border-emerald-400 group-hover:scale-105"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-xs font-semibold text-slate-200">Chat with us:</span>
        <span className="text-xs font-bold text-emerald-400">{WHATSAPP_NUMBER}</span>
      </a>

      {/* Floating Action Button */}
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open WhatsApp: 9825284434"
        title="Chat on WhatsApp (9825284434)"
        className="relative flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-[0_8px_30px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
      >
        <WhatsAppIcon className="h-7 w-7 sm:h-8 sm:w-8 fill-white" />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white border-2 border-[#25D366]" />
        </span>
      </a>
    </aside>
  );
}
