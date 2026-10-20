import { prisma } from "@/lib/db/prisma";
import { notify } from "@/server/services/notification-service";
import { logAudit } from "@/server/services/audit-service";
import { APPLICATION_STATUS_LABELS } from "@/lib/labels";
import type { ApplicationStatus } from "@prisma/client";
import type { ServiceResult } from "./result";

/**
 * قواعد الانتقال بين حالات الطلب (من خطة المشروع):
 * المتقدم يسحب قبل عرض العمل/التوظيف — صاحب العمل يحرّك الحالة للأمام أو يرفض.
 */
const WITHDRAWABLE_STATUSES: ApplicationStatus[] = [
  "SUBMITTED",
  "VIEWED",
  "SHORTLISTED",
  "INTERVIEW_SCHEDULED",
];

const EMPLOYER_ALLOWED_TARGETS: ApplicationStatus[] = [
  "VIEWED",
  "SHORTLISTED",
  "INTERVIEW_SCHEDULED",
  "OFFERED",
  "HIRED",
  "REJECTED",
];

const TERMINAL_STATUSES: ApplicationStatus[] = ["HIRED", "REJECTED", "WITHDRAWN"];

export async function applyToJob(
  userId: string,
  jobId: string,
  coverMessage?: string
): Promise<ServiceResult<{ applicationId: string }>> {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      status: true,
      reviewStatus: true,
      title: true,
      poster: { select: { userId: true } },
    },
  });

  if (!job) return { ok: false, error: "الوظيفة غير موجودة" };
  if (job.status !== "PUBLISHED" || job.reviewStatus !== "APPROVED") {
    return { ok: false, error: "هذه الوظيفة غير متاحة للتقديم حالياً" };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { status: true, phoneVerifiedAt: true },
  });
  if (!user?.phoneVerifiedAt || user.status !== "ACTIVE") {
    return { ok: false, error: "يجب تأكيد رقم هاتفك وتفعيل حسابك أولاً" };
  }

  const seekerProfile = await prisma.seekerProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!seekerProfile) {
    return {
      ok: false,
      error: "يجب إنشاء ملف باحث أولاً من صفحة الملف الشخصي",
    };
  }

  const existing = await prisma.jobApplication.findUnique({
    where: { jobId_applicantId: { jobId, applicantId: userId } },
    select: { id: true },
  });
  if (existing) {
    return { ok: false, error: "لقد قدّمت على هذه الوظيفة من قبل" };
  }

  const application = await prisma.jobApplication.create({
    data: {
      jobId,
      applicantId: userId,
      coverMessage: coverMessage?.trim() || null,
      statusHistory: {
        create: {
          toStatus: "SUBMITTED",
          changedByUserId: userId,
        },
      },
    },
    select: { id: true },
  });

  await notify({
    userId: job.poster.userId,
    type: "NEW_APPLICATION",
    title: "تقديم جديد",
    body: `لديك تقديم جديد على وظيفة "${job.title}"`,
    internalUrl: `/employer/jobs/${jobId}/applications`,
  });
  await logAudit({
    actorId: userId,
    action: "APPLICATION_SUBMITTED",
    entityType: "JobApplication",
    entityId: application.id,
    metadata: { jobId },
  });

  return { ok: true, data: { applicationId: application.id } };
}

export async function withdrawApplication(
  userId: string,
  applicationId: string
): Promise<ServiceResult> {
  const application = await prisma.jobApplication.findUnique({
    where: { id: applicationId },
    select: { applicantId: true, status: true, jobId: true },
  });

  if (!application || application.applicantId !== userId) {
    return { ok: false, error: "الطلب غير موجود" };
  }
  if (!WITHDRAWABLE_STATUSES.includes(application.status)) {
    return {
      ok: false,
      error: "لا يمكن سحب الطلب بعد وصوله لهذه الحالة",
    };
  }

  await changeStatusInternal({
    applicationId,
    fromStatus: application.status,
    toStatus: "WITHDRAWN",
    actorId: userId,
    notifyUserId: null,
    auditAction: "APPLICATION_WITHDRAWN",
  });

  return { ok: true };
}

export async function changeApplicationStatus(params: {
  actorId: string;
  applicationId: string;
  targetStatus: ApplicationStatus;
  note?: string;
}): Promise<ServiceResult> {
  const { actorId, applicationId, targetStatus, note } = params;

  if (!EMPLOYER_ALLOWED_TARGETS.includes(targetStatus)) {
    return { ok: false, error: "حالة غير مسموح بها" };
  }

  const application = await prisma.jobApplication.findUnique({
    where: { id: applicationId },
    select: {
      status: true,
      applicantId: true,
      job: {
        select: {
          title: true,
          poster: { select: { userId: true } },
        },
      },
    },
  });

  if (!application) return { ok: false, error: "الطلب غير موجود" };
  if (application.job.poster.userId !== actorId) {
    return { ok: false, error: "غير مصرّح لك بتعديل هذا الطلب" };
  }
  if (TERMINAL_STATUSES.includes(application.status)) {
    return { ok: false, error: "الطلب في حالة نهائية ولا يمكن تعديله" };
  }
  if (application.status === targetStatus) {
    return { ok: false, error: "الطلب على هذه الحالة بالفعل" };
  }

  await changeStatusInternal({
    applicationId,
    fromStatus: application.status,
    toStatus: targetStatus,
    actorId,
    notifyUserId: application.applicantId,
    note,
    jobTitle: application.job.title,
    auditAction: "APPLICATION_STATUS_CHANGED",
  });

  return { ok: true };
}

async function changeStatusInternal(params: {
  applicationId: string;
  fromStatus: ApplicationStatus;
  toStatus: ApplicationStatus;
  actorId: string;
  notifyUserId: string | null;
  note?: string;
  jobTitle?: string;
  auditAction: string;
}): Promise<void> {
  const {
    applicationId,
    fromStatus,
    toStatus,
    actorId,
    notifyUserId,
    note,
    jobTitle,
    auditAction,
  } = params;

  await prisma.jobApplication.update({
    where: { id: applicationId },
    data: {
      status: toStatus,
      statusHistory: {
        create: {
          fromStatus,
          toStatus,
          changedByUserId: actorId,
          note: note?.trim() || null,
        },
      },
    },
  });

  if (notifyUserId) {
    await notify({
      userId: notifyUserId,
      type: "APPLICATION_STATUS_CHANGED",
      title: "تحديث حالة طلبك",
      body: jobTitle
        ? `تم تحديث حالة تقديمك على وظيفة "${jobTitle}" إلى: ${APPLICATION_STATUS_LABELS[toStatus]}`
        : `تم تحديث حالة تقديمك إلى: ${APPLICATION_STATUS_LABELS[toStatus]}`,
      internalUrl: "/seeker/applications",
    });
  }

  await logAudit({
    actorId,
    action: auditAction,
    entityType: "JobApplication",
    entityId: applicationId,
    metadata: { fromStatus, toStatus },
  });
}
