"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { SearchModal } from "./search-modal";
import { AuthModal } from "./auth-modal";
import { MobileNav } from "./mobile-nav";
import { CallbackModal } from "@/components/enquiry/callback-modal";
import { FontSizeAdjuster } from "@/components/common/font-size-adjuster";
import { WhatsAppHeaderBox, WhatsAppTopBarPill } from "@/components/common/whatsapp-box";
import {
  Search,
  Heart,
  User,
  Menu,
  ChevronDown,
  PhoneCall,
  ShieldCheck,
  Compass,
  LogOut,
  Calendar,
  Settings,
  MessageSquare,
  Maximize,
  Minimize,
} from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isAuthOpen, setIsAuthOpen] = React.useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);
  const [isCallbackOpen, setIsCallbackOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<any | null>(null);
  const [wishlistCount, setWishlistCount] = React.useState(0);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  // Active mega menu state on hover
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);

  React.useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => { });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => { });
        setIsFullscreen(false);
      }
    }
  };

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setCurrentUser(data.user);
            setWishlistCount(data.counts?.wishlist || 0);
          }
        }
      } catch (err) {
        console.error("Auth me error:", err);
      }
    };
    fetchUser();

    const handleWishlistUpdated = (e: any) => {
      if (typeof e.detail?.count === "number") {
        setWishlistCount(e.detail.count);
      }
    };

    window.addEventListener("sah:wishlist-updated", handleWishlistUpdated);
    return () => window.removeEventListener("sah:wishlist-updated", handleWishlistUpdated);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
      setWishlistCount(0);
      setIsUserMenuOpen(false);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut: Cmd+K / Ctrl+K opens search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full font-sans transition-all duration-300">
        {/* Top Micro-Bar for Trust, Regulatory Transparency & Helpline */}
        <div className="hidden border-b border-brand-navy-900 bg-brand-navy-950 py-1.5 text-xs text-slate-300 sm:block w-full">
          <div className="section-container flex items-center justify-between">
            {/* Left: Verified Helpline & Callback Request */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-slate-300">
                <PhoneCall className="h-3.5 w-3.5 text-brand-gold-400 shrink-0" />
                <span className="font-semibold text-white">Helpline:</span>
                <a href="tel:+9779825284434" className="hover:text-brand-gold-400 text-slate-200 transition-colors">
                  +977 9825284434
                </a>
                <span className="text-slate-600">/</span>
                <a href="tel:+919263028848" className="hover:text-brand-gold-400 text-slate-200 transition-colors">
                  +91 9263028848
                </a>
              </div>
              <WhatsAppTopBarPill />
              <button
                type="button"
                onClick={() => setIsCallbackOpen(true)}
                className="text-xs font-semibold text-brand-gold-400 hover:text-brand-gold-300 underline underline-offset-2 transition-colors cursor-pointer"
              >
                Request a Callback
              </button>
              <span className="text-slate-600">|</span>
              <span className="text-[11px] text-slate-400">
                {siteConfig.contact.hours}
              </span>
            </div>

            {/* Right: Refined luxury travel badge & Currency */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Compass className="h-3.5 w-3.5 text-brand-gold-400" />
                <span className="text-[11px] font-medium">
                  Thoughtfully Planned Journeys Worldwide
                </span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-1 text-[11px] text-slate-300">
                <span className="font-semibold text-brand-gold-400">INR</span>
                <span>(₹)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div
          className={cn(
            "w-full border-b transition-all duration-200 bg-white/95 backdrop-blur-md",
            isScrolled
              ? "border-slate-200/90 shadow-luxury-md py-2.5"
              : "border-slate-200/60 shadow-luxury-sm py-3.5"
          )}
        >
          <div className="section-container flex items-center justify-between">
            {/* Brand Logo */}
            <Logo size="md" />

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {siteConfig.mainNav.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isActive = pathname === item.href;

                if (hasChildren) {
                  return (
                    <div
                      key={item.title}
                      className="relative group"
                      onMouseEnter={() => setActiveMenu(item.title)}
                      onMouseLeave={() => setActiveMenu(null)}
                    >
                      <button
                        type="button"
                        className={cn(
                          "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                          activeMenu === item.title
                            ? "text-brand-gold-600 bg-brand-gold-50/50"
                            : "text-slate-700 hover:text-brand-navy-900 hover:bg-slate-50"
                        )}
                      >
                        <span>{item.title}</span>
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 transition-transform duration-200",
                            activeMenu === item.title && "rotate-180 text-brand-gold-600"
                          )}
                        />
                      </button>

                      {/* Mega-Menu Dropdown Panel */}
                      {activeMenu === item.title && (
                        <div className="absolute left-0 top-full pt-2 w-[480px] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-luxury-lg">
                            <div className="mb-2 pb-2 border-b border-slate-100 flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                {item.description}
                              </span>
                              <Link
                                href={item.href}
                                className="text-xs font-semibold text-brand-gold-600 hover:underline"
                              >
                                View All
                              </Link>
                            </div>
                            <div className="grid grid-cols-1 gap-1">
                              {item.children?.map((child) => (
                                <Link
                                  key={child.title}
                                  href={child.href}
                                  className="group/item flex items-start gap-3 rounded-xl p-2.5 hover:bg-slate-50 transition-colors"
                                >
                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-navy-50 text-brand-navy-800 group-hover/item:bg-brand-gold-50 group-hover/item:text-brand-gold-700 transition-colors mt-0.5">
                                    <Compass className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="text-xs font-bold text-slate-800 group-hover/item:text-brand-navy-900">
                                        {child.title}
                                      </p>
                                      {child.isFeatured && (
                                        <span className="rounded-full bg-brand-gold-100 px-1.5 py-0.2 text-[9px] font-bold text-brand-gold-700">
                                          Popular
                                        </span>
                                      )}
                                    </div>
                                    {child.description && (
                                      <p className="text-[11px] text-slate-500 leading-snug">
                                        {child.description}
                                      </p>
                                    )}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                      isActive
                        ? "text-brand-navy-950 font-bold bg-slate-100"
                        : "text-slate-700 hover:text-brand-navy-900 hover:bg-slate-50"
                    )}
                  >
                    <span>{item.title}</span>
                    {item.badge && (
                      <span className="rounded-full bg-brand-gold-100 px-1.5 py-0.5 text-[10px] font-bold text-brand-gold-700">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Utility Actions (Search, Wishlist, Login) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Trigger Button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search destinations"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs font-medium text-slate-600 hover:border-slate-300 hover:bg-white hover:text-brand-navy-900 transition-all shadow-xs"
              >
                <Search className="h-4 w-4 text-brand-gold-500" />
                <span className="hidden md:inline">Search holidays...</span>
                <kbd className="hidden lg:inline rounded bg-slate-200/70 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                  ⌘K
                </kbd>
              </button>

              {/* Request Callback Trigger Button */}
              <button
                type="button"
                onClick={() => setIsCallbackOpen(true)}
                className="hidden xl:flex items-center gap-1.5 rounded-xl border border-brand-gold-400/30 bg-brand-gold-50/50 px-3 py-2 text-xs font-bold text-brand-navy-900 hover:bg-brand-gold-100/70 transition-colors shadow-xs"
              >
                <PhoneCall className="h-3.5 w-3.5 text-brand-gold-600" />
                <span>Request Callback</span>
              </button>

              {/* WhatsApp Quick Box */}
              <WhatsAppHeaderBox className="hidden lg:flex" />

              {/* Wishlist Action */}
              <Link
                href="/account?tab=wishlist"
                aria-label="Saved Packages Wishlist"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-600 hover:border-brand-navy-900/30 hover:bg-slate-50 hover:text-brand-navy-900 transition-colors shadow-xs"
              >
                <Heart className="h-4 w-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-gold-500 text-[10px] font-bold text-white shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Font Size & Visibility Adjuster */}
              <FontSizeAdjuster />

              {/* Fullscreen Mode Action */}
              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen Mode"}
                title={isFullscreen ? "Exit Full Screen" : "Full Screen View"}
                className="hidden sm:flex relative h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-600 hover:border-brand-navy-900/30 hover:bg-slate-50 hover:text-brand-navy-900 transition-colors shadow-xs cursor-pointer"
              >
                {isFullscreen ? (
                  <Minimize className="h-4 w-4 text-brand-gold-600" />
                ) : (
                  <Maximize className="h-4 w-4" />
                )}
              </button>

              {/* Plan Your Trip CTA Button */}
              <Link href="/contact" className="hidden sm:inline-flex">
                <Button variant="luxury" size="sm" className="h-9 px-4 text-xs font-semibold shadow-xs">
                  Plan Your Trip
                </Button>
              </Link>

              {/* User Account / Login Action */}
              {currentUser ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 shadow-xs"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        currentUser.image ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                      }
                      alt={currentUser.name}
                      className="h-6 w-6 rounded-full object-cover border border-brand-gold-400"
                    />
                    <span className="hidden sm:inline max-w-[90px] truncate">
                      {currentUser.name.split(" ")[0]}
                    </span>
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-luxury-lg z-50 animate-in fade-in duration-150">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {currentUser.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {currentUser.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <User className="h-3.5 w-3.5 text-brand-gold-600" />
                          <span>My Travel Portal</span>
                        </Link>
                        <Link
                          href="/account?tab=bookings"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <Calendar className="h-3.5 w-3.5 text-brand-teal-600" />
                          <span>My Bookings</span>
                        </Link>
                        <Link
                          href="/account?tab=wishlist"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <Heart className="h-3.5 w-3.5 text-rose-500" />
                          <span>Saved Wishlist ({wishlistCount})</span>
                        </Link>
                        <Link
                          href="/account?tab=enquiries"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <MessageSquare className="h-3.5 w-3.5 text-purple-600" />
                          <span>My Enquiries</span>
                        </Link>
                        <Link
                          href="/account?tab=profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <Settings className="h-3.5 w-3.5 text-slate-500" />
                          <span>Profile Settings</span>
                        </Link>
                      </div>
                      <div className="border-t border-slate-100 pt-1">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => setIsAuthOpen(true)}
                  leftIcon={<User className="h-3.5 w-3.5 text-brand-gold-400" />}
                  className="hidden sm:inline-flex text-xs font-semibold"
                >
                  Sign In
                </Button>
              )}

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(true)}
                aria-label="Open mobile navigation menu"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Interactive Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <CallbackModal
        isOpen={isCallbackOpen}
        onClose={() => setIsCallbackOpen(false)}
      />
    </>
  );
}
