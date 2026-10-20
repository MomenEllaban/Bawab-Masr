"use server";

/**
 * server/actions/auth.ts
 * Server Actions للمصادقة — التحقق من المدخلات يتم على الخادم دائمًا
 */

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";
import {
  registerSchema,
  loginSchema,
  otpVerifySchema,
  sendOtpSchema,
} from "@/lib/validation/auth";
import {
  registerUser,
  resendOtpForPhone,
  verifyOtp,
} from "@/server/services/auth-service";

export type AuthActionState = {
  error?: string;
  success?: string;
};

const GENERIC_ERROR = "حدث خطأ غير متوقع، حاول مرة أخرى";

async function getClientIp(): Promise<string> {
  try {
    const h = await headers();
    const forwarded = h.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim();
    return h.get("x-real-ip") ?? "unknown";
  } catch {
    return "unknown";
  }
}

/** يعيد أول رسالة خطأ من Zod */
function firstIssue(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? "بيانات غير صحيحة";
}

// ============================================================
// التسجيل
// ============================================================

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    role: formData.get("role"),
    employerName: formData.get("employerName") ?? undefined,
    employerType: formData.get("employerType") ?? undefined,
  });

  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  const ip = await getClientIp();

  let data: { phone: string; otpSent: boolean } | undefined;
  try {
    const result = await registerUser(parsed.data, ip);
    if (!result.ok) {
      return { error: result.error };
    }
    data = result.data;
  } catch (error) {
    console.error("[registerAction]", error);
    return { error: GENERIC_ERROR };
  }

  if (!data) {
    return { error: GENERIC_ERROR };
  }

  const params = new URLSearchParams({ phone: data.phone });
  if (!data.otpSent) params.set("otpFailed", "1");
  redirect(`/verify-phone?${params.toString()}`);
}

// ============================================================
// تسجيل الدخول
// ============================================================

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    phone: formData.get("phone"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  const callbackUrlRaw = formData.get("callbackUrl");
  const callbackUrl =
    typeof callbackUrlRaw === "string" && callbackUrlRaw.startsWith("/")
      ? callbackUrlRaw
      : "/";

  try {
    await signIn("credentials", {
      phone: parsed.data.phone,
      password: parsed.data.password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      console.error("[loginAction]", error.type, error.message);
      if (error.type === "CredentialsSignin") {
        return { error: "رقم الهاتف أو كلمة المرور غير صحيحة" };
      }
      return { error: "تعذر تسجيل الدخول، حاول مرة أخرى" };
    }
    // NEXT_REDIRECT وأخطاء النظام تُعاد كما هي
    throw error;
  }

  return { success: "تم تسجيل الدخول" };
}

// ============================================================
// تأكيد رقم الهاتف
// ============================================================

export async function verifyOtpAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = otpVerifySchema.safeParse({
    phone: formData.get("phone"),
    otp: formData.get("otp"),
  });

  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  const ip = await getClientIp();

  try {
    const result = await verifyOtp(parsed.data.phone, parsed.data.otp, ip);
    if (!result.ok) {
      return { error: result.error };
    }
  } catch (error) {
    console.error("[verifyOtpAction]", error);
    return { error: GENERIC_ERROR };
  }

  revalidatePath("/verify-phone");
  redirect("/login?verified=1");
}

export async function resendOtpAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = sendOtpSchema.safeParse({ phone: formData.get("phone") });

  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  const ip = await getClientIp();

  try {
    const result = await resendOtpForPhone(parsed.data.phone, ip);
    if (!result.ok) {
      return { error: result.error };
    }
  } catch (error) {
    console.error("[resendOtpAction]", error);
    return { error: GENERIC_ERROR };
  }

  return { success: "تم إرسال رمز تحقق جديد" };
}

// ============================================================
// تسجيل الخروج
// ============================================================

export async function logoutAction(): Promise<void> {
  try {
    await signOut({ redirectTo: "/" });
  } catch (error) {
    // signOut يرمي خطأ NEXT_REDIRECT عند النجاح — نعيده كما هو
    const digest =
      error !== null &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string"
        ? error.digest
        : "";
    if (digest.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("[logoutAction]", error);
    redirect("/");
  }
}
