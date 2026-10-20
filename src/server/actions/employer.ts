"use server";

/**
 * server/actions/employer.ts
 * Server Actions للوحة صاحب العقار — الوظائف والطلبات والعقارات والملف الشخصي
 */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth, requireVerifiedPhone } from "@/lib/permissions";
import { prisma } from "@/lib/db/prisma";
import { logAudit } from "@/server/services/audit-service";
import {
  createJob,
  updateJob,
  submitJobForReview,
  setJobPaused,
  closeJob,
  type JobInput,
} from "@/server/services/job-service";
import { changeApplicationStatus } from "@/server/services/application-service";
import { updateEmployerProfile } from "@/server/services/profile-service";
import {
  createEmployerProfileSchema,
  updateEmployerProfileSchema,
  createJobSchema,
  changeApplicationStatusSchema,
  createPropertySchema,
  idParamSchema,
} from "@/lib/validation/employer";

export type EmployerActionState = {
  error?: string;
  success?: string;
};

const GENERIC_ERROR = "حدث خطأ غير متوقع، حاول مرة أخرى";

function firstIssue(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? "بيانات غير صحيحة";
}

// ============================================================
// ملف صاحب العقار
// ============================================================

export async function createEmployerProfileAction(
  _prevState: EmployerActionState,
  formData: FormData
): Promise<EmployerActionState> {
  const user = await requireVerifiedPhone();

  const parsed = createEmployerProfileSchema.safeParse({
    displayName: formData.get("displayName"),
    employerType: formData.get("employerType"),
  });
  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  try {
    const existing = await prisma.employerProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });
    if (existing) {
      return { error: "لديك ملف صاحب عقار بالفعل" };
    }

    const profile = await prisma.employerProfile.create({
      data: {
        userId: user.id,
        displayName: parsed.data.displayName,
        employerType: parsed.data.employerType,
      },
      select: { id: true },
    });

    await logAudit({
      actorId: user.id,
      action: "EMPLOYER_PROFILE_CREATED",
      entityType: "EmployerProfile",
      entityId: profile.id,
    });
  } catch (error) {
    console.error("[createEmployerProfileAction]", error);
    return { error: GENERIC_ERROR };
  }

  revalidatePath("/employer", "layout");
  return { success: "تم إنشاء ملف صاحب العقار بنجاح" };
}

export async function updateEmployerProfileAction(
  _prevState: EmployerActionState,
  formData: FormData
): Promise<EmployerActionState> {
  const user = await requireVerifiedPhone();

  const parsed = updateEmployerProfileSchema.safeParse({
    displayName: formData.get("displayName"),
    employerType: formData.get("employerType"),
  });
  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  let result: { ok: boolean; error?: string };
  try {
    result = await updateEmployerProfile(user.id, {
      displayName: parsed.data.displayName,
      employerType: parsed.data.employerType,
    });
  } catch (error) {
    console.error("[updateEmployerProfileAction]", error);
    return { error: GENERIC_ERROR };
  }

  if (!result.ok) {
    return { error: result.error };
  }

  revalidatePath("/employer/profile");
  return { success: "تم حفظ بيانات الملف الشخصي" };
}

// ============================================================
// الوظائف
// ============================================================

function parseJobForm(formData: FormData) {
  return createJobSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    responsibilities: formData.get("responsibilities"),
    requirements: formData.get("requirements"),
    workType: formData.get("workType"),
    workSchedule: formData.get("workSchedule"),
    salaryMin: formData.get("salaryMin"),
    salaryMax: formData.get("salaryMax"),
    salaryPeriod: formData.get("salaryPeriod") || "MONTHLY",
    isSalaryPublic: formData.get("isSalaryPublic") !== null,
    experienceYears: formData.get("experienceYears"),
    housingProvided: formData.get("housingProvided") !== null,
    provinceId: formData.get("provinceId"),
    areaId: formData.get("areaId"),
    propertyId: formData.get("propertyId"),
    applicationDeadline: formData.get("applicationDeadline"),
  });
}

