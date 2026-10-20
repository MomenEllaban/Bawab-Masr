import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import type { ServiceResult } from "./result";

export type SeekerProfileInput = {
  bio?: string;
  yearsExperience?: number;
  preferredWorkType?: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "TEMPORARY";
  availability: "IMMEDIATE" | "TWO_WEEKS" | "ONE_MONTH" | "NOT_LOOKING";
  expectedSalaryMin?: number;
  expectedSalaryMax?: number;
  isProfilePublic: boolean;
  skills?: string[];
};

export async function updateSeekerProfile(
  userId: string,
  input: SeekerProfileInput
): Promise<ServiceResult> {
  const profile = await prisma.seekerProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!profile) {
    return { ok: false, error: "ملف الباحث غير موجود" };
  }

  if (
    input.expectedSalaryMin !== undefined &&
    input.expectedSalaryMax !== undefined &&
    input.expectedSalaryMin > input.expectedSalaryMax
  ) {
    return { ok: false, error: "الحد الأدنى للراتب المتوقع أكبر من الأعلى" };
  }

  const skillNames = (input.skills ?? [])
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, 20);

  await prisma.$transaction(async (tx) => {
    await tx.seekerProfile.update({
      where: { id: profile.id },
      data: {
        bio: input.bio?.trim() || null,
        yearsExperience: input.yearsExperience,
        preferredWorkType: input.preferredWorkType,
        availability: input.availability,
        expectedSalaryMin: input.expectedSalaryMin,
        expectedSalaryMax: input.expectedSalaryMax,
        isProfilePublic: input.isProfilePublic,
      },
    });

    await tx.seekerSkill.deleteMany({ where: { seekerProfileId: profile.id } });

    if (skillNames.length > 0) {
      for (const name of skillNames) {
        const skill = await tx.skill.upsert({
          where: { name },
          update: {},
          create: { name },
        });
        await tx.seekerSkill.create({
          data: { seekerProfileId: profile.id, skillId: skill.id },
        });
      }
    }
  });

  return { ok: true };
}

export type EmployerProfileInput = {
  displayName: string;
  employerType: "INDIVIDUAL_OWNER" | "UNION_REP" | "MANAGEMENT_COMPANY";
};

export async function updateEmployerProfile(
  userId: string,
  input: EmployerProfileInput
): Promise<ServiceResult> {
  const profile = await prisma.employerProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!profile) {
    return { ok: false, error: "ملف صاحب العقار غير موجود" };
  }
  if (input.displayName.trim().length < 2) {
    return { ok: false, error: "اسم صاحب العقصير مطلوب" };
  }

  await prisma.employerProfile.update({
    where: { id: profile.id },
    data: {
      displayName: input.displayName.trim(),
      employerType: input.employerType,
    },
  });

  return { ok: true };
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<ServiceResult> {
  if (newPassword.length < 8) {
    return { ok: false, error: "كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل" };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { passwordHash: true },
  });
  if (!user?.passwordHash) {
    return { ok: false, error: "تعذر العثور على الحساب" };
  }

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) {
    return { ok: false, error: "كلمة المرور الحالية غير صحيحة" };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  return { ok: true };
}
