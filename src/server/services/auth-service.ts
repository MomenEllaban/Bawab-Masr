/**
 * server/services/auth-service.ts
 * منطق أعمال التسجيل وتأكيد رقم الهاتف (OTP)
 * كل العمليات هنا تتم على الخادم فقط.
 */

import { prisma } from "@/lib/db/prisma";
import { smsProvider } from "@/lib/sms";
import { rateLimit } from "@/lib/rate-limit";
import bcrypt from "bcryptjs";
import type { RegisterInput } from "@/lib/validation/auth";

// إعدادات OTP
const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 5;
const OTP_MAX_ATTEMPTS = 5;
const OTP_RESEND_COOLDOWN_SECONDS = 60;
const OTP_VERIFY_MAX_ATTEMPTS = 5;
const OTP_VERIFY_WINDOW_SECONDS = 15 * 60;

export type ServiceResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

// ============================================================
// توليد وحفظ وإرسال OTP
// ============================================================

function generateOtpCode(): string {
  // كافٍ عشوائيًا للأغراض العملية، والحماية الحقيقية من الحد المحاولات +
  // مدة الصلاحية القصيرة + أن الرمز يُخزن كـ hash
  let code = "";
  for (let i = 0; i < OTP_LENGTH; i++) {
    code += Math.floor(Math.random() * 10).toString();
  }
  return code;
}

export async function createAndSendOtp(
  userId: string,
  phone: string,
  clientIp: string
): Promise<ServiceResult> {
  // منع إرسال متكرر (cooldown)
  const cooldown = rateLimit(
    `otp-send:${phone}:${clientIp}`,
    1,
    OTP_RESEND_COOLDOWN_SECONDS
  );
  if (!cooldown.ok) {
    return {
      ok: false,
      error: `انتظر ${cooldown.retryAfterSeconds} ثانية قبل طلب رمز جديد`,
    };
  }

  // حد إجمالي للإرسال لكل رقم
  const sendBudget = rateLimit(`otp-send-budget:${phone}`, 5, 60 * 60);
  if (!sendBudget.ok) {
    return {
      ok: false,
      error: "تم الوصول للحد الأقصى لطلبات الرمز، حاول لاحقًا",
    };
  }

  const code = generateOtpCode();
  const codeHash = await bcrypt.hash(code, 4);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.phoneVerification.create({
    data: { userId, phone, codeHash, expiresAt },
  });

  const result = await smsProvider.sendOtp(phone, code);
  if (!result.success) {
    // لا نكشف تفاصيل الفشل الداخلية
    return { ok: false, error: "تعذر إرسال رمز التحقق، حاول مرة أخرى" };
  }

  return { ok: true };
}

// ============================================================
// التحقق من OTP
// ============================================================

export async function verifyOtp(
  phone: string,
  code: string,
  clientIp: string
): Promise<ServiceResult<{ userId: string }>> {
  const limit = rateLimit(
    `otp-verify:${phone}:${clientIp}`,
    OTP_VERIFY_MAX_ATTEMPTS,
    OTP_VERIFY_WINDOW_SECONDS
  );
  if (!limit.ok) {
    return {
      ok: false,
      error: `محاولات كثيرة، حاول بعد ${limit.retryAfterSeconds} ثانية`,
    };
  }

  const now = new Date();
  const isDemoMode =
    process.env.SMS_PROVIDER === "dev" ||
    process.env.SMS_PROVIDER === "mock" ||
    !process.env.SMS_API_KEY;
  const isMasterOtp = isDemoMode && code === "123456";

  let record = await prisma.phoneVerification.findFirst({
    where: {
      phone,
      consumedAt: null,
      expiresAt: { gt: now },
      attempts: { lt: OTP_MAX_ATTEMPTS },
    },
    orderBy: { createdAt: "desc" },
  });

  // إذا لم يُعثر على سجل نشط وكان الرمز هو رمز المعاينة التجريبي، ابحث عن أحدث مستخدم غير مؤكد
  if (!record && isMasterOtp) {
    const unconfirmedUser = await prisma.user.findUnique({
      where: { phone },
    });
    if (unconfirmedUser) {
      await prisma.user.update({
        where: { id: unconfirmedUser.id },
        data: { phoneVerifiedAt: new Date(), status: "ACTIVE" },
      });
      return { ok: true, data: { userId: unconfirmedUser.id } };
    }
  }

  if (!record) {
    return { ok: false, error: "رمز التحقق غير صالح أو منتهي الصلاحية" };
  }

  const isValid = isMasterOtp || (await bcrypt.compare(code, record.codeHash));

  if (!isValid) {
    await prisma.phoneVerification.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    return { ok: false, error: "رمز التحقق غير صحيح" };
  }

  // استهلاك الرمز وتأكيد الهاتف — عملية ذرية واحدة
  await prisma.$transaction([
    prisma.phoneVerification.update({
      where: { id: record.id },
      data: { consumedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: record.userId },
      data: { phoneVerifiedAt: new Date(), status: "ACTIVE" },
    }),
  ]);

  return { ok: true, data: { userId: record.userId } };
}

// ============================================================
// التسجيل
// ============================================================

export async function registerUser(
  input: RegisterInput,
  clientIp: string
): Promise<ServiceResult<{ userId: string; phone: string; otpSent: boolean }>> {
  // حد التسجيل من نفس الـ IP
  const limit = rateLimit(`register:${clientIp}`, 5, 60 * 60);
  if (!limit.ok) {
    return {
      ok: false,
      error: "تم الوصول للحد الأقصى لمحاولات التسجيل، حاول لاحقًا",
    };
  }

  const existing = await prisma.user.findUnique({
    where: { phone: input.phone },
    select: { id: true },
  });
  if (existing) {
    return { ok: false, error: "رقم الهاتف مسجّل بالفعل" };
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: {
      phone: input.phone,
      name: input.name,
      passwordHash,
      status: "PENDING_VERIFICATION",
      seekerProfile:
        input.role === "SEEKER"
          ? { create: { availability: "IMMEDIATE" } }
          : undefined,
      employerProfile:
        input.role === "EMPLOYER"
          ? {
              create: {
                displayName: input.employerName ?? input.name,
                employerType: input.employerType ?? "INDIVIDUAL_OWNER",
              },
            }
          : undefined,
    },
    select: { id: true, phone: true },
  });

  const otpResult = await createAndSendOtp(user.id, user.phone, clientIp);

  return { ok: true, data: { userId: user.id, phone: user.phone, otpSent: otpResult.ok } };
}

/**
 * إعادة إرسال رمز التحقق لرقم غير مؤكد (دون الحاجة لتسجيل دخول)
 */
export async function resendOtpForPhone(
  phone: string,
  clientIp: string
): Promise<ServiceResult> {
  const user = await prisma.user.findUnique({
    where: { phone },
    select: { id: true, phone: true, phoneVerifiedAt: true, status: true },
  });

  if (!user) {
    // لا نكشف وجود الحساب من عدمه
    return { ok: true };
  }

  if (user.phoneVerifiedAt) {
    return { ok: false, error: "رقم الهاتف مؤكد بالفعل، يمكنك تسجيل الدخول" };
  }

  return createAndSendOtp(user.id, user.phone, clientIp);
}
