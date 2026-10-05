"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CallbackModal } from "@/components/enquiry/callback-modal";
import { siteConfig } from "@/config/site";
import {
  CheckCircle2,
  Clock,
  PhoneCall,
  Compass,
  ArrowRight,
  ShieldCheck,
  Mail,
  Copy,
  Check,
  FileText,
} from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const referenceNo = searchParams.get("ref") || `STT-ENQ-${new Date().getFullYear()}-0000`;

  const [copied, setCopied] = React.useState(false);
  const [isCallbackOpen, setIsCallbackOpen] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referenceNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card className="border border-slate-200/90 shadow-luxury-lg bg-white rounded-3xl overflow-hidden text-center">
        <div className="h-2.5 bg-gradient-to-r from-emerald-500 via-brand-gold-500 to-emerald-600" />

        <CardContent className="p-6 sm:p-12 space-y-6">
          {/* Animated Success Badge */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600 shadow-sm animate-in zoom-in-75 duration-300">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
              Enquiry Successfully Registered
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-navy-950 tracking-tight">
              We&apos;ve Received Your Travel Enquiry!
            </h1>
            <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              Your customized holiday requirements have been logged into our reservation system. An email confirmation has been dispatched to your inbox.
            </p>
          </div>

          {/* Reference Box with Copy */}
          <div className="rounded-2xl border-2 border-brand-navy-900/10 bg-slate-50 p-5 max-w-md mx-auto space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Official Lead Reference ID
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="font-mono text-2xl font-extrabold text-brand-navy-950 tracking-wide">
                {referenceNo}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                title="Copy reference number"
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-white hover:bg-slate-100 transition-colors shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-slate-600" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Please quote this reference number during any correspondence with our desk.
            </p>
          </div>

          {/* Service Level Agreement Timeline */}
          <div className="rounded-2xl border border-brand-gold-200 bg-brand-gold-50/70 p-5 text-left space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-navy-950">
              <Clock className="h-4 w-4 text-brand-gold-600" />
              <span>What Happens Next? (Sah Service Protocol)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl bg-white p-3 border border-brand-gold-200/60 space-y-1 shadow-xs">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold-500 text-[10px] font-bold text-white">
                  1
                </span>
                <p className="font-bold text-slate-900">Expert Assignment</p>
                <p className="text-[11px] text-slate-500">
                  Assigned to a certified specialist for your chosen destination.
                </p>
              </div>

              <div className="rounded-xl bg-white p-3 border border-brand-gold-200/60 space-y-1 shadow-xs">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold-500 text-[10px] font-bold text-white">
                  2
                </span>
                <p className="font-bold text-slate-900">Customized Plan</p>
                <p className="text-[11px] text-slate-500">
                  A day-by-day itinerary & transparent hotel quote is formulated.
                </p>
              </div>

              <div className="rounded-xl bg-white p-3 border border-brand-gold-200/60 space-y-1 shadow-xs">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold-500 text-[10px] font-bold text-white">
                  3
                </span>
                <p className="font-bold text-slate-900">Within 4 Hours</p>
                <p className="text-[11px] text-slate-500">
                  You receive a detailed quotation via WhatsApp & email.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsCallbackOpen(true)}
              className="w-full sm:w-auto h-11 text-xs font-semibold"
              leftIcon={<PhoneCall className="h-3.5 w-3.5 text-brand-gold-600" />}
            >
              Request an Urgent Callback
            </Button>

            <Link href="/account?tab=enquiries" className="w-full sm:w-auto">
              <Button
                variant="default"
                className="w-full h-11 text-xs font-semibold"
                leftIcon={<FileText className="h-3.5 w-3.5 text-brand-gold-400" />}
              >
                Track in My Account
              </Button>
            </Link>

            <Link href="/holidays" className="w-full sm:w-auto">
              <Button
                variant="luxury"
                className="w-full h-11 text-xs font-bold"
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
              >
                Browse Holiday Packages
              </Button>
            </Link>
          </div>

          {/* Configurable Contact Reminder */}
          <div className="border-t border-slate-100 pt-4 text-xs text-slate-500 flex flex-wrap items-center justify-center gap-4">
            <span className="flex items-center gap-1.5">
              <PhoneCall className="h-3.5 w-3.5 text-brand-gold-500" />
              <span>Desk: {siteConfig.contact.helpline}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-brand-teal-500" />
              <span>{siteConfig.contact.email}</span>
            </span>
          </div>
        </CardContent>
      </Card>

      <CallbackModal
        isOpen={isCallbackOpen}
        onClose={() => setIsCallbackOpen(false)}
        defaultDestination="Swiss / European Alps Holiday"
      />
    </div>
  );
}

export default function EnquirySuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-brand-navy-50/20 to-slate-100">
      <Header />

      <main className="flex-1 py-12 sm:py-16 px-4 sm:px-6">
        <React.Suspense
          fallback={
            <div className="max-w-md mx-auto text-center p-12 text-sm text-slate-500">
              Loading enquiry confirmation...
            </div>
          }
        >
          <SuccessContent />
        </React.Suspense>
      </main>

      <Footer />
    </div>
  );
}
