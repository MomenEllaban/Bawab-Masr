import { prisma } from "@/lib/db/prisma";
import { logAudit } from "@/server/services/audit-service";
import { notify } from "@/server/services/notification-service";
import type { ServiceResult } from "./result";

export type JobInput = {
  title: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
  workType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "TEMPORARY";
  workSchedule?: "MORNING" | "EVENING" | "NIGHT" | "ROTATING" | "FLEXIBLE";
  salaryMin?: number;
  salaryMax?: number;
  salaryPeriod: "MONTHLY" | "DAILY" | "WEEKLY";
  isSalaryPublic: boolean;
  experienceYears?: number;
  housingProvided: boolean;
  provinceId?: string;
  areaId?: string;
  propertyId?: string;
  applicationDeadline?: Date;
};

async function getEmployerProfileId(userId: string): Promise<string | null> {
  const profile = await prisma.employerProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  return profile?.id ?? null;
}

async function uniqueSlug(title: string): Promise<string> {
  const base =
    title
      .trim()
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .replace(/\s+/g, "-")
      .slice(0, 60) || "job";
  let slug = base;
  let exists = await prisma.job.findUnique({ where: { slug }, select: { id: true } });
  let n = 2;
  while (exists) {
    slug = `${base}-${n}`;
    exists = await prisma.job.findUnique({ where: { slug }, select: { id: true } });
    n += 1;
  }
  return slug;
}

export async function createJob(
  userId: string,
  input: JobInput,
  submitForReview: boolean
): Promise<ServiceResult<{ jobId: string }>> {
  const employerProfileId = await getEmployerProfileId(userId);
  if (!employerProfileId) {
    return { ok: false, error: "يجب إنشاء ملف صاحب عقار أولاً" };
  }

  if (input.salaryMin && input.salaryMax && input.salaryMin > input.salaryMax) {
    return { ok: false, error: "الحد الأدنى للراتب أكبر من الأعلى" };
  }
  if (input.propertyId) {
    const property = await prisma.property.findUnique({
      where: { id: input.propertyId },
      select: { ownerId: true },
    });
    if (!property || property.ownerId !== employerProfileId) {
      return { ok: false, error: "العقار غير موجود أو ليس لك" };
    }
  }

  const slug = await uniqueSlug(input.title);
  const job = await prisma.job.create({
    data: {
      slug,
      title: input.title.trim(),
      description: input.description.trim(),
      responsibilities: input.responsibilities?.trim() || null,
      requirements: input.requirements?.trim() || null,
      workType: input.workType,
      workSchedule: input.workSchedule,
      salaryMin: input.salaryMin,
      salaryMax: input.salaryMax,
      salaryPeriod: input.salaryPeriod,
      isSalaryPublic: input.isSalaryPublic,
      experienceYears: input.experienceYears,
      housingProvided: input.housingProvided,
      provinceId: input.provinceId || null,
      areaId: input.areaId || null,
      propertyId: input.propertyId || null,
      applicationDeadline: input.applicationDeadline,
      status: submitForReview ? "PENDING_REVIEW" : "DRAFT",
      posterId: employerProfileId,
    },
    select: { id: true, title: true },
  });

  await logAudit({
    actorId: userId,
    action: submitForReview ? "JOB_SUBMITTED_FOR_REVIEW" : "JOB_CREATED",
    entityType: "Job",
    entityId: job.id,
  });

  return { ok: true, data: { jobId: job.id } };
}

const EDITABLE_STATUSES = ["DRAFT", "PENDING_REVIEW", "REJECTED", "PAUSED"];

export async function updateJob(
  userId: string,
  jobId: string,
  input: Partial<JobInput>
): Promise<ServiceResult> {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: {
      status: true,
      slug: true,
      poster: { select: { userId: true } },
    },
  });
  if (!job || job.poster.userId !== userId) {
    return { ok: false, error: "الوظيفة غير موجودة أو غير مصرّح لك بتعديلها" };
  }
  if (!EDITABLE_STATUSES.includes(job.status)) {
    return { ok: false, error: "لا يمكن تعديل وظيفة بهذه الحالة" };
  }
  if (
    input.salaryMin !== undefined &&
    input.salaryMax !== undefined &&
    input.salaryMin > input.salaryMax
  ) {
    return { ok: false, error: "الحد الأدنى للراتب أكبر من الأعلى" };
  }

  await prisma.job.update({
    where: { id: jobId },
    data: {
      title: input.title?.trim(),
      description: input.description?.trim(),
      responsibilities: input.responsibilities?.trim() || undefined,
      requirements: input.requirements?.trim() || undefined,
      workType: input.workType,
      workSchedule: input.workSchedule,
      salaryMin: input.salaryMin,
      salaryMax: input.salaryMax,
      salaryPeriod: input.salaryPeriod,
      isSalaryPublic: input.isSalaryPublic,
      experienceYears: input.experienceYears,
      housingProvided: input.housingProvided,
      provinceId: input.provinceId || undefined,
      areaId: input.areaId || undefined,
      applicationDeadline: input.applicationDeadline,
    },
  });

  await logAudit({
    actorId: userId,
    action: "JOB_UPDATED",
    entityType: "Job",
    entityId: jobId,
  });

  return { ok: true };
}

