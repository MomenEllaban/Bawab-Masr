import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@prisma/client";

/**
 * تسجيل عملية في سجل التدقيق — يفشل الصمتًا ولا يوقف العملية الأساسية
 */
export async function logAudit(params: {
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: params.actorId ?? null,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        metadata: (params.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    });
  } catch (error) {
    console.error("[logAudit]", error);
  }
}
