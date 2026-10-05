# SAH TOUR AND TRAVEL — Production-Grade Commercial Travel Booking Platform
## Comprehensive Architectural Specification & Engineering Research Deliverable

---

## Executive Summary & Brand Identity System

### 1. Brand Essence
- **Brand Name:** SAH TOUR AND TRAVEL
- **Tagline:** *"Your Journey. Our Expertise."*
- **Brand Pillars:**
  - **Trust & Transparency:** Zero hidden fees, official source citations for all destinations, certified travel suppliers.
  - **Hospitality & Care:** 24/7 concierge assistance, tailored itineraries, real human travel experts.
  - **Curated Discovery:** Authentic local experiences, vetted accommodation, verified attractions.
  - **Commercial Agility:** Frictionless digital booking, instant Razorpay checkout, live inventory tracking.

### 2. Design System Tokens (Original & Tailored)
| Token Category | Specification | Implementation Value |
|---|---|---|
| **Primary Brand Color** | Deep Regal Navy (Trust, Depth) | `hsl(222, 47%, 18%)` / `#18253d` |
| **Accent / Luxury** | Warm Champagne Gold (Warmth, Luxury) | `hsl(38, 72%, 52%)` / `#e09f2b` |
| **Secondary Accent** | Aegean Teal (Water, Travel, Exploration) | `hsl(187, 85%, 33%)` / `#0d8294` |
| **Success / Verified** | Emerald Forest (Official Citation Badge) | `hsl(158, 64%, 40%)` / `#24a873` |
| **Neutral Backgrounds** | Alabaster / Pristine Slate | `hsl(210, 20%, 98%)` / `#f8fafc` |
| **Surface Cards** | Pure White & Glassmorphic Elevation | `hsl(0, 0%, 100%)` with soft borders |
| **Typography - Display**| Playfair Display / Outfit (Serif Elegance & Modern Flair) | Google Fonts (`Outfit` + `Playfair Display`) |
| **Typography - Body** | Plus Jakarta Sans / Inter (High Legibility & Dense Info) | Google Fonts (`Plus Jakarta Sans`) |
| **Spacing Scale** | 4px base scale (4, 8, 12, 16, 24, 32, 48, 64, 96, 128px) | Tailwind `p-1`, `p-2`, `p-4`, `p-6`, etc. |
| **Border Radius** | Subtle luxury curve: 8px (inputs), 14px (cards), 28px (pills) | `rounded-lg`, `rounded-2xl`, `rounded-full` |
| **Elevation / Shadows** | Multi-tier ambient shadows with navy tint | `0 10px 30px -10px rgba(24, 37, 61, 0.08)` |

---

## 1. Sitemap & Information Architecture

```
/
├── /destinations (All Destinations Directory)
│   ├── /[continent] (e.g., /destinations/asia, /destinations/europe)
│   ├── /[country] (e.g., /destinations/uae, /destinations/switzerland)
│   └── /[country]/[city] (e.g., /destinations/uae/dubai)
├── /packages (Search & Catalog)
│   ├── /international-tour-packages
│   ├── /domestic-tour-packages
│   ├── /honeymoon-packages
│   ├── /family-vacations
│   ├── /luxury-escapes
│   └── /[slug] (Package Detail & Day-by-Day Itinerary)
│       ├── /book (Multi-Step Checkout Flow)
│       └── /enquire (Customization & Lead Modal)
├── /holidays
│   ├── /visa-services (Official Consular & eVisa guidance)
│   ├── /travel-insurance (Policy options & medical coverage)
│   └── /custom-itinerary (Bespoke Tour Planner)
├── /about-us
│   ├── /our-story
│   ├── /why-sah-travel
│   └── /official-partners-and-sources (Transparency & Citations index)
├── /contact
├── /blog (Official Travel Guides & Tourism Board updates)
│   └── /[slug]
├── /auth
│   ├── /login
│   ├── /register
│   ├── /forgot-password
│   └── /verify-request
├── /account (Customer Portal - Authenticated)
│   ├── /profile
│   ├── /bookings (History, Active, Completed, Cancelled)
│   │   └── /[bookingReference] (Voucher, Invoice, Live Status)
│   ├── /travellers (Saved Co-Travellers & Passport Vault)
│   ├── /saved-packages (Wishlist)
│   └── /enquiries (Track submitted holiday requests)
└── /admin (Back-Office CMS & ERP - Protected)
    ├── /dashboard (Revenue, Leads, Active Trips, Analytics)
    ├── /destinations (CRUD with Official Board Citations)
    ├── /packages (Package Builder, Day-wise Itinerary Editor)
    ├── /pricing-inventory (Live slots, Seasonality, Tiered rates)
    ├── /bookings (Order management, Status state machine, Refund)
    ├── /enquiries (CRM Lead board: New -> Contacted -> Quoted -> Converted)
    ├── /hotels-suppliers (Directory of verified suppliers & hotels)
    ├── /reviews (Moderation & Verified Booking Check)
    ├── /coupons (Discount codes, Expiry, Min order rule)
    └── /settings (Audit logs, User roles, API integrations)
```

