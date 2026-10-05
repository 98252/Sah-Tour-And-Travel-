"use client";

import * as React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  X,
  RefreshCw,
  Eye,
  FileText,
  AlertCircle,
} from "lucide-react";
import { VALID_BOOKING_STATUSES, BookingStatus } from "@/lib/booking";

export default function AdminBookingsPage() {
  const [selectedStatus, setSelectedStatus] = React.useState<string>("ALL");
  const [search, setSearch] = React.useState<string>("");
  const [bookings, setBookings] = React.useState<any[]>([]);
  const [statusCounts, setStatusCounts] = React.useState<any[]>([]);
  const [totalCount, setTotalCount] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  // Edit / Status Modal State
  const [activeBooking, setActiveBooking] = React.useState<any | null>(null);
  const [newStatus, setNewStatus] = React.useState<string>("");
  const [agentNotes, setAgentNotes] = React.useState<string>("");
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  const fetchBookings = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedStatus !== "ALL") params.set("status", selectedStatus);
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/admin/bookings?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setBookings(data.bookings || []);
        setStatusCounts(data.statusCounts || []);
        setTotalCount(data.totalCount || 0);
      }
    } catch (err) {
      console.error("Admin bookings fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus, search]);

  React.useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Quick Status Transition
  const handleUpdateStatus = async (id: string, status: string, notes?: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, agentNotes: notes }),
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status } : b))
        );
        fetchBookings();
        setActiveBooking(null);
      }
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Payment Pending":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "Pending":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Cancelled":
        return "bg-rose-100 text-rose-800 border-rose-300";
      case "Completed":
        return "bg-slate-100 text-slate-800 border-slate-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 py-10 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-600 bg-brand-gold-50 px-2 py-0.5 rounded-md border border-brand-gold-200">
                  Staff Operations Console
                </span>
                <span className="text-xs text-slate-400">Total Bookings: {totalCount}</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-navy-950 mt-1">
                Booking Management Desk
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchBookings}
                leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />}
                className="text-xs"
              >
                Refresh Data
              </Button>
              <Link href="/admin/enquiries">
                <Button variant="default" size="sm" className="text-xs">
                  View Enquiries Desk
                </Button>
              </Link>
            </div>
          </div>

          {/* Status Filter Tabs (Exact 5 Statuses) */}
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedStatus("ALL")}
              className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedStatus === "ALL"
                  ? "bg-brand-navy-950 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              All Bookings ({totalCount})
            </button>

            {VALID_BOOKING_STATUSES.map((st) => {
              const count = statusCounts.find((c) => c.status === st)?.count || 0;
              const isSelected = selectedStatus === st;

              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? "bg-brand-navy-950 text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span>{st}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isSelected
                        ? "bg-brand-gold-500 text-brand-navy-950"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <Card className="border border-slate-200 shadow-xs bg-white p-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search bookings by Reference ID, customer name, email, phone, or package..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:border-brand-navy-900 focus:ring-2 focus:ring-brand-gold-500/40"
              />
            </div>
          </Card>

          {/* Bookings Table */}
          <Card className="border border-slate-200 shadow-luxury-sm bg-white overflow-hidden rounded-2xl">
            {isLoading ? (
              <div className="p-12 text-center text-xs text-slate-500">
                Loading bookings from reservation database...
              </div>
            ) : bookings.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500 space-y-2">
                <AlertCircle className="h-8 w-8 text-slate-300 mx-auto" />
                <p className="font-semibold text-slate-700">No Bookings Found</p>
                <p>No bookings match the selected status filter or search parameters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-100">
                    <tr>
                      <th className="p-4">Reference</th>
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Tour Package</th>
                      <th className="p-4">Departure Date</th>
                      <th className="p-4">Pax</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-mono font-bold text-brand-navy-950">
                          {booking.bookingReference}
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-brand-navy-900">{booking.customerName}</p>
                          <p className="text-[11px] text-slate-500">{booking.customerPhone}</p>
                          <p className="text-[11px] text-slate-400">{booking.customerEmail}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-slate-900 line-clamp-1">
                            {booking.package.name}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {booking.package.destination?.name}
                          </span>
                        </td>
                        <td className="p-4 font-medium">
                          {formatDate(booking.travelDate)}
                        </td>
                        <td className="p-4 font-medium">
                          {booking.travelersCount} Pax
                        </td>
                        <td className="p-4 font-mono font-bold text-brand-navy-950">
                          ₹{booking.totalAmount.toLocaleString("en-IN")}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                          <Link
                            href={`/book/confirmation/${booking.bookingReference}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:text-brand-navy-950 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 transition-colors"
                          >
                            <Eye className="h-3 w-3" />
                            <span>Voucher</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveBooking(booking);
                              setNewStatus(booking.status);
                              setAgentNotes(booking.agentNotes || "");
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-brand-navy-900 hover:bg-brand-gold-50 rounded-lg border border-brand-gold-400/40 bg-white transition-colors"
                          >
                            <span>Update</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* Edit Booking Modal */}
      {activeBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-luxury-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading text-lg font-bold text-brand-navy-950">
                  Update Booking Status
                </h3>
                <p className="font-mono text-xs text-slate-400">
                  Ref: {activeBooking.bookingReference}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveBooking(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Change Status (Phase 8 Exact 5 Statuses)
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
                >
                  {VALID_BOOKING_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Operational Agent Notes
                </label>
                <textarea
                  rows={3}
                  value={agentNotes}
                  onChange={(e) => setAgentNotes(e.target.value)}
                  placeholder="e.g. Flight tickets issued with Swiss Travel System reference, local voucher dispatched."
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveBooking(null)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="luxury"
                  onClick={() => handleUpdateStatus(activeBooking.id, newStatus, agentNotes)}
                  disabled={updatingId === activeBooking.id}
                  className="text-xs font-bold"
                >
                  {updatingId === activeBooking.id ? "Saving..." : "Save Status"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