function toJobInput(data: ReturnType<typeof createJobSchema.parse>): JobInput {
  return {
    title: data.title,
    description: data.description,
    responsibilities: data.responsibilities,
    requirements: data.requirements,
    workType: data.workType,
    workSchedule: data.workSchedule,
    salaryMin: data.salaryMin,
    salaryMax: data.salaryMax,
    salaryPeriod: data.salaryPeriod,
    isSalaryPublic: data.isSalaryPublic,
    experienceYears: data.experienceYears,
    housingProvided: data.housingProvided,
    provinceId: data.provinceId,
    areaId: data.areaId,
    propertyId: data.propertyId,
    applicationDeadline: data.applicationDeadline
      ? new Date(data.applicationDeadline)
      : undefined,
  };
}

export async function createJobAction(
  _prevState: EmployerActionState,
  formData: FormData
): Promise<EmployerActionState> {
  const user = await requireVerifiedPhone();

  const parsed = parseJobForm(formData);
  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  const intent = formData.get("intent") === "submit" ? "submit" : "draft";
  const jobInput = toJobInput(parsed.data);

  let jobId: string | undefined;
  try {
    const result = await createJob(user.id, jobInput, intent === "submit");
    if (!result.ok) {
      return { error: result.error };
    }
    jobId = result.data?.jobId;
  } catch (error) {
    console.error("[createJobAction]", error);
    return { error: GENERIC_ERROR };
  }

  if (!jobId) {
    return { error: GENERIC_ERROR };
  }

  revalidatePath("/employer/jobs");
  revalidatePath("/employer");
  redirect(`/employer/jobs/${jobId}`);
}

export async function updateJobAction(
  jobId: string,
  _prevState: EmployerActionState,
  formData: FormData
): Promise<EmployerActionState> {
  const user = await requireVerifiedPhone();

  const idParsed = idParamSchema.safeParse(jobId);
  if (!idParsed.success) {
    return { error: GENERIC_ERROR };
  }

  const parsed = parseJobForm(formData);
  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  const jobInput = toJobInput(parsed.data);

  try {
    const result = await updateJob(user.id, idParsed.data, jobInput);
    if (!result.ok) {
      return { error: result.error };
    }
  } catch (error) {
    console.error("[updateJobAction]", error);
    return { error: GENERIC_ERROR };
  }

  revalidatePath(`/employer/jobs/${idParsed.data}`);
  revalidatePath("/employer/jobs");
  return { success: "تم حفظ التعديلات" };
}

export async function submitJobForReviewAction(
  jobId: string,
  _prevState: EmployerActionState,
  _formData: FormData
): Promise<EmployerActionState> {
  const user = await requireVerifiedPhone();

  const idParsed = idParamSchema.safeParse(jobId);
  if (!idParsed.success) {
    return { error: GENERIC_ERROR };
  }

  try {
    const result = await submitJobForReview(user.id, idParsed.data);
    if (!result.ok) {
      return { error: result.error };
    }
  } catch (error) {
    console.error("[submitJobForReviewAction]", error);
    return { error: GENERIC_ERROR };
  }

  revalidatePath("/employer/jobs");
  revalidatePath("/employer");
  return { success: "تم إرسال الوظيفة للمراجعة" };
}

export async function setJobPausedAction(
  jobId: string,
  paused: boolean,
  _prevState: EmployerActionState,
  _formData: FormData
): Promise<EmployerActionState> {
  const user = await requireVerifiedPhone();

  const idParsed = idParamSchema.safeParse(jobId);
  if (!idParsed.success) {
    return { error: GENERIC_ERROR };
  }
  if (typeof paused !== "boolean") {
    return { error: GENERIC_ERROR };
  }

  try {
    const result = await setJobPaused(user.id, idParsed.data, paused);
    if (!result.ok) {
      return { error: result.error };
    }
  } catch (error) {
    console.error("[setJobPausedAction]", error);
    return { error: GENERIC_ERROR };
  }

  revalidatePath("/employer/jobs");
  revalidatePath("/employer");
  return { success: paused ? "تم إيقاف الوظيفة" : "تم استئناف الوظيفة" };
}

export async function closeJobAction(
  jobId: string,
  _prevState: EmployerActionState,
  _formData: FormData
): Promise<EmployerActionState> {
  const user = await requireVerifiedPhone();

  const idParsed = idParamSchema.safeParse(jobId);
  if (!idParsed.success) {
    return { error: GENERIC_ERROR };
  }

  try {
    const result = await closeJob(user.id, idParsed.data);
    if (!result.ok) {
      return { error: result.error };
    }
  } catch (error) {
    console.error("[closeJobAction]", error);
    return { error: GENERIC_ERROR };
  }

  revalidatePath("/employer/jobs");
  revalidatePath("/employer");
  return { success: "تم إغلاق الوظيفة" };
}