---

## 2. Customer Journeys

```mermaid
journey
    title Customer Holiday Discovery to Post-Trip Review
    section Discovery
      Visit Landing Page: 5: Customer
      Search Destination/Dates/Budget: 5: Customer
      Filter by Duration/Pacing/Theme: 4: Customer
      Compare Verified Packages: 5: Customer
    section Evaluation
      Read Day-by-Day Itinerary: 5: Customer
      Check Inclusions/Exclusions: 5: Customer
      Review Official Source Citations: 5: Customer
      View Hotel Tier & Flight Options: 4: Customer
    section Booking & Checkout
      Select Travel Date & Room Config: 5: Customer
      Enter Traveller & Passport Data: 4: Customer
      Review Fare Breakdown & Taxes: 4: Customer
      Pay via Razorpay (UPI/Cards/Netbanking): 5: Customer
    section Confirmation & Post-Booking
      Receive WhatsApp/Email & Voucher: 5: Customer
      Track Visa & Flight Status in Portal: 4: Customer
      24/7 On-Trip Concierge Support: 5: Customer
      Submit Post-Trip Verified Review: 5: Customer
```

### Detailed Customer Lifecycle Steps:
1. **Search & Discovery:**
   - Multi-criteria omni-search: Destination, Departure City, Travel Month/Date, Holiday Category (Family, Romantic, Adventure, Cultural).
   - Real-time faceted filters: Budget per person, Hotel Star Rating (3★, 4★, 5★), Meal Plan (CP, MAP, AP), Pacing (Relaxed vs. Active).
2. **Package Evaluation:**
   - Verified Day-by-Day timeline with attraction highlights and verified tourism board citations.
   - Transparent price breakup: Base fare, Taxes (GST 5% + TCS 5%/20% where applicable under Indian travel law), Optional add-ons.
3. **Flexible Action Choice:**
   - **Path A: Instant Online Booking** for fixed-departure or confirmed hotel+tour inventory.
   - **Path B: Customize & Enquire** where an inquiry payload is delivered to the internal CRM for travel consultant curation.
4. **Checkout & Identity Verification:**
   - Primary Booker details + Multi-traveller passport details, date of birth, dietary preferences, and emergency contact.
   - Integration with Razorpay checkout modal with instant validation and 15-minute inventory holding lock.
5. **Post-Booking Experience:**
   - Automated booking confirmation PDF generation, dynamic voucher dispatch via Resend, and live trip status tracking in Customer Dashboard.
   - Post-trip automated review invitation linked strictly to verified booking IDs to prevent fake reviews.

---

## 3. Administrator & Operations Journeys

```mermaid
graph TD
    A[Admin Login - MFA Protected] --> B[Back-Office Dashboard]
    B --> C[Destination Management]
    B --> D[Package Builder & Itinerary Engine]
    B --> E[CRM & Enquiry Board]
    B --> F[Booking & Payment Operations]
    B --> G[Supplier & Hotel Directory]

    C --> C1[Add Destination with Official Board Source URL]
    C --> C2[Attach Verified Attractions & Visa Rules]

    D --> D1[Draft Itinerary: Day, Activities, Transfers, Meals]
    D --> D2[Define Pricing Tiers & Seasonal Surcharges]
    D --> D3[Set Inventory Deadlines & Cancellation Policies]

    E --> E1[Receive Inbound Customer Enquiry]
    E --> E2[Assign to Travel Specialist]
    E --> E3[Send Custom Quotation via Email/WhatsApp]
    E --> E4[Convert to Booking Order]

    F --> F1[Monitor Razorpay Webhook Captures]
    F --> F2[Issue Official Vouchers & Itinerary PDF]
    F --> F3[Handle Modifications, Cancellations & Refunds]
```

---

## 4. Database Architecture (Prisma Schema Specification)

The relational schema strictly enforces referential integrity, audit trails, and mandatory source citations for all factual destination/attraction records.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  CUSTOMER
  TRAVEL_AGENT
  ADMIN
  SUPER_ADMIN
}

enum PackageCategory {
  INTERNATIONAL
  DOMESTIC
  HONEYMOON
  FAMILY
  LUXURY
  ADVENTURE
  SPIRITUAL
  WEEKEND_GETAWAY
}

enum BookingStatus {
  DRAFT
  PENDING_PAYMENT
  PAYMENT_VERIFIED
  CONFIRMED
  VOUCHERS_ISSUED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  REFUNDED
}

