/**
 * lib/validation/employer.ts
 * Zod schemas لأفعال لوحة صاحب العقار
 */

import { z } from "zod";

const emptyToUndefined = (value: unknown): unknown =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const optionalText = (max: number, message: string) =>
  z.preprocess(
    emptyToUndefined,
    z.string().trim().max(max, { message }).optional()
  );

const optionalId = z.preprocess(
  emptyToUndefined,
  z.string().trim().min(1, { message: "قيمة غير صحيحة" }).max(64, { message: "قيمة غير صحيحة" }).optional()
);

export const idParamSchema = z
  .string()
  .trim()
  .min(1, { message: "معرّف غير صالح" })
  .max(64, { message: "معرّف غير صالح" });

export const EMPLOYER_TYPES = [
  "INDIVIDUAL_OWNER",
  "UNION_REP",
  "MANAGEMENT_COMPANY",
] as const;

export const createEmployerProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, { message: "الاسم يجب أن يكون حرفين على الأقل" })
    .max(150, { message: "الاسم طويل جداً" }),
  employerType: z.enum(EMPLOYER_TYPES, {
    message: "يرجى اختيار نوع صاحب العقار",
  }),
});

export const updateEmployerProfileSchema = createEmployerProfileSchema;

export const createJobSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(5, { message: "عنوان الوظيفة يجب أن يكون 5 أحرف على الأقل" })
      .max(150, { message: "عنوان الوظيفة طويل جداً" }),
    description: z
      .string()
      .trim()
      .min(20, { message: "وصف الوظيفة يجب أن يكون 20 حرف على الأقل" })
      .max(5000, { message: "وصف الوظيفة طويل جداً" }),
    responsibilities: optionalText(3000, "المهام طويلة جداً"),
    requirements: optionalText(3000, "المتطلبات طويلة جداً"),
    workType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "TEMPORARY"], {
      message: "يرجى اختيار نوع الدوام",
    }),
    workSchedule: z.preprocess(
      emptyToUndefined,
      z
        .enum(["MORNING", "EVENING", "NIGHT", "ROTATING", "FLEXIBLE"], {
          message: "يرجى اختيار موعد الدوام",
        })
        .optional()
    ),
    salaryMin: z.preprocess(
      emptyToUndefined,
      z
        .coerce
        .number({ message: "الحد الأدنى للراتب غير صحيح" })
        .int({ message: "الحد الأدنى للراتب غير صحيح" })
        .min(0, { message: "الحد الأدنى للراتب غير صحيح" })
        .max(100000000, { message: "الحد الأدنى للراتب كبير جداً" })
        .optional()
    ),
    salaryMax: z.preprocess(
      emptyToUndefined,
      z
        .coerce
        .number({ message: "الحد الأعلى للراتب غير صحيح" })
        .int({ message: "الحد الأعلى للراتب غير صحيح" })
        .min(0, { message: "الحد الأعلى للراتب غير صحيح" })
        .max(100000000, { message: "الحد الأعلى للراتب كبير جداً" })
        .optional()
    ),
    salaryPeriod: z.enum(["MONTHLY", "DAILY", "WEEKLY"], {
      message: "يرجى اختيار فترة الراتب",
    }),
    isSalaryPublic: z.boolean(),
    experienceYears: z.preprocess(
      emptyToUndefined,
      z
        .coerce
        .number({ message: "سنوات الخبرة غير صحيحة" })
        .int({ message: "سنوات الخبرة غير صحيحة" })
        .min(0, { message: "سنوات الخبرة غير صحيحة" })
        .max(50, { message: "سنوات الخبرة كبيرة جداً" })
        .optional()
    ),
    housingProvided: z.boolean(),
    provinceId: optionalId,
    areaId: optionalId,
    propertyId: optionalId,
    applicationDeadline: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, {
          message: "تاريخ انتهاء التقديم غير صحيح",
        })
        .refine(
          (value) => {
            const date = new Date(value);
            return !Number.isNaN(date.getTime()) && date.getTime() > Date.now();
          },
          { message: "تاريخ انتهاء التقديم يجب أن يكون في المستقبل" }
        )
        .optional()
    ),
  })
  .refine(
    (data) =>
      data.salaryMin === undefined ||
      data.salaryMax === undefined ||
      data.salaryMin <= data.salaryMax,
    {
      message: "الحد الأدنى للراتب أكبر من الحد الأعلى",
      path: ["salaryMin"],
    }
  );

export const EMPLOYER_TARGET_STATUSES = [
  "VIEWED",
  "SHORTLISTED",
  "INTERVIEW_SCHEDULED",
  "OFFERED",
  "HIRED",
  "REJECTED",
] as const;

export const changeApplicationStatusSchema = z.object({
  targetStatus: z.enum(EMPLOYER_TARGET_STATUSES, {
    message: "يرجى اختيار الحالة الجديدة",
  }),
  note: optionalText(500, "الملاحظة يجب ألا تتجاوز 500 حرف"),
});

export const createPropertySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "اسم العقار يجب أن يكون حرفين على الأقل" })
    .max(150, { message: "اسم العقار طويل جداً" }),
  description: optionalText(1000, "وصف العقار طويل جداً"),
  areaId: z.string().trim().min(1, { message: "يرجى اختيار المنطقة" }).max(64),
  privateNotes: optionalText(1000, "الملاحظات طويلة جداً"),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type ChangeApplicationStatusInput = z.infer<
  typeof changeApplicationStatusSchema
>;
export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type CreateEmployerProfileInput = z.infer<
  typeof createEmployerProfileSchema
>;
