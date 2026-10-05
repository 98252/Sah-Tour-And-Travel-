import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { hasPermission, AdminModule, AdminAction, ADMIN_ROLES, AdminRole } from "@/lib/rbac";
import { createAuditLog } from "@/lib/audit";
import { formatSafeErrorResponse } from "@/lib/security";
import bcrypt from "bcryptjs";

// Secure helper to authenticate and verify staff role
async function getAuthenticatedAdmin(request: Request) {
  const user = await getCurrentUser();

  // In non-production testing, allow x-admin-role for CLI integration tests
  let roleOverride: string | null = null;
  if (process.env.NODE_ENV !== "production") {
    roleOverride = request.headers.get("x-admin-role");
  }

  if (!user && !roleOverride) {
    return {
      authenticated: false as const,
      response: NextResponse.json(
        { error: "Authentication required. Please sign in with staff credentials." },
        { status: 401 }
      ),
    };
  }

  const rawRole = roleOverride || (user?.role === "ADMIN" ? "Admin" : user?.role === "AGENT" ? "Support Agent" : user?.role);
  const role = rawRole as AdminRole;

  if (!ADMIN_ROLES.includes(role)) {
    return {
      authenticated: false as const,
      response: NextResponse.json(
        { error: `Access Denied: Persona [${rawRole}] does not possess necessary administrative privileges.` },
        { status: 403 }
      ),
    };
  }

  const userName = user?.name || `System ${role}`;
  const userId = user?.id || null;

  return { authenticated: true as const, user, role, userName, userId };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ module: string }> }
) {
  try {
    const { module } = await params;
    const adminModule = module.toLowerCase() as AdminModule;
    const auth = await getAuthenticatedAdmin(request);
    if (!auth.authenticated) {
      return auth.response;
    }
    const { role } = auth;

    // Permission check
    if (!hasPermission(role, adminModule, "READ")) {
      return NextResponse.json(
        {
          error: `Access Denied: Persona [${role}] does not have permission to read the [${module}] module.`,
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const showArchived = searchParams.get("archived") === "true";
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    let items: any[] = [];
    let total = 0;

    switch (adminModule) {
      case "destinations": {
        const where: any = showArchived ? {} : { isArchived: false };
        if (search) where.name = { contains: search };
        [items, total] = await Promise.all([
          prisma.destination.findMany({
            where,
            include: { country: true, region: true },
            take: limit,
            skip: offset,
            orderBy: { createdAt: "desc" },
          }),
          prisma.destination.count({ where }),
        ]);
        break;
      }

      case "packages": {
        const where: any = showArchived ? {} : { isArchived: false };
        if (search) where.name = { contains: search };
        [items, total] = await Promise.all([
          prisma.package.findMany({
            where,
            include: { destination: true, source: true },
            take: limit,
            skip: offset,
            orderBy: { createdAt: "desc" },
          }),
          prisma.package.count({ where }),
        ]);
        break;
      }

      case "itineraries": {
        const where: any = {};
        if (search) where.title = { contains: search };
        [items, total] = await Promise.all([
          prisma.packageItinerary.findMany({
            where,
            include: { package: { select: { name: true, slug: true } } },
            take: limit,
            skip: offset,
            orderBy: { dayNumber: "asc" },
          }),
          prisma.packageItinerary.count({ where }),
        ]);
        break;
      }

      case "hotels": {
        const where: any = {};
        if (search) where.hotelName = { contains: search };
        [items, total] = await Promise.all([
          prisma.packageHotel.findMany({
            where,
            include: { package: { select: { name: true, slug: true } } },
            take: limit,
            skip: offset,
            orderBy: { starRating: "desc" },
          }),
          prisma.packageHotel.count({ where }),
        ]);
        break;
      }

      case "activities": {
        const where: any = {};
        if (search) where.title = { contains: search };
        [items, total] = await Promise.all([
          prisma.packageActivity.findMany({
            where,
            include: { package: { select: { name: true, slug: true } } },
            take: limit,
            skip: offset,
            orderBy: { title: "asc" },
          }),
          prisma.packageActivity.count({ where }),
        ]);
        break;
      }

      case "bookings": {
        const where: any = {};
        if (search) {
          where.OR = [
            { bookingReference: { contains: search } },
            { customerName: { contains: search } },
            { customerEmail: { contains: search } },
          ];
        }
        [items, total] = await Promise.all([
          prisma.booking.findMany({
            where,
            include: { package: { select: { name: true } } },
            take: limit,
            skip: offset,
            orderBy: { createdAt: "desc" },
          }),
          prisma.booking.count({ where }),
        ]);
        break;
      }

      case "customers": {
        const where: any = showArchived ? {} : { isArchived: false };
        if (search) {
          where.OR = [
            { name: { contains: search } },
            { email: { contains: search } },
            { phone: { contains: search } },
          ];
        }
        [items, total] = await Promise.all([
          prisma.user.findMany({
            where,
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              role: true,
              preferredLanguage: true,
              isArchived: true,
              createdAt: true,
              _count: { select: { bookings: true, enquiries: true } },
            },
            take: limit,
            skip: offset,
            orderBy: { createdAt: "desc" },
          }),
          prisma.user.count({ where }),
        ]);
        break;
      }

      case "enquiries": {
        const where: any = showArchived ? {} : { isArchived: false };
        if (search) {
          where.OR = [
            { referenceNo: { contains: search } },
            { name: { contains: search } },
            { email: { contains: search } },
            { destination: { contains: search } },
          ];
        }
        [items, total] = await Promise.all([
          prisma.enquiry.findMany({
            where,
            take: limit,
            skip: offset,
            orderBy: { createdAt: "desc" },
          }),
          prisma.enquiry.count({ where }),
        ]);
        break;
      }

      case "reviews": {
        const where: any = showArchived ? {} : { isArchived: false };
        if (search) {
          where.OR = [
            { title: { contains: search } },
            { comment: { contains: search } },
            { status: { contains: search } },
          ];
        }
        [items, total] = await Promise.all([
          prisma.review.findMany({
            where,
            include: {
              user: { select: { name: true, email: true } },
              package: { select: { name: true, slug: true } },
              booking: { select: { bookingReference: true } },
            },
            take: limit,
            skip: offset,
            orderBy: { createdAt: "desc" },
          }),
          prisma.review.count({ where }),
        ]);
        break;
      }

      case "offers": {
        const where: any = showArchived ? {} : { isArchived: false };
        if (search) where.title = { contains: search };
        [items, total] = await Promise.all([
          prisma.offer.findMany({
            where,
            take: limit,
            skip: offset,
            orderBy: { createdAt: "desc" },
          }),
          prisma.offer.count({ where }),
        ]);
        break;
      }

      case "coupons": {
        const where: any = showArchived ? {} : { isArchived: false };
        if (search) where.code = { contains: search };
        [items, total] = await Promise.all([
          prisma.coupon.findMany({
            where,
            take: limit,
            skip: offset,
            orderBy: { createdAt: "desc" },
          }),
          prisma.coupon.count({ where }),
        ]);
        break;
      }

      case "content": {
        const where: any = showArchived ? {} : { isArchived: false };
        if (search) {
          where.OR = [
            { title: { contains: search } },
            { summary: { contains: search } },
            { category: { contains: search } },
            { author: { contains: search } },
          ];
        }
        [items, total] = await Promise.all([
          prisma.contentItem.findMany({
            where,
            take: limit,
            skip: offset,
            orderBy: { createdAt: "desc" },
          }),
          prisma.contentItem.count({ where }),
        ]);
        break;
      }

      case "users": {
        const where: any = showArchived ? {} : { isArchived: false };
        if (search) {
          where.OR = [{ name: { contains: search } }, { email: { contains: search } }];
        }
        [items, total] = await Promise.all([
          prisma.user.findMany({
            where,
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              role: true,
              isArchived: true,
              createdAt: true,
            },
            take: limit,
            skip: offset,
            orderBy: { createdAt: "desc" },
          }),
          prisma.user.count({ where }),
        ]);
        break;
      }

      case "settings": {
        const where: any = {};
        if (search) where.key = { contains: search };
        [items, total] = await Promise.all([
          prisma.systemSetting.findMany({
            where,
            take: limit,
            skip: offset,
            orderBy: { category: "asc" },
          }),
          prisma.systemSetting.count({ where }),
        ]);
        break;
      }

      default:
        return NextResponse.json({ error: `Unknown admin module "${module}"` }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      module: adminModule,
      items,
      total,
      limit,
      offset,
    });
  } catch (error: any) {
    return formatSafeErrorResponse(error, "Failed to fetch module data.", 500);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ module: string }> }
) {
  try {
    const { module } = await params;
    const adminModule = module.toLowerCase() as AdminModule;
    const auth = await getAuthenticatedAdmin(request);
    if (!auth.authenticated) {
      return auth.response;
    }
    const { role, userName, userId } = auth;

    // Permission check
    if (!hasPermission(role, adminModule, "CREATE")) {
      return NextResponse.json(
        {
          error: `Permission Denied: Persona [${role}] cannot create items in [${module}].`,
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    let createdItem: any = null;

    switch (adminModule) {
      case "offers": {
        createdItem = await prisma.offer.create({
          data: {
            title: body.title,
            slug: body.slug || `offer-${Date.now()}`,
            badge: body.badge || "Special Deal",
            description: body.description || "",
            discountType: body.discountType || "PERCENTAGE",
            discountVal: Number(body.discountVal) || 10,
            isFeatured: Boolean(body.isFeatured),
            startDate: body.startDate ? new Date(body.startDate) : new Date(),
            endDate: body.endDate ? new Date(body.endDate) : null,
          },
        });
        break;
      }

      case "coupons": {
        createdItem = await prisma.coupon.create({
          data: {
            code: String(body.code).trim().toUpperCase(),
            description: body.description || "Promotional Discount",
            discountType: body.discountType || "FLAT",
            discountVal: Number(body.discountVal) || 1000,
            minBookingVal: Number(body.minBookingVal) || 0,
            usageLimit: Number(body.usageLimit) || 100,
          },
        });
        break;
      }

      case "content": {
        createdItem = await prisma.contentItem.create({
          data: {
            title: body.title,
            slug: body.slug || `article-${Date.now()}`,
            category: body.category || "Destination Guides",
            summary: body.summary || "",
            body: body.body || "",
            author: body.author || userName,
            authorRole: body.authorRole || "Senior Travel Curator",
            coverImage: body.coverImage || "https://images.unsplash.com/photo-1488646953014-85cb44e25828",
            coverImageCaption: body.coverImageCaption || null,
            coverImageSource: body.coverImageSource || "Licensed Commercial Photography",
            coverImageLicense: body.coverImageLicense || "Commercial Use Permitted",
            readingTime: body.readingTime || "5 min read",
            sourcesJson: typeof body.sourcesJson === "string" ? body.sourcesJson : JSON.stringify(body.sources || []),
            relatedDestinationsJson: typeof body.relatedDestinationsJson === "string" ? body.relatedDestinationsJson : JSON.stringify(body.relatedDestinations || []),
            relatedPackagesJson: typeof body.relatedPackagesJson === "string" ? body.relatedPackagesJson : JSON.stringify(body.relatedPackages || []),
            tagsJson: typeof body.tagsJson === "string" ? body.tagsJson : JSON.stringify(body.tags || []),
            isFeatured: Boolean(body.isFeatured),
            isPublished: body.isPublished !== false,
          },
        });
        break;
      }

      case "users": {
        const passwordHash = await bcrypt.hash(body.password || "AdminPass2026!", 10);
        createdItem = await prisma.user.create({
          data: {
            name: body.name,
            email: body.email.toLowerCase().trim(),
            phone: body.phone,
            role: body.role || "Support Agent",
            passwordHash,
          },
          select: { id: true, name: true, email: true, role: true, phone: true },
        });
        break;
      }

      case "settings": {
        createdItem = await prisma.systemSetting.upsert({
          where: { key: body.key },
          update: { value: body.value, category: body.category, description: body.description, updatedBy: userName },
          create: {
            key: body.key,
            value: body.value,
            category: body.category || "GENERAL",
            description: body.description,
            updatedBy: userName,
          },
        });
        break;
      }

      case "destinations": {
        const firstCountry = await prisma.country.findFirst();
        const firstRegion = await prisma.region.findFirst();
        createdItem = await prisma.destination.create({
          data: {
            name: body.name,
            slug: body.slug || `dest-${Date.now()}`,
            countryId: body.countryId || firstCountry?.id || "",
            regionId: body.regionId || firstRegion?.id || "",
            shortDescription: body.shortDescription || "Curated destination",
            longDescription: body.longDescription || "Comprehensive destination overview",
            heroImage: body.heroImage || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
            heroImageSource: "Licensed Photography",
            heroImageLicense: "Commercial",
            galleryJson: "[]",
            bestTimeToVisit: body.bestTimeToVisit || "September to April",
            recommendedDuration: body.recommendedDuration || "5 to 7 Days",
            travelStyle: body.travelStyle || "Luxury Leisure",
            languages: "English, Local",
            currency: "Local",
            timeZone: "GMT+5:30",
            whyVisitJson: "[]",
            thingsToDoJson: "[]",
            travelTipsJson: "[]",
          },
        });
        break;
      }

      default:
        return NextResponse.json(
          { error: `Direct creation not supported for module ${module}` },
          { status: 400 }
        );
    }

    // AUDIT LOG: Who changed it, What changed, When
    await createAuditLog({
      userId,
      userName,
      userRole: role,
      action: "CREATE",
      module: adminModule,
      entityId: createdItem.id || createdItem.key || createdItem.code,
      details: {
        message: `Created new item in ${adminModule}`,
        nameOrTitle: createdItem.title || createdItem.name || createdItem.code || createdItem.key,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Created new record in ${adminModule}`,
      item: createdItem,
    });
  } catch (error: any) {
    return formatSafeErrorResponse(error, "Failed to create item.", 500);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ module: string }> }
) {
  try {
    const { module } = await params;
    const adminModule = module.toLowerCase() as AdminModule;
    const auth = await getAuthenticatedAdmin(request);
    if (!auth.authenticated) {
      return auth.response;
    }
    const { role, userName, userId } = auth;
    const body = await request.json();
    const { id, isArchived, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Item ID is required." }, { status: 400 });
    }

    // Determine action: ARCHIVE vs UPDATE
    const action: AdminAction = typeof isArchived === "boolean" ? "ARCHIVE" : "UPDATE";

    if (!hasPermission(role, adminModule, action)) {
      return NextResponse.json(
        {
          error: `Permission Denied: Persona [${role}] cannot perform [${action}] on [${module}].`,
        },
        { status: 403 }
      );
    }

    let updatedItem: any = null;

    switch (adminModule) {
      case "destinations": {
        updatedItem = await prisma.destination.update({
          where: { id },
          data: { ...(typeof isArchived === "boolean" ? { isArchived } : updates) },
        });
        break;
      }

      case "packages": {
        updatedItem = await prisma.package.update({
          where: { id },
          data: { ...(typeof isArchived === "boolean" ? { isArchived } : updates) },
        });
        break;
      }

      case "bookings": {
        updatedItem = await prisma.booking.update({
          where: { id },
          data: { ...updates },
        });
        break;
      }

      case "enquiries": {
        updatedItem = await prisma.enquiry.update({
          where: { id },
          data: { ...(typeof isArchived === "boolean" ? { isArchived } : updates) },
        });
        break;
      }

      case "offers": {
        updatedItem = await prisma.offer.update({
          where: { id },
          data: { ...(typeof isArchived === "boolean" ? { isArchived } : updates) },
        });
        break;
      }

      case "coupons": {
        updatedItem = await prisma.coupon.update({
          where: { id },
          data: { ...(typeof isArchived === "boolean" ? { isArchived } : updates) },
        });
        break;
      }

      case "content": {
        updatedItem = await prisma.contentItem.update({
          where: { id },
          data: { ...(typeof isArchived === "boolean" ? { isArchived } : updates) },
        });
        break;
      }

      case "users": {
        updatedItem = await prisma.user.update({
          where: { id },
          data: { ...(typeof isArchived === "boolean" ? { isArchived } : updates) },
          select: { id: true, name: true, email: true, role: true, isArchived: true },
        });
        break;
      }

      case "settings": {
        updatedItem = await prisma.systemSetting.update({
          where: { id },
          data: { ...updates, updatedBy: userName },
        });
        break;
      }

      case "reviews": {
        updatedItem = await prisma.review.update({
          where: { id },
          data: { ...(typeof isArchived === "boolean" ? { isArchived } : updates) },
        });
        break;
      }

      default:
        return NextResponse.json(
          { error: `Update not supported for module ${module}` },
          { status: 400 }
        );
    }

    // AUDIT LOG: Who changed it, What changed, When
    await createAuditLog({
      userId,
      userName,
      userRole: role,
      action,
      module: adminModule,
      entityId: id,
      details: {
        action,
        changes: typeof isArchived === "boolean" ? { isArchived } : updates,
      },
    });

    return NextResponse.json({
      success: true,
      message: `${action === "ARCHIVE" ? (isArchived ? "Archived" : "Restored") : "Updated"} successfully.`,
      item: updatedItem,
    });
  } catch (error: any) {
    return formatSafeErrorResponse(error, "Failed to update item.", 500);
  }
}