enum PaymentStatus {
  INITIATED
  PROCESSING
  CAPTURED
  FAILED
  REFUNDED
  PARTIALLY_REFUNDED
}

enum EnquiryStatus {
  NEW
  CONTACTED
  PROPOSAL_SENT
  NEGOTIATING
  CONVERTED
  LOST
}

model User {
  id            String         @id @default(cuid())
  name          String?
  email         String         @unique
  emailVerified DateTime?
  image         String?
  phoneNumber   String?
  passwordHash  String?
  role          Role           @default(CUSTOMER)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  accounts      Account[]
  sessions      Session[]
  bookings      Booking[]
  enquiries     Enquiry[]
  reviews       Review[]
  savedPackages SavedPackage[]
  auditLogs     AuditLog[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// ----------------------------------------------------
// VERIFIED FACTUAL CONTENT (Mandatory Source Citations)
// ----------------------------------------------------

model Destination {
  id               String       @id @default(cuid())
  slug             String       @unique
  name             String
  country          String
  continent        String
  overviewText     String       @db.Text
  idealDuration    String
  bestTimeToVisit  String
  currencyCode     String
  languageSpoken   String
  timeZoneOffset   String
  visaRequirements String       @db.Text
  
  // MANDATORY SOURCE CITATION (Official Tourism Board / Govt Entity)
  sourceName       String       // e.g. "Visit Dubai (Dubai DET)", "Switzerland Tourism"
  sourceUrl        String       // e.g. "https://www.visitdubai.com"
  verifiedAt       DateTime     @default(now())

  heroImageUrl     String
  galleryImages    String[]     // CDN URLs
  isFeatured       Boolean      @default(false)
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt

  attractions      Attraction[]
  packages         TourPackage[]
}

model Attraction {
  id               String      @id @default(cuid())
  destinationId    String
  name             String
  description      String      @db.Text
  locationName     String
  latitude         Float?
  longitude        Float?
  timingsInfo      String?
  entryFeePolicy   String?     // e.g., "Official ticket required via partner portal"
  
  // MANDATORY SOURCE CITATION
  officialWebsite  String      // e.g. "https://www.burjkhalifa.ae"
  verifiedAt       DateTime    @default(now())

  destination      Destination @relation(fields: [destinationId], references: [id], onDelete: Cascade)
  activities       ItineraryActivity[]
}

model SupplierHotel {
  id               String      @id @default(cuid())
  name             String
  starRating       Int
  city             String
  country          String
  supplierCode     String?     // Verified Supplier Identifier
  contactEmail     String?
  verifiedLicense  String?     // Govt / Hospitality License reference
  createdAt        DateTime    @default(now())
}

// ----------------------------------------------------
// TOUR PACKAGES & ITINERARY ENGINE
// ----------------------------------------------------

model TourPackage {
  id                String          @id @default(cuid())
  slug              String          @unique
  title             String
  tagline           String
  category          PackageCategory
  destinationId     String
  durationDays      Int
  durationNights    Int
  
  // Commercial Pricing Matrix
  startingPriceInr  Decimal         @db.Decimal(10, 2)
  discountedPrice   Decimal?        @db.Decimal(10, 2)
  gstPercentage     Decimal         @default(5.00) @db.Decimal(5, 2)
  tcsPercentage     Decimal         @default(5.00) @db.Decimal(5, 2)

  overview          String          @db.Text
  highlights        String[]
  inclusions        String[]
  exclusions        String[]
  importantNotes    String[]
  cancellationPolicy String         @db.Text

  // Departure & Availability Configuration
  departureCity     String          // e.g., "Mumbai", "Delhi", "Ex-Destination"
  isLiveInventory   Boolean         @default(false)
  isFeatured        Boolean         @default(false)
  isActive          Boolean         @default(true)
  
  heroImageUrl      String
  galleryImages     String[]

  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  destination       Destination     @relation(fields: [destinationId], references: [id], onDelete: Restrict)
  itineraryDays     ItineraryDay[]
  bookingSlots      BookingSlot[]
  bookings          Booking[]
  enquiries         Enquiry[]
  reviews           Review[]
  savedByUsers      SavedPackage[]
}

model ItineraryDay {
  id               String              @id @default(cuid())
  packageId        String
  dayNumber        Int
  title            String
  description      String              @db.Text
  mealsIncluded    String[]            // ["Breakfast", "Dinner"]
  transferDetails  String?             // e.g. "Private airport transfer to hotel"
  stayDetails      String?             // e.g. "Overnight stay at Hotel Swissotel"

  package          TourPackage         @relation(fields: [packageId], references: [id], onDelete: Cascade)
  activities       ItineraryActivity[]

  @@unique([packageId, dayNumber])
}

model ItineraryActivity {
  id               String         @id @default(cuid())
  itineraryDayId   String
  attractionId     String?
  title            String
  description      String         @db.Text
  durationHours    Float?
  isOptional       Boolean        @default(false)
  additionalCost   Decimal?       @db.Decimal(10, 2)

  itineraryDay     ItineraryDay   @relation(fields: [itineraryDayId], references: [id], onDelete: Cascade)
  attraction       Attraction?    @relation(fields: [attractionId], references: [id], onDelete: SetNull)
}

model BookingSlot {
  id               String       @id @default(cuid())
  packageId        String
  startDate        DateTime
  endDate          DateTime
  totalCapacity    Int
  availableSlots   Int
  pricePerAdult    Decimal      @db.Decimal(10, 2)
  pricePerChild    Decimal      @db.Decimal(10, 2)
  singleSupplement Decimal?     @db.Decimal(10, 2)
  isActive         Boolean      @default(true)

  package          TourPackage  @relation(fields: [packageId], references: [id], onDelete: Cascade)
  bookings         Booking[]
}

// ----------------------------------------------------
// BOOKINGS, PAYMENTS & TRAVELLERS
// ----------------------------------------------------

model Booking {
  id                 String         @id @default(cuid())
  bookingReference   String         @unique // e.g. "STT-2026-94812"
  userId             String
  packageId          String
  bookingSlotId      String?
  
  // Date & Room Details
  travelStartDate    DateTime
  travelEndDate      DateTime
  adultCount         Int            @default(1)
  childCount         Int            @default(0)
  roomCount          Int            @default(1)

  // Financial Breakdown
  baseAmount         Decimal        @db.Decimal(10, 2)
  gstAmount          Decimal        @db.Decimal(10, 2)
  tcsAmount          Decimal        @db.Decimal(10, 2)
  discountAmount     Decimal        @default(0.00) @db.Decimal(10, 2)
  totalPayable       Decimal        @db.Decimal(10, 2)
  currency           String         @default("INR")

  status             BookingStatus  @default(DRAFT)
  specialRequests    String?        @db.Text
  cancellationReason String?        @db.Text

  createdAt          DateTime       @default(now())
  updatedAt          DateTime       @updatedAt

  user               User           @relation(fields: [userId], references: [id], onDelete: Restrict)
  package            TourPackage    @relation(fields: [packageId], references: [id], onDelete: Restrict)
  slot               BookingSlot?   @relation(fields: [bookingSlotId], references: [id], onDelete: SetNull)
  travellers         Traveller[]
  payments           Payment[]
  voucherDocuments   VoucherDocument[]
}

model Traveller {
  id                 String       @id @default(cuid())
  bookingId          String
  isPrimaryBooker    Boolean      @default(false)
  title              String       // Mr, Mrs, Ms, Master
  firstName          String
  lastName           String
  dateOfBirth        DateTime
  gender             String
  nationality        String       @default("Indian")
  passportNumber     String?
  passportExpiryDate DateTime?
  dietaryPreference  String?
  phone              String?
  email              String?

  booking            Booking      @relation(fields: [bookingId], references: [id], onDelete: Cascade)
}

model Payment {
  id                   String        @id @default(cuid())
  bookingId            String
  razorpayOrderId      String        @unique
  razorpayPaymentId    String?       @unique
  razorpaySignature    String?
  amount               Decimal       @db.Decimal(10, 2)
  currency             String        @default("INR")
  status               PaymentStatus @default(INITIATED)
  method               String?       // UPI, CARD, NETBANKING
  errorCode            String?
  errorDescription     String?
  rawWebhookPayload    Json?
  createdAt            DateTime      @default(now())
  updatedAt            DateTime      @updatedAt

  booking              Booking       @relation(fields: [bookingId], references: [id], onDelete: Cascade)
}

model VoucherDocument {
  id           String      @id @default(cuid())
  bookingId    String
  documentType String      // "CONFIRMATION_VOUCHER", "FLIGHT_TICKET", "HOTEL_VOUCHER"
  documentUrl  String      // Secure S3/Cloudinary URL
  issuedAt     DateTime    @default(now())

  booking      Booking     @relation(fields: [bookingId], references: [id], onDelete: Cascade)
}

// ----------------------------------------------------
// ENQUIRIES, REVIEWS & CRM
// ----------------------------------------------------

model Enquiry {
  id                 String         @id @default(cuid())
  enquiryReference   String         @unique // e.g. "ENQ-88219"
  userId             String?
  packageId          String?
  customerName       String
  customerEmail      String
  customerPhone      String
  intendedDate       DateTime?
  destinationText    String?
  travellerCount     Int?
  budgetRange        String?
  notes              String?        @db.Text
  status             EnquiryStatus  @default(NEW)
  assignedToAgent    String?
  createdAt          DateTime       @default(now())
  updatedAt          DateTime       @updatedAt

  user               User?          @relation(fields: [userId], references: [id], onDelete: SetNull)
  package            TourPackage?   @relation(fields: [packageId], references: [id], onDelete: SetNull)
}

model Review {
  id            String      @id @default(cuid())
  packageId     String
  userId        String
  rating        Int         // 1 to 5
  title         String
  comment       String      @db.Text
  travelDate    DateTime?
  isVerifiedTrip Boolean    @default(false)
  isApproved    Boolean     @default(false)
  createdAt     DateTime    @default(now())

  package       TourPackage @relation(fields: [packageId], references: [id], onDelete: Cascade)
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Coupon {
  id            String      @id @default(cuid())
  code          String      @unique
  discountType  String      // PERCENTAGE, FIXED_INR
  discountValue Decimal     @db.Decimal(10, 2)
  minBookingInr Decimal?    @db.Decimal(10, 2)
  maxDiscountInr Decimal?   @db.Decimal(10, 2)
  validFrom     DateTime
  validTill     DateTime
  usageLimit    Int?
  usedCount     Int         @default(0)
  isActive      Boolean     @default(true)
}

model SavedPackage {
  id         String      @id @default(cuid())
  userId     String
  packageId  String
  createdAt  DateTime    @default(now())

  user       User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  package    TourPackage @relation(fields: [packageId], references: [id], onDelete: Cascade)

  @@unique([userId, packageId])
}

model AuditLog {
  id         String      @id @default(cuid())
  userId     String?
  action     String
  entityType String
  entityId   String
  metadata   Json?
  timestamp  DateTime    @default(now())

  user       User?       @relation(fields: [userId], references: [id], onDelete: SetNull)
}
```

---

## 5. API Architecture & Server Actions

### Core Endpoints & Route Handlers Matrix

| Method | Endpoint / Action | Purpose | Auth Required | Validation Schema |
|---|---|---|---|---|
| `GET` | `/api/destinations` | Fetch verified destinations with official citations | Public | `DestinationQuerySchema` |
| `GET` | `/api/destinations/[slug]` | Destination overview, attractions, packages | Public | `SlugParamSchema` |
| `GET` | `/api/packages` | Filtered & paginated package catalog | Public | `PackageFilterSchema` |
| `GET` | `/api/packages/[slug]` | Comprehensive package details with itinerary | Public | `SlugParamSchema` |
| `POST` | `/actions/enquiry.create` | Submit lead/customization request | Public | `CreateEnquirySchema` |
| `POST` | `/actions/booking.create` | Initiate booking & calculate tax/pricing | `CUSTOMER` | `CreateBookingSchema` |
| `POST` | `/api/payments/razorpay-order`| Create verified Razorpay Order with backend locked price | `CUSTOMER` | `CreatePaymentOrderSchema` |
| `POST` | `/api/payments/verify` | Verify HMAC SHA256 signature from client checkout | `CUSTOMER` | `VerifyPaymentSignatureSchema` |
| `POST` | `/api/webhooks/razorpay` | Asynchronous payment capture/refund processing | Webhook Secret | `RazorpayWebhookHeader` |
| `GET` | `/api/account/bookings` | Retrieve user bookings & documents | `CUSTOMER` | Session check |
| `POST` | `/actions/admin.package.upsert` | Manage package, day schedules, pricing | `ADMIN` | `PackageUpsertSchema` |
| `POST` | `/actions/admin.destination.upsert`| Ingest destination with mandatory source citations | `ADMIN` | `DestinationUpsertSchema` |
| `GET` | `/api/admin/analytics` | Real-time booking conversion & lead metrics | `ADMIN` | Admin session |

### Sample Zod Validation Schemas
```typescript
import { z } from 'zod';

export const CreateEnquirySchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Please provide a valid email address"),
  customerPhone: z.string().regex(/^[0-9+ -]{10,15}$/, "Valid phone number required"),
  packageId: z.string().cuid().optional(),
  intendedDate: z.string().datetime().optional(),
  travellerCount: z.coerce.number().min(1).max(50),
  budgetRange: z.string().optional(),
  notes: z.string().max(1000).optional()
});

export const CreateBookingSchema = z.object({
  packageId: z.string().cuid(),
  bookingSlotId: z.string().cuid().optional(),
  travelStartDate: z.string().datetime(),
  adultCount: z.number().int().min(1).max(20),
  childCount: z.number().int().min(0).max(10),
  roomCount: z.number().int().min(1).max(10),
  specialRequests: z.string().max(500).optional(),
  travellers: z.array(z.object({
    isPrimaryBooker: z.boolean(),
    title: z.enum(["Mr", "Mrs", "Ms", "Master"]),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    dateOfBirth: z.string().datetime(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    nationality: z.string().default("Indian"),
    passportNumber: z.string().optional(),
    passportExpiryDate: z.string().datetime().optional(),
    dietaryPreference: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional()
  })).min(1)
});

export const DestinationUpsertSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  country: z.string().min(2),
  continent: z.string().min(2),
  overviewText: z.string().min(50),
  idealDuration: z.string(),
  bestTimeToVisit: z.string(),
  currencyCode: z.string().length(3),
  languageSpoken: z.string(),
  timeZoneOffset: z.string(),
  visaRequirements: z.string(),
  // MANDATORY SOURCE CITATION (Zero Fake Data Enforcement)
  sourceName: z.string().min(3, "Official tourism board or government source name is required"),
  sourceUrl: z.string().url("Must provide verified official website URL"),
  heroImageUrl: z.string().url(),
  galleryImages: z.array(z.string().url())
});
```

---

## 6. Component Architecture & Design System

The platform adopts a modular, atomic structure built with React Server Components (RSC) by default and Client Components only for rich interactive leaves.

```
/components
├── /ui (shadcn/ui customized tokens: buttons, dialogs, inputs, sheets, badges)
├── /common
│   ├── Header.tsx (Sticky navigation, mega-menu, phone helpline, currency picker)
│   ├── Footer.tsx (Trust badges, official credentials, quick links, newsletter)
│   ├── Breadcrumbs.tsx (SEO-optimized BreadcrumbList schema integration)
│   ├── VerifiedBadge.tsx (Visual indicator displaying official source citation)
│   ├── PriceTag.tsx (Displaying INR formatted price, tax breakdown popover)
│   └── ContactQuickBar.tsx (WhatsApp click-to-chat, expert callback button)
├── /search
│   ├── OmniSearchBar.tsx (Combobox with destination suggestions, dates, travellers)
│   ├── FilterSidebar.tsx (Accordion with price sliders, duration checkboxes, themes)
│   ├── ActiveFiltersBar.tsx (Removable filter chips)
│   └── SortDropdown.tsx (Price low-to-high, duration, popularity)
├── /package
│   ├── PackageCard.tsx (High-conversion card: duration badge, flight badge, ratings)
│   ├── PackageHero.tsx (Hero gallery, quick info bar, sticky booking summary)
│   ├── ItineraryTimeline.tsx (Interactive day-by-day accordions with maps & photos)
│   ├── InclusionsExclusions.tsx (Two-column clear visual checklist)
│   ├── PolicyTabs.tsx (Cancellation, payment terms, visa requirements)
│   └── VerifiedSourceFooter.tsx (Displays official tourism board citation)
├── /booking
│   ├── BookingEngineBar.tsx (Floating price selector on desktop/mobile)
│   ├── DateRoomSelector.tsx (Calendar selector with slot capacity indicators)
│   ├── TravellerForm.tsx (Dynamic multi-traveller fields with passport validation)
│   ├── FareSummaryCard.tsx (Clear breakdown: Base + GST 5% + TCS 5% - Discount)
│   └── RazorpayButton.tsx (Client component triggering Razorpay checkout modal)
├── /enquiry
│   ├── EnquiryModal.tsx (Clean popup form for instant holiday consultation)
│   └── CustomPlannerWizard.tsx (Step-by-step bespoke holiday requirement builder)
└── /admin
    ├── AdminSidebar.tsx (Nav to packages, destinations, leads, bookings)
    ├── DataTable.tsx (Generic sortable, filterable table with server pagination)
    ├── ItineraryEditor.tsx (Drag-and-drop day activities builder)
    └── StatCard.tsx (KPI summary cards with trend lines)
