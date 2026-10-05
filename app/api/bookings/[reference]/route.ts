import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/rbac";
import { maskPassport, maskPhone, formatSafeErrorResponse } from "@/lib/security";

export async function GET(
  request: Request,
  props: { params: Promise<{ reference: string }> }
) {
  try {
    const { reference } = await props.params;

    const booking = await prisma.booking.findFirst({
      where: {
        OR: [
          { bookingReference: reference.toUpperCase().trim() },
          { id: reference.trim() },
        ],
      },
      include: {
        package: {
          include: {
            destination: true,
            source: true,
            hotels: true,
            images: { take: 2 },
          },
        },
        payments: true,
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // IDOR / Access Authorization Check
    const currentUser = await getCurrentUser();
    const { searchParams } = new URL(request.url);
    const guestEmail = searchParams.get("email");

    let isFullyAuthorized = false;
    let isGuestVerified = false;

    if (currentUser) {
      if (booking.userId === currentUser.id || ADMIN_ROLES.includes(currentUser.role as any)) {
        isFullyAuthorized = true;
      }
    }

    if (!isFullyAuthorized && guestEmail) {
      if (guestEmail.trim().toLowerCase() === booking.customerEmail.trim().toLowerCase()) {
        isGuestVerified = true;
      }
    }

    // If neither logged in owner/admin nor guest email supplied, block sensitive passenger exposure
    // If accessing confirmation page right after checkout without query params, allow with masked PII
    let parsedTravelers: any[] = [];
    try {
      parsedTravelers = JSON.parse(booking.travelersJson || "[]");
    } catch {
      parsedTravelers = [];
    }

    // Mask sensitive traveler documents (passports, phone) if not fully authorized staff/owner
    if (!isFullyAuthorized && !isGuestVerified) {
      parsedTravelers = parsedTravelers.map((t: any) => ({
        ...t,
        passportNumber: t.passportNumber ? maskPassport(t.passportNumber) : undefined,
      }));
    }

    let parsedAddons = [];
    try {
      parsedAddons = booking.addonsJson ? JSON.parse(booking.addonsJson) : [];
    } catch {
      parsedAddons = [];
    }

    const safeBooking = {
      ...booking,
      customerPhone: isFullyAuthorized || isGuestVerified ? booking.customerPhone : maskPhone(booking.customerPhone),
      travelers: parsedTravelers,
      addons: parsedAddons,
    };

    return NextResponse.json({
      success: true,
      booking: safeBooking,
    });
  } catch (error) {
    return formatSafeErrorResponse(error, "Failed to fetch booking details.", 500);
  }
}
