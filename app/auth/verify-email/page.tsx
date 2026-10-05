"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  MailCheck,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlToken = searchParams.get("token") || "";

  const [token, setToken] = React.useState(urlToken);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [resendStatus, setResendStatus] = React.useState<string | null>(null);
  const [isResending, setIsResending] = React.useState(false);

  const handleVerify = React.useCallback(async (tokenToVerify: string) => {
    if (!tokenToVerify) return;
    setError(null);
    setIsVerifying(true);

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenToVerify.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Email verification failed.");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred during verification.");
    } finally {
      setIsVerifying(false);
    }
  }, []);

  // Auto-verify if token is in URL
  React.useEffect(() => {
    if (urlToken) {
      setToken(urlToken);
      handleVerify(urlToken);
    }
  }, [urlToken, handleVerify]);

  const handleResend = async () => {
    setError(null);
    setResendStatus(null);
    setIsResending(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate new verification link.");
      }
      setResendStatus(`New token generated: ${data.verificationToken}`);
      setToken(data.verificationToken);
    } catch (err: any) {
      setError(err.message || "Failed to resend.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="border border-slate-200/80 shadow-luxury-lg bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-brand-emerald-500 via-brand-navy-800 to-brand-gold-400" />

      <CardContent className="p-6 sm:p-8 space-y-6">
        {isSuccess ? (
          <div className="text-center space-y-4 py-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">
                Verification Complete!
              </h2>
              <p className="text-xs text-slate-600">
                Your customer account is now officially verified. You can now download booking vouchers, manage reservations, and customize your travel preferences.
              </p>
            </div>

            <Link href="/account">
              <Button
                variant="luxury"
                className="w-full h-11 text-sm font-bold shadow-luxury-sm mt-2"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Go to Traveler Dashboard
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800 flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Verification Failed</p>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {resendStatus && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-xs font-medium text-blue-800 flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <span>{resendStatus}</span>
              </div>
            )}

            <div className="space-y-3">
              <Input
                label="Security Verification Token"
                placeholder="Paste your 64-character verification token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />

              <Button
                onClick={() => handleVerify(token)}
                disabled={isVerifying || !token.trim()}
                className="w-full h-11 text-sm font-bold"
              >
                {isVerifying ? "Verifying Token..." : "Confirm & Verify Email"}
              </Button>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-600">
              <span>Need a new token?</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="font-bold text-brand-gold-600 hover:text-brand-gold-700 flex items-center gap-1"
              >
                <RefreshCw className={`h-3 w-3 ${isResending ? "animate-spin" : ""}`} />
                <span>Resend Token</span>
              </button>
            </div>
          </div>
        )}

        <div className="border-t border-slate-100 pt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-brand-emerald-600" />
          <span>Sah Anti-Fraud Trust Certification</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-brand-navy-50/20 to-slate-100">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-emerald-100 text-brand-emerald-700 mb-3 shadow-xs">
              <MailCheck className="h-7 w-7" />
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-brand-navy-950 tracking-tight">
              Email Verification
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Verify your customer email address to activate your full booking privileges and security protections.
            </p>
          </div>

          <React.Suspense
            fallback={
              <Card className="p-8 text-center text-xs text-slate-500">
                Loading email verification...
              </Card>
            }
          >
            <VerifyEmailForm />
          </React.Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
