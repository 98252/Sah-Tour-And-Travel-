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
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to sign in. Please verify your credentials.");
      }

      setSuccess("Sign in successful! Redirecting to your travel portal...");
      setTimeout(() => {
        router.push(redirect);
        router.refresh();
      }, 700);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsGoogleLoading(true);
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Google authentication failed.");
      }
      setSuccess("Authenticated with Google! Redirecting...");
      setTimeout(() => {
        router.push(redirect);
        router.refresh();
      }, 700);
    } catch (err: any) {
      setError(err.message || "Failed to connect with Google.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail("customer@sahtour.com");
    setPassword("SahTravel@2026");
    setError(null);
  };

  return (
    <Card className="border border-slate-200/80 shadow-luxury-lg bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-brand-gold-500 via-brand-navy-800 to-brand-gold-400" />

      <CardContent className="p-6 sm:p-8 space-y-6">
        {/* Demo Fill Helper Banner */}
        <div className="rounded-xl border border-brand-gold-200 bg-brand-gold-50/70 p-3.5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-brand-navy-900">
            <Sparkles className="h-4 w-4 text-brand-gold-600 shrink-0" />
            <span>
              <strong>Quick Test:</strong> Use verified demo customer
            </span>
          </div>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-brand-navy-900 text-white hover:bg-brand-gold-600 transition-colors shrink-0 shadow-xs"
          >
            Auto Fill Demo
          </button>
        </div>

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
          <Input
            label="Email Address"
            type="email"
            required
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="h-4 w-4" />}
          />

          <div className="space-y-1.5">
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter your account password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="h-4 w-4" />}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-brand-gold-500 focus:ring-brand-gold-500"
              />
              <span>Remember this device</span>
            </label>
            <Link
              href="/auth/forgot-password"
              className="font-semibold text-brand-gold-600 hover:text-brand-gold-700 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="default"
            disabled={isLoading}
            className="w-full h-11 text-sm font-bold shadow-luxury-sm mt-2"
          >
            {isLoading ? "Signing in..." : "Sign In to Travel Portal"}
          </Button>

          {/* Divider */}
          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-xs uppercase tracking-wider text-slate-400 font-medium">
              Or continue with
            </span>
          </div>

          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            disabled={isGoogleLoading}
            onClick={handleGoogleLogin}
            className="w-full h-11 border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium"
          >
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            {isGoogleLoading ? "Connecting..." : "Continue with Google"}
          </Button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-600">
          Don&apos;t have an account yet?{" "}
          <Link
            href={`/auth/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
            className="font-bold text-brand-gold-600 hover:text-brand-gold-700 hover:underline"
          >
            Create an account
          </Link>
        </div>

        <div className="border-t border-slate-100 pt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-brand-emerald-600" />
          <span>256-Bit SSL Encrypted Customer Session</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-brand-navy-50/20 to-slate-100">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Brand header */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-gold-100 text-brand-gold-800 border border-brand-gold-200 mb-3">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-gold-700" />
              Secure Traveler Portal
            </span>
            <h1 className="font-heading text-3xl font-extrabold text-brand-navy-950 tracking-tight">
              Sign In to Your Account
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Access your booked itineraries, verified vouchers, and saved holiday packages.
            </p>
          </div>

          <React.Suspense
            fallback={
              <Card className="p-8 text-center text-xs text-slate-500">
                Loading login portal...
              </Card>
            }
          >
            <LoginForm />
          </React.Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
