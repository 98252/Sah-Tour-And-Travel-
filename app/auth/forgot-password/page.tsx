"use client";

import * as React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mail,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ExternalLink,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);
  const [devResetLink, setDevResetLink] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setDevResetLink(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to process password reset request.");
      }

      setMessage(data.message);
      if (data.devResetLink) {
        setDevResetLink(data.devResetLink);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-brand-navy-50/20 to-slate-100">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gold-100 text-brand-gold-700 mb-3 shadow-xs">
              <KeyRound className="h-6 w-6" />
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-brand-navy-950 tracking-tight">
              Reset Your Password
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Enter your registered email address and we will provide you a secure link to reset your credentials.
            </p>
          </div>

          <Card className="border border-slate-200/80 shadow-luxury-lg bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-brand-gold-500 via-brand-navy-800 to-brand-gold-400" />

            <CardContent className="p-6 sm:p-8 space-y-6">
              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800 flex items-start gap-3">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {message && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800 space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{message}</span>
                  </div>

                  {devResetLink && (
                    <div className="pt-2 border-t border-emerald-200/70">
                      <p className="text-[11px] text-emerald-900 font-bold mb-1">
                        Development Instant Reset Link:
                      </p>
                      <Link
                        href={devResetLink}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-navy-950 underline hover:text-brand-gold-600"
                      >
                        <span>Click here to set new password</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Registered Email Address"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="h-4 w-4" />}
                />

                <Button
                  type="submit"
                  variant="default"
                  disabled={isLoading}
                  className="w-full h-11 text-sm font-bold shadow-luxury-sm"
                >
                  {isLoading ? "Generating Reset Link..." : "Send Password Reset Link"}
                </Button>
              </form>

              <div className="pt-2 text-center text-xs text-slate-600">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-1.5 font-bold text-brand-navy-900 hover:text-brand-gold-600 transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Return to Sign In</span>
                </Link>
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-brand-emerald-600" />
                <span>Single-Use Cryptographic Reset Tokens (Expires in 60m)</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
