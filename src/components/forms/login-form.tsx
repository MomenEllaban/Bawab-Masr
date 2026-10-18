"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type AuthActionState } from "@/server/actions/auth";

const initialState: AuthActionState = {};

export default function LoginForm({
  callbackUrl,
  justVerified,
}: {
  callbackUrl?: string;
  justVerified?: boolean;
}) {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <div className="card">
      <h1 className="text-2xl font-bold mb-2 text-center">تسجيل الدخول</h1>
      <p className="text-gray-500 text-center mb-6 text-sm">
        أدخل رقم هاتفك وكلمة المرور للمتابعة
      </p>

      {justVerified && !state.error && (
        <div className="alert alert-success mb-4">
          تم تأكيد رقم هاتفك بنجاح. يمكنك تسجيل الدخول الآن.
        </div>
      )}

      {state.error && <div className="alert alert-error mb-4">{state.error}</div>}

      <form action={formAction} className="space-y-4">
        {callbackUrl && (
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
        )}

        <div>
          <label htmlFor="phone" className="form-label">
            رقم الهاتف
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="01xxxxxxxxx"
            className="form-input"
            dir="ltr"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="form-label">
            كلمة المرور
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="form-input"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full justify-center"
          disabled={isPending}
        >
          {isPending ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        ليس لديك حساب؟{" "}
        <Link
          href="/register"
          className="font-semibold"
          style={{ color: "var(--color-primary)" }}
        >
          إنشاء حساب جديد
        </Link>
      </p>
    </div>
  );
}