// ============================================================
// الطلبات الواردة
// ============================================================

export async function changeApplicationStatusAction(
  applicationId: string,
  _prevState: EmployerActionState,
  formData: FormData
): Promise<EmployerActionState> {
  const user = await requireAuth();

  const idParsed = idParamSchema.safeParse(applicationId);
  if (!idParsed.success) {
    return { error: GENERIC_ERROR };
  }

  const parsed = changeApplicationStatusSchema.safeParse({
    targetStatus: formData.get("targetStatus"),
    note: formData.get("note"),
  });
  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  let result: { ok: boolean; error?: string };
  try {
    result = await changeApplicationStatus({
      actorId: user.id,
      applicationId: idParsed.data,
      targetStatus: parsed.data.targetStatus,
      note: parsed.data.note,
    });
  } catch (error) {
    console.error("[changeApplicationStatusAction]", error);
    return { error: GENERIC_ERROR };
  }

  if (!result.ok) {
    return { error: result.error };
  }

  revalidatePath("/employer/applications");
  revalidatePath("/employer/jobs/[id]/applications", "page");
  revalidatePath("/employer");
  return { success: "تم تحديث حالة الطلب" };
}

// ============================================================
// العقارات
// ============================================================

export async function createPropertyAction(
  _prevState: EmployerActionState,
  formData: FormData
): Promise<EmployerActionState> {
  const user = await requireVerifiedPhone();

  const parsed = createPropertySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    areaId: formData.get("areaId"),
    privateNotes: formData.get("privateNotes"),
  });
  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  const profile = await prisma.employerProfile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });
  if (!profile) {
    return { error: "يجب إنشاء ملف صاحب عقار أولاً" };
  }

  let propertyId: string | undefined;
  try {
    const area = await prisma.area.findUnique({
      where: { id: parsed.data.areaId },
      select: { id: true },
    });
    if (!area) {
      return { error: "المنطقة غير موجودة" };
    }

    const property = await prisma.property.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description || null,
        privateNotes: parsed.data.privateNotes || null,
        areaId: parsed.data.areaId,
        ownerId: profile.id,
      },
      select: { id: true },
    });
    propertyId = property.id;

    await logAudit({
      actorId: user.id,
      action: "PROPERTY_CREATED",
      entityType: "Property",
      entityId: property.id,
    });
  } catch (error) {
    console.error("[createPropertyAction]", error);
    return { error: GENERIC_ERROR };
  }

  if (!propertyId) {
    return { error: GENERIC_ERROR };
  }

  revalidatePath("/employer/properties");
  revalidatePath("/employer/jobs/new");
  return { success: "تمت إضافة العقار بنجاح" };
}

export async function setPropertyActiveAction(
  propertyId: string,
  active: boolean,
  _prevState: EmployerActionState,
  _formData: FormData
): Promise<EmployerActionState> {
  const user = await requireAuth();

  const idParsed = idParamSchema.safeParse(propertyId);
  if (!idParsed.success) {
    return { error: GENERIC_ERROR };
  }
  if (typeof active !== "boolean") {
    return { error: GENERIC_ERROR };
  }

  const profile = await prisma.employerProfile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });
  if (!profile) {
    return { error: "يجب إنشاء ملف صاحب عقار أولاً" };
  }

  try {
    const property = await prisma.property.findUnique({
      where: { id: idParsed.data },
      select: { ownerId: true },
    });
    if (!property || property.ownerId !== profile.id) {
      return { error: "العقار غير موجود أو غير مصرّح لك بتعديله" };
    }

    await prisma.property.update({
      where: { id: idParsed.data },
      data: { isActive: active },
    });

    await logAudit({
      actorId: user.id,
      action: active ? "PROPERTY_ACTIVATED" : "PROPERTY_DEACTIVATED",
      entityType: "Property",
      entityId: idParsed.data,
    });
  } catch (error) {
    console.error("[setPropertyActiveAction]", error);
    return { error: GENERIC_ERROR };
  }

  revalidatePath("/employer/properties");
  return { success: active ? "تم تفعيل العقار" : "تم إيقاف العقار" };
}
