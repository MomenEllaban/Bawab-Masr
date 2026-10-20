"use client";

import { useActionState } from "react";
import Link from "next/link";
import { LogIn, ShieldCheck } from "lucide-react";
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
    <div className="card p-6 shadow-soft sm:p-8">
      <h1 className="text-center text-2xl font-extrabold">تسجيل الدخول</h1>
      <p className="mb-6 mt-2 text-center text-sm leading-relaxed text-ink-soft">
        أدخل رقم هاتفك وكلمة المرور للمتابعة
      </p>

      {justVerified && !state.error && (
        <div className="alert alert-success mb-4">
          <ShieldCheck size={17} aria-hidden />
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
            className="form-input ltr text-start"
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
          className={`btn btn-primary btn-block${isPending ? " is-loading" : ""}`}
          disabled={isPending}
        >
          <LogIn size={16} aria-hidden />
          تسجيل الدخول
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        ليس لديك حساب؟{" "}
        <Link href="/register" className="link text-sm">
          إنشاء حساب جديد
        </Link>
      </p>
    </div>
  );
}
