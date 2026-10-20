import { prisma } from "@/lib/db/prisma";
import { logAudit } from "@/server/services/audit-service";
import { notify } from "@/server/services/notification-service";
import type { ServiceResult } from "./result";

/**
 * مراجعة وظيفة من الإدارة — قرار نهائي يُطبَّق فورًا مع إشعار للناشر
 */
export async function reviewJobDecision(params: {
  adminId: string;
  jobId: string;
  decision: "APPROVED" | "REJECTED";
  reason?: string;
}): Promise<ServiceResult> {
  const { adminId, jobId, decision, reason } = params;

  if (decision === "REJECTED" && (!reason || reason.trim().length < 5)) {
    return { ok: false, error: "سبب الرفض مطلوب (5 أحرف على الأقل)" };
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      status: true,
      title: true,
      poster: { select: { userId: true } },
    },
  });
  if (!job) return { ok: false, error: "الوظيفة غير موجودة" };
  if (job.status !== "PENDING_REVIEW") {
    return { ok: false, error: "هذه الوظيفة ليست قيد المراجعة" };
  }

  const now = new Date();

  await prisma.$transaction([
    prisma.job.update({
      where: { id: jobId },
      data:
        decision === "APPROVED"
          ? { status: "PUBLISHED", reviewStatus: "APPROVED", publishedAt: now }
          : {
              status: "REJECTED",
              reviewStatus: "REJECTED",
              rejectionReason: reason?.trim() ?? null,
            },
    }),
    prisma.moderationReview.create({
      data: {
        reviewedById: adminId,
        decision,
        reason: reason?.trim() || null,
        jobId,
      },
    }),
  ]);

  await notify({
    userId: job.poster.userId,
    type: "JOB_REVIEW_DECISION",
    title: decision === "APPROVED" ? "تمت الموافقة على وظيفتك" : "تم رفض وظيفتك",
    body:
      decision === "APPROVED"
        ? `تمت الموافقة على نشر وظيفة "${job.title}"`
        : `تم رفض وظيفة "${job.title}". السبب: ${reason?.trim() ?? ""}`,
    internalUrl: "/employer/jobs",
  });

  await logAudit({
    actorId: adminId,
    action: decision === "APPROVED" ? "JOB_APPROVED" : "JOB_REJECTED",
    entityType: "Job",
    entityId: jobId,
  });

  return { ok: true };
}

export async function setUserStatus(
  adminId: string,
  userId: string,
  status: "ACTIVE" | "SUSPENDED" | "DEACTIVATED"
): Promise<ServiceResult> {
  if (userId === adminId) {
    return { ok: false, error: "لا يمكنك تعديل حالة حسابك بنفسك" };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, status: true },
  });
  if (!user) return { ok: false, error: "المستخدم غير موجود" };

  await prisma.user.update({ where: { id: userId }, data: { status } });

  await logAudit({
    actorId: adminId,
    action: `USER_${status}`,
    entityType: "User",
    entityId: userId,
    metadata: { from: user.status, to: status },
  });

  await notify({
    userId,
    type: "ACCOUNT_REVIEW_DECISION",
    title:
      status === "ACTIVE"
        ? "تم تفعيل حسابك"
        : status === "SUSPENDED"
          ? "تم إيقاف حسابك مؤقتاً"
          : "تم إلغاء تفعيل حسابك",
  });

  return { ok: true };
}

export async function grantSystemRole(
  adminId: string,
  userId: string,
  roleName: string
): Promise<ServiceResult> {
  if (userId === adminId) {
    return { ok: false, error: "لا يمكنك تعديل صلاحياتك بنفسك" };
  }

  const role = await prisma.systemRole.findUnique({
    where: { name: roleName },
    select: { id: true },
  });
  if (!role) return { ok: false, error: "الدور غير موجود" };

  const existing = await prisma.systemUserRole.findUnique({
    where: { userId_roleId: { userId, roleId: role.id } },
    select: { id: true },
  });
  if (existing) return { ok: false, error: "المستخدم يمتلك هذا الدور بالفعل" };

  await prisma.systemUserRole.create({
    data: { userId, roleId: role.id },
  });
  await logAudit({
    actorId: adminId,
    action: "ROLE_GRANTED",
    entityType: "User",
    entityId: userId,
    metadata: { role: roleName },
  });

  return { ok: true };
}

export async function revokeSystemRole(
  adminId: string,
  userId: string,
  roleName: string
): Promise<ServiceResult> {
  if (userId === adminId) {
    return { ok: false, error: "لا يمكنك تعديل صلاحياتك بنفسك" };
  }

  const role = await prisma.systemRole.findUnique({
    where: { name: roleName },
    select: { id: true },
  });
  if (!role) return { ok: false, error: "الدور غير موجود" };

  const existing = await prisma.systemUserRole.findUnique({
    where: { userId_roleId: { userId, roleId: role.id } },
    select: { id: true },
  });
  if (!existing) return { ok: false, error: "المستخدم لا يمتلك هذا الدور" };

  await prisma.systemUserRole.delete({ where: { id: existing.id } });
  await logAudit({
    actorId: adminId,
    action: "ROLE_REVOKED",
    entityType: "User",
    entityId: userId,
    metadata: { role: roleName },
  });

  return { ok: true };
}

export async function resolveReport(
  adminId: string,
  reportId: string,
  resolution: "RESOLVED" | "DISMISSED"
): Promise<ServiceResult> {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    select: { id: true, status: true, reporterId: true },
  });
  if (!report) return { ok: false, error: "البلاغ غير موجود" };
  if (report.status === "RESOLVED" || report.status === "DISMISSED") {
    return { ok: false, error: "البلاغ مُغلق بالفعل" };
  }

  await prisma.report.update({
    where: { id: reportId },
    data: {
      status: resolution,
      assignedToId: adminId,
      resolvedAt: new Date(),
    },
  });

  await logAudit({
    actorId: adminId,
    action: `REPORT_${resolution}`,
    entityType: "Report",
    entityId: reportId,
  });

  await notify({
    userId: report.reporterId,
    type: "REPORT_UPDATE",
    title: resolution === "RESOLVED" ? "تمت معالجة بلاغك" : "تم إغلاق بلاغك",
  });

  return { ok: true };
}
