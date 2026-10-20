"use client";

import { useActionState } from "react";
import { ShieldCheck, Send, TriangleAlert, Sparkles } from "lucide-react";
import {
  verifyOtpAction,
  resendOtpAction,
  type AuthActionState,
} from "@/server/actions/auth";

const initialState: AuthActionState = {};

export default function VerifyPhoneForm({
  phone,
  otpFailed,
}: {
  phone: string;
  otpFailed?: boolean;
}) {
  const [state, formAction, isPending] = useActionState(
    verifyOtpAction,
    initialState
  );
  const [resendState, resendAction, isResending] = useActionState(
    resendOtpAction,
    initialState
  );

  return (
    <div className="card p-6 shadow-soft sm:p-8">
      <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-navy-50 text-navy">
        <ShieldCheck size={24} aria-hidden />
      </span>
      <h1 className="text-center text-2xl font-extrabold">تأكيد رقم الهاتف</h1>
      <p className="mt-2 text-center text-sm text-ink-soft">
        أرسلنا رمز تحقق مكوّن من 6 أرقام إلى
      </p>
      <p className="mb-4 mt-1 text-center text-lg font-bold text-navy ltr" dir="ltr">
        {phone}
      </p>

      {/* شريط المعاينة التجريبي لتسهيل التجربة في أي بيئة */}
      <div className="mb-5 rounded-2xl border border-emerald-500/30 bg-emerald-50/70 p-4 text-xs text-emerald-950">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-bold text-emerald-900 inline-flex items-center gap-1.5 text-xs">
            <Sparkles size={14} className="text-emerald-700" aria-hidden />
            وضع المعاينة (Demo Mode)
          </span>
          <button
            type="button"
            onClick={() => {
              const input = document.getElementById("otp") as HTMLInputElement;
              if (input) {
                input.value = "123456";
                input.focus();
              }
            }}
            className="rounded-lg bg-emerald-700 px-2.5 py-1 text-white font-bold hover:bg-emerald-800 transition-colors shadow-xs"
          >
            تعبئة تلقائية (123456)
          </button>
        </div>
        <p className="mt-2 text-emerald-800 leading-relaxed">
          نظراً لأن بوابات رسائل SMS في مصر تتطلب عقوداً تجارية، يمكنك استخدام الرمز التجريبي{" "}
          <strong className="font-mono text-emerald-950 text-sm">123456</strong> للتأكيد الفوري والمتابعة.
        </p>
      </div>

      {otpFailed && !state.error && (
        <div className="alert alert-warning mb-4">
          <TriangleAlert size={16} aria-hidden />
          تعذّر إرسال الرمز تلقائياً. اضغط &quot;إعادة إرسال الرمز&quot;
          بالأسفل أو استخدم الرمز التجريبي أعلاه.
        </div>
      )}

      {state.error && <div className="alert alert-error mb-4">{state.error}</div>}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="phone" value={phone} />

        <div>
          <label htmlFor="otp" className="form-label">
            رمز التحقق
          </label>
          <input
            id="otp"
            name="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="______"
            className="form-input text-center text-2xl font-bold tracking-[0.5em]"
            dir="ltr"
            required
          />
          <p className="form-hint">الرمز صالح لمدة 5 دقائق</p>
        </div>

        <button
          type="submit"
          className={`btn btn-primary btn-block${isPending ? " is-loading" : ""}`}
          disabled={isPending}
        >
          تأكيد الرقم
        </button>
      </form>

      <div className="mt-6 border-t border-line pt-6 text-center">
        {resendState.success && (
          <div className="alert alert-success mb-4">{resendState.success}</div>
        )}
        {resendState.error && (
          <div className="alert alert-error mb-4">{resendState.error}</div>
        )}
        <p className="mb-3 text-sm text-ink-soft">لم تستلم الرمز؟</p>
        <form action={resendAction}>
          <input type="hidden" name="phone" value={phone} />
          <button
            type="submit"
            className={`btn btn-secondary${isResending ? " is-loading" : ""}`}
            disabled={isResending}
          >
            <Send size={15} aria-hidden />
            إعادة إرسال الرمز
          </button>
        </form>
      </div>
    </div>
  );
}
