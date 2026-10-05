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
  User,
  Mail,
  Lock,
  Phone,
  Globe,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Compass,
} from "lucide-react";

const TRAVEL_PREFERENCE_OPTIONS = [
  "Luxury Escorted Tour",
  "Beach & Island Retreat",
  "Alpine Scenic Rail",
  "Cultural Heritage",
  "Honeymoon & Romantic",
  "Family Adventure",
  "Wildlife Safari",
];

const LANGUAGE_OPTIONS = [
  "English",
  "Hindi",
  "Bengali",
  "Tamil",
  "Telugu",
  "French",
  "German",
  "Arabic",
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [country, setCountry] = React.useState("India");
  const [preferredLanguage, setPreferredLanguage] = React.useState("English");
  const [selectedPreferences, setSelectedPreferences] = React.useState<string[]>([
    "Luxury Escorted Tour",
    "Beach & Island Retreat",
  ]);

  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [verificationLink, setVerificationLink] = React.useState<string | null>(null);

  const togglePreference = (pref: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const passStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setVerificationLink(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          country,
          preferredLanguage,
          travelPreferences: selectedPreferences,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create account.");
      }

      setSuccess("Account successfully created! Welcome to Sah Tour And Travel.");
      if (data.verificationLink) {
        setVerificationLink(data.verificationLink);
      }

      setTimeout(() => {
        router.push(redirect);
        router.refresh();
      }, 1500);
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
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800 space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
            {verificationLink && (
              <div className="mt-2 pt-2 border-t border-emerald-200/60">
                <p className="text-[11px] text-emerald-700 font-semibold mb-1">
                  Development Verification Link:
                </p>
                <Link
                  href={verificationLink}
                  className="text-xs font-bold underline text-brand-navy-900 hover:text-brand-gold-600"
                >
                  Verify Email Now ({verificationLink})
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              required
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="h-4 w-4" />}
            />

            <Input
              label="Email Address"
              type="email"
              required
              placeholder="rahul@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="h-4 w-4" />}
            />
          </div>

          {/* Password & Confirm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="At least 8 characters"
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
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
            />
          </div>

          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <div className="space-y-1">
              <div className="flex gap-1 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    passStrength >= 1 ? "bg-rose-500 w-1/4" : "w-0"
                  }`}
                />
                <div
                  className={`h-full transition-all ${
                    passStrength >= 2 ? "bg-amber-500 w-1/4" : "w-0"
                  }`}
                />
                <div
                  className={`h-full transition-all ${
                    passStrength >= 3 ? "bg-blue-500 w-1/4" : "w-0"
                  }`}
                />
                <div
                  className={`h-full transition-all ${
                    passStrength >= 4 ? "bg-emerald-500 w-1/4" : "w-0"
                  }`}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Strength:{" "}
                {passStrength < 2
                  ? "Weak (needs numbers & mixed case)"
                  : passStrength === 3
                  ? "Good"
                  : "Strong & Secure"}
              </p>
            </div>
          )}

          {/* Phone & Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number (Optional)"
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<Phone className="h-4 w-4" />}
            />

            <div className="w-full space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Country of Residence
              </label>
              <div className="relative flex items-center">
                <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
                  <Globe className="h-4 w-4" />
                </div>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-brand-navy-900 focus:ring-2 focus:ring-brand-gold-500/50"
                >
                  <option value="India">India</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Singapore">Singapore</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Australia">Australia</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preferred Language */}
          <div className="w-full space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Preferred Communication Language
            </label>
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-brand-navy-900 focus:ring-2 focus:ring-brand-gold-500/50"
            >
              {LANGUAGE_OPTIONS.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Travel Preferences */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700">
              <Compass className="h-3.5 w-3.5 text-brand-gold-600" />
              <span>Travel Style Preferences (Select what you love)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {TRAVEL_PREFERENCE_OPTIONS.map((option) => {
                const isSelected = selectedPreferences.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => togglePreference(option)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all border ${
                      isSelected
                        ? "bg-brand-navy-900 text-white border-brand-navy-900 shadow-xs"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {isSelected && "✓ "}
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Privacy & Anti-Sensitive Data Assurance */}
          <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-3 text-[11px] text-slate-500 leading-relaxed">
            <strong className="text-slate-700">Privacy Safeguard:</strong> Sah Tour And Travel respects your privacy. We only collect details essential for holiday planning and booking vouchers. We never store credit cards, bank passwords, or sensitive personal IDs.
          </div>

          <Button
            type="submit"
            variant="default"
            disabled={isLoading}
            className="w-full h-11 text-sm font-bold shadow-luxury-sm mt-3"
          >
            {isLoading ? "Creating your account..." : "Complete Registration & Explore"}
          </Button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-600">
          Already have an account?{" "}
          <Link
            href={`/auth/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
            className="font-bold text-brand-gold-600 hover:text-brand-gold-700 hover:underline"
          >
            Sign In
          </Link>
        </div>

        <div className="border-t border-slate-100 pt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-brand-emerald-600" />
          <span>Encrypted 256-Bit SSL Customer Security</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-brand-navy-50/20 to-slate-100">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-gold-100 text-brand-gold-800 border border-brand-gold-200 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-brand-gold-700" />
              Join Sah Travel Elite Circle
            </span>
            <h1 className="font-heading text-3xl font-extrabold text-brand-navy-950 tracking-tight">
              Create Your Traveler Profile
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Save packages to wishlist, manage bookings, and receive customized itineraries.
            </p>
          </div>

          <React.Suspense
            fallback={
              <Card className="p-8 text-center text-xs text-slate-500">
                Loading registration form...
              </Card>
            }
          >
            <RegisterForm />
          </React.Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
