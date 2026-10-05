export const VALID_BOOKING_STATUSES = [
  "Pending",
  "Payment Pending",
  "Confirmed",
  "Cancelled",
  "Completed",
] as const;

export type BookingStatus = (typeof VALID_BOOKING_STATUSES)[number];

export const VALID_PAYMENT_STATUSES = [
  "UNPAID",
  "PENDING",
  "PAID",
  "REFUNDED",
  "FAILED",
] as const;

export type PaymentStatus = (typeof VALID_PAYMENT_STATUSES)[number];

export interface TravelerDetail {
  type: "ADULT" | "CHILD" | "INFANT";
  title: "Mr" | "Mrs" | "Ms" | "Master";
  firstName: string;
  lastName: string;
  gender: "Male" | "Female" | "Other";
  dateOfBirth?: string;
  passportNumber?: string;
  passportExpiry?: string;
  specialFoodPreference?: string;
}

export interface AddonOption {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  perPerson: boolean; // if true, multiplied by (adults + children)
  iconName: string;
}

export const CURATED_ADDONS: AddonOption[] = [
  {
    id: "addon-insurance",
    name: "Comprehensive International Travel & Medical Shield",
    tagline: "Worldwide emergency medical & baggage loss protection",
    description:
      "Underwritten by accredited travel insurer with ₹10,00,000 emergency medical cover, flight delay allowance, and trip interruption compensation.",
    price: 1499,
    perPerson: true,
    iconName: "ShieldCheck",
  },
  {
    id: "addon-airport",
    name: "Private Executive Airport Chauffeur Transfer",
    tagline: "Meet & greet at arrival airport with luggage assist",
    description:
      "Dedicated air-conditioned luxury sedan or minivan transfer between airport and hotel with flight monitoring.",
    price: 2999,
    perPerson: false,
    iconName: "Car",
  },
  {
    id: "addon-meals",
    name: "Half-Board Gourmet Dining Upgrade",
    tagline: "Daily 4-course chef dinner at licensed hotel restaurants",
    description:
      "Upgrades your package meal plan from Breakfast (CP) to Modified American Plan (MAP) with daily dinner buffets.",
    price: 2499,
    perPerson: true,
    iconName: "Utensils",
  },
  {
    id: "addon-priority",
    name: "VIP Fast-Track Sightseeing & Concierge Pass",
    tagline: "Skip-the-line express attraction vouchers & local e-SIM",
    description:
      "Priority timed-entry to headline monuments, bilingual local assistance hotline, and 10GB high-speed destination e-SIM.",
    price: 1799,
    perPerson: true,
    iconName: "Sparkles",
  },
];

export interface PriceBreakdownInput {
  basePricePerPerson: number;
  adultsCount: number;
  childrenCount: number;
  infantsCount: number;
  selectedAddonIds: string[];
}

export interface PriceBreakdownResult {
  basePrice: number;
  adultsPrice: number;
  childrenPrice: number;
  infantsPrice: number;
  taxesAmount: number;
  feesAmount: number;
  addonsAmount: number;
  addonsList: { id: string; name: string; price: number; quantity: number; total: number }[];
  totalAmount: number;
  currency: string;
  totalTravelers: number;
}

/**
 * Verified pricing calculation engine
 * Adheres to transparent fare breakdown:
 * Base Price (Adults @ 100%, Children @ 75%, Infants @ 15%)
 * + Taxes (5% GST Indian Tour Operator Standard)
 * + Fees (Mandatory Supplier Booking Fee: ₹499)
 * + Optional Add-ons
 * = Total Amount
 */
export function calculateBookingPrice({
  basePricePerPerson,
  adultsCount,
  childrenCount,
  infantsCount,
  selectedAddonIds,
}: PriceBreakdownInput): PriceBreakdownResult {
  const adults = Math.max(1, adultsCount || 1);
  const children = Math.max(0, childrenCount || 0);
  const infants = Math.max(0, infantsCount || 0);
  const totalTravelers = adults + children + infants;
  const payingTravelers = adults + children;

  // 1. Base Prices
  const adultsPrice = Math.round(basePricePerPerson * adults);
  const childrenPrice = Math.round(basePricePerPerson * 0.75 * children); // 75% for children
  const infantsPrice = Math.round(basePricePerPerson * 0.15 * infants); // 15% carrier fee for infants
  const basePrice = adultsPrice + childrenPrice + infantsPrice;

  // 2. Add-ons
  const addonsList: { id: string; name: string; price: number; quantity: number; total: number }[] = [];
  let addonsAmount = 0;

  for (const addonId of selectedAddonIds) {
    const addon = CURATED_ADDONS.find((a) => a.id === addonId);
    if (addon) {
      const quantity = addon.perPerson ? payingTravelers : 1;
      const total = addon.price * quantity;
      addonsAmount += total;
      addonsList.push({
        id: addon.id,
        name: addon.name,
        price: addon.price,
        quantity,
        total,
      });
    }
  }

  // 3. Taxes (5% GST standard on tourist holiday packages)
  const taxesAmount = Math.round((basePrice + addonsAmount) * 0.05);

  // 4. Regulatory & Merchant Booking Fee (Flat ₹499 per booking)
  const feesAmount = 499;

  // 5. Total
  const totalAmount = basePrice + taxesAmount + feesAmount + addonsAmount;

  return {
    basePrice,
    adultsPrice,
    childrenPrice,
    infantsPrice,
    taxesAmount,
    feesAmount,
    addonsAmount,
    addonsList,
    totalAmount,
    currency: "INR",
    totalTravelers,
  };
}

/**
 * Generate unique, official Booking Reference ID: STT-BK-YYYY-XXXX
 */
export function generateBookingReference(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `STT-BK-${year}-${randomSuffix}`;
}

/**
 * Generate unique payment transaction ID: TXN-YYYY-XXXXX
 */
export function generateTransactionId(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `TXN-${year}-${randomSuffix}`;
}
