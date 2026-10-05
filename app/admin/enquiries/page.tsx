"use client";

import * as React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MessageSquare,
  Phone,
  Mail,
  Edit3,
  Calendar,
  DollarSign,
  ShieldCheck,
  UserCheck,
  X,
  RefreshCw,
  Send,
} from "lucide-react";

const STATUS_OPTIONS = [
  "New",
  "Contacted",
  "In Progress",
  "Quoted",
  "Converted",
  "Closed",
] as const;

export default function AdminEnquiriesPage() {
  const [selectedStatus, setSelectedStatus] = React.useState<string>("ALL");
  const [search, setSearch] = React.useState("");
  const [enquiries, setEnquiries] = React.useState<any[]>([]);
  const [statusCounts, setStatusCounts] = React.useState<any[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  // Edit Modal State
  const [editingEnquiry, setEditingEnquiry] = React.useState<any | null>(null);
  const [editStatus, setEditStatus] = React.useState("");
  const [editNotes, setEditNotes] = React.useState("");
  const [editQuote, setEditQuote] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  const fetchEnquiries = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedStatus !== "ALL") params.set("status", selectedStatus);
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/admin/enquiries?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setEnquiries(data.enquiries || []);
        setStatusCounts(data.statusCounts || []);
        setTotalCount(data.totalCount || 0);
      }
    } catch (err) {
      console.error("Failed to load admin enquiries:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus, search]);

  React.useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  // Quick Status Change
  const handleQuickStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
        // Refresh counts
        fetchEnquiries();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Open Edit Modal
  const openEditModal = (enq: any) => {
    setEditingEnquiry(enq);
    setEditStatus(enq.status);
    setEditNotes(enq.agentNotes || "");
    setEditQuote(enq.quotedAmount ? String(enq.quotedAmount) : "");
  };

  // Save Modal
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEnquiry) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingEnquiry.id,
          status: editStatus,
          agentNotes: editNotes,
          quotedAmount: editQuote ? parseFloat(editQuote) : null,
        }),
      });
      const data = await res.json();
      if (res.ok && data.enquiry) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === editingEnquiry.id ? data.enquiry : e))
        );
        setEditingEnquiry(null);
        fetchEnquiries();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadgeClass = (st: string) => {
    switch (st) {
      case "New":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Contacted":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "In Progress":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Quoted":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Converted":
        return "bg-emerald-600 text-white border-emerald-600 font-bold";
      case "Closed":
        return "bg-slate-200 text-slate-700 border-slate-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Header />

      <main className="flex-1 py-8 sm:py-10 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-luxury-sm">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-gold-600 mb-1">
                <ShieldCheck className="h-4 w-4" />
                <span>Sah Tour And Travel Operations</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-navy-950">
                Customer Travel Enquiry & Callback Desk
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Manage, quote, and transition customer travel leads across all 6 administrative stages.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchEnquiries}
                className="text-xs"
                leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />}
              >
                Refresh Desk
              </Button>

              <Link href="/contact">
                <Button variant="luxury" size="sm" className="text-xs">
                  + New Customer Enquiry
                </Button>
              </Link>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setSelectedStatus("ALL")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all border ${
                selectedStatus === "ALL"
                  ? "bg-brand-navy-950 text-white border-brand-navy-950 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              All Enquiries ({totalCount})
            </button>

            {STATUS_OPTIONS.map((st) => {
              const countObj = statusCounts.find((sc) => sc.status === st);
              const count = countObj ? countObj.count : 0;
              const isSelected = selectedStatus === st;

              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStatus(st)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all border flex items-center gap-2 ${
                    isSelected
                      ? "bg-brand-navy-900 text-white border-brand-navy-900 shadow-xs"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span>{st}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      isSelected ? "bg-brand-gold-500 text-brand-navy-950" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className="pointer-events-none absolute left-3.5 top-3 flex items-center text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search by Reference ID (e.g. STT-ENQ-2026-8912), customer name, email, phone, or destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 shadow-xs focus:border-brand-navy-900 focus:ring-2 focus:ring-brand-gold-500/50"
            />
          </div>

          {/* Enquiries List */}
          {enquiries.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-slate-300">
              <MessageSquare className="h-10 w-10 text-slate-400 mx-auto mb-3" />
              <h3 className="font-heading text-base font-bold text-slate-800">
                No Enquiries Found
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                There are no enquiries matching the status filter &quot;{selectedStatus}&quot;.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {enquiries.map((enq) => (
                <Card
                  key={enq.id}
                  className="border border-slate-200 shadow-luxury-sm hover:border-slate-300 transition-colors bg-white overflow-hidden"
                >
                  <CardContent className="p-5 sm:p-6 space-y-4">
                    {/* Header: Ref No, Callback indicator, Status Selector, Date */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-extrabold text-brand-navy-950">
                          {enq.referenceNo}
                        </span>

                        {enq.isCallback && (
                          <span className="rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-bold px-2 py-0.5">
                            ⚡ Callback Requested
                          </span>
                        )}

                        <span
                          className={`rounded-full text-[11px] font-bold px-2.5 py-0.5 border ${getStatusBadgeClass(
                            enq.status
                          )}`}
                        >
                          {enq.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">
                          Received: {formatDate(enq.createdAt)}
                        </span>

                        {/* Fast Status Selector */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-slate-500">Status:</span>
                          <select
                            disabled={updatingId === enq.id}
                            value={enq.status}
                            onChange={(e) => handleQuickStatusChange(enq.id, e.target.value)}
                            className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-bold text-slate-800 shadow-xs focus:ring-2 focus:ring-brand-gold-500"
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Customer & Destination Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                      {/* Customer Info */}
                      <div className="space-y-1">
                        <span className="text-slate-400 font-semibold uppercase text-[10px] block">
                          Customer
                        </span>
                        <p className="font-bold text-slate-900 text-sm">{enq.name}</p>
                        <div className="flex items-center gap-1 text-slate-600">
                          <Phone className="h-3 w-3 text-brand-gold-500" />
                          <a href={`tel:${enq.phone}`} className="hover:underline">
                            {enq.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-1 text-slate-600">
                          <Mail className="h-3 w-3 text-brand-teal-500" />
                          <a href={`mailto:${enq.email}`} className="hover:underline truncate">
                            {enq.email}
                          </a>
                        </div>
                      </div>

                      {/* Travel Specs */}
                      <div className="space-y-1">
                        <span className="text-slate-400 font-semibold uppercase text-[10px] block">
                          Travel Specs
                        </span>
                        <p className="font-bold text-slate-900">{enq.destination}</p>
                        <p className="text-slate-500">
                          Date:{" "}
                          <strong>
                            {enq.travelDate ? formatDate(enq.travelDate) : "Flexible"}
                          </strong>
                        </p>
                        <p className="text-slate-500">
                          Travellers: <strong>{enq.travelersCount} Adults</strong>
                        </p>
                      </div>

                      {/* Budget & Type */}
                      <div className="space-y-1">
                        <span className="text-slate-400 font-semibold uppercase text-[10px] block">
                          Commercial Profile
                        </span>
                        <p className="text-slate-700">
                          Budget: <strong>{enq.budgetRange || "Standard"}</strong>
                        </p>
                        <p className="text-slate-700">
                          Type: <strong>{enq.travelType || "Escorted Tour"}</strong>
                        </p>
                        {enq.quotedAmount && (
                          <p className="text-emerald-700 font-bold">
                            Quoted: ₹{enq.quotedAmount.toLocaleString("en-IN")}
                          </p>
                        )}
                        {enq.preferredCallbackTime && (
                          <p className="text-rose-700 font-bold text-[11px]">
                            Preferred Slot: {enq.preferredCallbackTime}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col justify-between items-start md:items-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(enq)}
                          className="text-xs"
                          leftIcon={<Edit3 className="h-3.5 w-3.5 text-brand-navy-800" />}
                        >
                          Quote / Add Notes
                        </Button>

                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${enq.phone}`}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                            title="Call customer"
                          >
                            <Phone className="h-4 w-4" />
                          </a>
                          <a
                            href={`mailto:${enq.email}?subject=Regarding Your Sah Tour Enquiry ${enq.referenceNo}`}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                            title="Email customer"
                          >
                            <Mail className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Customer Message */}
                    <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 text-xs text-slate-700">
                      <strong className="text-slate-900 block mb-0.5">Customer Message:</strong>
                      &ldquo;{enq.message}&rdquo;
                    </div>

                    {/* Agent Notes (if any) */}
                    {enq.agentNotes && (
                      <div className="rounded-xl border border-brand-gold-300 bg-brand-gold-50/70 p-3 text-xs text-brand-navy-950 space-y-1">
                        <strong className="block text-[11px] uppercase tracking-wider text-brand-gold-800">
                          Agent Counselor Notes:
                        </strong>
                        <p>{enq.agentNotes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Edit Notes & Quotation Modal */}
      {editingEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-luxury-lg space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-600 block">
                  Lead Management
                </span>
                <h3 className="font-heading text-lg font-bold text-brand-navy-900">
                  Update {editingEnquiry.referenceNo}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingEnquiry(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Update Admin Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 font-bold shadow-xs focus:ring-2 focus:ring-brand-gold-500/50"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Quotation Amount (INR ₹)"
                type="number"
                placeholder="e.g. 148000"
                value={editQuote}
                onChange={(e) => setEditQuote(e.target.value)}
                helperText="Entering a quotation notifies the customer if they have an active account."
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Specialist Consultation Notes
                </label>
                <textarea
                  rows={4}
                  placeholder="Record call summary, customized hotel allotments, flight inclusions, or client follow-up timings."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 shadow-xs focus:border-brand-navy-900 focus:ring-2 focus:ring-brand-gold-500/50"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingEnquiry(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving Lead..." : "Save & Update Lead"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
