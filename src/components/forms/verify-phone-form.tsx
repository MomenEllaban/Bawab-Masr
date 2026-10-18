"use client";

import { useActionState } from "react";
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
    <div className="card">
      <h1 className="text-2xl font-bold mb-2 text-center">تأكيد رقم الهاتف</h1>
      <p className="text-gray-500 text-center mb-6 text-sm">
        أرسلنا رمز تحقق مكوّن من 6 أرقام إلى
      </p>
      <p
        className="text-center font-bold text-lg mb-6"
        style={{ color: "var(--color-primary)" }}
        dir="ltr"
      >
        {phone}
      </p>

      {otpFailed && !state.error && (
        <div className="alert alert-warning mb-4">
          تعذّر إرسال الرمز تلقائياً. اضغط &quot;إعادة إرسال الرمز&quot;
          بالأسفل.
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
            className="form-input text-center text-2xl tracking-[0.5em] font-bold"
            dir="ltr"
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            الرمز صالح لمدة 5 دقائق
          </p>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full justify-center"
          disabled={isPending}
        >
          {isPending ? "جارٍ التحقق..." : "تأكيد الرقم"}
        </button>
      </form>

      <div className="mt-6 border-t border-gray-100 pt-6 text-center">
        {resendState.success && (
          <div className="alert alert-success mb-4">{resendState.success}</div>
        )}
        {resendState.error && (
          <div className="alert alert-error mb-4">{resendState.error}</div>
        )}
        <p className="text-sm text-gray-500 mb-3">لم تستلم الرمز؟</p>
        <form action={resendAction}>
          <input type="hidden" name="phone" value={phone} />
          <button
            type="submit"
            className="btn btn-secondary"
            disabled={isResending}
          >
            {isResending ? "جارٍ الإرسال..." : "إعادة إرسال الرمز"}
          </button>
        </form>
      </div>
    </div>
  );
}
