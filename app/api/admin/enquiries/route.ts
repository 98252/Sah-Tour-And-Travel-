import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/auth";
import { requireAdminSession, formatSafeErrorResponse } from "@/lib/security";
import { createAuditLog } from "@/lib/audit";

export const VALID_ENQUIRY_STATUSES = [
  "New",
  "Contacted",
  "In Progress",
  "Quoted",
  "Converted",
  "Closed",
] as const;

export type EnquiryStatus = (typeof VALID_ENQUIRY_STATUSES)[number];

export async function GET(request: Request) {
  try {
    const authCheck = await requireAdminSession(request, ["Admin", "Travel Manager", "Support Agent"]);
    if (!authCheck.success) {
      return authCheck.response;
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = (searchParams.get("search") || "").trim();

    const where: any = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { referenceNo: { contains: search } },
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { destination: { contains: search } },
      ];
    }

    const [enquiries, statusCounts] = await Promise.all([
      prisma.enquiry.findMany({
        where,
        include: {
          package: { select: { id: true, name: true, slug: true } },
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      Promise.all(
        VALID_ENQUIRY_STATUSES.map(async (st) => ({
          status: st,
          count: await prisma.enquiry.count({ where: { status: st } }),
        }))
      ),
    ]);

    const totalCount = await prisma.enquiry.count();

    return NextResponse.json({
      success: true,
      totalCount,
      statusCounts,
      enquiries,
    });
  } catch (error) {
    return formatSafeErrorResponse(error, "Failed to fetch enquiries.", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const authCheck = await requireAdminSession(request, ["Admin", "Travel Manager", "Support Agent"]);
    if (!authCheck.success) {
      return authCheck.response;
    }

    const body = await request.json();
    const { id, status, agentNotes, quotedAmount } = body;

    if (!id) {
      return NextResponse.json({ error: "Enquiry ID is required." }, { status: 400 });
    }

    if (status && !VALID_ENQUIRY_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${VALID_ENQUIRY_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (agentNotes !== undefined) updateData.agentNotes = sanitizeText(agentNotes);
    if (quotedAmount !== undefined) {
      const parsedAmount = parseFloat(quotedAmount);
      updateData.quotedAmount = isNaN(parsedAmount) ? null : parsedAmount;
    }

    const updatedEnquiry = await prisma.enquiry.update({
      where: { id },
      data: updateData,
      include: {
        package: true,
      },
    });

    // Audit log
    await createAuditLog({
      userId: authCheck.user.id,
      userName: authCheck.user.name,
      userRole: authCheck.role,
      action: "UPDATE",
      module: "enquiries",
      entityId: id,
      details: {
        referenceNo: updatedEnquiry.referenceNo,
        status: updatedEnquiry.status,
        quotedAmount: updatedEnquiry.quotedAmount,
      },
    });

    // Notify user if linked
    if (updatedEnquiry.userId && status) {
      await prisma.notification
        .create({
          data: {
            userId: updatedEnquiry.userId,
            title: `Enquiry Update: ${updatedEnquiry.referenceNo}`,
            message: `Your travel enquiry status has been updated to "${updatedEnquiry.status}".`,
            type: "INFO",
            link: "/account?tab=enquiries",
          },
        })
        .catch(() => {});
    }

    return NextResponse.json({
      success: true,
      message: `Enquiry updated to "${updatedEnquiry.status}".`,
      enquiry: updatedEnquiry,
    });
  } catch (error) {
    return formatSafeErrorResponse(error, "Failed to update enquiry status.", 500);
  }
}