```

---

## 7. Data-Source Strategy (Static Verified Content vs. Live Data)

To uphold our commitment to **zero fake/demo/fabricated travel data**, the data architecture maintains strict separation between verified static content and live supplier data:

```mermaid
graph LR
    subgraph Static Verified Content Repository
        A1[Official Tourism Boards] --> B1[Destination Guides]
        A2[Govt Consular Portals] --> B2[Visa & Entry Regulations]
        A3[Official Attraction Portals] --> B3[Attraction Details & Hours]
        B1 & B2 & B3 --> D1[PostgreSQL Database with Source Citations]
    end

    subgraph Live Supplier & Dynamic Data
        C1[Amadeus / Skyscanner APIs] --> E1[Live Flight Availability]
        C2[HotelBeds / Wholesaler APIs] --> E2[Live Room Rates & Slots]
        C3[Open Exchange Rates API] --> E3[Live Multi-Currency FX]
        C4[OpenWeather API] --> E4[Real-time Weather at Destination]
        C5[Razorpay Payment Gateway] --> E5[Live Transaction Settlement]
    end

    D1 --> F[Sah Tour And Travel Web Platform]
    E1 & E2 & E3 & E4 & E5 --> F
```

### Static Verified Content Governance
1. **Source Citation Integrity:** Every record in the `Destination` and `Attraction` table must store:
   - `sourceName`: e.g., *"Visit Dubai / Dubai Department of Economy and Tourism"*, *"Swiss National Tourist Office (MySwitzerland.com)"*, *"Ministry of Tourism, Government of India (Incredible India)"*.
   - `sourceUrl`: Verified HTTPS canonical link to the authority website.
   - `verifiedAt`: Timestamp of factual check.
2. **Attraction Accuracy:** Timings, dress codes, entry policies must be derived from official attraction sites (e.g., Louvre Museum, Burj Khalifa, Eiffel Tower official ticket portal).

### Live Data Architecture
1. **Dynamic Inventory & Pricing:** Prices are marked with clear state badges:
   - `Guaranteed Departure (Live Slots)`: Connected to internal confirmed allotment.
   - `Supplier On-Request`: Clearly states that booking is confirmed within 24 hours of supplier re-validation.
2. **Zero Fictional Discounts:** No artificial countdown timers or fake "90% off" claims. All discounts represent genuine seasonal promotions or group booking deals.

---

## 8. SEO & Discoverability Strategy

1. **Information Hierarchy & Dynamic Metadata:**
   - Every destination and package generates server-side dynamic tags using Next.js `generateMetadata`:
     - Dynamic title: `{Package Title} - {DurationDays}D/{DurationNights}N | Sah Tour And Travel`
     - Meta description: Curated summary mentioning key verified highlights, departure city, and transparent pricing.
2. **Schema.org Structured Data (JSON-LD):**
   - Package Pages: `schema.org/TouristTrip` and `schema.org/Product` with nested `offers` (price, priceCurrency: "INR", availability: "InStock").
   - Destination Pages: `schema.org/Place` and `schema.org/TouristDestination` with official citations.
   - FAQ Sections: `schema.org/FAQPage` for instant rich snippets in Google search results.
   - Navigation: `schema.org/BreadcrumbList` linking homepage to category and package.
3. **Core Web Vitals & Performance Engineering:**
   - Next.js Image Component (`next/image`) with WebP/AVIF compression and responsive sizes (`sizes="(max-width: 768px) 100vw, 50vw"`).
   - Server-side streaming (`loading.tsx` and React Suspense) for sub-second Largest Contentful Paint (LCP < 1.5s).
   - Zero layout shift (CLS < 0.05) through fixed aspect ratios on imagery and skeleton loaders.

---

## 9. Authentication, Security & RBAC Strategy

```mermaid
sequenceDiagram
    autonumber
    actor User as Customer / Admin
    participant App as Next.js App / Auth.js
    participant DB as PostgreSQL (Prisma)
    participant MW as Middleware (RBAC)

    User->>App: Submits Credentials / Google OAuth
    App->>DB: Query User & Validate Password (bcrypt) or OAuth Token
    DB-->>App: User record with Role (CUSTOMER / ADMIN)
    App-->>User: Issue Signed Secure HTTP-Only JWT Cookie
    
    Note over User, MW: Subsequent Request to /admin or /account
    User->>MW: Request with Session Cookie
    MW->>MW: Verify JWT Signature & Decrypt
    alt Request to /admin and Role != ADMIN
        MW-->>User: 403 Forbidden / Redirect to Login
    else Authorized
        MW-->>App: Allow Request & Forward Auth Headers
    end
