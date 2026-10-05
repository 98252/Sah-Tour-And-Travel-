"use client";

import * as React from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  calculateBookingPrice,
  CURATED_ADDONS,
  TravelerDetail,
} from "@/lib/booking";
import { formatCurrency, formatDate } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import {
  Calendar,
  Users,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CreditCard,
  Building2,
  FileCheck,
  HelpCircle,
  Download,
  PhoneCall,
  Check,
  Lock,
  Compass,
  PlaneTakeoff,
  Car,
  Utensils,
  MapPin,
  RefreshCw,
  X,
  ExternalLink,
} from "lucide-react";

export interface BookingWizardProps {
  initialPackage: any;
}

const STEPS = [
  { step: 1, title: "Travel Date", shortTitle: "Date" },
  { step: 2, title: "Travellers", shortTitle: "Pax" },
  { step: 3, title: "Passenger Details", shortTitle: "Details" },
  { step: 4, title: "Optional Add-ons", shortTitle: "Add-ons" },
  { step: 5, title: "Review Booking", shortTitle: "Review" },
  { step: 6, title: "Payment", shortTitle: "Payment" },
  { step: 7, title: "Confirmation", shortTitle: "Done" },
];

export function BookingWizard({ initialPackage }: BookingWizardProps) {
  const router = useRouter();
  const pkg = initialPackage;

  // Wizard Navigation
  const [currentStep, setCurrentStep] = React.useState<number>(1);

  // Step 1: Date
  const [selectedDate, setSelectedDate] = React.useState<string>("");
  const [availableDepartureDates, setAvailableDepartureDates] = React.useState<string[]>([]);

  // Step 2: Travellers
  const [adultsCount, setAdultsCount] = React.useState<number>(2);
  const [childrenCount, setChildrenCount] = React.useState<number>(0);
  const [infantsCount, setInfantsCount] = React.useState<number>(0);

  // Step 3: Passenger Information
  const [customerName, setCustomerName] = React.useState<string>("");
  const [customerEmail, setCustomerEmail] = React.useState<string>("");
  const [customerPhone, setCustomerPhone] = React.useState<string>("");
  const [travelers, setTravelers] = React.useState<TravelerDetail[]>([]);
  const [specialRequests, setSpecialRequests] = React.useState<string>("");

  // Step 4: Add-ons
  const [selectedAddonIds, setSelectedAddonIds] = React.useState<string[]>([
    "addon-insurance",
  ]);

  // Step 5: Terms
  const [termsAccepted, setTermsAccepted] = React.useState<boolean>(true);

  // Step 6: Payment (Razorpay Secure Integration)
  const [paymentMethod, setPaymentMethod] = React.useState<string>("RAZORPAY");
  const [upiId, setUpiId] = React.useState<string>("");
  const [isProcessingPayment, setIsProcessingPayment] = React.useState<boolean>(false);
  const [paymentFailed, setPaymentFailed] = React.useState<boolean>(false);
  const [failureDetails, setFailureDetails] = React.useState<string | null>(null);
  const [activeRazorpayOrder, setActiveRazorpayOrder] = React.useState<any | null>(null);
  const [showSimulatedModal, setShowSimulatedModal] = React.useState<boolean>(false);
  const [razorpayLoaded, setRazorpayLoaded] = React.useState<boolean>(false);

  // Step 7: Completed Booking
  const [confirmedBooking, setConfirmedBooking] = React.useState<any | null>(null);

  // General State
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isAvailabilityRequestOpen, setIsAvailabilityRequestOpen] = React.useState<boolean>(false);
  const [availabilityRequestSent, setAvailabilityRequestSent] = React.useState<boolean>(false);
  const [availabilityRequestLoading, setAvailabilityRequestLoading] = React.useState<boolean>(false);

  // Load upcoming departure dates
  React.useEffect(() => {
    fetch(`/api/packages/${pkg.slug}/availability`)
      .then((res) => res.json())
      .then((data) => {
        if (data.package?.departureDates?.length > 0) {
          setAvailableDepartureDates(data.package.departureDates);
          if (!selectedDate) {
            setSelectedDate(data.package.departureDates[0]);
          }
        }
      })
      .catch(() => {});
  }, [pkg.slug]);

  // Auto-fill logged in user
  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          if (!customerName && data.user.name) setCustomerName(data.user.name);
          if (!customerEmail && data.user.email) setCustomerEmail(data.user.email);
          if (!customerPhone && data.user.phone) setCustomerPhone(data.user.phone);
        }
      })
      .catch(() => {});
  }, []);

  // Sync Travelers array length with (adults + children + infants)
  React.useEffect(() => {
    const totalTravelers = adultsCount + childrenCount + infantsCount;
    setTravelers((prev) => {
      const nextList: TravelerDetail[] = [];

      for (let i = 0; i < adultsCount; i++) {
        const existing = prev[i] || {};
        nextList.push({
          type: "ADULT",
          title: existing.title || (i === 0 ? "Mr" : "Mrs"),
          firstName: existing.firstName || (i === 0 && customerName ? customerName.split(" ")[0] : ""),
          lastName: existing.lastName || (i === 0 && customerName ? customerName.split(" ").slice(1).join(" ") : ""),
          gender: existing.gender || (i === 0 ? "Male" : "Female"),
          dateOfBirth: existing.dateOfBirth || "",
          passportNumber: existing.passportNumber || "",
          passportExpiry: existing.passportExpiry || "",
        });
      }

      for (let i = 0; i < childrenCount; i++) {
        const idx = adultsCount + i;
        const existing = prev[idx] || {};
        nextList.push({
          type: "CHILD",
          title: existing.title || "Master",
          firstName: existing.firstName || "",
          lastName: existing.lastName || "",
          gender: existing.gender || "Male",
          dateOfBirth: existing.dateOfBirth || "",
        });
      }

      for (let i = 0; i < infantsCount; i++) {
        const idx = adultsCount + childrenCount + i;
        const existing = prev[idx] || {};
        nextList.push({
          type: "INFANT",
          title: existing.title || "Master",
          firstName: existing.firstName || "",
          lastName: existing.lastName || "",
          gender: existing.gender || "Male",
          dateOfBirth: existing.dateOfBirth || "",
        });
      }

      return nextList;
    });
  }, [adultsCount, childrenCount, infantsCount, customerName]);

  // Live Pricing Calculation
  const priceBreakdown = calculateBookingPrice({
    basePricePerPerson: pkg.startingPrice,
    adultsCount,
    childrenCount,
    infantsCount,
    selectedAddonIds,
  });

  // Toggle Addon
  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  // Step Validation & Progression
  const handleNext = () => {
    setErrorMessage(null);

    if (currentStep === 1) {
      if (!selectedDate) {
        setErrorMessage("Please select your preferred departure date.");
        return;
      }
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      const totalPax = adultsCount + childrenCount + infantsCount;
      if (adultsCount < 1) {
        setErrorMessage("At least one adult (age 12+) is required.");
        return;
      }
      if (pkg.availableSlots && totalPax > pkg.availableSlots) {
        setErrorMessage(
          `Only ${pkg.availableSlots} seats remain for this departure. Please adjust your party size.`
        );
        return;
      }
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      if (!customerName.trim() || customerName.trim().length < 2) {
        setErrorMessage("Lead traveler full name is required.");
        return;
      }
      if (!customerEmail.trim() || !customerEmail.includes("@")) {
        setErrorMessage("Valid lead passenger email address is required.");
        return;
      }
      if (!customerPhone.trim() || customerPhone.trim().length < 7) {
        setErrorMessage("Valid contact phone number is required.");
        return;
      }

      // Check first name of all travelers
      for (let i = 0; i < travelers.length; i++) {
        if (!travelers[i].firstName.trim()) {
          setErrorMessage(`Please provide the first name for Traveler #${i + 1}.`);
          return;
        }
      }

      setCurrentStep(4);
      return;
    }

    if (currentStep === 4) {
      setCurrentStep(5);
      return;
    }

    if (currentStep === 5) {
      if (!termsAccepted) {
        setErrorMessage("Please accept the terms and verified cancellation policy to proceed.");
        return;
      }
      setCurrentStep(6);
      return;
    }
  };

  const handleBack = () => {
    setErrorMessage(null);
    if (currentStep > 1 && currentStep < 7) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Execute server-side cryptographic payment verification
  const executePaymentVerification = async (payload: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    bookingReference: string;
  }) => {
    setIsProcessingPayment(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/payments/razorpay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setPaymentFailed(true);
        setFailureDetails(
          data.error ||
            "Cryptographic payment verification failed on the server. Your booking is NOT confirmed."
        );
        setErrorMessage(
          data.error || "Payment verification failed. Please retry your payment."
        );
        return;
      }

      // Success! Booking verified & confirmed by server
      setPaymentFailed(false);
      setFailureDetails(null);
      setConfirmedBooking({
        id: data.payment.bookingId,
        bookingReference: data.bookingReference,
        status: "Confirmed",
        paymentStatus: "PAID",
        totalAmount: data.payment.amount,
        currency: data.payment.currency,
        travelDate: selectedDate,
        travelersCount: adultsCount + childrenCount + infantsCount,
        transactionId: data.payment.paymentId,
        createdAt: data.payment.timestamp,
      });
      setCurrentStep(7);
    } catch (err: any) {
      setPaymentFailed(true);
      setFailureDetails(err.message || "Network error while verifying payment on server.");
      setErrorMessage("Network error verifying payment. Please retry.");
    } finally {
      setIsProcessingPayment(false);
      setShowSimulatedModal(false);
    }
  };

  // Report failed or cancelled payment to preserve state & allow retry
  const handleFailureReport = async (orderId: string, bookingRef: string, errorDesc: string) => {
    try {
      await fetch("/api/payments/failure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingReference: bookingRef,
          orderId,
          errorCode: "PAYMENT_CANCELLED_OR_DECLINED",
          errorDescription: errorDesc,
        }),
      });
    } catch (e) {
      console.error("Payment failure log error:", e);
    }

    setPaymentFailed(true);
    setFailureDetails(errorDesc);
    setErrorMessage(errorDesc);
    setIsProcessingPayment(false);
    setShowSimulatedModal(false);
  };

  // Process Final Booking & Payment (Step 6 -> Step 7)
  const handleProcessPayment = async () => {
    setErrorMessage(null);
    setPaymentFailed(false);
    setFailureDetails(null);
    setIsProcessingPayment(true);

    try {
      // 1. Pay at Travel Desk (Offline / Hold Allotment)
      if (paymentMethod === "PAY_AT_DESK") {
        const res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            packageId: pkg.id,
            packageSlug: pkg.slug,
            travelDate: selectedDate,
            adultsCount,
            childrenCount,
            infantsCount,
            customerName,
            customerEmail,
            customerPhone,
            travelers,
            selectedAddonIds,
            specialRequests,
            paymentMethod: "PAY_AT_DESK",
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to create booking.");
        }

        setConfirmedBooking(data.booking);
        setCurrentStep(7);
        return;
      }

      // 2. Razorpay Secure Payment Order Creation
      const orderRes = await fetch("/api/payments/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingReference: activeRazorpayOrder?.bookingReference,
          packageId: pkg.id,
          packageSlug: pkg.slug,
          travelDate: selectedDate,
          adultsCount,
          childrenCount,
          infantsCount,
          customerName,
          customerEmail,
          customerPhone,
          travelers,
          selectedAddonIds,
          specialRequests,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || "Failed to initialize secure payment order.");
      }

      setActiveRazorpayOrder(orderData);

      // Check if standard Razorpay checkout is available on window
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay({
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "Sah Tour And Travel",
          description: `${orderData.packageName || pkg.name} (Ref: ${orderData.bookingReference})`,
          order_id: orderData.orderId,
          prefill: {
            name: orderData.customer.name,
            email: orderData.customer.email,
            contact: orderData.customer.phone,
          },
          theme: {
            color: "#0b192c",
          },
          handler: function (response: any) {
            // NEVER trust client confirmation: verify signature on server!
            executePaymentVerification({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              bookingReference: orderData.bookingReference,
            });
          },
          modal: {
            ondismiss: function () {
              handleFailureReport(
                orderData.orderId,
                orderData.bookingReference,
                "Payment window was closed before completion. Your allotment is on hold and you can retry."
              );
            },
          },
        });

        rzp.open();
        setIsProcessingPayment(false);
      } else {
        // Fallback to Interactive Razorpay Checkout Simulator in Sandbox/Dev
        setShowSimulatedModal(true);
        setIsProcessingPayment(false);
      }
    } catch (err: any) {
      setPaymentFailed(true);
      setFailureDetails(err.message || "An unexpected error occurred during payment initiation.");
      setErrorMessage(err.message || "An unexpected error occurred during payment.");
      setIsProcessingPayment(false);
    }
  };

  // Handle Request Availability for unavailable inventory
  const handleSendAvailabilityRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setAvailabilityRequestLoading(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customerName || "Prospective Traveler",
          email: customerEmail || "guest@sahtour.com",
          phone: customerPhone || "+91 98765 43210",
          destination: pkg.destination?.name || pkg.name,
          travelDate: selectedDate || null,
          travelersCount: adultsCount + childrenCount + infantsCount,
          budgetRange: `Package standard ₹${pkg.startingPrice.toLocaleString("en-IN")}`,
          travelType: pkg.travelStyle || "Vacation Package",
          message: `Special Allotment Request: Customer requested live availability check for "${pkg.name}". Date: ${selectedDate || "Flexible"}. Group: ${adultsCount} Adults, ${childrenCount} Children.`,
          packageId: pkg.id,
        }),
      });
      if (res.ok) {
        setAvailabilityRequestSent(true);
      }
    } catch {
      alert("Failed to send availability request. Please call our desk directly.");
    } finally {
      setAvailabilityRequestLoading(false);
    }
  };

  // Render Add-on Icon Helper
  const renderAddonIcon = (iconName: string) => {
    switch (iconName) {
      case "Car":
        return <Car className="h-5 w-5 text-brand-gold-600" />;
      case "Utensils":
        return <Utensils className="h-5 w-5 text-brand-gold-600" />;
      case "Sparkles":
        return <Sparkles className="h-5 w-5 text-brand-gold-600" />;
      default:
        return <ShieldCheck className="h-5 w-5 text-emerald-600" />;
    }
  };

  // =========================================================================
  // IF PACKAGE HAS NO LIVE AVAILABILITY: SHOW "Request Availability" ONLY!
  // =========================================================================
  if (!pkg.hasLiveAvailability) {
    return (
      <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6">
        <Card className="border-2 border-amber-300 bg-amber-50/50 shadow-luxury-md rounded-3xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />
          <CardContent className="p-8 sm:p-12 space-y-6">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 w-fit">
              <Clock className="h-3.5 w-3.5 text-amber-700" />
              <span>On-Demand Seasonal Allocation</span>
            </div>

            <div className="space-y-2">
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-navy-950">
                Live Inventory Check Required for {pkg.name}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                In accordance with Sah Tour And Travel transparency protocols, this package is currently subject to live inbound supplier allotment confirmation. Instant online checkout is disabled to guarantee no false bookings are accepted.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Verified Base Rate:</span>
                <span className="font-heading text-base font-extrabold text-brand-navy-900 font-mono">
                  {formatCurrency(pkg.startingPrice, pkg.currency)} / person
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Inventory Status:</span>
                <span className="font-bold text-amber-800">
                  {pkg.inventoryNotice || "Ground Operator Confirmation Required"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-500">Contracted Supplier:</span>
                <span className="font-medium text-slate-800">
                  {pkg.source?.name} ({pkg.source?.licenseRef})
                </span>
              </div>
            </div>

            {availabilityRequestSent ? (
              <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="font-heading text-base font-bold text-emerald-950">
                  Availability Request Logged!
                </h4>
                <p className="text-xs text-emerald-800 max-w-md mx-auto">
                  Our operations desk will contact our ground partner in {pkg.destination?.name} and verify allotment for your party within 4 business hours.
                </p>
                <Link href={`/holidays/${pkg.slug}`}>
                  <Button variant="outline" size="sm" className="mt-2 text-xs">
                    Return to Package Overview
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSendAvailabilityRequest} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Your Full Name"
                    required
                    placeholder="e.g. Vikram Malhotra"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    placeholder="vikram@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                  <Input
                    label="Desired Departure Date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-amber-200">
                  <div className="text-xs text-slate-500">
                    <span className="font-bold text-slate-700">Official Helpline:</span>{" "}
                    {siteConfig.contact.helpline}
                  </div>
                  <Button
                    type="submit"
                    variant="luxury"
                    className="font-bold text-xs shadow-luxury-md"
                    disabled={availabilityRequestLoading}
                  >
                    {availabilityRequestLoading ? "Checking Allotment..." : "Request Availability from Desk"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // =========================================================================
  // PACKAGE HAS LIVE ALLOTMENT: 7-STEP BOOKING FLOW
  // =========================================================================
  return (
    <div className="container mx-auto max-w-6xl py-8 sm:py-12 px-4 sm:px-6 font-sans">
      {/* 1. Header with Breadcrumbs & Title */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/holidays" className="hover:text-brand-navy-900 transition-colors">
            Holidays
          </Link>
          <span>/</span>
          <Link href={`/holidays/${pkg.slug}`} className="hover:text-brand-navy-900 transition-colors">
            {pkg.name}
          </Link>
          <span>/</span>
          <span className="text-brand-navy-950 font-bold">Secure Booking</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-navy-950">
              Book: {pkg.name}
            </h1>
            <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
              <span>{pkg.durationText}</span>
              <span>•</span>
              <span>Ex-{pkg.departureCity}</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {pkg.availableSlots} Live Allotments Remaining
              </span>
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-semibold">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Guaranteed Allotment Checkout</span>
          </div>
        </div>
      </div>

      {/* 2. Visual 7-Step Progress Stepper */}
      <div className="mb-8">
        <div className="hidden md:flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-10 -translate-y-1/2" />
          {STEPS.map((s) => {
            const isCompleted = currentStep > s.step;
            const isCurrent = currentStep === s.step;

            return (
              <div
                key={s.step}
                className="flex flex-col items-center gap-1 bg-white px-2 py-1 rounded-lg"
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all shadow-xs ${
                    isCompleted
                      ? "bg-emerald-600 text-white"
                      : isCurrent
                      ? "bg-brand-navy-950 text-brand-gold-300 ring-4 ring-brand-gold-400/20"
                      : "bg-slate-100 text-slate-400 border border-slate-200"
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : s.step}
                </div>
                <span
                  className={`text-[11px] font-bold ${
                    isCurrent
                      ? "text-brand-navy-950 font-heading"
                      : isCompleted
                      ? "text-emerald-700"
                      : "text-slate-400"
                  }`}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Mobile Compact Progress Bar */}
        <div className="md:hidden flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-brand-navy-950">
            Step {currentStep} of 7: {STEPS[currentStep - 1]?.title}
          </span>
          <div className="flex gap-1">
            {STEPS.map((s) => (
              <div
                key={s.step}
                className={`h-1.5 w-4 rounded-full ${
                  s.step <= currentStep ? "bg-brand-gold-500" : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Error Alert Display */}
      {errorMessage && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800 flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 3. Main Two-Column Layout (Form Wizard + Real-Time Sticky Price Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Columns: Step Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* ================================================================ */}
          {/* STEP 1: SELECT TRAVEL DATE */}
          {/* ================================================================ */}
          {currentStep === 1 && (
            <Card className="border border-slate-200 shadow-luxury-md bg-white rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-600 block">
                  Step 1 of 7
                </span>
                <h2 className="font-heading text-xl font-bold text-brand-navy-950">
                  Select Your Tour Departure Date
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Choose from guaranteed verified departure allotments with contracted seat quotas.
                </p>
              </div>

              {/* Verified Departures Chips */}
              {availableDepartureDates.length > 0 && (
                <div className="space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Upcoming Guaranteed Departures
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {availableDepartureDates.slice(0, 8).map((dateStr) => {
                      const isSelected = selectedDate === dateStr;
                      const dateObj = new Date(dateStr);

                      return (
                        <button
                          key={dateStr}
                          type="button"
                          onClick={() => setSelectedDate(dateStr)}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? "border-brand-navy-950 bg-brand-navy-950 text-white shadow-luxury-sm"
                              : "border-slate-200 bg-slate-50/80 hover:bg-slate-100 text-slate-800"
                          }`}
                        >
                          <span className={`block text-[10px] uppercase font-bold ${isSelected ? "text-brand-gold-300" : "text-slate-400"}`}>
                            {dateObj.toLocaleDateString("en-IN", { weekday: "short" })}
                          </span>
                          <span className="block font-heading text-sm font-extrabold mt-0.5">
                            {dateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </span>
                          <span className={`block text-[10px] mt-1 ${isSelected ? "text-emerald-300" : "text-emerald-700"}`}>
                            ✓ Available
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Custom Date Picker */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Or Specify Custom Departure Date
                </label>
                <div className="max-w-xs">
                  <Input
                    type="date"
                    value={selectedDate}
                    min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    leftIcon={<Calendar className="h-4 w-4 text-brand-gold-600" />}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Selected: <strong>{selectedDate ? formatDate(selectedDate) : "None"}</strong>
                </p>
              </div>

              {/* Navigation Action */}
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button variant="luxury" onClick={handleNext} rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Continue to Travellers
                </Button>
              </div>
            </Card>
          )}

          {/* ================================================================ */}
          {/* STEP 2: TRAVELLERS (Adults, Children, Infants) */}
          {/* ================================================================ */}
          {currentStep === 2 && (
            <Card className="border border-slate-200 shadow-luxury-md bg-white rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-600 block">
                  Step 2 of 7
                </span>
                <h2 className="font-heading text-xl font-bold text-brand-navy-950">
                  Number of Travellers
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Specify passenger numbers. Pricing dynamically updates according to verified operator tariff scales.
                </p>
              </div>

              <div className="space-y-4">
                {/* Adults Counter */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <div className="flex items-center gap-2 font-heading font-bold text-slate-900 text-sm">
                      <User className="h-4 w-4 text-brand-gold-600" />
                      <span>Adults (Ages 12+ years)</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Standard fare: {formatCurrency(pkg.startingPrice, pkg.currency)} per adult
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAdultsCount((prev) => Math.max(1, prev - 1))}
                      disabled={adultsCount <= 1}
                      className="h-9 w-9 rounded-xl border border-slate-300 bg-white font-bold text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center shadow-xs"
                    >
                      –
                    </button>
                    <span className="font-mono text-base font-extrabold w-6 text-center text-brand-navy-950">
                      {adultsCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAdultsCount((prev) => Math.min(10, prev + 1))}
                      className="h-9 w-9 rounded-xl border border-slate-300 bg-white font-bold text-sm text-slate-700 hover:bg-slate-100 flex items-center justify-center shadow-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children Counter */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <div className="flex items-center gap-2 font-heading font-bold text-slate-900 text-sm">
                      <Users className="h-4 w-4 text-brand-teal-600" />
                      <span>Children (Ages 2–11 years)</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      75% tariff scale: {formatCurrency(Math.round(pkg.startingPrice * 0.75), pkg.currency)} per child
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setChildrenCount((prev) => Math.max(0, prev - 1))}
                      disabled={childrenCount <= 0}
                      className="h-9 w-9 rounded-xl border border-slate-300 bg-white font-bold text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center shadow-xs"
                    >
                      –
                    </button>
                    <span className="font-mono text-base font-extrabold w-6 text-center text-brand-navy-950">
                      {childrenCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setChildrenCount((prev) => Math.min(6, prev + 1))}
                      className="h-9 w-9 rounded-xl border border-slate-300 bg-white font-bold text-sm text-slate-700 hover:bg-slate-100 flex items-center justify-center shadow-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Infants Counter */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <div className="flex items-center gap-2 font-heading font-bold text-slate-900 text-sm">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      <span>Infants (Under 2 years)</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Carrier fee: {formatCurrency(Math.round(pkg.startingPrice * 0.15), pkg.currency)} per infant
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setInfantsCount((prev) => Math.max(0, prev - 1))}
                      disabled={infantsCount <= 0}
                      className="h-9 w-9 rounded-xl border border-slate-300 bg-white font-bold text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center shadow-xs"
                    >
                      –
                    </button>
                    <span className="font-mono text-base font-extrabold w-6 text-center text-brand-navy-950">
                      {infantsCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setInfantsCount((prev) => Math.min(4, prev + 1))}
                      className="h-9 w-9 rounded-xl border border-slate-300 bg-white font-bold text-sm text-slate-700 hover:bg-slate-100 flex items-center justify-center shadow-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation Action */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={handleBack} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                  Back
                </Button>
                <Button variant="luxury" onClick={handleNext} rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Continue to Passenger Details
                </Button>
              </div>
            </Card>
          )}

          {/* ================================================================ */}
          {/* STEP 3: TRAVELLER INFORMATION */}
          {/* ================================================================ */}
          {currentStep === 3 && (
            <Card className="border border-slate-200 shadow-luxury-md bg-white rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-600 block">
                  Step 3 of 7
                </span>
                <h2 className="font-heading text-xl font-bold text-brand-navy-950">
                  Traveller Information
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Enter passenger details as displayed on official government photo ID or passport.
                </p>
              </div>

              {/* Primary Contact (Lead Traveller) */}
              <div className="rounded-2xl border border-brand-gold-300 bg-brand-gold-50/50 p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-brand-gold-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-navy-950">
                    Lead Passenger & Primary Booking Contact
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    label="Lead Full Name"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                  <Input
                    label="Email (For Voucher & Tickets)"
                    type="email"
                    required
                    placeholder="customer@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                  <Input
                    label="Phone (SMS / WhatsApp Alerts)"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Detailed Passenger Roster */}
              <div className="space-y-4">
                <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Passenger List ({travelers.length} Travellers)
                </h3>

                {travelers.map((traveler, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-200 p-4 space-y-3 bg-slate-50/60">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-bold text-brand-navy-900">
                        Passenger #{idx + 1} ({traveler.type})
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {idx === 0 ? "Primary Lead" : "Co-passenger"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold uppercase text-slate-600">
                          Title
                        </label>
                        <select
                          value={traveler.title}
                          onChange={(e) => {
                            const val = e.target.value as any;
                            setTravelers((prev) =>
                              prev.map((t, i) => (i === idx ? { ...t, title: val } : t))
                            );
                          }}
                          className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900"
                        >
                          <option value="Mr">Mr</option>
                          <option value="Mrs">Mrs</option>
                          <option value="Ms">Ms</option>
                          <option value="Master">Master</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold uppercase text-slate-600">
                          First Name *
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="First Name"
                          value={traveler.firstName}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTravelers((prev) =>
                              prev.map((t, i) => (i === idx ? { ...t, firstName: val } : t))
                            );
                          }}
                          className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold uppercase text-slate-600">
                          Last Name
                        </label>
                        <input
                          type="text"
                          placeholder="Last Name"
                          value={traveler.lastName}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTravelers((prev) =>
                              prev.map((t, i) => (i === idx ? { ...t, lastName: val } : t))
                            );
                          }}
                          className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold uppercase text-slate-600">
                          Gender
                        </label>
                        <select
                          value={traveler.gender}
                          onChange={(e) => {
                            const val = e.target.value as any;
                            setTravelers((prev) =>
                              prev.map((t, i) => (i === idx ? { ...t, gender: val } : t))
                            );
                          }}
                          className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Special Requests */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Special Requests (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Vegetarian/Jain meal request on flight, adjoining rooms, anniversary amenity."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900"
                />
              </div>

              {/* Navigation Action */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={handleBack} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                  Back
                </Button>
                <Button variant="luxury" onClick={handleNext} rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Continue to Optional Add-ons
                </Button>
              </div>
            </Card>
          )}

          {/* ================================================================ */}
          {/* STEP 4: OPTIONAL ADD-ONS */}
          {/* ================================================================ */}
          {currentStep === 4 && (
            <Card className="border border-slate-200 shadow-luxury-md bg-white rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-600 block">
                  Step 4 of 7
                </span>
                <h2 className="font-heading text-xl font-bold text-brand-navy-950">
                  Tailored Tour Add-ons
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Enhance your holiday with verified supplementary travel protections and amenities.
                </p>
              </div>

              <div className="space-y-3">
                {CURATED_ADDONS.map((addon) => {
                  const isChecked = selectedAddonIds.includes(addon.id);

                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                        isChecked
                          ? "border-brand-gold-400 bg-brand-gold-50/50 shadow-xs"
                          : "border-slate-200 bg-white hover:bg-slate-50/80"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleAddon(addon.id)}
                        className="mt-1 h-4 w-4 rounded text-brand-navy-950 focus:ring-brand-gold-500 cursor-pointer"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="font-heading text-sm font-bold text-brand-navy-900 flex items-center gap-2">
                            {renderAddonIcon(addon.iconName)}
                            <span>{addon.name}</span>
                          </h4>
                          <span className="font-mono text-xs font-bold text-brand-navy-950">
                            +₹{addon.price.toLocaleString("en-IN")}{" "}
                            <span className="text-[10px] text-slate-400 font-normal">
                              {addon.perPerson ? "/ person" : "/ booking"}
                            </span>
                          </span>
                        </div>
                        <p className="text-xs text-brand-gold-700 font-semibold">{addon.tagline}</p>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{addon.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Action */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={handleBack} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                  Back
                </Button>
                <Button variant="luxury" onClick={handleNext} rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Review Booking & Price
                </Button>
              </div>
            </Card>
          )}

          {/* ================================================================ */}
          {/* STEP 5: REVIEW BOOKING */}
          {/* ================================================================ */}
          {currentStep === 5 && (
            <Card className="border border-slate-200 shadow-luxury-md bg-white rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-600 block">
                  Step 5 of 7
                </span>
                <h2 className="font-heading text-xl font-bold text-brand-navy-950">
                  Review & Confirm Your Reservation
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Verify your itinerary, passenger manifest, and transparent price breakdown before payment.
                </p>
              </div>

              {/* Itinerary Summary */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-brand-navy-950 uppercase tracking-wider">
                    {pkg.destination?.name} • {pkg.durationText}
                  </span>
                  <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                    Instant Allotment Confirmed
                  </span>
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-900">{pkg.name}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 pt-1">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Departure Date:</span>
                    <strong>{formatDate(selectedDate)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Departure City:</span>
                    <strong>{pkg.departureCity}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Travellers:</span>
                    <strong>
                      {adultsCount} Adults{childrenCount > 0 ? `, ${childrenCount} Children` : ""}{infantsCount > 0 ? `, ${infantsCount} Infants` : ""}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Passenger Manifest Recap */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Passenger Manifest
                </h4>
                <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 text-xs">
                  {travelers.map((t, idx) => (
                    <div key={idx} className="p-3 flex justify-between items-center">
                      <span>
                        <strong>#{idx + 1}</strong> {t.title} {t.firstName} {t.lastName} ({t.type})
                      </span>
                      <span className="text-slate-400">{t.gender}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cancellation Policy Recap */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 font-bold text-brand-navy-900">
                  <FileCheck className="h-4 w-4 text-brand-gold-600" />
                  <span>Cancellation & Regulatory Terms</span>
                </div>
                <p className="leading-relaxed">{pkg.cancellationPolicy}</p>
                <div className="pt-2">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded text-brand-navy-950 focus:ring-brand-gold-500"
                    />
                    <span className="text-[11px] text-slate-700">
                      I have read and agree to the verified cancellation policy and commercial booking terms for Sah Tour And Travel.
                    </span>
                  </label>
                </div>
              </div>

              {/* Navigation Action */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={handleBack} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                  Back
                </Button>
                <Button variant="luxury" onClick={handleNext} rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Proceed to Payment
                </Button>
              </div>
            </Card>
          )}

          {/* ================================================================ */}
          {/* STEP 6: PAYMENT (RAZORPAY SECURE INTEGRATION) */}
          {/* ================================================================ */}
          {currentStep === 6 && (
            <Card className="border border-slate-200 shadow-luxury-md bg-white rounded-3xl p-6 sm:p-8 space-y-6">
              {/* Load Official Razorpay Checkout Script */}
              <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="lazyOnload"
                onLoad={() => setRazorpayLoaded(true)}
              />

              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-600 block">
                  Step 6 of 7 • Secure Payment Gateway
                </span>
                <h2 className="font-heading text-xl font-bold text-brand-navy-950">
                  Complete Your Tour Reservation
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Total Payable Fare:{" "}
                  <strong className="text-brand-navy-950 font-mono text-base">
                    {formatCurrency(priceBreakdown.totalAmount, "INR")}
                  </strong>{" "}
                  (All Taxes, GST & Curated Add-ons Included)
                </p>
              </div>

              {/* PAYMENT FAILURE ALERT: Allows immediate retry with clear message */}
              {paymentFailed && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                    <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
                    <span>Payment Authorization Incomplete / Failed</span>
                  </div>
                  <p className="text-xs text-rose-700 leading-relaxed">
                    {failureDetails ||
                      "Your transaction could not be verified or was cancelled. Your booking has NOT been confirmed. No charges were settled."}
                  </p>
                  <p className="text-[11px] text-rose-600 font-medium">
                    Your allotment is preserved temporarily. You can retry with Razorpay or select another method.
                  </p>
                  <div className="pt-2">
                    <Button
                      variant="luxury"
                      size="sm"
                      onClick={handleProcessPayment}
                      disabled={isProcessingPayment}
                      leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                    >
                      Retry Payment Now
                    </Button>
                  </div>
                </div>
              )}

              {/* Payment Methods Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. Razorpay Secure Gateway (Recommended) */}
                <div
                  onClick={() => setPaymentMethod("RAZORPAY")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "RAZORPAY"
                      ? "border-brand-navy-950 bg-brand-navy-950 text-white shadow-md ring-2 ring-brand-gold-400"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-sm font-bold flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-brand-gold-400" />
                      Razorpay Secure Gateway
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        paymentMethod === "RAZORPAY"
                          ? "bg-brand-gold-400 text-brand-navy-950"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      Instant Allotment
                    </span>
                  </div>
                  <p
                    className={`text-xs mt-1.5 leading-relaxed ${
                      paymentMethod === "RAZORPAY" ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards, Net Banking & Wallets.
                  </p>
                  <div className="mt-2 text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    <span>256-Bit SSL • PCI-DSS Level 1 Compliant</span>
                  </div>
                </div>

                {/* 2. Pay at Travel Desk (Hold Allotment) */}
                <div
                  onClick={() => setPaymentMethod("PAY_AT_DESK")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "PAY_AT_DESK"
                      ? "border-brand-navy-950 bg-brand-navy-950 text-white shadow-md ring-2 ring-brand-gold-400"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-sm font-bold flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-brand-gold-400" />
                      Pay at Travel Desk
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        paymentMethod === "PAY_AT_DESK"
                          ? "bg-brand-gold-400 text-brand-navy-950"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      Hold Allotment
                    </span>
                  </div>
                  <p
                    className={`text-xs mt-1.5 leading-relaxed ${
                      paymentMethod === "PAY_AT_DESK" ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    Reserve departure slots now; settle balance via Bank Transfer (RTGS/NEFT) or at our registered branch.
                  </p>
                  <div className="mt-2 text-[10px] font-mono text-amber-300 font-semibold flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Status: Payment Pending until confirmed</span>
                  </div>
                </div>
              </div>

              {/* Security & Card Details Privacy Guarantee */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-navy-900">
                  <Lock className="h-4 w-4 text-emerald-600" />
                  <span>Strict Zero Card-Storage Policy & Server-Side Verification</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Sah Tour And Travel never collects, stores, or transmits your credit card numbers, CVVs, or bank credentials. All electronic payments are routed directly through Razorpay’s Level-1 PCI-DSS compliant infrastructure and verified cryptographically using server-side HMAC SHA-256 signatures before booking confirmation.
                </p>
              </div>

              {/* Navigation Action */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={handleBack} disabled={isProcessingPayment}>
                  Back
                </Button>
                <Button
                  variant="luxury"
                  onClick={handleProcessPayment}
                  disabled={isProcessingPayment}
                  className="font-bold shadow-luxury-md min-w-[220px]"
                >
                  {isProcessingPayment
                    ? "Securing Payment..."
                    : paymentMethod === "RAZORPAY"
                    ? `Pay ₹${priceBreakdown.totalAmount.toLocaleString("en-IN")} via Razorpay`
                    : "Hold Allotment & Pay at Desk"}
                </Button>
              </div>

              {/* SIMULATED RAZORPAY CHECKOUT MODAL (For Development & Sandbox Mode) */}
              {showSimulatedModal && activeRazorpayOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
                  <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden space-y-0">
                    {/* Header */}
                    <div className="bg-brand-navy-950 text-white p-5 flex items-center justify-between border-b border-brand-navy-900">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-sm tracking-wide text-brand-gold-400">
                            RAZORPAY CHECKOUT
                          </span>
                          <span className="text-[10px] bg-brand-gold-400 text-brand-navy-950 px-2 py-0.5 rounded-full font-bold">
                            TEST / SANDBOX
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Order ID: <code className="text-brand-gold-300 font-mono">{activeRazorpayOrder.orderId}</code>
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          handleFailureReport(
                            activeRazorpayOrder.orderId,
                            activeRazorpayOrder.bookingReference,
                            "User dismissed the Razorpay checkout window."
                          );
                        }}
                        className="text-slate-400 hover:text-white p-1 rounded-lg"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-4">
                      <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500">Booking Reference:</span>
                          <span className="font-mono font-bold text-brand-navy-950">
                            {activeRazorpayOrder.bookingReference}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500">Customer:</span>
                          <span className="font-semibold text-slate-800">
                            {activeRazorpayOrder.customer?.name}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200">
                          <span className="text-slate-500 font-bold">Payable Amount:</span>
                          <span className="font-heading text-lg font-extrabold text-brand-navy-950 font-mono">
                            ₹{activeRazorpayOrder.amountInRupees?.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 pt-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                          Simulate Gateway Action:
                        </span>

                        {/* 1. Simulate Success */}
                        <Button
                          variant="luxury"
                          className="w-full justify-center font-bold text-xs"
                          onClick={() => {
                            executePaymentVerification({
                              razorpayOrderId: activeRazorpayOrder.orderId,
                              razorpayPaymentId: `pay_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
                              razorpaySignature: "simulated_valid_test_signature",
                              bookingReference: activeRazorpayOrder.bookingReference,
                            });
                          }}
                        >
                          ✓ Authorize & Verify Payment (Success)
                        </Button>

                        {/* 2. Simulate Decline / Failure */}
                        <Button
                          variant="outline"
                          className="w-full justify-center text-xs border-rose-200 text-rose-700 hover:bg-rose-50"
                          onClick={() => {
                            handleFailureReport(
                              activeRazorpayOrder.orderId,
                              activeRazorpayOrder.bookingReference,
                              "Card declined by issuing bank (Insufficient funds / Risk assessment)."
                            );
                          }}
                        >
                          ✕ Simulate Bank Decline (Failure & Retry)
                        </Button>

                        {/* 3. Simulate Tampered Signature Attack */}
                        <Button
                          variant="ghost"
                          className="w-full justify-center text-[11px] text-slate-500 hover:bg-slate-100"
                          onClick={() => {
                            executePaymentVerification({
                              razorpayOrderId: activeRazorpayOrder.orderId,
                              razorpayPaymentId: `pay_tampered_${Date.now()}`,
                              razorpaySignature: "forged_malicious_signature_attack_attempt",
                              bookingReference: activeRazorpayOrder.bookingReference,
                            });
                          }}
                        >
                          ⚠ Test Forged Signature Attack (Server Rejection)
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* ================================================================ */}
          {/* STEP 7: CONFIRMATION */}
          {/* ================================================================ */}
          {currentStep === 7 && confirmedBooking && (
            <Card className="border border-slate-200 shadow-luxury-lg bg-white rounded-3xl p-8 sm:p-12 text-center space-y-6">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600 shadow-sm animate-in zoom-in-75 duration-300">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
                  Booking Officially Registered & Allotment Guaranteed
                </span>
                <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-navy-950">
                  Pack Your Bags! Your Tour is Booked.
                </h1>
                <p className="text-sm text-slate-600 max-w-lg mx-auto">
                  A confirmation dispatch and digital travel kit have been sent to <strong>{customerEmail}</strong>.
                </p>
              </div>

              {/* Reference Box */}
              <div className="rounded-2xl border-2 border-brand-navy-900/10 bg-slate-50 p-6 max-w-md mx-auto space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Official Booking Reference ID
                </span>
                <span className="font-mono text-2xl font-extrabold text-brand-navy-950 tracking-wide block">
                  {confirmedBooking.bookingReference}
                </span>
                <p className="text-[11px] text-slate-500 pt-1">
                  Status: <strong>{confirmedBooking.status}</strong> • Transaction Ref: <strong>{confirmedBooking.transactionId || "N/A"}</strong>
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <Link href="/account?tab=bookings">
                  <Button variant="default" className="text-xs font-bold shadow-xs">
                    View in Customer Dashboard
                  </Button>
                </Link>
                <Link href={`/holidays/${pkg.slug}`}>
                  <Button variant="outline" className="text-xs">
                    View Package Itinerary
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>

        {/* Right 4 Columns: Sticky Transparent Price Breakdown (Always Visible Steps 1-6) */}
        {currentStep < 7 && (
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <Card className="border border-brand-gold-500/40 shadow-luxury-md bg-white rounded-3xl overflow-hidden">
              <CardHeader className="bg-brand-navy-950 text-white p-5 border-b border-brand-navy-900">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-400 block">
                  Verified Price Breakdown
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-heading text-2xl font-extrabold text-white">
                    {formatCurrency(priceBreakdown.totalAmount, "INR")}
                  </span>
                  <span className="text-xs text-brand-gold-300">
                    {priceBreakdown.totalTravelers} {priceBreakdown.totalTravelers === 1 ? "Traveller" : "Travellers"}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-3.5 text-xs text-slate-600">
                {/* 1. Base Price */}
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <div>
                    <span className="font-bold text-slate-800 block">Base Tour Price</span>
                    <span className="text-[11px] text-slate-400">
                      {adultsCount} Adult{adultsCount > 1 ? "s" : ""}
                      {childrenCount > 0 ? ` + ${childrenCount} Child` : ""}
                      {infantsCount > 0 ? ` + ${infantsCount} Infant` : ""}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    ₹{priceBreakdown.basePrice.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* 2. Taxes */}
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <div>
                    <span className="font-bold text-slate-800 block">Taxes (5% Tour GST)</span>
                    <span className="text-[11px] text-slate-400">HSN/SAC 998555</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    ₹{priceBreakdown.taxesAmount.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* 3. Fees */}
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <div>
                    <span className="font-bold text-slate-800 block">Fees</span>
                    <span className="text-[11px] text-slate-400">Supplier Booking & Security Fee</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    ₹{priceBreakdown.feesAmount.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* 4. Add-ons */}
                {priceBreakdown.addonsAmount > 0 && (
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 bg-brand-gold-50/60 p-2 rounded-xl">
                    <div>
                      <span className="font-bold text-brand-navy-950 block">Selected Add-ons</span>
                      <span className="text-[10px] text-brand-gold-800">
                        {priceBreakdown.addonsList.length} option{priceBreakdown.addonsList.length > 1 ? "s" : ""} included
                      </span>
                    </div>
                    <span className="font-mono font-bold text-brand-navy-950">
                      +₹{priceBreakdown.addonsAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                {/* 5. Total */}
                <div className="flex justify-between items-center pt-2 text-sm font-bold text-brand-navy-950">
                  <span>Total Amount</span>
                  <span className="font-mono text-base font-extrabold text-brand-navy-950">
                    ₹{priceBreakdown.totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Trust Seal */}
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-[11px] text-slate-500 space-y-1">
                  <div className="flex items-center gap-1 font-bold text-brand-navy-900">
                    <ShieldCheck className="h-3.5 w-3.5 text-brand-emerald-600" />
                    <span>Price Integrity Guarantee</span>
                  </div>
                  <p>Transparent contracted tariff. Zero unexpected departure surcharges.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
