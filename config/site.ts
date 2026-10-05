/**
 * SAH TOUR AND TRAVEL - Enterprise Site Configuration
 * 
 * NOTE: As per enterprise verification guidelines, all contact details,
 * regulatory registration IDs, and official handles use environment variables
 * with standardized placeholders until official verification credentials are provided.
 */

export interface NavItem {
  title: string;
  href: string;
  description?: string;
  badge?: string;
  children?: {
    title: string;
    href: string;
    description?: string;
    isFeatured?: boolean;
  }[];
}

export const siteConfig = {
  name: "SAH TOUR AND TRAVEL",
  shortName: "Sah Travel",
  tagline: "Your Journey. Our Expertise.",
  description:
    "Original, verified commercial travel platform delivering curated holiday packages, transparent itineraries, and authentic world discovery.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.sahtourandtravel.com",
  
  founder: "Rahul Kumar Sah",
  founderTitle: "Founder & Managing Director",
  
  // Enterprise Contact & Registration
  contact: {
    name: "Rahul Kumar Sah",
    founder: "Rahul Kumar Sah",
    helpline: process.env.NEXT_PUBLIC_COMPANY_PHONE || "+977 9825284434, +91 9263028848",
    primaryPhone: "+977 9825284434",
    secondaryPhone: "+91 9263028848",
    phones: ["+977 9825284434", "+91 9263028848"],
    tollFree: process.env.NEXT_PUBLIC_COMPANY_TOLLFREE || "+977 9825284434",
    email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || "sahr67568@gmail.com",
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "sahr67568@gmail.com",
    address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || "Birgunj Parsa, Nepal",
    hours: "Monday – Saturday: 09:00 AM – 08:00 PM",
    emergencySupport: "24/7 Dedicated Support: +977 9825284434",
    gstin: process.env.NEXT_PUBLIC_COMPANY_GSTIN || "Reg: Birgunj Parsa, Nepal",
    iataCode: process.env.NEXT_PUBLIC_COMPANY_IATA || "Sah Tour And Travel Verified Desk",
  },

  // Social Channels (Placeholders with safe '#' fallbacks)
  socials: {
    facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || "#",
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "#",
    linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || "#",
    twitter: process.env.NEXT_PUBLIC_SOCIAL_TWITTER || "#",
    youtube: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || "#",
  },

  // Navigation Links
  mainNav: [
    {
      title: "Destinations",
      href: "/destinations",
      description: "Explore world destinations with insider insights.",
      children: [
        {
          title: "Switzerland & The Alps",
          href: "/destinations/europe/switzerland",
          description: "Scenic railways, glacier lakes, and alpine luxury.",
          isFeatured: true,
        },
        {
          title: "Dubai & UAE",
          href: "/destinations/uae/dubai",
          description: "Skyline grandeur, Arabian desert safaris, and beach resorts.",
        },
        {
          title: "Singapore",
          href: "/destinations/asia/singapore",
          description: "Gardens by the Bay, Marina Bay Sands, and Sentosa Island.",
        },
        {
          title: "Thailand & Islands",
          href: "/destinations/asia/thailand",
          description: "Tropical beaches, floating markets, and cultural temples.",
        },
        {
          title: "Bali, Indonesia",
          href: "/destinations/asia/indonesia/bali",
          description: "Ubud wellness sanctuaries and private cliffside villas.",
        },
        {
          title: "India & Nepal",
          href: "/destinations/asia/india",
          description: "Himalayan horizons, Kerala backwaters, and royal heritage.",
        },
      ],
    },
    {
      title: "Journeys",
      href: "/packages",
      description: "Handcrafted holiday packages tailored for unforgettable memories.",
      children: [
        {
          title: "International Journeys",
          href: "/packages/international-tour-packages",
          description: "Curated experiences across Europe, Southeast Asia, Middle East & beyond.",
          isFeatured: true,
        },
        {
          title: "Domestic Holidays",
          href: "/packages/domestic-tour-packages",
          description: "Discover Himalayan peaks, backwaters, and palace hotels.",
        },
        {
          title: "Honeymoon Specials",
          href: "/packages/honeymoon-packages",
          description: "Romantic luxury retreats with bespoke private dining & couple experiences.",
        },
        {
          title: "Family Vacations",
          href: "/packages/family-vacations",
          description: "Child-friendly, relaxed pacing with multi-generational activities.",
        },
        {
          title: "Luxury Escapes",
          href: "/packages/luxury-escapes",
          description: "5-star bespoke stays, private transfers, and VIP concierge services.",
        },
      ],
    },
    {
      title: "Offers",
      href: "/offers",
      badge: "Exclusive",
      description: "Seasonal privileges, early-bird advantages, and partner deals.",
    },
    {
      title: "Travel Inspiration",
      href: "/blog",
      description: "Editorial guides, destination stories, and travel tips.",
    },
    {
      title: "About Us",
      href: "/about-us",
      description: "Discover Sah Tour And Travel's heritage, founder, and commitment.",
    },
    {
      title: "Contact",
      href: "/contact",
      description: "Connect with our travel counselors to plan your next journey.",
    },
  ] as NavItem[],

  // Footer Navigation Sections
  footerNav: {
    popularDestinations: [
      { title: "Dubai Tour Packages", href: "/packages/international-tour-packages?dest=dubai" },
      { title: "Switzerland Scenic Tours", href: "/packages/international-tour-packages?dest=switzerland" },
      { title: "Singapore City & Sentosa", href: "/packages/international-tour-packages?dest=singapore" },
      { title: "Thailand Beach Holidays", href: "/packages/international-tour-packages?dest=thailand" },
      { title: "Bali Tropical Escapes", href: "/packages/international-tour-packages?dest=bali" },
      { title: "Kerala Backwaters & Hills", href: "/packages/domestic-tour-packages?dest=kerala" },
      { title: "Kashmir Valley Discovery", href: "/packages/domestic-tour-packages?dest=kashmir" },
    ],
    holidayCategories: [
      { title: "International Tour Packages", href: "/packages/international-tour-packages" },
      { title: "Domestic Indian Holidays", href: "/packages/domestic-tour-packages" },
      { title: "Honeymoon Packages", href: "/packages/honeymoon-packages" },
      { title: "Family Vacation Specials", href: "/packages/family-vacations" },
      { title: "Luxury Curated Escapes", href: "/packages/luxury-escapes" },
      { title: "Cultural Heritage Tours", href: "/packages?theme=heritage" },
      { title: "Visa Assistance Services", href: "/holidays/visa-services" },
    ],
    customerSupport: [
      { title: "Customer Help Center", href: "/contact" },
      { title: "Track My Booking", href: "/account/bookings" },
      { title: "Custom Itinerary Request", href: "/holidays/custom-itinerary" },
      { title: "Cancellation & Refund Policy", href: "/legal/cancellation-policy" },
      { title: "Travel Insurance Guidelines", href: "/holidays/travel-insurance" },
      { title: "Official Partners & Citations", href: "/about-us/official-partners-and-sources" },
      { title: "COVID-19 & Visa Advisory", href: "/blog/visa-and-entry-guidelines" },
    ],
    legal: [
      { title: "Privacy Policy", href: "/legal/privacy-policy" },
      { title: "Terms & Conditions", href: "/legal/terms-and-conditions" },
      { title: "Refund & Cancellation Policy", href: "/legal/cancellation-policy" },
      { title: "Cookie Policy", href: "/legal/cookie-policy" },
      { title: "Source Verification Disclaimer", href: "/legal/disclaimer" },
    ],
  },

  // Travel Information Disclaimer Mandate
  disclaimer:
    "Sah Tour And Travel is dedicated to authentic, transparent holiday curation. All destination overviews, visa advisories, and attraction details are cross-referenced with official national tourism boards and government consular portals. Tour availability, hotel ratings, and live airfares are subject to real-time supplier inventory confirmation.",
};
