"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  User,
  Calendar,
  Heart,
  MessageSquare,
  CreditCard,
  Star,
  Bell,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Trash2,
  Send,
  Download,
  Phone,
  Globe,
  Sparkles,
  PlaneTakeoff,
  Plus,
  RefreshCw,
  Clock,
  HelpCircle,
  X,
  MapPin,
  Users,
  Camera,
} from "lucide-react";
import { ReviewSubmissionModal } from "@/components/reviews/review-submission-modal";

export type DashboardTab =
  | "profile"
  | "bookings"
  | "wishlist"
  | "enquiries"
  | "payments"
  | "reviews"
  | "notifications";

interface AccountDashboardClientProps {
  initialData: {
    profile: any;
    bookings: any[];
    wishlist: any[];
    enquiries: any[];
    payments: any[];
    reviews: any[];
    notifications: any[];
    stats: {
      totalBookings: number;
      totalWishlist: number;
      totalEnquiries: number;
      totalPayments: number;
      unreadNotifications: number;
    };
  };
}

const PRESET_AVATARS = [
  {
    name: "Luxury Jetsetter",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Alpine Explorer",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Coastal Voyager",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Heritage Wanderer",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
  },
];

const PREFERENCE_TAGS = [
  "Luxury Escorted Tour",
  "Beach & Island Retreat",
  "Alpine Scenic Rail",
  "Cultural Heritage",
  "Honeymoon & Romantic",
  "Family Adventure",
  "Wildlife Safari",
];

const LANGUAGES = [
  "English",
  "Hindi",
  "Bengali",
  "Tamil",
  "Telugu",
  "French",
  "German",
  "Arabic",
];

