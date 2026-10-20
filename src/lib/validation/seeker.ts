/**
 * lib/validation/seeker.ts
 * Zod schemas لملف الباحث والوظائف المحفوظة وفلاتر الطلبات
 */

import { z } from "zod";

/** كل حالات طلب التقديم — تُستخدم في الفلاتر والتحقق */
export const APPLICATION_STATUSES = [
  "SUBMITTED",
  "VIEWED",
  "SHORTLISTED",
  "INTERVIEW_SCHEDULED",
  "OFFERED",
  "HIRED",
  "REJECTED",
  "WITHDRAWN",
] as const;

/** أنواع الدوام فقط — مطابقة لـ enum WorkType في قاعدة البيانات */
export const WORK_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "TEMPORARY"] as const;

export const SEEKER_AVAILABILITIES = [
  "IMMEDIATE",
  "TWO_WEEKS",
  "ONE_MONTH",
  "NOT_LOOKING",
] as const;

export const applicationStatusFilterSchema = z.enum(APPLICATION_STATUSES, {
  error: "حالة طلب غير صحيحة",
});

/** يحوّل القيم الفارغة/null من النموذج إلى undefined قبل التحقق */
function emptyToUndefined(value: unknown): unknown {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "string" && value.trim() === "") return undefined;
  return value;
}

function optionalText(max: number, message: string) {
  return z.preprocess(emptyToUndefined, z.string().trim().max(max, message).optional());
}

function optionalInt(min: number, max: number, message: string) {
  return z.preprocess(
    emptyToUndefined,
    z.coerce.number().int(message).min(min, message).max(max, message).optional()
  );
}

export const seekerProfileUpdateSchema = z.object({
  bio: optionalText(1000, "النبذة الشخصية يجب ألا تتجاوز 1000 حرف"),
  yearsExperience: optionalInt(0, 50, "سنوات الخبرة يجب أن تكون رقمًا بين 0 و 50"),
  preferredWorkType: z.preprocess(
    emptyToUndefined,
    z.enum(WORK_TYPES, { error: "اختر نوع الدوام المفضل" }).optional()
  ),
  availability: z.enum(SEEKER_AVAILABILITIES, {
    error: "اختر مدى جاهزيتك للعمل",
  }),
  expectedSalaryMin: optionalInt(
    0,
    100_000_000,
    "الحد الأدنى للراتب المتوقع يجب أن يكون رقمًا صحيحًا موجبًا"
  ),
  expectedSalaryMax: optionalInt(
    0,
    100_000_000,
    "الحد الأعلى للراتب المتوقع يجب أن يكون رقمًا صحيحًا موجبًا"
  ),
  isProfilePublic: z.preprocess((value) => value === "on" || value === true, z.boolean()),
  skillsCsv: optionalText(600, "قائمة المهارات طويلة جداً"),
});

export const savedJobIdSchema = z.string().min(1, "معرّف الوظيفة غير صالح");

export type SeekerProfileUpdateInput = z.infer<typeof seekerProfileUpdateSchema>;
export type ApplicationStatusFilter = z.infer<typeof applicationStatusFilterSchema>;
