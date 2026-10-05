"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();
  const [tab, setTab] = React.useState<"login" | "register">("login");

  // Form states
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isOpen) {
      setError(null);
      setSuccess(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const endpoint = tab === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload =
        tab === "login"
          ? { email, password }
          : { name, email, password, country: "India" };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      setSuccess(
        tab === "login"
          ? "Signed in successfully! Redirecting..."
          : "Account created! Welcome to Sah Tour And Travel."
      );

      setTimeout(() => {
        onClose();
        router.push("/account");
        router.refresh();
      }, 800);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Google login failed.");
      setSuccess("Authenticated with Google! Redirecting...");
      setTimeout(() => {
        onClose();
        router.push("/account");
        router.refresh();
      }, 800);
    } catch (err: any) {
      setError(err.message || "Failed to authenticate with Google.");
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail("customer@sahtour.com");
    setPassword("SahTravel@2026");
    setError(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={tab === "login" ? "Sign In to Your Account" : "Create Traveler Account"}
      description="Access your saved packages, booking vouchers, and customized itineraries"
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Tab switch */}
        <div className="flex rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => {
              setTab("login");
              setError(null);
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
              tab === "login"
                ? "bg-white text-brand-navy-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("register");
              setError(null);
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
              tab === "register"
                ? "bg-white text-brand-navy-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Register
          </button>
        </div>

        {/* Demo Credentials Quick Pill */}
        {tab === "login" && (
          <div className="rounded-xl border border-brand-gold-200 bg-brand-gold-50/70 p-2.5 flex items-center justify-between gap-2 text-xs">
            <span className="text-[11px] text-brand-navy-900">
              <strong>Quick Test:</strong> Use verified demo customer
            </span>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="px-2 py-0.5 text-[11px] font-bold rounded-lg bg-brand-navy-900 text-white hover:bg-brand-gold-600 transition-colors shrink-0"
            >
              Fill Demo
            </button>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-800 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800 flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === "register" && (
            <Input
              label="Full Name"
              type="text"
              required
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="h-4 w-4" />}
            />
          )}

          <Input
            label="Email Address"
            type="email"
            required
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="h-4 w-4" />}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              required
              placeholder={tab === "register" ? "At least 8 characters" : "Enter your password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {tab === "login" && (
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-300 text-brand-gold-500 focus:ring-brand-gold-500"
                />
                <span>Remember me</span>
              </label>
              <Link
                href="/auth/forgot-password"
                onClick={onClose}
                className="font-semibold text-brand-gold-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          )}

          <Button
            type="submit"
            variant="default"
            disabled={isLoading}
            className="w-full h-11 text-xs font-bold"
          >
            {isLoading
              ? "Authenticating..."
              : tab === "login"
              ? "Sign In to Travel Portal"
              : "Create Traveler Account"}
          </Button>

          <div className="relative my-3 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-[11px] uppercase tracking-wider text-slate-400">
              Or continue with
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            className="w-full h-10 border-slate-300 text-slate-700 text-xs"
            onClick={handleGoogleLogin}
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
            Continue with Google
          </Button>

          <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-emerald-600" />
            <span>Encrypted 256-Bit SSL Customer Security</span>
          </div>
        </form>
      </div>
    </Modal>
  );
}
