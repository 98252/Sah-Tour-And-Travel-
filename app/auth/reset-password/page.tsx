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
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlToken = searchParams.get("token") || "";

  const [token, setToken] = React.useState(urlToken);
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (urlToken) {
      setToken(urlToken);
    }
  }, [urlToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token.trim()) {
      setError("Reset token is missing. Please use the link provided in your email.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long with letters and numbers.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      setSuccess("Your password has been securely updated! Redirecting to login...");
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border border-slate-200/80 shadow-luxury-lg bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-brand-gold-500 via-brand-navy-800 to-brand-gold-400" />

      <CardContent className="p-6 sm:p-8 space-y-6">
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800 flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800 flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!urlToken && (
            <Input
              label="Reset Token"
              type="text"
              required
              placeholder="Enter security token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          )}

          <div className="relative">
            <Input
              label="New Password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="At least 8 chars (letters & numbers)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <Input
            label="Confirm New Password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            leftIcon={<Lock className="h-4 w-4" />}
          />

          <Button
            type="submit"
            variant="default"
            disabled={isLoading}
            className="w-full h-11 text-sm font-bold shadow-luxury-sm mt-2"
          >
            {isLoading ? "Updating Password..." : "Update Password & Sign In"}
          </Button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-600">
          Remember your password?{" "}
          <Link
            href="/auth/login"
            className="font-bold text-brand-gold-600 hover:text-brand-gold-700 hover:underline"
          >
            Sign In
          </Link>
        </div>

        <div className="border-t border-slate-100 pt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-brand-emerald-600" />
          <span>Encrypted bcrypt hash update with automatic session revocation</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
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
              Create New Password
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Enter your new secure password below to regain full account access.
            </p>
          </div>

          <React.Suspense
            fallback={
              <Card className="p-8 text-center text-xs text-slate-500">
                Loading password reset...
              </Card>
            }
          >
            <ResetPasswordForm />
          </React.Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
