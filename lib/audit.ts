import { prisma } from "@/lib/prisma";

export interface CreateAuditLogInput {
  userId?: string | null;
  userName?: string;
  userRole?: string;
  action: "CREATE" | "UPDATE" | "ARCHIVE" | "RESTORE" | "DELETE";
  module: string;
  entityId?: string | null;
  details: string | Record<string, any>;
  ipAddress?: string | null;
}

/**
 * Record an administrative action into the immutable Audit Log
 */
export async function createAuditLog(input: CreateAuditLogInput) {
  try {
    const detailsString =
      typeof input.details === "string"
        ? input.details
        : JSON.stringify(input.details);

    return await prisma.auditLog.create({
      data: {
        userId: input.userId || null,
        userName: input.userName || "System Admin",
        userRole: input.userRole || "Admin",
        action: input.action,
        module: input.module,
        entityId: input.entityId || null,
        details: detailsString,
        ipAddress: input.ipAddress || "127.0.0.1",
      },
    });
  } catch (error) {
    console.error("Failed to create audit log entry:", error);
    return null;
  }
}

/**
 * Retrieve audit log records with filtering and pagination
 */
export async function getAuditLogs(options?: {
  limit?: number;
  offset?: number;
  module?: string;
  action?: string;
  search?: string;
}) {
  const { limit = 50, offset = 0, module, action, search } = options || {};

  const where: any = {};
  if (module && module !== "ALL") where.module = module;
  if (action && action !== "ALL") where.action = action;
  if (search && search.trim()) {
    where.OR = [
      { userName: { contains: search } },
      { entityId: { contains: search } },
      { details: { contains: search } },
    ];
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { logs, total };
}