export async function submitJobForReview(
  userId: string,
  jobId: string
): Promise<ServiceResult> {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { status: true, poster: { select: { userId: true } } },
  });
  if (!job || job.poster.userId !== userId) {
    return { ok: false, error: "الوظيفة غير موجودة أو غير مصرّح لك بها" };
  }
  if (!["DRAFT", "REJECTED"].includes(job.status)) {
    return { ok: false, error: "لا يمكن إرسال هذه الوظيفة للمراجعة" };
  }

  await prisma.job.update({
    where: { id: jobId },
    data: { status: "PENDING_REVIEW", reviewStatus: "PENDING", rejectionReason: null },
  });
  await logAudit({
    actorId: userId,
    action: "JOB_SUBMITTED_FOR_REVIEW",
    entityType: "Job",
    entityId: jobId,
  });

  return { ok: true };
}

export async function setJobPaused(
  userId: string,
  jobId: string,
  paused: boolean
): Promise<ServiceResult> {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { status: true, poster: { select: { userId: true } } },
  });
  if (!job || job.poster.userId !== userId) {
    return { ok: false, error: "الوظيفة غير موجودة أو غير مصرّح لك بها" };
  }
  if (paused && job.status !== "PUBLISHED") {
    return { ok: false, error: "يمكن إيقاف وظيفة منشورة فقط" };
  }
  if (!paused && job.status !== "PAUSED") {
    return { ok: false, error: "الوظيفة ليست موقوفة" };
  }

  await prisma.job.update({
    where: { id: jobId },
    data: { status: paused ? "PAUSED" : "PUBLISHED" },
  });
  await logAudit({
    actorId: userId,
    action: paused ? "JOB_PAUSED" : "JOB_RESUMED",
    entityType: "Job",
    entityId: jobId,
  });

  return { ok: true };
}

export async function closeJob(
  userId: string,
  jobId: string
): Promise<ServiceResult> {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { status: true, poster: { select: { userId: true } } },
  });
  if (!job || job.poster.userId !== userId) {
    return { ok: false, error: "الوظيفة غير موجودة أو غير مصرّح لك بها" };
  }
  if (["CLOSED", "ARCHIVED"].includes(job.status)) {
    return { ok: false, error: "الوظيفة مغلقة بالفعل" };
  }

  await prisma.job.update({
    where: { id: jobId },
    data: { status: "CLOSED", closedAt: new Date() },
  });
  await logAudit({
    actorId: userId,
    action: "JOB_CLOSED",
    entityType: "Job",
    entityId: jobId,
  });

  return { ok: true };
}

// ============================================================
// الوظائف المحفوظة
// ============================================================

export async function toggleSaveJob(
  userId: string,
  jobId: string
): Promise<ServiceResult<{ saved: boolean }>> {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { id: true, status: true },
  });
  if (!job || job.status !== "PUBLISHED") {
    return { ok: false, error: "الوظيفة غير متاحة" };
  }

  const existing = await prisma.savedJob.findUnique({
    where: { userId_jobId: { userId, jobId } },
    select: { id: true },
  });

  if (existing) {
    await prisma.savedJob.delete({ where: { id: existing.id } });
    return { ok: true, data: { saved: false } };
  }

  await prisma.savedJob.create({ data: { userId, jobId } });
  return { ok: true, data: { saved: true } };
}

// ============================================================
// البلاغات
// ============================================================

export async function reportJob(
  userId: string,
  jobId: string,
  reason: string,
  details?: string
): Promise<ServiceResult> {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { id: true, status: true },
  });
  if (!job || job.status !== "PUBLISHED") {
    return { ok: false, error: "الوظيفة غير موجودة" };
  }

  await prisma.report.create({
    data: {
      reporterId: userId,
      targetType: "JOB",
      targetId: jobId,
      reason: reason.trim(),
      details: details?.trim() || null,
    },
  });
  await logAudit({
    actorId: userId,
    action: "REPORT_SUBMITTED",
    entityType: "Job",
    entityId: jobId,
    metadata: { reason: reason.trim() },
  });

  await notify({
    userId,
    type: "SYSTEM",
    title: "تم استلام بلاغك",
    body: "سيقوم فريق المراجعة بالاطلاع على البلاغ",
  });

  return { ok: true };
}
