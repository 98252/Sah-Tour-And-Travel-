import { NextResponse } from "next/server";
import { getAuditLogs, createAuditLog } from "@/lib/audit";
import { requireAdminSession, formatSafeErrorResponse } from "@/lib/security";

export async function GET(request: Request) {
  try {
    const authCheck = await requireAdminSession(request);
    if (!authCheck.success) {
      return authCheck.response;
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
    const offset = Math.max(0, parseInt(searchParams.get("offset") || "0", 10));
    const module = searchParams.get("module") || "ALL";
    const action = searchParams.get("action") || "ALL";
    const search = (searchParams.get("search") || "").trim();

    const { logs, total } = await getAuditLogs({
      limit,
      offset,
      module,
      action,
      search,
    });

    return NextResponse.json({
      success: true,
      logs,
      total,
      limit,
      offset,
    });
  } catch (error: any) {
    return formatSafeErrorResponse(error, "Failed to retrieve audit logs.", 500);
  }
}

export async function POST(request: Request) {
  try {
    const authCheck = await requireAdminSession(request);
    if (!authCheck.success) {
      return authCheck.response;
    }

    const body = await request.json();
    const { action, module, entityId, details, ipAddress } = body;

    if (!action || !module || !details) {
      return NextResponse.json(
        { error: "action, module, and details are required for audit logging." },
        { status: 400 }
      );
    }

    const log = await createAuditLog({
      userId: authCheck.user.id,
      userName: authCheck.user.name,
      userRole: authCheck.role,
      action,
      module,
      entityId,
      details,
      ipAddress: ipAddress || "127.0.0.1",
    });

    return NextResponse.json({ success: true, log });
  } catch (error: any) {
    return formatSafeErrorResponse(error, "Failed to record audit log.", 500);
  }
}
