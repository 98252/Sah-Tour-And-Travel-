import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = await prisma.wishlistItem.findMany({
      where: { userId: user.id },
      include: {
        package: {
          include: {
            destination: true,
            source: true,
            images: true,
            hotels: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const packages = items.map((item) => {
      const pkg = item.package;
      return {
        id: pkg.id,
        name: pkg.name,
        slug: pkg.slug,
        durationDays: pkg.durationDays,
        durationNights: pkg.durationNights,
        durationText: pkg.durationText,
        travelStyle: pkg.travelStyle,
        startingPrice: pkg.startingPrice,
        currency: pkg.currency,
        priceType: pkg.priceType,
        departureCity: pkg.departureCity,
        mealPlan: pkg.mealPlan,
        shortDescription: pkg.shortDescription,
        highlights: JSON.parse(pkg.highlightsJson || "[]"),
        destination: {
          name: pkg.destination.name,
          countryName: pkg.destination.countryName,
        },
        source: {
          name: pkg.source.name,
          licenseRef: pkg.source.licenseRef,
        },
        images: pkg.images,
        hotels: pkg.hotels,
        savedAt: item.createdAt,
      };
    });

    return NextResponse.json({
      success: true,
      count: packages.length,
      packages,
    });
  } catch (error) {
    console.error("Wishlist GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist items." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to save packages to your wishlist." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { packageId } = body;

    if (!packageId || typeof packageId !== "string") {
      return NextResponse.json(
        { error: "Package ID is required." },
        { status: 400 }
      );
    }

    // Check if package exists
    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!pkg) {
      return NextResponse.json(
        { error: "Package not found." },
        { status: 404 }
      );
    }

    // Check if already in wishlist
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_packageId: {
          userId: user.id,
          packageId,
        },
      },
    });

    let saved = false;
    if (existing) {
      // Toggle off / remove
      await prisma.wishlistItem.delete({
        where: { id: existing.id },
      });
      saved = false;
    } else {
      // Add to wishlist
      await prisma.wishlistItem.create({
        data: {
          userId: user.id,
          packageId,
        },
      });
      saved = true;

      // Create notification
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: "Package Saved",
          message: `"${pkg.name}" has been saved to your wishlist.`,
          type: "OFFER",
          link: `/holidays/${pkg.slug}`,
        },
      }).catch(() => {});
    }

    const totalCount = await prisma.wishlistItem.count({
      where: { userId: user.id },
    });

    return NextResponse.json({
      success: true,
      saved,
      count: totalCount,
      message: saved ? "Package added to wishlist." : "Package removed from wishlist.",
    });
  } catch (error) {
    console.error("Wishlist POST error:", error);
    return NextResponse.json(
      { error: "Failed to update wishlist." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    let packageId = searchParams.get("packageId");

    if (!packageId) {
      const body = await request.json().catch(() => ({}));
      packageId = body.packageId;
    }

    if (!packageId) {
      return NextResponse.json(
        { error: "Package ID is required." },
        { status: 400 }
      );
    }

    await prisma.wishlistItem.deleteMany({
      where: {
        userId: user.id,
        packageId,
      },
    });

    const totalCount = await prisma.wishlistItem.count({
      where: { userId: user.id },
    });

    return NextResponse.json({
      success: true,
      message: "Package removed from wishlist.",
      count: totalCount,
    });
  } catch (error) {
    console.error("Wishlist DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to remove item from wishlist." },
      { status: 500 }
    );
  }
}