export function AccountDashboardClient({ initialData }: AccountDashboardClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTabQuery = (searchParams.get("tab") as DashboardTab) || "profile";

  const [activeTab, setActiveTab] = React.useState<DashboardTab>(activeTabQuery);

  // Data states
  const [profile, setProfile] = React.useState(initialData.profile);
  const [bookings, setBookings] = React.useState(initialData.bookings);
  const [wishlist, setWishlist] = React.useState(initialData.wishlist);
  const [enquiries, setEnquiries] = React.useState(initialData.enquiries);
  const [payments, setPayments] = React.useState(initialData.payments);
  const [reviews, setReviews] = React.useState(initialData.reviews);
  const [notifications, setNotifications] = React.useState(initialData.notifications);
  const [stats, setStats] = React.useState(initialData.stats);

  // Form states for Profile
  const [name, setName] = React.useState(profile?.name || "");
  const [phone, setPhone] = React.useState(profile?.phone || "");
  const [country, setCountry] = React.useState(profile?.country || "India");
  const [avatarUrl, setAvatarUrl] = React.useState(profile?.image || PRESET_AVATARS[0].url);
  const [language, setLanguage] = React.useState(profile?.preferredLanguage || "English");
  const [preferences, setPreferences] = React.useState<string[]>(
    profile?.travelPreferences
      ? profile.travelPreferences.split(",").map((s: string) => s.trim())
      : ["Luxury Escorted Tour", "Alpine Scenic Rail"]
  );

  const [profileSaving, setProfileSaving] = React.useState(false);
  const [profileStatus, setProfileStatus] = React.useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Modals
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = React.useState(false);
  const [enquiryName, setEnquiryName] = React.useState(profile?.name || "");
  const [enquiryEmail, setEnquiryEmail] = React.useState(profile?.email || "");
  const [enquiryPhone, setEnquiryPhone] = React.useState(profile?.phone || "");
  const [enquiryDestination, setEnquiryDestination] = React.useState("Switzerland & The Alps");
  const [enquiryDate, setEnquiryDate] = React.useState("");
  const [enquiryTravelers, setEnquiryTravelers] = React.useState(2);
  const [enquiryBudget, setEnquiryBudget] = React.useState("₹75,000 – ₹1,50,000 / person");
  const [enquiryTravelType, setEnquiryTravelType] = React.useState("Family Vacation");
  const [enquiryMessage, setEnquiryMessage] = React.useState("");
  const [enquirySubmitting, setEnquirySubmitting] = React.useState(false);

  const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = React.useState<any | null>(null);

  // Eligible bookings for review (Completed status or Confirmed+Paid with past travel date)
  const eligibleBookings = React.useMemo(() => {
    return bookings.filter((b: any) => {
      const isPast = b.travelDate ? new Date(b.travelDate).getTime() < Date.now() : false;
      const isCompleted =
        b.status === "Completed" || (b.status === "Confirmed" && b.paymentStatus === "PAID" && isPast);
      return isCompleted;
    });
  }, [bookings]);

  const handleOpenReviewModal = (booking?: any) => {
    if (booking) {
      setSelectedBookingForReview(booking);
    } else if (eligibleBookings.length > 0) {
      setSelectedBookingForReview(eligibleBookings[0]);
    }
    setIsReviewModalOpen(true);
  };

  const handleReviewSuccess = async () => {
    setIsReviewModalOpen(false);
    setSelectedBookingForReview(null);
    try {
      const res = await fetch("/api/user/reviews");
      if (res.ok) {
        const data = await res.json();
        if (data.reviews) {
          setReviews(data.reviews);
        }
      }
    } catch (err) {
      console.error("Failed to refresh customer reviews:", err);
    }
  };

  const [activeVoucherBooking, setActiveVoucherBooking] = React.useState<any | null>(null);

  // Sync tab with URL
  React.useEffect(() => {
    if (activeTabQuery && activeTabQuery !== activeTab) {
      setActiveTab(activeTabQuery);
    }
  }, [activeTabQuery]);

  const changeTab = (tab: DashboardTab) => {
    setActiveTab(tab);
    router.push(`/account?tab=${tab}`, { scroll: false });
  };

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth/login");
      router.refresh();
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  // Profile save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileStatus(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          country,
          image: avatarUrl,
          preferredLanguage: language,
          travelPreferences: preferences,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile.");
      }

      setProfile(data.user);
      setProfileStatus({ type: "success", msg: "Profile updated successfully!" });
      setTimeout(() => setProfileStatus(null), 4000);
    } catch (err: any) {
      setProfileStatus({ type: "error", msg: err.message || "Failed to save profile." });
    } finally {
      setProfileSaving(false);
    }
  };

  // Toggle Preference Tag
  const togglePref = (tag: string) => {
    setPreferences((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Remove Wishlist Item
  const handleRemoveWishlist = async (packageId: string) => {
    const prevList = [...wishlist];
    setWishlist((prev) => prev.filter((p) => p.id !== packageId));
    setStats((prev) => ({ ...prev, totalWishlist: Math.max(0, prev.totalWishlist - 1) }));

    try {
      const res = await fetch(`/api/wishlist?packageId=${packageId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setWishlist(prevList);
      }
    } catch {
      setWishlist(prevList);
    }
  };

  // Submit Enquiry
  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnquirySubmitting(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: enquiryName.trim() || profile?.name || "Traveler",
          email: enquiryEmail.trim() || profile?.email || "customer@sahtour.com",
          phone: enquiryPhone.trim() || profile?.phone || "+91 98765 43210",
          destination: enquiryDestination,
          travelDate: enquiryDate || null,
          travelersCount: enquiryTravelers,
          budgetRange: enquiryBudget,
          travelType: enquiryTravelType,
          message: enquiryMessage,
        }),
      });
      const data = await res.json();
      if (res.ok && data.enquiry) {
        setEnquiries([data.enquiry, ...enquiries]);
        setStats((prev) => ({ ...prev, totalEnquiries: prev.totalEnquiries + 1 }));
        setIsEnquiryModalOpen(false);
        setEnquiryMessage("");
      } else {
        alert(data.error || "Failed to submit enquiry.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEnquirySubmitting(false);
    }
  };



  // Mark all notifications as read
  const handleMarkAllNotifications = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setStats((prev) => ({ ...prev, unreadNotifications: 0 }));
    try {
      await fetch("/api/user/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllAsRead: true }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          {/* Top Profile Summary Banner */}
          <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-r from-brand-navy-950 via-brand-navy-900 to-brand-navy-800 p-6 sm:p-8 text-white shadow-luxury-lg mb-8 relative overflow-hidden">
            {/* Ambient Background Accents */}
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-gold-500/10 blur-3xl" />
            <div className="absolute right-32 bottom-0 h-40 w-40 rounded-full bg-brand-teal-500/10 blur-2xl" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile?.image || PRESET_AVATARS[0].url}
                    alt={profile?.name || "Customer Avatar"}
                    className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover border-2 border-brand-gold-400 shadow-luxury-md"
                  />
                  {profile?.emailVerified && (
                    <div
                      title="Verified Customer Account"
                      className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-brand-emerald-500 text-white shadow-sm ring-2 ring-brand-navy-950"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight">
                      {profile?.name || "Traveler"}
                    </h1>
                    <span className="rounded-full bg-brand-gold-500/20 px-2.5 py-0.5 text-xs font-bold text-brand-gold-300 border border-brand-gold-400/40">
                      {profile?.role === "ADMIN" ? "Administrator" : "Sah Elite Explorer"}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2">
                    <span>{profile?.email}</span>
                    {profile?.country && (
                      <>
                        <span className="text-slate-500">•</span>
                        <span>{profile.country}</span>
                      </>
                    )}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-brand-emerald-400 font-medium">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {profile?.emailVerified ? "Email & Phone Verified" : "Verification Pending"}
                    </span>
                    <span>•</span>
                    <span>Member since {formatDate(profile?.createdAt || new Date())}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 self-start md:self-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="border-slate-700 bg-brand-navy-900/80 text-slate-200 hover:bg-slate-800 hover:text-white text-xs font-medium"
                  leftIcon={<LogOut className="h-3.5 w-3.5" />}
                >
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Quick Stat Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-white/10">
              <div
                onClick={() => changeTab("wishlist")}
                className="cursor-pointer rounded-2xl bg-white/5 hover:bg-white/10 p-3.5 transition-colors border border-white/5"
              >
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span>Saved Packages</span>
                  <Heart className="h-4 w-4 text-rose-400" />
                </div>
                <p className="text-2xl font-bold font-heading text-white">{stats.totalWishlist}</p>
              </div>

              <div
                onClick={() => changeTab("bookings")}
                className="cursor-pointer rounded-2xl bg-white/5 hover:bg-white/10 p-3.5 transition-colors border border-white/5"
              >
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span>Bookings</span>
                  <Calendar className="h-4 w-4 text-brand-gold-400" />
                </div>
                <p className="text-2xl font-bold font-heading text-white">{stats.totalBookings}</p>
              </div>

              <div
                onClick={() => changeTab("enquiries")}
                className="cursor-pointer rounded-2xl bg-white/5 hover:bg-white/10 p-3.5 transition-colors border border-white/5"
              >
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span>Enquiries</span>
                  <MessageSquare className="h-4 w-4 text-brand-teal-400" />
                </div>
                <p className="text-2xl font-bold font-heading text-white">{stats.totalEnquiries}</p>
              </div>

              <div
                onClick={() => changeTab("notifications")}
                className="cursor-pointer rounded-2xl bg-white/5 hover:bg-white/10 p-3.5 transition-colors border border-white/5"
              >
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span>Notifications</span>
                  <Bell className="h-4 w-4 text-amber-400" />
                </div>
                <p className="text-2xl font-bold font-heading text-white">
                  {stats.unreadNotifications}
                </p>
              </div>
            </div>
          </div>

          {/* Main Dashboard Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3">
              <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-3 shadow-luxury-sm space-y-1">
                <button
                  type="button"
                  onClick={() => changeTab("profile")}
                  className={`w-full flex items-center justify-between rounded-xl px-3.5 py-3 text-xs font-semibold transition-all ${
                    activeTab === "profile"
                      ? "bg-brand-navy-900 text-white shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <User className="h-4 w-4" />
                    <span>Profile Details</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => changeTab("bookings")}
                  className={`w-full flex items-center justify-between rounded-xl px-3.5 py-3 text-xs font-semibold transition-all ${
                    activeTab === "bookings"
                      ? "bg-brand-navy-900 text-white shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className="h-4 w-4" />
                    <span>My Bookings</span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      activeTab === "bookings"
                        ? "bg-brand-gold-500 text-brand-navy-950"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {bookings.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => changeTab("wishlist")}
                  className={`w-full flex items-center justify-between rounded-xl px-3.5 py-3 text-xs font-semibold transition-all ${
                    activeTab === "wishlist"
                      ? "bg-brand-navy-900 text-white shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Heart className="h-4 w-4" />
                    <span>Saved Wishlist</span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      activeTab === "wishlist"
                        ? "bg-brand-gold-500 text-brand-navy-950"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {wishlist.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => changeTab("enquiries")}
                  className={`w-full flex items-center justify-between rounded-xl px-3.5 py-3 text-xs font-semibold transition-all ${
                    activeTab === "enquiries"
                      ? "bg-brand-navy-900 text-white shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="h-4 w-4" />
                    <span>Travel Enquiries</span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      activeTab === "enquiries"
                        ? "bg-brand-gold-500 text-brand-navy-950"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {enquiries.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => changeTab("payments")}
                  className={`w-full flex items-center justify-between rounded-xl px-3.5 py-3 text-xs font-semibold transition-all ${
                    activeTab === "payments"
                      ? "bg-brand-navy-900 text-white shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="h-4 w-4" />
                    <span>Payments & Invoices</span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      activeTab === "payments"
                        ? "bg-brand-gold-500 text-brand-navy-950"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {payments.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => changeTab("reviews")}
                  className={`w-full flex items-center justify-between rounded-xl px-3.5 py-3 text-xs font-semibold transition-all ${
                    activeTab === "reviews"
                      ? "bg-brand-navy-900 text-white shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Star className="h-4 w-4" />
                    <span>My Tour Reviews</span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      activeTab === "reviews"
                        ? "bg-brand-gold-500 text-brand-navy-950"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {reviews.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => changeTab("notifications")}
                  className={`w-full flex items-center justify-between rounded-xl px-3.5 py-3 text-xs font-semibold transition-all ${
                    activeTab === "notifications"
                      ? "bg-brand-navy-900 text-white shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Bell className="h-4 w-4" />
                    <span>Travel Alerts</span>
                  </div>
                  {stats.unreadNotifications > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                      {stats.unreadNotifications}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-9 space-y-6">
              {/* ==================================================== */}
              {/* 1. PROFILE SECTION */}
              {/* ==================================================== */}
              {activeTab === "profile" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <Card className="border border-slate-200 shadow-luxury-sm bg-white">
                    <CardHeader className="border-b border-slate-100 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="font-heading text-xl font-bold text-brand-navy-900">
                            Customer Profile Information
                          </h2>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Manage personal identity, contact channels, and customized travel preferences.
                          </p>
                        </div>
                        <Badge variant="verified">Official Customer Account</Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 sm:p-8 space-y-6">
                      {profileStatus && (
                        <div
                          className={`rounded-xl p-4 text-xs font-medium flex items-center gap-3 ${
                            profileStatus.type === "success"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-rose-50 text-rose-800 border border-rose-200"
                          }`}
                        >
                          {profileStatus.type === "success" ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                          )}
                          <span>{profileStatus.msg}</span>
                        </div>
                      )}

                      <form onSubmit={handleSaveProfile} className="space-y-6">
                        {/* Avatar Picker */}
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                            Choose Your Travel Persona Avatar
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {PRESET_AVATARS.map((av) => (
                              <button
                                key={av.name}
                                type="button"
                                onClick={() => setAvatarUrl(av.url)}
                                className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                                  avatarUrl === av.url
                                    ? "border-brand-gold-500 bg-brand-gold-50/50 ring-2 ring-brand-gold-400"
                                    : "border-slate-200 hover:bg-slate-50"
                                }`}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={av.url}
                                  alt={av.name}
                                  className="h-9 w-9 rounded-lg object-cover"
                                />
                                <span className="text-[11px] font-semibold text-slate-800 leading-tight">
                                  {av.name}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Name and Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input
                            label="Full Name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            leftIcon={<User className="h-4 w-4" />}
                          />

                          <div className="w-full space-y-1.5">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                              Registered Email Address
                            </label>
                            <div className="relative flex items-center">
                              <input
                                disabled
                                value={profile?.email || ""}
                                className="flex h-11 w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-sm text-slate-500 cursor-not-allowed"
                              />
                              <span className="absolute right-3 text-[10px] font-bold text-slate-400 bg-slate-200/80 px-2 py-0.5 rounded">
                                Protected
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Phone and Country */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input
                            label="Contact Phone"
                            placeholder="+91 98765 43210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            leftIcon={<Phone className="h-4 w-4" />}
                          />

                          <div className="w-full space-y-1.5">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                              Country of Residence
                            </label>
                            <div className="relative flex items-center">
                              <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
                                <Globe className="h-4 w-4" />
                              </div>
                              <select
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="flex h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-brand-navy-900 focus:ring-2 focus:ring-brand-gold-500/50"
                              >
                                <option value="India">India</option>
                                <option value="United Arab Emirates">United Arab Emirates</option>
                                <option value="Singapore">Singapore</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="United States">United States</option>
                                <option value="Switzerland">Switzerland</option>
                                <option value="Australia">Australia</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Preferred Language */}
                        <div className="w-full space-y-1.5">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                            Preferred Language for Communication & Vouchers
                          </label>
                          <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-brand-navy-900 focus:ring-2 focus:ring-brand-gold-500/50"
                          >
                            {LANGUAGES.map((l) => (
                              <option key={l} value={l}>
                                {l}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Travel Preferences */}
                        <div className="space-y-2 pt-2">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                            Holiday & Travel Preferences
                          </label>
                          <p className="text-xs text-slate-500 mb-2">
                            Select the experiences you enjoy. We personalize recommended packages and seasonal deals based on these tags.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {PREFERENCE_TAGS.map((tag) => {
                              const isSel = preferences.includes(tag);
                              return (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() => togglePref(tag)}
                                  className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all border ${
                                    isSel
                                      ? "bg-brand-navy-900 text-white border-brand-navy-900 shadow-xs"
                                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                                  }`}
                                >
                                  {isSel ? "✓ " : "+ "}
                                  {tag}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Strict Privacy & Security Note */}
                        <div className="rounded-xl border border-brand-gold-200 bg-brand-gold-50/60 p-4 text-xs text-slate-700 leading-relaxed flex items-start gap-3">
                          <ShieldCheck className="h-5 w-5 text-brand-gold-600 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-brand-navy-950 font-bold block mb-0.5">
                              Customer Data Minimization Guarantee:
                            </strong>
                            Sah Tour And Travel strictly collects only essential holiday logistics information. We do not store sensitive payment card details, government identification, or biometric records.
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                          <Button
                            type="submit"
                            variant="default"
                            disabled={profileSaving}
                            className="px-6 h-11 text-xs font-bold shadow-luxury-sm"
                          >
                            {profileSaving ? "Saving Updates..." : "Save Profile Changes"}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ==================================================== */}
              {/* 2. BOOKINGS SECTION */}
              {/* ==================================================== */}
              {activeTab === "bookings" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-heading text-xl font-bold text-brand-navy-900">
                        Booked Tour Itineraries & Vouchers
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Access confirmed allotments, flight timings, hotel vouchers, and day-by-day schedules.
                      </p>
                    </div>
                    <Link href="/holidays">
                      <Button size="sm" variant="outline" className="text-xs">
                        Browse More Holidays
                      </Button>
                    </Link>
                  </div>

                  {bookings.length === 0 ? (
                    <Card className="p-12 text-center border-dashed border-slate-300">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-navy-50 text-brand-navy-800 mb-3">
                        <Calendar className="h-7 w-7" />
                      </div>
                      <h3 className="font-heading text-lg font-bold text-brand-navy-900">
                        No Bookings Found Yet
                      </h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
                        You do not have any active or past tour bookings. Explore our verified international and domestic itineraries to start your journey.
                      </p>
                      <Link href="/holidays">
                        <Button variant="luxury" size="sm">
                          Explore Holiday Packages
                        </Button>
                      </Link>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((booking) => {
                        const pkg = booking.package;
                        const hero = pkg.images?.[0]?.url || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80";

                        return (
                          <Card
                            key={booking.id}
                            className="border border-slate-200 overflow-hidden shadow-luxury-sm hover:border-brand-gold-500/50 transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row">
                              {/* Thumbnail */}
                              <div className="sm:w-60 h-44 sm:h-auto relative bg-slate-900 shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={hero}
                                  alt={pkg.name}
                                  className="h-full w-full object-cover"
                                />
                                <div className="absolute top-3 left-3">
                                  <span
                                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-xs ${
                                      booking.status === "Confirmed" || booking.status === "CONFIRMED"
                                        ? "bg-emerald-500 text-white"
                                        : booking.status === "Payment Pending"
                                        ? "bg-amber-500 text-white"
                                        : booking.status === "Pending" || booking.status === "PENDING"
                                        ? "bg-blue-500 text-white"
                                        : booking.status === "Cancelled" || booking.status === "CANCELLED"
                                        ? "bg-rose-500 text-white"
                                        : booking.status === "Completed" || booking.status === "COMPLETED"
                                        ? "bg-slate-700 text-white"
                                        : "bg-slate-600 text-white"
                                    }`}
                                  >
                                    {booking.status}
                                  </span>
                                </div>
                              </div>

                              {/* Details */}
                              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                <div>
                                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 mb-1">
                                    <span className="font-mono font-bold text-brand-navy-950">
                                      Ref: {booking.bookingReference}
                                    </span>
                                    <span>
                                      Travel Date: <strong>{formatDate(booking.travelDate)}</strong>
                                    </span>
                                  </div>

                                  <h3 className="font-heading text-lg font-bold text-brand-navy-900">
                                    {pkg.name}
                                  </h3>

                                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2">
                                    <span>
                                      Travelers: <strong>{booking.travelersCount} Pax</strong>
                                    </span>
                                    <span>•</span>
                                    <span>
                                      Destination: <strong>{pkg.destination?.name}</strong>
                                    </span>
                                    <span>•</span>
                                    <span>
                                      Duration: <strong>{pkg.durationText}</strong>
                                    </span>
                                  </div>

                                  {booking.specialRequests && (
                                    <p className="text-[11px] text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                      <strong>Special Request:</strong> {booking.specialRequests}
                                    </p>
                                  )}
                                </div>

                                {/* Pricing & CTAs */}
                                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                                  <div>
                                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                                      Total Fare ({booking.currency || "INR"})
                                    </span>
                                    <span className="font-heading text-lg font-bold text-brand-navy-900">
                                      {formatCurrency(booking.totalAmount, booking.currency)}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Link href={`/book/confirmation/${booking.bookingReference}`}>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-xs"
                                        leftIcon={<Download className="h-3.5 w-3.5 text-brand-gold-600" />}
                                      >
                                        Digital Voucher
                                      </Button>
                                    </Link>

                                    <Link href={`/holidays/${pkg.slug}`}>
                                      <Button size="sm" variant="default" className="text-xs">
                                        View Itinerary
                                      </Button>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ==================================================== */}
              {/* 3. WISHLIST SECTION */}
              {/* ==================================================== */}
              {activeTab === "wishlist" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-heading text-xl font-bold text-brand-navy-900">
                        Saved Packages Wishlist ({wishlist.length})
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Your shortlisted dream vacations. Price changes and allotment availability are monitored live.
                      </p>
                    </div>
                    <Link href="/holidays">
                      <Button size="sm" variant="luxury" className="text-xs">
                        + Add More Packages
                      </Button>
                    </Link>
                  </div>

                  {wishlist.length === 0 ? (
                    <Card className="p-12 text-center border-dashed border-slate-300">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 mb-3">
                        <Heart className="h-7 w-7" />
                      </div>
                      <h3 className="font-heading text-lg font-bold text-brand-navy-900">
                        Your Wishlist is Empty
                      </h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
                        Browse our curated international and domestic holiday packages and click the heart icon to save them here for easy comparison.
                      </p>
                      <Link href="/holidays">
                        <Button variant="luxury" size="sm">
                          Browse Verified Holidays
                        </Button>
                      </Link>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {wishlist.map((pkg) => {
                        const hero = pkg.images?.[0]?.url || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80";

                        return (
                          <Card
                            key={pkg.id}
                            className="border border-slate-200 overflow-hidden shadow-luxury-sm flex flex-col group"
                          >
                            <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={hero}
                                alt={pkg.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950 via-transparent to-transparent" />

                              <div className="absolute top-3 left-3">
                                <Badge variant="verified" className="bg-white/95">
                                  {pkg.destination?.name}
                                </Badge>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveWishlist(pkg.id)}
                                title="Remove from wishlist"
                                className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-rose-600 hover:bg-rose-50 transition-colors shadow-sm"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>

                              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs text-white">
                                <span className="text-brand-gold-300 font-bold">
                                  {pkg.durationText}
                                </span>
                                <span className="text-[11px] text-slate-300">
                                  {pkg.travelStyle}
                                </span>
                              </div>
                            </div>

                            <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
                              <div>
                                <h3 className="font-heading text-base font-bold text-brand-navy-900 group-hover:text-brand-gold-600 transition-colors">
                                  {pkg.name}
                                </h3>
                                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                                  {pkg.shortDescription}
                                </p>
                              </div>

                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                <div>
                                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                                    Starting from
                                  </span>
                                  <span className="font-heading text-lg font-bold text-brand-navy-900">
                                    {formatCurrency(pkg.startingPrice, pkg.currency)}
                                  </span>
                                </div>

                                <Link href={`/holidays/${pkg.slug}`}>
                                  <Button size="sm" variant="default" className="text-xs">
                                    View Details
                                  </Button>
                                </Link>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ==================================================== */}
              {/* 4. ENQUIRIES SECTION */}
              {/* ==================================================== */}
              {activeTab === "enquiries" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-heading text-xl font-bold text-brand-navy-900">
                        Custom Itinerary Enquiries
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Track bespoke travel requests, hotel upgrades, and direct advice from Sah destination experts.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="luxury"
                      onClick={() => setIsEnquiryModalOpen(true)}
                      className="text-xs"
                      leftIcon={<Plus className="h-3.5 w-3.5" />}
                    >
                      New Travel Enquiry
                    </Button>
                  </div>

                  {enquiries.length === 0 ? (
                    <Card className="p-12 text-center border-dashed border-slate-300">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-teal-50 text-brand-teal-700 mb-3">
                        <MessageSquare className="h-7 w-7" />
                      </div>
                      <h3 className="font-heading text-lg font-bold text-brand-navy-900">
                        No Active Enquiries
                      </h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
                        Have special requests for flights, private rail upgrades, or tailored departures? Our team will formulate a bespoke quotation.
                      </p>
                      <Button
                        variant="luxury"
                        size="sm"
                        onClick={() => setIsEnquiryModalOpen(true)}
                      >
                        Submit Custom Enquiry
                      </Button>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {enquiries.map((enq) => {
                        // 6 exact Admin statuses: New, Contacted, In Progress, Quoted, Converted, Closed
                        const getStatusBadge = (status: string) => {
                          switch (status) {
                            case "New":
                              return "bg-blue-100 text-blue-800 border-blue-200";
                            case "Contacted":
                              return "bg-amber-100 text-amber-800 border-amber-200";
                            case "In Progress":
                              return "bg-purple-100 text-purple-800 border-purple-200";
                            case "Quoted":
                              return "bg-emerald-100 text-emerald-800 border-emerald-200";
                            case "Converted":
                              return "bg-teal-100 text-teal-800 border-teal-200";
                            case "Closed":
                              return "bg-slate-100 text-slate-700 border-slate-200";
                            default:
                              return "bg-slate-100 text-slate-700 border-slate-200";
                          }
                        };

                        return (
                          <Card key={enq.id} className="border border-slate-200 shadow-luxury-sm">
                            <CardContent className="p-5 space-y-3.5">
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-brand-navy-950">
                                    {enq.referenceNo}
                                  </span>
                                  <span
                                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${getStatusBadge(
                                      enq.status
                                    )}`}
                                  >
                                    {enq.status}
                                  </span>
                                  {enq.isCallback && (
                                    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                      Callback Request
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-slate-400">
                                  {formatDate(enq.createdAt)}
                                </span>
                              </div>

                              <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="font-heading text-base font-bold text-slate-900">
                                    {enq.destination}
                                  </h4>
                                  {enq.travelType && (
                                    <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                      {enq.travelType}
                                    </span>
                                  )}
                                </div>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                                  {enq.travelDate && (
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                      {formatDate(enq.travelDate)}
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1">
                                    <Users className="h-3.5 w-3.5 text-slate-400" />
                                    {enq.travelersCount} {enq.travelersCount === 1 ? "Traveller" : "Travellers"}
                                  </span>
                                  {enq.budgetRange && (
                                    <span className="flex items-center gap-1">
                                      <span className="font-semibold text-slate-700">Budget:</span>
                                      {enq.budgetRange}
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                                  {enq.message}
                                </p>
                              </div>

                              {/* Quoted Amount */}
                              {enq.quotedAmount && (
                                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs text-emerald-950 flex flex-wrap items-center justify-between gap-2">
                                  <div>
                                    <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-700 block">
                                      Official Quote Provided
                                    </span>
                                    <span className="text-base font-extrabold text-emerald-900 font-mono">
                                      ₹{Number(enq.quotedAmount).toLocaleString("en-IN")}
                                    </span>
                                  </div>
                                  <Link
                                    href="/contact"
                                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                                  >
                                    Accept & Proceed
                                  </Link>
                                </div>
                              )}

                              {/* Agent response note */}
                              {enq.agentNotes && (
                                <div className="rounded-xl border border-brand-gold-300 bg-brand-gold-50/80 p-3.5 text-xs text-slate-700 space-y-1">
                                  <div className="flex items-center gap-1.5 font-bold text-brand-navy-900 text-[11px] uppercase tracking-wider">
                                    <Sparkles className="h-3.5 w-3.5 text-brand-gold-600" />
                                    <span>Travel Concierge Specialist Note:</span>
                                  </div>
                                  <p className="leading-relaxed">{enq.agentNotes}</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ==================================================== */}
              {/* 5. PAYMENTS SECTION */}
              {/* ==================================================== */}
              {activeTab === "payments" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-brand-navy-900">
                      Payment History & Tax Invoices
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Verified GST receipts, secure gateway transaction logs, and transparent ledger entries.
                    </p>
                  </div>

                  {payments.length === 0 ? (
                    <Card className="p-12 text-center border-dashed border-slate-300">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-navy-50 text-brand-navy-800 mb-3">
                        <CreditCard className="h-7 w-7" />
                      </div>
                      <h3 className="font-heading text-lg font-bold text-brand-navy-900">
                        No Transactions Recorded
                      </h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                        When you book a holiday package, your encrypted payment receipts will appear here.
                      </p>
                    </Card>
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-luxury-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                            <tr>
                              <th className="px-5 py-3.5">Transaction ID</th>
                              <th className="px-5 py-3.5">Booking Ref</th>
                              <th className="px-5 py-3.5">Method</th>
                              <th className="px-5 py-3.5">Date</th>
                              <th className="px-5 py-3.5">Amount</th>
                              <th className="px-5 py-3.5">Status</th>
                              <th className="px-5 py-3.5 text-right">Invoice</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {payments.map((pay) => (
                              <tr key={pay.id} className="hover:bg-slate-50/70 transition-colors">
                                <td className="px-5 py-4 font-mono font-bold text-brand-navy-900">
                                  {pay.transactionId}
                                </td>
                                <td className="px-5 py-4 font-mono text-slate-600">
                                  {pay.booking?.bookingReference || "Direct Deposit"}
                                </td>
                                <td className="px-5 py-4 text-slate-700">{pay.paymentMethod}</td>
                                <td className="px-5 py-4 text-slate-500">{formatDate(pay.createdAt)}</td>
                                <td className="px-5 py-4 font-heading font-bold text-brand-navy-950">
                                  {formatCurrency(pay.amount, pay.currency)}
                                </td>
                                <td className="px-5 py-4">
                                  <span
                                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                      pay.status === "SUCCESS"
                                        ? "bg-emerald-100 text-emerald-800"
                                        : pay.status === "REFUNDED"
                                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                                        : pay.status === "FAILED"
                                        ? "bg-rose-100 text-rose-800 border border-rose-200"
                                        : "bg-slate-100 text-slate-700"
                                    }`}
                                  >
                                    {pay.status}
                                  </span>
                                  {pay.status === "REFUNDED" && pay.refundId && (
                                    <span className="block text-[9px] font-mono text-amber-700 mt-0.5">
                                      Ref: {pay.refundId}
                                    </span>
                                  )}
                                </td>
                                <td className="px-5 py-4 text-right">
                                  <button
                                    type="button"
                                    onClick={() => alert(`Receipt ${pay.transactionId} downloaded.`)}
                                    className="font-semibold text-brand-gold-600 hover:text-brand-gold-700 hover:underline"
                                  >
                                    Download PDF
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ==================================================== */}
              {/* 6. REVIEWS SECTION (Phase 12: Verified Reviews Only) */}
              {/* ==================================================== */}
              {activeTab === "reviews" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="font-heading text-xl font-bold text-brand-navy-900 flex items-center gap-2">
                        <span>Customer Tour Reviews</span>
                        <span className="rounded-full bg-brand-navy-100 text-brand-navy-800 text-[10px] font-bold px-2 py-0.5">
                          Verified Only
                        </span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Authentic feedback strictly from your completed holiday journeys. Moderated by Sah Tour & Travel before publishing.
                      </p>
                    </div>
                    {eligibleBookings.length > 0 && (
                      <Button
                        size="sm"
                        variant="luxury"
                        onClick={() => handleOpenReviewModal()}
                        className="text-xs shrink-0"
                        leftIcon={<Star className="h-3.5 w-3.5" />}
                      >
                        Write a Review
                      </Button>
                    )}
                  </div>

                  {/* Completed Journeys Eligible For Review */}
                  {eligibleBookings.length > 0 && (
                    <div className="rounded-2xl border border-brand-gold-500/30 bg-brand-gold-50/40 p-5 space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-brand-gold-600" />
                        <h3 className="font-heading text-sm font-bold text-brand-navy-950">
                          Completed Journeys Awaiting Your Verified Feedback
                        </h3>
                      </div>
                      <p className="text-xs text-slate-600">
                        You have traveled with us! Share your genuine experience regarding itinerary pacing, hotel standards, and certified tour guides.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {eligibleBookings.map((b: any) => (
                          <div
                            key={b.id}
                            className="rounded-xl border border-white/80 bg-white p-3.5 shadow-xs flex items-center justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <p className="font-heading text-xs font-bold text-brand-navy-900 truncate">
                                {b.package?.name || "Holiday Package Tour"}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                                <span>Ref: <strong>{b.bookingReference}</strong></span>
                                <span>•</span>
                                <span>Travel: {formatDate(b.travelDate)}</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="luxury"
                              className="text-[11px] h-8 shrink-0"
                              onClick={() => handleOpenReviewModal(b)}
                            >
                              Review Tour
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Customer's Submitted Reviews */}
                  <div className="space-y-3">
                    <h3 className="font-heading text-base font-bold text-brand-navy-900">
                      Your Submitted Reviews & Moderation Status
                    </h3>

                    {reviews.length === 0 ? (
                      <Card className="p-10 text-center border-dashed border-slate-300">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-3">
                          <Star className="h-7 w-7" />
                        </div>
                        <h4 className="font-heading text-base font-bold text-brand-navy-900">
                          No Reviews Submitted Yet
                        </h4>
                        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4 leading-relaxed">
                          {eligibleBookings.length > 0
                            ? "You have completed holiday journeys above ready for review. Choose a tour to write your authentic feedback."
                            : "In strict accordance with our verified review policy, only customers who have completed a booked journey can submit reviews. Once your holiday concludes, you will be able to submit your authentic feedback here."}
                        </p>
                        {eligibleBookings.length > 0 && (
                          <Button
                            variant="luxury"
                            size="sm"
                            onClick={() => handleOpenReviewModal()}
                          >
                            Review Your Completed Tour
                          </Button>
                        )}
                      </Card>
                    ) : (
                      <div className="space-y-4">
                        {reviews.map((rev: any) => {
                          const status = rev.status || "Pending";
                          return (
                            <Card key={rev.id} className="border border-slate-200 shadow-luxury-sm">
                              <CardContent className="p-5 space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                                  <div>
                                    <span className="text-[11px] font-bold text-brand-gold-600 uppercase">
                                      {rev.package?.name || rev.packageName || "Holiday Package Tour"}
                                    </span>
                                    <div className="flex items-center gap-1.5 mt-1">
                                      <div className="flex items-center gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                          <Star
                                            key={i}
                                            className={`h-3.5 w-3.5 ${
                                              i < rev.rating
                                                ? "fill-amber-400 text-amber-400"
                                                : "text-slate-200"
                                            }`}
                                          />
                                        ))}
                                      </div>
                                      <span className="text-xs font-bold text-slate-800 ml-1">
                                        {rev.rating}.0 / 5.0
                                      </span>
                                      {rev.travelDate && (
                                        <span className="text-[11px] text-slate-500 ml-2">
                                          • Traveled: {formatDate(rev.travelDate)}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    {/* Moderation Status Badges */}
                                    {status === "Approved" && (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2.5 py-1">
                                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                        Approved & Published
                                      </span>
                                    )}
                                    {status === "Pending" && (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-[10px] font-bold px-2.5 py-1">
                                        <Clock className="h-3 w-3 text-amber-600" />
                                        Pending Admin Moderation
                                      </span>
                                    )}
                                    {status === "Rejected" && (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-800 border border-rose-300 text-[10px] font-bold px-2.5 py-1">
                                        <AlertCircle className="h-3 w-3 text-rose-600" />
                                        Review Not Approved
                                      </span>
                                    )}
                                    <span className="text-xs text-slate-400">
                                      {formatDate(rev.createdAt)}
                                    </span>
                                  </div>
                                </div>

                                {rev.title && (
                                  <h4 className="font-heading text-sm font-bold text-brand-navy-950">
                                    {rev.title}
                                  </h4>
                                )}
                                <p className="text-xs text-slate-600 leading-relaxed">
                                  {rev.comment}
                                </p>

                                {rev.photoUrl && (
                                  <div className="pt-2">
                                    <div className="h-20 w-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={rev.photoUrl}
                                        alt="Tour verification photo"
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                  </div>
                                )}

                                {status === "Rejected" && rev.moderationNotes && (
                                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-900 space-y-0.5">
                                    <span className="font-bold">Moderator Notice:</span>
                                    <p className="text-[11px] text-rose-800 leading-relaxed">
                                      {rev.moderationNotes}
                                    </p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ==================================================== */}
              {/* 7. NOTIFICATIONS SECTION */}
              {/* ==================================================== */}
              {activeTab === "notifications" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-heading text-xl font-bold text-brand-navy-900">
                        Travel Notifications & Security Alerts
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Live itinerary updates, verification notices, and authorized tour operator advisories.
                      </p>
                    </div>
                    {stats.unreadNotifications > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleMarkAllNotifications}
                        className="text-xs"
                      >
                        Mark All as Read
                      </Button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <Card className="p-12 text-center border-dashed border-slate-300">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 mb-3">
                        <Bell className="h-7 w-7" />
                      </div>
                      <h3 className="font-heading text-lg font-bold text-brand-navy-900">
                        No Notifications
                      </h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                        You are all caught up! Booking updates and security alerts will appear here.
                      </p>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`rounded-2xl border p-4 transition-all flex items-start gap-3.5 ${
                            notif.isRead
                              ? "bg-white border-slate-200"
                              : "bg-brand-gold-50/40 border-brand-gold-300 shadow-xs"
                          }`}
                        >
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                              notif.type === "BOOKING"
                                ? "bg-emerald-100 text-emerald-700"
                                : notif.type === "SECURITY"
                                ? "bg-blue-100 text-blue-700"
                                : notif.type === "OFFER"
                                ? "bg-brand-gold-100 text-brand-gold-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {notif.type === "BOOKING" ? (
                              <Calendar className="h-4 w-4" />
                            ) : notif.type === "SECURITY" ? (
                              <ShieldCheck className="h-4 w-4" />
                            ) : (
                              <Bell className="h-4 w-4" />
                            )}
                          </div>

                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-heading text-xs font-bold text-slate-900">
                                {notif.title}
                              </h4>
                              <span className="text-[10px] text-slate-400">
                                {formatDate(notif.createdAt)}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {notif.message}
                            </p>
                            {notif.link && (
                              <Link
                                href={notif.link}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-gold-600 hover:underline pt-1"
                              >
                                <span>View details</span>
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* New Enquiry Modal */}
      {isEnquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-luxury-lg space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading text-lg font-bold text-brand-navy-900">
                Submit Customized Travel Enquiry
              </h3>
              <button
                type="button"
                onClick={() => setIsEnquiryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEnquiry} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Your Full Name"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={enquiryName}
                  onChange={(e) => setEnquiryName(e.target.value)}
                />
                <Input
                  label="Contact Phone"
                  required
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={enquiryPhone}
                  onChange={(e) => setEnquiryPhone(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Target Destination"
                  required
                  placeholder="e.g. Switzerland, Dubai, Kerala"
                  value={enquiryDestination}
                  onChange={(e) => setEnquiryDestination(e.target.value)}
                />
                <Input
                  label="Target Travel Date"
                  type="date"
                  value={enquiryDate}
                  onChange={(e) => setEnquiryDate(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Travellers
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={enquiryTravelers}
                    onChange={(e) => setEnquiryTravelers(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 shadow-xs focus:border-brand-navy-900 focus:ring-2 focus:ring-brand-gold-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Budget Range
                  </label>
                  <select
                    value={enquiryBudget}
                    onChange={(e) => setEnquiryBudget(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 shadow-xs focus:border-brand-navy-900 focus:ring-2 focus:ring-brand-gold-500/50"
                  >
                    <option value="Under ₹40,000 / person">Under ₹40,000 / person</option>
                    <option value="₹40,000 – ₹75,000 / person">₹40,000 – ₹75,000 / person</option>
                    <option value="₹75,000 – ₹1,50,000 / person">₹75,000 – ₹1,50,000 / person</option>
                    <option value="₹1,50,000 – ₹3,00,000 / person">₹1,50,000 – ₹3,00,000 / person</option>
                    <option value="Luxury Bespoke (₹3,00,000+ / person)">Luxury Bespoke (₹3,00,000+)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Travel Type
                  </label>
                  <select
                    value={enquiryTravelType}
                    onChange={(e) => setEnquiryTravelType(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 shadow-xs focus:border-brand-navy-900 focus:ring-2 focus:ring-brand-gold-500/50"
                  >
                    <option value="Family Vacation">Family Vacation</option>
                    <option value="Honeymoon & Couple">Honeymoon & Couple</option>
                    <option value="Luxury Escapes">Luxury Escapes</option>
                    <option value="Alpine Scenic Rail">Alpine Scenic Rail</option>
                    <option value="Beach & Island Retreat">Beach & Island</option>
                    <option value="Solo Discovery">Solo Discovery</option>
                    <option value="Group / Friends Tour">Group Tour</option>
                    <option value="Corporate / MICE">Corporate / MICE</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Detailed Travel Requirements
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Mention flight preferences, hotel category (4★/5★), special dietary needs, or tailored excursions."
                  value={enquiryMessage}
                  onChange={(e) => setEnquiryMessage(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 shadow-xs focus:border-brand-navy-900 focus:ring-2 focus:ring-brand-gold-500/50"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEnquiryModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  disabled={enquirySubmitting}
                >
                  {enquirySubmitting ? "Submitting..." : "Send to Concierge"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Submission Modal (Phase 12: Verified Booking Only) */}
      <ReviewSubmissionModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedBookingForReview(null);
        }}
        packageId={
          selectedBookingForReview?.package?.id ||
          selectedBookingForReview?.packageId ||
          (eligibleBookings[0]?.package?.id || "")
        }
        packageName={
          selectedBookingForReview?.package?.name ||
          (eligibleBookings[0]?.package?.name || "Holiday Package")
        }
        eligibleBooking={
          selectedBookingForReview
            ? {
                bookingId: selectedBookingForReview.id,
                bookingReference: selectedBookingForReview.bookingReference,
                travelDate: selectedBookingForReview.travelDate
                  ? new Date(selectedBookingForReview.travelDate).toISOString()
                  : new Date().toISOString(),
              }
            : eligibleBookings[0]
            ? {
                bookingId: eligibleBookings[0].id,
                bookingReference: eligibleBookings[0].bookingReference,
                travelDate: eligibleBookings[0].travelDate
                  ? new Date(eligibleBookings[0].travelDate).toISOString()
                  : new Date().toISOString(),
              }
            : undefined
        }
        onSuccess={handleReviewSuccess}
      />

      {/* Booking Voucher Modal */}
      {activeVoucherBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-luxury-lg space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-600 block">
                  Official Travel Confirmation Voucher
                </span>
                <h3 className="font-heading text-xl font-bold text-brand-navy-900">
                  Sah Tour And Travel E-Voucher
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveVoucherBooking(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Status: {activeVoucherBooking.status} & Verified Allotment</span>
              </div>
              <span className="font-mono font-bold text-slate-800">
                {activeVoucherBooking.bookingReference}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Lead Traveler:</span>
                <strong className="text-slate-800">{profile?.name}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Travel Date:</span>
                <strong className="text-slate-800">
                  {formatDate(activeVoucherBooking.travelDate)}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block">Travelers Count:</span>
                <strong className="text-slate-800">
                  {activeVoucherBooking.travelersCount} Adults
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block">Holiday Package:</span>
                <strong className="text-slate-800">
                  {activeVoucherBooking.package.name}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block">Destination:</span>
                <strong className="text-slate-800">
                  {activeVoucherBooking.package.destination?.name}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block">Total Fare Paid:</span>
                <strong className="text-brand-navy-950 font-bold">
                  {formatCurrency(activeVoucherBooking.totalAmount, activeVoucherBooking.currency)}
                </strong>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50 text-xs space-y-2">
              <p className="font-bold text-slate-800">Emergency 24x7 Concierge Support:</p>
              <p className="text-slate-600">
                Dedicated WhatsApp Hotline: +91 98765 43210 • Email: emergency@sahtour.com
              </p>
              <p className="text-[11px] text-slate-400 pt-1">
                Please present this voucher alongside your government photo passport at airport transfer and hotel check-in.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                leftIcon={<Download className="h-3.5 w-3.5" />}
              >
                Print / Save PDF
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => setActiveVoucherBooking(null)}
              >
                Close Voucher
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
