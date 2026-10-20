"use server";

/**
 * server/actions/seeker.ts
 * Server Actions لملف الباحث والوظائف المحفوظة — التحقق من المدخلات يتم على الخادم دائمًا
 */

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/permissions";
import { prisma } from "@/lib/db/prisma";
import { seekerProfileUpdateSchema, savedJobIdSchema } from "@/lib/validation/seeker";
import { updateSeekerProfile } from "@/server/services/profile-service";
import { logAudit } from "@/server/services/audit-service";

export type SeekerActionState = {
  error?: string;
  success?: string;
};

const GENERIC_ERROR = "حدث خطأ غير متوقع، حاول مرة أخرى";

function firstIssue(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? "بيانات غير صحيحة";
}

/** يحوّل نص المهارات المفصولة بفواصل إلى قائمة مهارات نظيفة (بحد أقصى 20) */
function parseSkills(skillsCsv: string | undefined): string[] | undefined {
  if (!skillsCsv) return undefined;
  const names = skillsCsv
    .split(/[،,]/)
    .map((skill) => skill.trim())
    .filter((skill) => skill.length > 0);
  return Array.from(new Set(names)).slice(0, 20);
}

// ============================================================
// إنشاء ملف الباحث
// ============================================================

export async function createSeekerProfileAction(
  _prevState: SeekerActionState,
  _formData: FormData
): Promise<SeekerActionState> {
  const user = await requireAuth();

  try {
    const existing = await prisma.seekerProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!existing) {
      const profile = await prisma.seekerProfile.create({
        data: {
          userId: user.id,
          availability: "IMMEDIATE",
          isProfilePublic: true,
        },
        select: { id: true },
      });

      await logAudit({
        actorId: user.id,
        action: "SEEKER_PROFILE_CREATED",
        entityType: "SeekerProfile",
        entityId: profile.id,
      });
    }
  } catch (error) {
    console.error("[createSeekerProfileAction]", error);
    return { error: GENERIC_ERROR };
  }

  revalidatePath("/seeker/profile");
  return { success: "تم إنشاء ملف الباحث، يمكنك تعديله الآن" };
}

// ============================================================
// تحديث ملف الباحث
// ============================================================

export async function updateSeekerProfileAction(
  _prevState: SeekerActionState,
  formData: FormData
): Promise<SeekerActionState> {
  const user = await requireAuth();

  const parsed = seekerProfileUpdateSchema.safeParse({
    bio: formData.get("bio"),
    yearsExperience: formData.get("yearsExperience"),
    preferredWorkType: formData.get("preferredWorkType"),
    availability: formData.get("availability"),
    expectedSalaryMin: formData.get("expectedSalaryMin"),
    expectedSalaryMax: formData.get("expectedSalaryMax"),
    isProfilePublic: formData.get("isProfilePublic"),
    skillsCsv: formData.get("skillsCsv"),
  });

  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  const { skillsCsv, ...rest } = parsed.data;

  let result: { ok: boolean; error?: string };
  try {
    result = await updateSeekerProfile(user.id, {
      ...rest,
      skills: parseSkills(skillsCsv),
    });
  } catch (error) {
    console.error("[updateSeekerProfileAction]", error);
    return { error: GENERIC_ERROR };
  }

  if (!result.ok) {
    return { error: result.error };
  }

  await logAudit({
    actorId: user.id,
    action: "SEEKER_PROFILE_UPDATED",
    entityType: "SeekerProfile",
    entityId: user.id,
    metadata: { isProfilePublic: rest.isProfilePublic },
  });

  revalidatePath("/seeker/profile");
  return { success: "تم حفظ الملف الشخصي" };
}

// ============================================================
// إزالة وظيفة من المحفوظات
// ============================================================

export async function removeSavedJobAction(
  jobId: string,
  _prevState: SeekerActionState,
  _formData: FormData
): Promise<SeekerActionState> {
  const user = await requireAuth();

  const parsed = savedJobIdSchema.safeParse(jobId);
  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  try {
    const deleted = await prisma.savedJob.deleteMany({
      where: { userId: user.id, jobId: parsed.data },
    });

    if (deleted.count === 0) {
      return { error: "هذه الوظيفة غير محفوظة في حسابك" };
    }

    await logAudit({
      actorId: user.id,
      action: "SAVED_JOB_REMOVED",
      entityType: "SavedJob",
      entityId: parsed.data,
      metadata: { jobId: parsed.data },
    });
  } catch (error) {
    console.error("[removeSavedJobAction]", error);
    return { error: GENERIC_ERROR };
  }

  revalidatePath("/seeker/saved");
  revalidatePath("/seeker");
  return { success: "تمت إزالة الوظيفة من المحفوظات" };
}
