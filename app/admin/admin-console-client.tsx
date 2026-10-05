"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  AdminRole,
  AdminModule,
  ADMIN_ROLES,
  ADMIN_MODULE_LIST,
  hasPermission,
  getRoleDescription,
} from "@/lib/rbac";
import {
  LayoutDashboard,
  MapPin,
  Briefcase,
  Calendar,
  Building2,
  Compass,
  Ticket,
  Users,
  MessageSquare,
  Star,
  Percent,
  Tag,
  FileText,
  UserCheck,
  Settings,
  ShieldCheck,
  Search,
  Plus,
  RefreshCw,
  Archive,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Filter,
  Eye,
  Lock,
  X,
  Edit2,
  Save,
} from "lucide-react";

interface AdminConsoleClientProps {
  initialMetrics: any;
  initialRecent: any;
}

export function AdminConsoleClient({
  initialMetrics,
  initialRecent,
}: AdminConsoleClientProps) {
  // Navigation & Role State
  const [activeTab, setActiveTab] = React.useState<"dashboard" | AdminModule>("dashboard");
  const [activeRole, setActiveRole] = React.useState<AdminRole>("Admin");

  // Metrics & Recent State
  const [metrics, setMetrics] = React.useState(initialMetrics);
  const [recent, setRecent] = React.useState(initialRecent);
  const [isLoadingMetrics, setIsLoadingMetrics] = React.useState(false);

  // Module Data State
  const [moduleData, setModuleData] = React.useState<any[]>([]);
  const [moduleTotal, setModuleTotal] = React.useState(0);
  const [isLoadingModule, setIsLoadingModule] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showArchived, setShowArchived] = React.useState(false);

  // Audit Log State
  const [auditLogs, setAuditLogs] = React.useState<any[]>(recent.audits || []);
  const [auditModuleFilter, setAuditModuleFilter] = React.useState("ALL");
  const [auditActionFilter, setAuditActionFilter] = React.useState("ALL");

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<any | null>(null);
  const [formValues, setFormValues] = React.useState<Record<string, any>>({});
  const [actionNotice, setActionNotice] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Fetch verified metrics
  const refreshMetrics = async () => {
    setIsLoadingMetrics(true);
    try {
      const res = await fetch("/api/admin/metrics");
      const data = await res.json();
      if (data.success) {
        setMetrics(data.metrics);
        setRecent(data.recent);
      }
    } catch (e) {
      console.error("Failed to refresh metrics:", e);
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  // Fetch items for selected module
  const fetchModuleItems = React.useCallback(async (mod: AdminModule) => {
    if (mod === "audit") {
      fetchAuditLogs();
      return;
    }

    setIsLoadingModule(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.set("search", searchTerm.trim());
      if (showArchived) params.set("archived", "true");

      const res = await fetch(`/api/admin/modules/${mod}?${params.toString()}`, {
        headers: { "x-admin-role": activeRole },
      });
      const data = await res.json();
      if (data.success) {
        setModuleData(data.items || []);
        setModuleTotal(data.total || 0);
      } else {
        setModuleData([]);
        setModuleTotal(0);
      }
    } catch (e) {
      console.error(`Failed to fetch items for ${mod}:`, e);
      setModuleData([]);
    } finally {
      setIsLoadingModule(false);
    }
  }, [searchTerm, showArchived, activeRole]);

  // Fetch audit logs
  const fetchAuditLogs = React.useCallback(async () => {
    setIsLoadingModule(true);
    try {
      const params = new URLSearchParams();
      if (auditModuleFilter !== "ALL") params.set("module", auditModuleFilter);
      if (auditActionFilter !== "ALL") params.set("action", auditActionFilter);
      if (searchTerm.trim()) params.set("search", searchTerm.trim());

      const res = await fetch(`/api/admin/audit?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setAuditLogs(data.logs || []);
        setModuleTotal(data.total || 0);
      }
    } catch (e) {
      console.error("Failed to fetch audit logs:", e);
    } finally {
      setIsLoadingModule(false);
    }
  }, [auditModuleFilter, auditActionFilter, searchTerm]);

  // Change tab
  const handleTabChange = (tab: "dashboard" | AdminModule) => {
    setActiveTab(tab);
    setSearchTerm("");
    setShowArchived(false);
    setActionNotice(null);
  };

  // Load module data when tab or filters change
  React.useEffect(() => {
    if (activeTab !== "dashboard") {
      fetchModuleItems(activeTab);
    }
  }, [activeTab, fetchModuleItems]);

  // Handle Soft Deletion (Archive / Restore)
  const handleToggleArchive = async (item: any, mod: AdminModule) => {
    const nextArchived = !item.isArchived;
    const canArchive = hasPermission(activeRole, mod, "ARCHIVE");

    if (!canArchive) {
      alert(`Permission Denied: Persona [${activeRole}] is not authorized to archive records in [${mod}].`);
      return;
    }

    try {
      const res = await fetch(`/api/admin/modules/${mod}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-role": activeRole,
        },
        body: JSON.stringify({
          id: item.id,
          isArchived: nextArchived,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Archive toggle failed.");

      setActionNotice(`Item successfully ${nextArchived ? "archived (soft-deleted)" : "restored"}.`);
      fetchModuleItems(mod);
      refreshMetrics();
    } catch (err: any) {
      alert(err.message || "Failed to update item archive state.");
    }
  };

  // Handle Create Submission
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "dashboard" || activeTab === "audit") return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/modules/${activeTab}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-role": activeRole,
        },
        body: JSON.stringify(formValues),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create record.");

      setIsCreateModalOpen(false);
      setFormValues({});
      setActionNotice(`Successfully created new record in ${activeTab}. Audit log updated.`);
      fetchModuleItems(activeTab);
      refreshMetrics();
    } catch (err: any) {
      alert(err.message || "Creation error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || activeTab === "dashboard" || activeTab === "audit") return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/modules/${activeTab}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-role": activeRole,
        },
        body: JSON.stringify({
          id: editingItem.id,
          ...formValues,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update record.");

      setEditingItem(null);
      setFormValues({});
      setActionNotice(`Successfully updated record in ${activeTab}. Audit log updated.`);
      fetchModuleItems(activeTab);
      refreshMetrics();
    } catch (err: any) {
      alert(err.message || "Update error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Review Moderation (Phase 12)
  const handleModerateReview = async (reviewId: string, status: "Approved" | "Rejected") => {
    try {
      const notes =
        status === "Rejected"
          ? window.prompt("Enter optional moderation note for rejection:")
          : null;

      const res = await fetch("/api/reviews/moderate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-role": activeRole,
        },
        body: JSON.stringify({
          reviewId,
          status,
          moderationNotes: notes || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to moderate review.");

      setActionNotice(`Review marked as [${status}]. Public visibility updated.`);
      fetchModuleItems("reviews");
    } catch (err: any) {
      alert(err.message || "Failed to moderate review.");
    }
  };

  // Helper to render icon by name
  const renderModuleIcon = (iconName: string, className = "h-4 w-4") => {
    switch (iconName) {
      case "MapPin": return <MapPin className={className} />;
      case "Briefcase": return <Briefcase className={className} />;
      case "Calendar": return <Calendar className={className} />;
      case "Building2": return <Building2 className={className} />;
      case "Compass": return <Compass className={className} />;
      case "Ticket": return <Ticket className={className} />;
      case "Users": return <Users className={className} />;
      case "MessageSquare": return <MessageSquare className={className} />;
      case "Star": return <Star className={className} />;
      case "Percent": return <Percent className={className} />;
      case "Tag": return <Tag className={className} />;
      case "FileText": return <FileText className={className} />;
      case "UserCheck": return <UserCheck className={className} />;
      case "Settings": return <Settings className={className} />;
      case "ShieldCheck": return <ShieldCheck className={className} />;
      default: return <Briefcase className={className} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-brand-gold-500 selection:text-brand-navy-950">
      {/* ================================================================ */}
      {/* 1. ENTERPRISE HEADER & ROLE SELECTOR BAR */}
      {/* ================================================================ */}
      <header className="border-b border-slate-800 bg-slate-950 sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-600 flex items-center justify-center text-brand-navy-950 font-black shadow-md shadow-brand-gold-500/20">
            ST
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-base tracking-tight text-white">
                Sah Tour And Travel
              </span>
              <span className="bg-brand-gold-500/10 text-brand-gold-400 border border-brand-gold-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Enterprise Admin
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected to Live Database (dev.db) • Phase 10 Console
            </p>
          </div>
        </div>

        {/* ROLE PERSONA SWITCHER */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900 p-1 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 flex items-center gap-1">
            <Lock className="h-3 w-3 text-brand-gold-400" />
            <span>Active Persona:</span>
          </span>
          {ADMIN_ROLES.map((role) => {
            const isSelected = activeRole === role;
            return (
              <button
                key={role}
                onClick={() => {
                  setActiveRole(role);
                  setActionNotice(`Switched persona to: ${role}. Permissions dynamically updated.`);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? "bg-brand-gold-500 text-brand-navy-950 shadow-sm font-extrabold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <span>{role}</span>
              </button>
            );
          })}
        </div>

        {/* Public Site Link */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="text-xs text-slate-400 hover:text-brand-gold-400 flex items-center gap-1 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl transition-colors"
          >
            <span>Customer Portal</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </header>

      {/* Role Capabilities Banner */}
      <div className="bg-slate-950/70 border-b border-slate-800/80 px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-brand-gold-400">Current Scope:</span>
          <span className="text-slate-400">{getRoleDescription(activeRole)}</span>
        </div>
        {actionNotice && (
          <div className="text-emerald-400 font-semibold flex items-center gap-1 animate-in fade-in">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{actionNotice}</span>
          </div>
        )}
      </div>

      {/* ================================================================ */}
      {/* 2. MAIN LAYOUT: SIDEBAR + CONTENT AREA */}
      {/* ================================================================ */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* SIDEBAR NAVIGATION (14 MODULES + DASHBOARD) */}
        <aside className="w-full md:w-64 border-r border-slate-800 bg-slate-950/40 p-4 space-y-6 shrink-0">
          {/* Main Navigation */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 px-2 block mb-2">
              Overview
            </span>
            <button
              onClick={() => handleTabChange("dashboard")}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-brand-gold-500 text-brand-navy-950 font-bold"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard Overview</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === "dashboard" ? "bg-brand-navy-950 text-brand-gold-400 font-mono" : "bg-slate-800 text-slate-400"}`}>
                Live
              </span>
            </button>
          </div>

          {/* 14 Administrative Modules */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 px-2 block mb-2">
              Administrative Modules ({ADMIN_MODULE_LIST.length})
            </span>
            <div className="space-y-0.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
              {ADMIN_MODULE_LIST.map((mod) => {
                const isSelected = activeTab === mod.id;
                const canRead = hasPermission(activeRole, mod.id, "READ");

                return (
                  <button
                    key={mod.id}
                    disabled={!canRead}
                    onClick={() => handleTabChange(mod.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-brand-gold-500 text-brand-navy-950 font-bold shadow-xs"
                        : canRead
                        ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                        : "text-slate-400 cursor-not-allowed opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {renderModuleIcon(mod.iconName, `h-4 w-4 ${isSelected ? "text-brand-navy-950" : canRead ? "text-brand-gold-400" : "text-slate-400"}`)}
                      <span className="truncate">{mod.label}</span>
                    </div>

                    {!canRead ? (
                      <Lock className="h-3 w-3 text-slate-400 shrink-0" />
                    ) : mod.id === "audit" ? (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? "bg-brand-navy-950 text-brand-gold-300" : "bg-slate-800 text-slate-400"}`}>
                        {metrics.audits?.total || 0}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* MAIN DISPLAY AREA */}
        <main className="flex-1 p-4 sm:p-8 space-y-8 overflow-x-hidden">
          {/* ================================================================ */}
          {/* TAB: DASHBOARD OVERVIEW (ACTUAL DATABASE METRICS) */}
          {/* ================================================================ */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-400 block">
                    Real-time Ledger & Database Telemetry
                  </span>
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white mt-1">
                    Operational Control Dashboard
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    All metrics below are computed in real-time from active SQLite records. No simulated statistics.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshMetrics}
                    disabled={isLoadingMetrics}
                    leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${isLoadingMetrics ? "animate-spin" : ""}`} />}
                    className="text-xs border-slate-700 hover:bg-slate-800"
                  >
                    Refresh Metrics
                  </Button>
                </div>
              </div>

              {/* 6 CORE DATABASE METRICS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {/* 1. Bookings */}
                <Card className="bg-slate-950/80 border-slate-800 p-4 rounded-2xl shadow-sm hover:border-brand-gold-500/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bookings</span>
                    <Ticket className="h-4 w-4 text-brand-gold-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-heading text-2xl font-black text-white">{metrics.bookings.total}</span>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      {metrics.bookings.confirmed} Confirmed
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {metrics.bookings.paymentPending} Pending • {metrics.bookings.cancelled} Cancelled
                  </p>
                </Card>

                {/* 2. Revenue */}
                <Card className="bg-slate-950/80 border-slate-800 p-4 rounded-2xl shadow-sm hover:border-brand-gold-500/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Revenue</span>
                    <Percent className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="font-heading text-2xl font-black text-white">
                      ₹{metrics.revenue.totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Verified Razorpay & ledger receipts
                  </p>
                </Card>

                {/* 3. Customers */}
                <Card className="bg-slate-950/80 border-slate-800 p-4 rounded-2xl shadow-sm hover:border-brand-gold-500/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Customers</span>
                    <Users className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="mt-2">
                    <span className="font-heading text-2xl font-black text-white">{metrics.customers.total}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Active registered user accounts
                  </p>
                </Card>

                {/* 4. Enquiries */}
                <Card className="bg-slate-950/80 border-slate-800 p-4 rounded-2xl shadow-sm hover:border-brand-gold-500/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Enquiries</span>
                    <MessageSquare className="h-4 w-4 text-amber-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-heading text-2xl font-black text-white">{metrics.enquiries.total}</span>
                    <span className="text-[10px] text-amber-400 font-bold">{metrics.enquiries.new} New</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {metrics.enquiries.inProgress} In Progress • {metrics.enquiries.converted} Converted
                  </p>
                </Card>

                {/* 5. Packages */}
                <Card className="bg-slate-950/80 border-slate-800 p-4 rounded-2xl shadow-sm hover:border-brand-gold-500/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Packages</span>
                    <Briefcase className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-heading text-2xl font-black text-white">{metrics.packages.total}</span>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      {metrics.packages.liveAvailability} Live
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Verified operator inventory catalogue
                  </p>
                </Card>

                {/* 6. Destinations */}
                <Card className="bg-slate-950/80 border-slate-800 p-4 rounded-2xl shadow-sm hover:border-brand-gold-500/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Destinations</span>
                    <MapPin className="h-4 w-4 text-rose-400" />
                  </div>
                  <div className="mt-2">
                    <span className="font-heading text-2xl font-black text-white">{metrics.destinations.total}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Official tourism board verified guides
                  </p>
                </Card>
              </div>

              {/* SPLIT: RECENT ACTIVITY STREAMS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Bookings */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-brand-gold-400" />
                      <h3 className="font-heading text-sm font-bold text-white">Recent Customer Bookings</h3>
                    </div>
                    <button
                      onClick={() => handleTabChange("bookings")}
                      className="text-xs text-brand-gold-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Manage Bookings</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="divide-y divide-slate-800 text-xs">
                    {recent.bookings.length === 0 ? (
                      <p className="py-4 text-slate-500 text-center">No bookings registered yet.</p>
                    ) : (
                      recent.bookings.map((b: any) => (
                        <div key={b.id} className="py-3 flex items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-white">{b.reference}</span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  b.status === "Confirmed"
                                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                    : b.status === "Payment Pending"
                                    ? "bg-amber-950 text-amber-400 border border-amber-800"
                                    : "bg-slate-800 text-slate-400"
                                }`}
                              >
                                {b.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {b.customerName} • {b.packageName}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-heading font-bold text-white block">
                              {formatCurrency(b.amount, b.currency)}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {formatDate(b.date)}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Recent Enquiries */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-amber-400" />
                      <h3 className="font-heading text-sm font-bold text-white">Recent Travel Enquiries</h3>
                    </div>
                    <button
                      onClick={() => handleTabChange("enquiries")}
                      className="text-xs text-brand-gold-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Manage Enquiries</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="divide-y divide-slate-800 text-xs">
                    {recent.enquiries.length === 0 ? (
                      <p className="py-4 text-slate-500 text-center">No enquiries recorded.</p>
                    ) : (
                      recent.enquiries.map((e: any) => (
                        <div key={e.id} className="py-3 flex items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-white">{e.reference}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                                {e.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {e.customerName} • Destination: {e.destination}
                            </p>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {formatDate(e.date)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* AUDIT LOG RECENT STREAM */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <h3 className="font-heading text-sm font-bold text-white">
                      Administrative Audit Trail (Who, What, When)
                    </h3>
                  </div>
                  <button
                    onClick={() => handleTabChange("audit")}
                    className="text-xs text-brand-gold-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Full Immutable Audit Log</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>

                <div className="divide-y divide-slate-800 text-xs">
                  {recent.audits.map((a: any) => (
                    <div key={a.id} className="py-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            a.action === "CREATE"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                              : a.action === "UPDATE"
                              ? "bg-blue-950 text-blue-400 border border-blue-800"
                              : a.action === "ARCHIVE"
                              ? "bg-amber-950 text-amber-400 border border-amber-800"
                              : "bg-rose-950 text-rose-400 border border-rose-800"
                          }`}
                        >
                          {a.action}
                        </span>
                        <div>
                          <span className="font-semibold text-white">
                            {a.userName} ({a.userRole})
                          </span>
                          <span className="text-slate-400 ml-1.5">
                            modified <strong>{a.module}</strong>
                          </span>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{a.details}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">{formatDate(a.date)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB: AUDIT LOG VIEWER */}
          {/* ================================================================ */}
          {activeTab === "audit" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h1 className="font-heading text-2xl font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-brand-gold-400" />
                    <span>Immutable Audit Log & Security Journal</span>
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Tracking administrative accountability: Who changed it, What changed, and When.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchAuditLogs}
                  disabled={isLoadingModule}
                  leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${isLoadingModule ? "animate-spin" : ""}`} />}
                  className="text-xs border-slate-700 hover:bg-slate-800"
                >
                  Refresh Log
                </Button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Search by user, entity ID, or details..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-xs text-white"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Module:</span>
                  <select
                    value={auditModuleFilter}
                    onChange={(e) => setAuditModuleFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="ALL">All Modules</option>
                    {ADMIN_MODULE_LIST.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Action:</span>
                  <select
                    value={auditActionFilter}
                    onChange={(e) => setAuditActionFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="ALL">All Actions</option>
                    <option value="CREATE">CREATE</option>
                    <option value="UPDATE">UPDATE</option>
                    <option value="ARCHIVE">ARCHIVE</option>
                    <option value="RESTORE">RESTORE</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
              </div>

              {/* Audit Table */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                      <tr>
                        <th className="px-5 py-3.5">Timestamp (When)</th>
                        <th className="px-5 py-3.5">Operator (Who)</th>
                        <th className="px-5 py-3.5">Action</th>
                        <th className="px-5 py-3.5">Module</th>
                        <th className="px-5 py-3.5">Details (What Changed)</th>
                        <th className="px-5 py-3.5">IP Address</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {auditLogs.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                            No matching audit log entries found.
                          </td>
                        </tr>
                      ) : (
                        auditLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                            <td className="px-5 py-3.5 font-mono text-slate-400 whitespace-nowrap">
                              {formatDate(log.createdAt)}
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              <span className="font-bold text-white block">{log.userName}</span>
                              <span className="text-[10px] text-brand-gold-400 font-semibold">{log.userRole}</span>
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  log.action === "CREATE"
                                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                    : log.action === "UPDATE"
                                    ? "bg-blue-950 text-blue-400 border border-blue-800"
                                    : log.action === "ARCHIVE"
                                    ? "bg-amber-950 text-amber-400 border border-amber-800"
                                    : "bg-rose-950 text-rose-400 border border-rose-800"
                                }`}
                              >
                                {log.action}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 font-semibold text-slate-300 whitespace-nowrap">
                              {log.module}
                            </td>
                            <td className="px-5 py-3.5 text-slate-400 max-w-md font-mono text-[11px] truncate">
                              {log.details}
                            </td>
                            <td className="px-5 py-3.5 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                              {log.ipAddress || "127.0.0.1"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB: MODULE CRUD WORKSPACE (ALL 14 MODULES) */}
          {/* ================================================================ */}
          {activeTab !== "dashboard" && activeTab !== "audit" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Module Header & Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-400">
                      Module Workspace
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {moduleTotal} Records Total
                    </span>
                  </div>
                  <h1 className="font-heading text-2xl font-bold text-white capitalize mt-0.5">
                    {activeTab} Management
                  </h1>
                </div>

                {/* Actions: Refresh & Create */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchModuleItems(activeTab)}
                    disabled={isLoadingModule}
                    leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${isLoadingModule ? "animate-spin" : ""}`} />}
                    className="text-xs border-slate-700 hover:bg-slate-800 text-slate-300"
                  >
                    Refresh
                  </Button>

                  {hasPermission(activeRole, activeTab, "CREATE") && (
                    <Button
                      variant="luxury"
                      size="sm"
                      onClick={() => {
                        setFormValues({});
                        setIsCreateModalOpen(true);
                      }}
                      leftIcon={<Plus className="h-4 w-4" />}
                      className="text-xs font-bold shadow-md shadow-brand-gold-500/10"
                    >
                      Create {activeTab.slice(0, -1)}
                    </Button>
                  )}
                </div>
              </div>

              {/* Filters Bar: Search & Show Archived */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex-1 min-w-[240px]">
                  <Input
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-xs text-white"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
                    <input
                      type="checkbox"
                      checked={showArchived}
                      onChange={(e) => setShowArchived(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-brand-gold-500 focus:ring-brand-gold-500"
                    />
                    <span>Include Soft-Deleted / Archived</span>
                  </label>
                </div>
              </div>

              {/* Module Data Table */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                      <tr>
                        <th className="px-5 py-3.5">Name / Title</th>
                        <th className="px-5 py-3.5">Identifier / Slug</th>
                        <th className="px-5 py-3.5">Details</th>
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {isLoadingModule ? (
                        <tr>
                          <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                            <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-brand-gold-400" />
                            <span>Loading verified database records...</span>
                          </td>
                        </tr>
                      ) : moduleData.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                            No records found for this view.
                          </td>
                        </tr>
                      ) : (
                        moduleData.map((item) => {
                          const isArchived = Boolean(item.isArchived);
                          const title = item.name || item.title || item.code || item.key || item.bookingReference || item.referenceNo || "Record";
                          const subtitle = item.slug || item.id || item.email || item.category || "";

                          return (
                            <tr key={item.id || item.key || item.code} className="hover:bg-slate-900/50 transition-colors">
                              {/* Title */}
                              <td className="px-5 py-4">
                                <span className={`font-bold block ${isArchived ? "line-through text-slate-500" : "text-white"}`}>
                                  {title}
                                </span>
                                {item.shortDescription && (
                                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                    {item.shortDescription}
                                  </p>
                                )}
                              </td>

                              {/* Identifier */}
                              <td className="px-5 py-4 font-mono text-slate-400 text-[11px]">
                                {subtitle}
                              </td>

                              {/* Dynamic Details depending on module */}
                              <td className="px-5 py-4 text-slate-300">
                                {activeTab === "packages" && (
                                  <div>
                                    <span className="font-heading font-bold text-white">
                                      ₹{item.startingPrice?.toLocaleString("en-IN")}
                                    </span>
                                    <span className="text-[10px] text-slate-400 block">
                                      {item.availableSlots} Slots • {item.durationText}
                                    </span>
                                  </div>
                                )}
                                {activeTab === "offers" && (
                                  <div>
                                    <span className="text-brand-gold-400 font-bold">
                                      {item.discountType === "PERCENTAGE" ? `${item.discountVal}% OFF` : `₹${item.discountVal} Flat`}
                                    </span>
                                    <span className="text-[10px] text-slate-400 block">{item.badge}</span>
                                  </div>
                                )}
                                {activeTab === "coupons" && (
                                  <div>
                                    <span className="font-mono text-emerald-400 font-bold">
                                      {item.discountType === "PERCENTAGE" ? `${item.discountVal}%` : `₹${item.discountVal}`}
                                    </span>
                                    <span className="text-[10px] text-slate-400 block">
                                      Used {item.usedCount} of {item.usageLimit}
                                    </span>
                                  </div>
                                )}
                                {activeTab === "bookings" && (
                                  <div>
                                    <span className="font-heading font-bold text-white">
                                      {formatCurrency(item.totalAmount, item.currency)}
                                    </span>
                                    <span className="text-[10px] text-slate-400 block">
                                      {item.customerName} ({item.travelersCount} Pax)
                                    </span>
                                  </div>
                                )}
                                {activeTab === "users" && (
                                  <span className="text-brand-gold-400 font-bold">{item.role}</span>
                                )}
                                {activeTab === "settings" && (
                                  <span className="font-mono text-[11px] text-slate-300">{item.value}</span>
                                )}
                                {activeTab === "content" && (
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="rounded bg-brand-gold-500/20 text-brand-gold-400 border border-brand-gold-500/30 text-[10px] font-bold px-1.5 py-0.2">
                                        {item.category}
                                      </span>
                                      <span className="text-slate-400 text-[10px]">
                                        {item.readingTime || "5 min read"}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-300">
                                      By {item.author} ({item.authorRole || "Curator"})
                                    </p>
                                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                                      <CheckCircle2 className="h-3 w-3" />
                                      {item.sourcesJson
                                        ? `${(() => {
                                            try {
                                              return JSON.parse(item.sourcesJson).length;
                                            } catch {
                                              return 0;
                                            }
                                          })()} Verified Official Sources`
                                        : "Verified"}
                                    </span>
                                  </div>
                                )}
                                {activeTab === "reviews" && (
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`h-3 w-3 ${
                                            i < (item.rating || 5)
                                              ? "fill-amber-400 text-amber-400"
                                              : "text-slate-600"
                                          }`}
                                        />
                                      ))}
                                      <span className="font-bold text-white ml-1">
                                        {item.rating}.0
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-300 line-clamp-1">
                                      {item.comment}
                                    </p>
                                    <div className="text-[10px] text-slate-400 flex items-center gap-2">
                                      <span>Tour: {item.package?.name || "Package"}</span>
                                      {item.travelDate && (
                                        <span>• Travel: {formatDate(item.travelDate)}</span>
                                      )}
                                      {item.photoUrl && (
                                        <span className="text-brand-gold-400 font-semibold">• Has Photo</span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </td>

                              {/* Status */}
                              <td className="px-5 py-4">
                                {activeTab === "reviews" ? (
                                  <div className="space-y-1">
                                    {item.status === "Approved" && (
                                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block">
                                        Approved
                                      </span>
                                    )}
                                    {item.status === "Pending" && (
                                      <span className="bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block">
                                        Pending Moderation
                                      </span>
                                    )}
                                    {item.status === "Rejected" && (
                                      <span className="bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block">
                                        Rejected
                                      </span>
                                    )}
                                    {isArchived && (
                                      <span className="bg-slate-900 text-slate-500 border border-slate-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full block text-center">
                                        Archived
                                      </span>
                                    )}
                                  </div>
                                ) : isArchived ? (
                                  <span className="bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    Archived (Soft-Deleted)
                                  </span>
                                ) : (
                                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    Active
                                  </span>
                                )}
                              </td>

                              {/* Actions */}
                              <td className="px-5 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {/* Quick Review Moderation: Approve / Reject (Phase 12) */}
                                  {activeTab === "reviews" && hasPermission(activeRole, "reviews", "UPDATE") && (
                                    <div className="flex items-center gap-1.5 mr-1">
                                      {item.status !== "Approved" && (
                                        <button
                                          onClick={() => handleModerateReview(item.id, "Approved")}
                                          className="px-2 py-1 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                          title="Approve Review for Public Display"
                                        >
                                          <CheckCircle2 className="h-3 w-3" />
                                          Approve
                                        </button>
                                      )}
                                      {item.status !== "Rejected" && (
                                        <button
                                          onClick={() => handleModerateReview(item.id, "Rejected")}
                                          className="px-2 py-1 rounded bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-rose-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                          title="Reject Review"
                                        >
                                          <X className="h-3 w-3" />
                                          Reject
                                        </button>
                                      )}
                                    </div>
                                  )}

                                  {/* Edit */}
                                  {hasPermission(activeRole, activeTab, "UPDATE") && (
                                    <button
                                      onClick={() => {
                                        setEditingItem(item);
                                        setFormValues(item);
                                      }}
                                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                      title="Edit Record"
                                    >
                                      <Edit2 className="h-3.5 w-3.5" />
                                    </button>
                                  )}

                                  {/* Soft Deletion / Archive */}
                                  {hasPermission(activeRole, activeTab, "ARCHIVE") && typeof item.isArchived === "boolean" && (
                                    <button
                                      onClick={() => handleToggleArchive(item, activeTab)}
                                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                        isArchived
                                          ? "bg-emerald-950/60 text-emerald-400 hover:bg-emerald-900 border border-emerald-800/50"
                                          : "bg-amber-950/60 text-amber-400 hover:bg-amber-900 border border-amber-800/50"
                                      }`}
                                      title={isArchived ? "Restore Record" : "Soft-Delete (Archive)"}
                                    >
                                      {isArchived ? <RotateCcw className="h-3.5 w-3.5" /> : <Archive className="h-3.5 w-3.5" />}
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* MODAL: CREATE ITEM */}
          {/* ================================================================ */}
          {isCreateModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs animate-in fade-in duration-150">
              <div className="w-full max-w-lg rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                    <Plus className="h-4 w-4 text-brand-gold-400" />
                    <span>Create New {activeTab.slice(0, -1)}</span>
                  </h3>
                  <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
                  {/* Dynamic Form Fields */}
                  {activeTab === "offers" && (
                    <>
                      <Input
                        label="Offer Title"
                        placeholder="e.g. Early Bird Festive Saver"
                        required
                        value={formValues.title || ""}
                        onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                        className="bg-slate-900 border-slate-700 text-white"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="Badge Tag"
                          placeholder="e.g. 15% OFF"
                          value={formValues.badge || ""}
                          onChange={(e) => setFormValues({ ...formValues, badge: e.target.value })}
                          className="bg-slate-900 border-slate-700 text-white"
                        />
                        <Input
                          label="Discount Value"
                          type="number"
                          placeholder="15"
                          required
                          value={formValues.discountVal || ""}
                          onChange={(e) => setFormValues({ ...formValues, discountVal: e.target.value })}
                          className="bg-slate-900 border-slate-700 text-white"
                        />
                      </div>
                      <Input
                        label="Description"
                        placeholder="Detailed offer benefits"
                        value={formValues.description || ""}
                        onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                        className="bg-slate-900 border-slate-700 text-white"
                      />
                    </>
                  )}

                  {activeTab === "coupons" && (
                    <>
                      <Input
                        label="Coupon Code"
                        placeholder="e.g. SAHTOUR2026"
                        required
                        value={formValues.code || ""}
                        onChange={(e) => setFormValues({ ...formValues, code: e.target.value })}
                        className="bg-slate-900 border-slate-700 text-white"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="Discount Value"
                          type="number"
                          placeholder="3000"
                          required
                          value={formValues.discountVal || ""}
                          onChange={(e) => setFormValues({ ...formValues, discountVal: e.target.value })}
                          className="bg-slate-900 border-slate-700 text-white"
                        />
                        <Input
                          label="Min Booking Amount"
                          type="number"
                          placeholder="50000"
                          value={formValues.minBookingVal || ""}
                          onChange={(e) => setFormValues({ ...formValues, minBookingVal: e.target.value })}
                          className="bg-slate-900 border-slate-700 text-white"
                        />
                      </div>
                      <Input
                        label="Description"
                        placeholder="Promotion description"
                        value={formValues.description || ""}
                        onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                        className="bg-slate-900 border-slate-700 text-white"
                      />
                    </>
                  )}

                  {activeTab === "content" && (
                    <>
                      <Input
                        label="Article / Guide Title"
                        placeholder="e.g. European Alps Panoramic Scenic Rail Guide"
                        required
                        value={formValues.title || ""}
                        onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                        className="bg-slate-900 border-slate-700 text-white"
                      />

                      <div className="space-y-1.5 text-xs">
                        <label className="text-slate-300 font-bold">Category (Phase 13 Required):</label>
                        <select
                          value={formValues.category || "Destination Guides"}
                          onChange={(e) => setFormValues({ ...formValues, category: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs"
                        >
                          <option value="Destination Guides">Destination Guides</option>
                          <option value="Travel Tips">Travel Tips</option>
                          <option value="Visa Guides">Visa Guides</option>
                          <option value="Packing Guides">Packing Guides</option>
                          <option value="Honeymoon Guides">Honeymoon Guides</option>
                          <option value="Family Travel">Family Travel</option>
                          <option value="Budget Travel">Budget Travel</option>
                          <option value="Luxury Travel">Luxury Travel</option>
                          <option value="Adventure Travel">Adventure Travel</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="Author Name"
                          placeholder="e.g. Elena Rohner"
                          value={formValues.author || ""}
                          onChange={(e) => setFormValues({ ...formValues, author: e.target.value })}
                          className="bg-slate-900 border-slate-700 text-white"
                        />
                        <Input
                          label="Author Role / Credentials"
                          placeholder="e.g. Senior Alpine Curator"
                          value={formValues.authorRole || ""}
                          onChange={(e) => setFormValues({ ...formValues, authorRole: e.target.value })}
                          className="bg-slate-900 border-slate-700 text-white"
                        />
                      </div>

                      <Input
                        label="Cover Image URL"
                        placeholder="https://images.unsplash.com/..."
                        value={formValues.coverImage || ""}
                        onChange={(e) => setFormValues({ ...formValues, coverImage: e.target.value })}
                        className="bg-slate-900 border-slate-700 text-white"
                      />

                      <div className="space-y-1.5 text-xs">
                        <label className="text-slate-300 font-bold">Summary / SEO Meta Description:</label>
                        <textarea
                          rows={2}
                          required
                          placeholder="Compelling overview for search engines and social shares"
                          value={formValues.summary || ""}
                          onChange={(e) => setFormValues({ ...formValues, summary: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs"
                        />
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <label className="text-slate-300 font-bold">Article Body Content:</label>
                          <span className="text-[10px] text-amber-400">
                            Verified facts only. Visa info must link to official sources.
                          </span>
                        </div>
                        <textarea
                          rows={6}
                          required
                          placeholder="## Section Headings and verified travel facts..."
                          value={formValues.body || ""}
                          onChange={(e) => setFormValues({ ...formValues, body: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs font-mono"
                        />
                      </div>
                    </>
                  )}

                  {activeTab === "users" && (
                    <>
                      <Input
                        label="Full Name"
                        placeholder="Employee Name"
                        required
                        value={formValues.name || ""}
                        onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                        className="bg-slate-900 border-slate-700 text-white"
                      />
                      <Input
                        label="Corporate Email"
                        type="email"
                        placeholder="employee@sahtour.com"
                        required
                        value={formValues.email || ""}
                        onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                        className="bg-slate-900 border-slate-700 text-white"
                      />
                      <div className="space-y-1.5 text-xs">
                        <label className="text-slate-300 font-bold">Assigned Role:</label>
                        <select
                          value={formValues.role || "Support Agent"}
                          onChange={(e) => setFormValues({ ...formValues, role: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs"
                        >
                          {ADMIN_ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  {activeTab === "settings" && (
                    <>
                      <Input
                        label="Setting Key"
                        placeholder="e.g. emergency_helpline"
                        required
                        value={formValues.key || ""}
                        onChange={(e) => setFormValues({ ...formValues, key: e.target.value })}
                        className="bg-slate-900 border-slate-700 text-white"
                      />
                      <Input
                        label="Setting Value"
                        placeholder="e.g. +91 98765 00000"
                        required
                        value={formValues.value || ""}
                        onChange={(e) => setFormValues({ ...formValues, value: e.target.value })}
                        className="bg-slate-900 border-slate-700 text-white"
                      />
                    </>
                  )}

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                    <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="luxury" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Creating..." : "Save Record"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* MODAL: EDIT ITEM */}
          {/* ================================================================ */}
          {editingItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs animate-in fade-in duration-150">
              <div className="w-full max-w-lg rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                    <Edit2 className="h-4 w-4 text-brand-gold-400" />
                    <span>Edit {activeTab.slice(0, -1)}</span>
                  </h3>
                  <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                  <Input
                    label="Name / Title"
                    value={formValues.title || formValues.name || formValues.key || ""}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        title: e.target.value,
                        name: e.target.value,
                      })
                    }
                    className="bg-slate-900 border-slate-700 text-white"
                  />

                  {formValues.value !== undefined && (
                    <Input
                      label="Configuration Value"
                      value={formValues.value || ""}
                      onChange={(e) => setFormValues({ ...formValues, value: e.target.value })}
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  )}

                  {activeTab === "reviews" ? (
                    <>
                      <div className="space-y-1.5 text-xs">
                        <label className="text-slate-300 font-bold">Moderation Status:</label>
                        <select
                          value={formValues.status || "Pending"}
                          onChange={(e) => setFormValues({ ...formValues, status: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs"
                        >
                          <option value="Pending">Pending (Under Review - Not Published)</option>
                          <option value="Approved">Approved (Published Publicly)</option>
                          <option value="Rejected">Rejected (Hidden from Public)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <label className="text-slate-300 font-bold">Rating (1-5):</label>
                        <input
                          type="number"
                          min={1}
                          max={5}
                          value={formValues.rating ?? 5}
                          onChange={(e) => setFormValues({ ...formValues, rating: Number(e.target.value) })}
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs"
                        />
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <label className="text-slate-300 font-bold">Moderator Notice / Notes:</label>
                        <textarea
                          rows={2}
                          value={formValues.moderationNotes || ""}
                          onChange={(e) => setFormValues({ ...formValues, moderationNotes: e.target.value })}
                          placeholder="Notes on verified customer booking or reason for rejection"
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs"
                        />
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <label className="text-slate-300 font-bold">Review Comment:</label>
                        <textarea
                          rows={3}
                          value={formValues.comment || ""}
                          onChange={(e) => setFormValues({ ...formValues, comment: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs"
                        />
                      </div>
                    </>
                  ) : activeTab === "content" ? (
                    <>
                      <div className="space-y-1.5 text-xs">
                        <label className="text-slate-300 font-bold">Category (Phase 13 Required):</label>
                        <select
                          value={formValues.category || "Destination Guides"}
                          onChange={(e) => setFormValues({ ...formValues, category: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs"
                        >
                          <option value="Destination Guides">Destination Guides</option>
                          <option value="Travel Tips">Travel Tips</option>
                          <option value="Visa Guides">Visa Guides</option>
                          <option value="Packing Guides">Packing Guides</option>
                          <option value="Honeymoon Guides">Honeymoon Guides</option>
                          <option value="Family Travel">Family Travel</option>
                          <option value="Budget Travel">Budget Travel</option>
                          <option value="Luxury Travel">Luxury Travel</option>
                          <option value="Adventure Travel">Adventure Travel</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="Author Name"
                          value={formValues.author || ""}
                          onChange={(e) => setFormValues({ ...formValues, author: e.target.value })}
                          className="bg-slate-900 border-slate-700 text-white"
                        />
                        <Input
                          label="Author Role"
                          value={formValues.authorRole || ""}
                          onChange={(e) => setFormValues({ ...formValues, authorRole: e.target.value })}
                          className="bg-slate-900 border-slate-700 text-white"
                        />
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <label className="text-slate-300 font-bold">Summary / SEO Description:</label>
                        <textarea
                          rows={2}
                          value={formValues.summary || ""}
                          onChange={(e) => setFormValues({ ...formValues, summary: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs"
                        />
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <label className="text-slate-300 font-bold">Article Body Content:</label>
                        <textarea
                          rows={6}
                          value={formValues.body || ""}
                          onChange={(e) => setFormValues({ ...formValues, body: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs font-mono"
                        />
                      </div>
                    </>
                  ) : (
                    formValues.status !== undefined && (
                      <div className="space-y-1.5 text-xs">
                        <label className="text-slate-300 font-bold">Status:</label>
                        <Input
                          value={formValues.status || ""}
                          onChange={(e) => setFormValues({ ...formValues, status: e.target.value })}
                          className="bg-slate-900 border-slate-700 text-white"
                        />
                      </div>
                    )
                  )}

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                    <Button variant="outline" type="button" onClick={() => setEditingItem(null)}>
                      Cancel
                    </Button>
                    <Button variant="luxury" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Updating..." : "Update & Audit Log"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