```

### Security Guardrails:
1. **Session Management:** Auth.js v5 with stateless, encrypted JWTs stored in `HttpOnly`, `SameSite=Lax`, `Secure` cookies.
2. **Role Hierarchy:**
   - `CUSTOMER`: Access to own profile, bookings, saved packages, and enquiry history.
   - `TRAVEL_AGENT`: Access to CRM leads, customer assignment, and custom quotation generation.
   - `ADMIN`: Full access to destinations, packages, itinerary engine, pricing, and reviews.
   - `SUPER_ADMIN`: Access to user management, payment reconciliation, and audit logs.
3. **API Protection:** Next.js route middleware guarding `/admin/*` and `/account/*` with automated rate limiting (Upstash Redis) on checkout and enquiry submissions to prevent automated abuse.

---

## 10. Booking Engine & State Machine

```mermaid
stateDiagram-v2
    [*] --> DRAFT : User starts date/room selection
    DRAFT --> PENDING_PAYMENT : Submits traveller info (Hold slot 15 min)
    
    PENDING_PAYMENT --> PAYMENT_VERIFIED : Razorpay signature verified
    PENDING_PAYMENT --> CANCELLED : 15 min timeout expired / Payment failed
    
    PAYMENT_VERIFIED --> CONFIRMED : Booking reference allocated (STT-XXXXX)
    CONFIRMED --> VOUCHERS_ISSUED : Admin/Supplier uploads travel documents
    
    VOUCHERS_ISSUED --> IN_PROGRESS : Travel departure date reached
    IN_PROGRESS --> COMPLETED : Trip return date concluded
    
    CONFIRMED --> REFUNDED : Customer requests cancellation & Refund processed
    VOUCHERS_ISSUED --> REFUNDED : Cancellation approved per policy
```

### Booking Concurrency & Inventory Lock:
- When a customer enters the checkout step, a 15-minute temporary inventory reservation is written to Redis or a timestamped database lock.
- If payment is not completed within 15 minutes, the slot is released automatically, preventing inventory hoarding.

---

## 11. Payment Architecture (Razorpay Integration)

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Client as Next.js Frontend
    participant Server as Next.js Server Action
    participant RZP as Razorpay API
    participant DB as PostgreSQL Database
    participant WH as Webhook Handler

    Customer->>Client: Clicks "Proceed to Payment"
    Client->>Server: Request Payment Order (BookingId)
    Server->>DB: Verify Booking Status & Re-calculate Total
    Server->>RZP: Create Order (amount, currency="INR", receipt=STT-ref)
    RZP-->>Server: Return order_id (e.g. order_OP92348k)
    Server-->>Client: Return razorpay_order_id & razorpay_key_id

    Client->>Customer: Render Razorpay Checkout Modal (UPI, Cards, Netbanking)
    Customer->>RZP: Completes Payment on Modal
    RZP-->>Client: Returns {razorpay_payment_id, razorpay_order_id, razorpay_signature}

    Client->>Server: POST /api/payments/verify
    Server->>Server: Compute HMAC SHA256 (order_id + "|" + payment_id, secret)
    alt Signature Matches
        Server->>DB: Update Payment: CAPTURED, Booking: CONFIRMED
        Server-->>Client: Success! Redirect to /account/bookings/[reference]
    else Invalid Signature
        Server-->>Client: Payment Verification Error
    end

    Note over RZP, WH: Asynchronous Safeguard
    RZP->>WH: POST /api/webhooks/razorpay (event: payment.captured)
    WH->>WH: Validate X-Razorpay-Signature
    WH->>DB: Idempotent status check & confirm booking if not yet marked
```

---

## 12. Deployment, DevOps & Infrastructure Architecture

```
                    ┌─────────────────────────┐
                    │      DNS / Cloudflare   │
                    │   (DDoS & SSL Edge)     │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │      Vercel Edge        │
                    │ (Next.js App Router)    │
                    │ - Streaming SSR Pages   │
                    │ - Server Actions        │
                    │ - API Edge Middleware   │
                    └────────────┬────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Neon / Supabase │     │  Cloudinary CDN │     │  Upstash Redis  │
│  PostgreSQL DB  │     │ (Optimized Img) │     │ (Rate Limiting) │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Razorpay PG    │     │  Resend (Email) │     │ Google Analytics│
│  (Transactions) │     │ (PDF Vouchers)  │     │ 4 & Search Cons.│
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Environment Variable Matrix
```bash
# Database
DATABASE_URL="postgresql://user:password@host/sahtourandtravel?sslmode=require"

# NextAuth / Auth.js
NEXTAUTH_URL="https://www.sahtourandtravel.com"
NEXTAUTH_SECRET="super-secure-production-random-secret"
GOOGLE_CLIENT_ID="google-client-id"
GOOGLE_CLIENT_SECRET="google-client-secret"

# Payments (Razorpay)
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="razorpay_secret_xxxxxxxxxxxx"
RAZORPAY_WEBHOOK_SECRET="razorpay_webhook_secret_xxxxxxxxxxxx"

# Media Storage
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="sah-tour-travel"
CLOUDINARY_API_KEY="xxxxxxxxxxxx"
CLOUDINARY_API_SECRET="xxxxxxxxxxxx"

# Email Delivery
RESEND_API_KEY="re_xxxxxxxxxxxx"
EMAIL_FROM="bookings@sahtourandtravel.com"

# Analytics & Maps
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIzaSyxxxxxxxxxxxx"
```

---

## Conclusion & Readiness
This document serves as the complete, authoritative engineering plan for **SAH TOUR AND TRAVEL**. Every system is mapped to production standards, eliminates fabricated data, ensures legal and tax compliance, and guarantees a luxury, trustworthy customer experience.
