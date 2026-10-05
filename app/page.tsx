import * as React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WaterHero } from "@/components/home/water-hero";
import { TrendingDestinationsSlider } from "@/components/home/trending-destinations-slider";
import { ExploreWorldGrid } from "@/components/home/explore-world-grid";
import { TrendingEscapes } from "@/components/home/trending-escapes";
import { CuratedCategories } from "@/components/home/curated-categories";
import { ThemesInspireTravel } from "@/components/home/themes-inspire-travel";
import { SpecialOffersBanner } from "@/components/home/special-offers-banner";
import { TravelInspiration } from "@/components/home/travel-inspiration";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { TravelerReviews } from "@/components/home/traveler-reviews";
import { CookieBanner } from "@/components/home/cookie-banner";
import { getDestinations } from "@/services/destination-service";
import { getPackages, getDistinctDepartureCities } from "@/services/package-service";
import { getPublishedArticles } from "@/lib/content";
import { getApprovedReviews } from "@/lib/reviews";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // Incremental Static Regeneration every minute

export const metadata: Metadata = {
  title: "Sah Tour And Travel | Your Journey. Our Expertise.",
  description:
    "Original luxury commercial travel curation. Verified holiday itineraries, transparent pricing, and unforgettable journeys across Switzerland, Dubai, Singapore, Kerala, and beyond.",
};

export default async function HomePage() {
  // Query all genuine database content concurrently
  const [destinations, packages, offers, departureCities, articlesData, reviewsData] =
    await Promise.all([
      getDestinations(),
      getPackages({ limit: 6 }),
      prisma.offer.findMany({
        where: { isArchived: false },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      getDistinctDepartureCities(),
      getPublishedArticles({ limit: 3 }),
      getApprovedReviews(),
    ]);

  // Destination options for Hero Search Bar
  const heroDestinations = destinations.map((d) => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    countryName: d.country?.name,
  }));

  return (
    <div className="w-full min-h-screen flex flex-col bg-white text-slate-900 selection:bg-brand-gold-500 selection:text-white overflow-x-hidden">
      {/* 1. Official Sticky Travel Header */}
      <Header />

      <main className="w-full flex-1 overflow-x-hidden">
        {/* 2. Immersive Water/Lake Hero Section with Subtle Motion & Search */}
        <WaterHero
          destinations={heroDestinations}
          departureCities={departureCities.length > 0 ? departureCities : undefined}
        />

        {/* 3. Trending Destinations — Iconic Capsule Destination Slider */}
        <TrendingDestinationsSlider />

        {/* 4. Explore the World — Editorial Destination Mosaic */}
        <ExploreWorldGrid destinations={destinations} />

        {/* 4. Trending Escapes — Curated Verified Packages */}
        <TrendingEscapes
          packages={packages}
          title="Trending Escapes"
          subtitle="Handcrafted itineraries with guaranteed allotments and transparent inclusions."
        />

        {/* 5. Explore Themes that Inspire Travel (Horizontal Expanding Accordion) */}
        <ThemesInspireTravel />

        {/* 6. Curated Travel Themes & Video Highlights */}
        <CuratedCategories />

        {/* 6. Seasonal Privileges & Exclusive Partner Offers */}
        <SpecialOffersBanner offers={offers} />

        {/* 7. Travel Inspiration & Editorial Guides Desk */}
        <TravelInspiration articles={articlesData.articles} />

        {/* 8. The Sah Tour Commitment (Authentic, Verifiable Values) */}
        <WhyChooseUs />

        {/* 9. Genuine Traveler Reviews (Direct from Database) */}
        <TravelerReviews reviews={reviewsData.reviews} />
      </main>

      {/* 10. Sophisticated Travel Footer & Verification Disclaimer */}
      <Footer />

      {/* 11. Minimal Non-Intrusive Cookie Consent Banner */}
      <CookieBanner />
    </div>
  );
}
