/**
 * lib/validation/auth.ts
 * Zod schemas للمصادقة
 */

import { z } from "zod";

// تحقق من رقم الهاتف المصري
const egyptianPhone = z
  .string()
  .regex(/^(01[0-2,5]\d{8})$/, "رقم هاتف مصري غير صحيح")
  .transform((v) => v.trim());

export const loginSchema = z.object({
  phone: egyptianPhone,
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "الاسم يجب أن يكون حرفين على الأقل")
      .max(100, "الاسم طويل جداً")
      .trim(),
    phone: egyptianPhone,
    password: z
      .string()
      .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
      .max(128, "كلمة المرور طويلة جداً"),
    confirmPassword: z.string(),
    role: z.enum(["SEEKER", "EMPLOYER"], {
      error: "يرجى تحديد نوع الحساب",
    }),
    // مطلوبان لحساب صاحب العقار
    employerName: z.string().max(150, "اسم صاحب العقار طويل جداً").trim().optional(),
    employerType: z
      .enum(["INDIVIDUAL_OWNER", "UNION_REP", "MANAGEMENT_COMPANY"], {
        error: "يرجى تحديد نوع صاحب العقار",
      })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  })
  .refine(
    (data) =>
      data.role !== "EMPLOYER" ||
      (!!data.employerName && data.employerName.length >= 2),
    {
      message: "اسم صاحب العقار مطلوب لحساب صاحب العقار",
      path: ["employerName"],
    }
  )
  .refine((data) => data.role !== "EMPLOYER" || !!data.employerType, {
    message: "نوع صاحب العقار مطلوب لحساب صاحب العقار",
    path: ["employerType"],
  });

export const otpVerifySchema = z.object({
  phone: egyptianPhone,
  otp: z
    .string()
    .length(6, "رمز التحقق يجب أن يكون 6 أرقام")
    .regex(/^\d+$/, "رمز التحقق يجب أن يحتوي على أرقام فقط"),
});

export const sendOtpSchema = z.object({
  phone: egyptianPhone,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type OtpVerifyInput = z.infer<typeof otpVerifySchema>;
export type SendOtpInput = z.infer<typeof sendOtpSchema>;
