import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BookingWizard } from "@/components/booking/booking-wizard";

export interface BookPackagePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  props: BookPackagePageProps
): Promise<Metadata> {
  const { slug } = await props.params;
  const pkg = await prisma.package.findUnique({
    where: { slug },
    select: { name: true, durationText: true },
  });

  if (!pkg) {
    return { title: "Booking Not Found | Sah Tour And Travel" };
  }

  return {
    title: `Book Tour: ${pkg.name} | Sah Tour And Travel`,
    description: `Official guaranteed online booking for ${pkg.name} (${pkg.durationText}). Transparent price breakdown, verified tour allotments, and instant confirmation.`,
  };
}

export default async function BookPackagePage(props: BookPackagePageProps) {
  const { slug } = await props.params;

  const pkg = await prisma.package.findUnique({
    where: { slug },
    include: {
      destination: true,
      source: true,
      hotels: true,
      inclusions: true,
      exclusions: true,
      images: { take: 3 },
    },
  });

  if (!pkg) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1">
        <BookingWizard initialPackage={pkg} />
      </main>
      <Footer />
    </div>
  );
}
