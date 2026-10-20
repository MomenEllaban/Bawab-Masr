import { z } from "zod";

export const applySchema = z.object({
  coverMessage: z
    .string()
    .trim()
    .max(500, { message: "رسالة التقديم يجب ألا تتجاوز 500 حرف" })
    .optional(),
});

export const REPORT_REASONS = [
  "محتوى مخادع",
  "راتب غير واقعي",
  "تمييز أو سلوك غير لائق",
  "وظيفة غير قانونية",
  "أخرى",
] as const;

export const reportSchema = z.object({
  reason: z.enum(REPORT_REASONS, {
    message: "اختر سبب البلاغ",
  }),
  details: z
    .string()
    .trim()
    .max(1000, { message: "تفاصيل البلاغ يجب ألا تتجاوز 1000 حرف" })
    .optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: "أدخل كلمة المرور الحالية" }),
    newPassword: z
      .string()
      .min(8, { message: "كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل" }),
    confirmPassword: z.string().min(1, { message: "أعد إدخال كلمة المرور الجديدة" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });
