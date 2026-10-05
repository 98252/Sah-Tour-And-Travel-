"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/common/logo";
import {
  X,
  ChevronDown,
  Search,
  Heart,
  User,
  PhoneCall,
} from "lucide-react";
import { FontSizeAdjuster } from "@/components/common/font-size-adjuster";
import { WhatsAppIcon, WHATSAPP_LINK, WHATSAPP_NUMBER } from "@/components/common/whatsapp-box";

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
  onOpenAuth: () => void;
}

export function MobileNav({
  isOpen,
  onClose,
  onOpenSearch,
  onOpenAuth,
}: MobileNavProps) {
  const [openAccordions, setOpenAccordions] = React.useState<Record<string, boolean>>({
    Holidays: true,
  });
  const [user, setUser] = React.useState<any | null>(null);
  const [wishlistCount, setWishlistCount] = React.useState(0);

  React.useEffect(() => {
    if (isOpen) {
      fetch("/api/auth/me")
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
            setWishlistCount(data.counts?.wishlist || 0);
          } else {
            setUser(null);
            setWishlistCount(0);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  const toggleAccordion = (title: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-brand-navy-950/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-10 flex w-full max-w-sm flex-col bg-white shadow-2xl transition-transform animate-in slide-in-from-right duration-250">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <Logo size="sm" showTagline={false} />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
            className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-500 shadow-xs"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-brand-gold-500" />
              <span>Search destinations, packages...</span>
            </div>
            <span className="text-[10px] font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
              EXPLORE
            </span>
          </button>
        </div>

        {/* Navigation Items (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
          {siteConfig.mainNav.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = openAccordions[item.title];

            if (hasChildren) {
              return (
                <div key={item.title} className="rounded-xl border border-slate-100 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleAccordion(item.title)}
                    className="flex w-full items-center justify-between p-3.5 text-left text-sm font-bold text-brand-navy-900 hover:bg-slate-50 transition-colors"
                  >
                    <span>{item.title}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-slate-400 transition-transform duration-200",
                        isExpanded && "rotate-180 text-brand-gold-600"
                      )}
                    />
                  </button>

                  {isExpanded && (
                    <div className="bg-slate-50/70 p-2 space-y-1 border-t border-slate-100">
                      {item.children?.map((sub) => (
                        <Link
                          key={sub.title}
                          href={sub.href}
                          onClick={onClose}
                          className="flex flex-col rounded-lg p-2.5 hover:bg-white transition-colors"
                        >
                          <span className="text-xs font-semibold text-slate-800">
                            {sub.title}
                          </span>
                          {sub.description && (
                            <span className="text-[11px] text-slate-500 line-clamp-1">
                              {sub.description}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.title}
                href={item.href}
                onClick={onClose}
                className="flex items-center justify-between rounded-xl p-3.5 text-sm font-bold text-brand-navy-900 hover:bg-slate-50 transition-colors"
              >
                <span>{item.title}</span>
                {item.badge && (
                  <span className="rounded-full bg-brand-gold-50 px-2 py-0.5 text-[10px] font-semibold text-brand-gold-700 border border-brand-gold-200">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Utility Drawer Actions */}
        <div className="border-t border-slate-100 bg-slate-50/80 p-4 space-y-3">
          {/* Mobile Display Text Size Adjuster */}
          <FontSizeAdjuster variant="inline" />

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/account?tab=wishlist"
              onClick={onClose}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Heart className="h-4 w-4 text-brand-gold-500" />
              <span>Wishlist ({wishlistCount})</span>
            </Link>

            {user ? (
              <Link
                href="/account"
                onClick={onClose}
                className="flex items-center justify-center gap-2 rounded-xl bg-brand-navy-900 py-2.5 text-xs font-semibold text-white hover:bg-brand-navy-800 transition-colors"
              >
                <User className="h-4 w-4 text-brand-gold-400" />
                <span>My Portal</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-brand-navy-900 py-2.5 text-xs font-semibold text-white hover:bg-brand-navy-800 transition-colors"
              >
                <User className="h-4 w-4 text-brand-gold-400" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* WhatsApp Direct Chat Box */}
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-between p-3 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 hover:bg-[#25D366] text-emerald-950 hover:text-white transition-all shadow-xs group"
          >
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-[#25D366] text-white flex items-center justify-center shadow-xs group-hover:bg-white group-hover:text-[#25D366] transition-colors shrink-0">
                <WhatsAppIcon className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 group-hover:text-emerald-100">
                  Chat on WhatsApp
                </div>
                <div className="text-sm font-extrabold text-slate-900 group-hover:text-white">
                  {WHATSAPP_NUMBER}
                </div>
              </div>
            </div>
            <span className="text-xs font-bold text-[#25D366] group-hover:text-white flex items-center gap-1">
              Online
            </span>
          </a>

          {/* Customer Helpline Info */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-3 space-y-1 text-xs">
            <div className="flex items-center gap-2 font-semibold text-brand-navy-900">
              <PhoneCall className="h-3.5 w-3.5 text-brand-gold-500" />
              <span>Travel Desk Support</span>
            </div>
            <p className="text-[11px] text-slate-500">{siteConfig.contact.helpline}</p>
            <p className="text-[10px] text-slate-400">{siteConfig.contact.hours}</p>
            <Link
              href="/contact"
              onClick={onClose}
              className="mt-2 block w-full text-center rounded-lg bg-brand-gold-500 py-1.5 text-xs font-bold text-brand-navy-950 hover:bg-brand-gold-400 transition-colors"
            >
              Request Callback / Custom Enquiry
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
