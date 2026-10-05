import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Users,
  MapPin,
  Printer,
  Download,
  Building2,
  Clock,
  PhoneCall,
  Mail,
  ArrowLeft,
  FileCheck,
} from "lucide-react";
import { VoucherPrintButton } from "@/components/booking/voucher-print-button";

export interface BookingConfirmationPageProps {
  params: Promise<{ reference: string }>;
}

export async function generateMetadata(
  props: BookingConfirmationPageProps
): Promise<Metadata> {
  const { reference } = await props.params;
  return {
    title: `Booking Voucher: ${reference} | Sah Tour And Travel`,
    description: `Official digital itinerary voucher and passenger manifest for reservation ${reference}.`,
  };
}

export default async function BookingConfirmationPage(
  props: BookingConfirmationPageProps
) {
  const { reference } = await props.params;

  const booking = await prisma.booking.findFirst({
    where: {
      OR: [{ bookingReference: reference }, { id: reference }],
    },
    include: {
      package: {
        include: {
          destination: true,
          source: true,
          hotels: true,
        },
      },
      payments: true,
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!booking) {
    notFound();
  }

  let travelers: any[] = [];
  try {
    travelers = JSON.parse(booking.travelersJson);
  } catch {
    travelers = [];
  }

  let addons: any[] = [];
  try {
    addons = booking.addonsJson ? JSON.parse(booking.addonsJson) : [];
  } catch {
    addons = [];
  }

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
        <div className="container mx-auto max-w-4xl space-y-6">
          {/* Top Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
            <Link
              href="/account?tab=bookings"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-navy-950 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to My Bookings</span>
            </Link>

            <div className="flex items-center gap-2">
              <VoucherPrintButton />
              <Link href="/account?tab=bookings">
                <Button size="sm" variant="default" className="text-xs">
                  My Portal
                </Button>
              </Link>
            </div>
          </div>

          {/* Official Printable Voucher */}
          <Card className="border border-slate-200 shadow-luxury-md bg-white rounded-3xl overflow-hidden print:shadow-none print:border-none">
            {/* Voucher Header Band */}
            <div className="bg-brand-navy-950 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold-400 block">
                  Official Service Voucher & Itinerary Pass
                </span>
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  SAH TOUR AND TRAVEL
                </h1>
                <p className="text-xs text-slate-300 mt-1">
                  Commercial Travel Desk • Allotment Citation: {booking.package.source.licenseRef}
                </p>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Booking Reference
                </span>
                <span className="font-mono text-xl sm:text-2xl font-extrabold text-brand-gold-300">
                  {booking.bookingReference}
                </span>
                <div>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            </div>

            <CardContent className="p-6 sm:p-8 space-y-8">
              {/* Trip Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[11px] font-bold uppercase">
                    Tour Package
                  </span>
                  <strong className="text-brand-navy-950 text-sm block mt-0.5">
                    {booking.package.name}
                  </strong>
                  <span className="text-slate-500">{booking.package.durationText}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px] font-bold uppercase">
                    Confirmed Departure Date
                  </span>
                  <strong className="text-brand-navy-950 text-sm block mt-0.5">
                    {formatDate(booking.travelDate)}
                  </strong>
                  <span className="text-slate-500">Ex-{booking.package.departureCity}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px] font-bold uppercase">
                    Total Travellers
                  </span>
                  <strong className="text-brand-navy-950 text-sm block mt-0.5">
                    {booking.adultsCount} Adults
                    {booking.childrenCount > 0 ? `, ${booking.childrenCount} Children` : ""}
                    {booking.infantsCount > 0 ? `, ${booking.infantsCount} Infants` : ""}
                  </strong>
                  <span className="text-emerald-700 font-semibold">
                    {booking.travelersCount} Confirmed Seats
                  </span>
                </div>
              </div>

              {/* Passenger Manifest */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-brand-navy-900" />
                  <h3 className="font-heading text-sm font-bold text-brand-navy-950 uppercase tracking-wider">
                    Passenger Manifest ({travelers.length} Passengers)
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">Title</th>
                        <th className="p-3">Full Passenger Name</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Gender</th>
                        <th className="p-3">Passport / ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {travelers.map((t, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-3 font-mono font-bold text-slate-400">{idx + 1}</td>
                          <td className="p-3 font-medium">{t.title}</td>
                          <td className="p-3 font-bold text-brand-navy-950">
                            {t.firstName} {t.lastName}
                          </td>
                          <td className="p-3">{t.type}</td>
                          <td className="p-3">{t.gender}</td>
                          <td className="p-3 font-mono text-[11px] text-slate-500">
                            {t.passportNumber || "Verified at check-in"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Verified Transparent Pricing Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-brand-gold-600" />
                  <h3 className="font-heading text-sm font-bold text-brand-navy-950 uppercase tracking-wider">
                    Verified Transparent Tariff Breakdown
                  </h3>
                </div>

                <div className="rounded-2xl border border-slate-200 overflow-hidden text-xs">
                  <div className="divide-y divide-slate-100">
                    <div className="flex justify-between p-3">
                      <span className="text-slate-600 font-medium">Base Tour Package Tariff:</span>
                      <span className="font-mono font-bold text-slate-900">
                        ₹{booking.basePrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between p-3">
                      <span className="text-slate-600 font-medium">Taxes (Government 5% Tour GST):</span>
                      <span className="font-mono font-bold text-slate-900">
                        ₹{booking.taxesAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between p-3">
                      <span className="text-slate-600 font-medium">Regulatory & Supplier Booking Fee:</span>
                      <span className="font-mono font-bold text-slate-900">
                        ₹{booking.feesAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    {booking.addonsAmount > 0 && (
                      <div className="flex justify-between p-3 bg-brand-gold-50/50">
                        <span className="text-brand-navy-950 font-bold">Selected Optional Add-ons:</span>
                        <span className="font-mono font-bold text-brand-navy-950">
                          +₹{booking.addonsAmount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between p-4 bg-brand-navy-950 text-white font-bold text-sm">
                      <span>Total Amount Paid / Payable:</span>
                      <span className="font-mono text-base font-extrabold text-brand-gold-300">
                        ₹{booking.totalAmount.toLocaleString("en-IN")} {booking.currency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Receipt Info */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-1.5 text-slate-600">
                <span className="font-bold text-brand-navy-950 uppercase tracking-wider block text-[10px]">
                  Payment Authorization & Transaction Verification
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Payment Method:</span>
                    <strong>{booking.paymentMethod || "Electronic"}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Payment Status:</span>
                    <strong className="text-emerald-700">{booking.paymentStatus}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Transaction ID:</span>
                    <strong className="font-mono text-[11px]">{booking.transactionId || "N/A"}</strong>
                  </div>
                </div>
              </div>

              {/* Support & Desk Contact */}
              <div className="rounded-2xl border border-brand-navy-900/10 bg-brand-navy-50/50 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                <div>
                  <h4 className="font-heading font-bold text-brand-navy-950">
                    24/7 Operations Concierge & Emergency Helpline
                  </h4>
                  <p className="text-slate-500 mt-0.5">
                    For departure coordination or transfer queries, quote ref: <strong>{booking.bookingReference}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-4 text-slate-700 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <PhoneCall className="h-3.5 w-3.5 text-brand-gold-600" />
                    <span>{siteConfig.contact.helpline}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-brand-teal-600" />
                    <span>{siteConfig.contact.email}</span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
