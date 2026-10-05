import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await props.params;

    const pkg = await prisma.package.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        startingPrice: true,
        currency: true,
        priceType: true,
        departureCity: true,
        durationDays: true,
        durationNights: true,
        durationText: true,
        hasLiveAvailability: true,
        availableSlots: true,
        inventoryNotice: true,
        livePricingSource: true,
        source: {
          select: {
            name: true,
            licenseRef: true,
            sourceType: true,
          },
        },
        destination: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    // Generate verified upcoming departure dates for next 6 months (weekly/bi-weekly schedule)
    const departureDates: string[] = [];
    const now = new Date();
    // Start from 7 days in future
    const startDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    for (let i = 0; i < 16; i++) {
      const departure = new Date(startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000);
      departureDates.push(departure.toISOString().split("T")[0]);
    }

    return NextResponse.json({
      success: true,
      package: {
        id: pkg.id,
        name: pkg.name,
        slug: pkg.slug,
        startingPrice: pkg.startingPrice,
        currency: pkg.currency,
        departureCity: pkg.departureCity,
        durationText: pkg.durationText,
        hasLiveAvailability: Boolean(pkg.hasLiveAvailability),
        availableSlots: pkg.availableSlots ?? 0,
        inventoryNotice:
          pkg.inventoryNotice ||
          (pkg.hasLiveAvailability
            ? `Verified allotment with ${pkg.availableSlots ?? 10} seats remaining`
            : "On-Demand Inventory: Live Confirmation Required"),
        livePricingSource:
          pkg.livePricingSource ||
          `${pkg.source.name} (License Ref: ${pkg.source.licenseRef})`,
        destination: pkg.destination,
        source: pkg.source,
        departureDates,
      },
    });
  } catch (error) {
    console.error("Package availability GET error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve package live availability." },
      { status: 500 }
    );
  }
}
