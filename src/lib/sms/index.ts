/**
 * lib/sms/index.ts
 * SMS Provider Interface — منع إرسال رسائل وهمية في الإنتاج
 */

export interface SmsProvider {
  sendOtp(phone: string, code: string): Promise<{ success: boolean; error?: string }>;
}

// ============================================================
// مزود تطوير — يطبع الكود في الـ console فقط
// ============================================================

class DevSmsProvider implements SmsProvider {
  async sendOtp(phone: string, code: string) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("DevSmsProvider لا يُسمح باستخدامه في الإنتاج");
    }
    // لا يُطبع في الـ log في الإنتاج — فقط في التطوير
    console.log(`[DEV SMS] رمز OTP لـ ${phone}: ${code}`);
    return { success: true };
  }
}

// ============================================================
// مزود Twilio (placeholder — يحتاج إعداد حقيقي)
// ============================================================

class TwilioSmsProvider implements SmsProvider {
  async sendOtp(_phone: string, _code: string) {
    const apiKey = process.env.SMS_API_KEY;
    const sender = process.env.SMS_SENDER_ID;

    if (!apiKey || !sender) {
      return { success: false, error: "بيانات مزود SMS غير مكتملة" };
    }

    // TODO: تنفيذ Twilio API
    console.error("Twilio غير مُنفَّذ بعد");
    return { success: false, error: "مزود SMS غير جاهز" };
  }
}

// ============================================================
// اختيار المزود بناءً على المتغيرات
// ============================================================

function getSmsProvider(): SmsProvider {
  const provider = process.env.SMS_PROVIDER ?? "dev";

  if (provider === "dev") {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "SMS_PROVIDER=dev غير مسموح في الإنتاج. يجب تكوين مزود SMS حقيقي."
      );
    }
    return new DevSmsProvider();
  }

  if (provider === "twilio") {
    return new TwilioSmsProvider();
  }

  throw new Error(`مزود SMS غير معروف: ${provider}`);
}

export const smsProvider = getSmsProvider();
