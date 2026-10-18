"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { registerAction, type AuthActionState } from "@/server/actions/auth";

const initialState: AuthActionState = {};

type Role = "SEEKER" | "EMPLOYER";

export default function RegisterForm({ defaultRole }: { defaultRole?: Role }) {
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState
  );
  const [role, setRole] = useState<Role>(defaultRole ?? "SEEKER");

  return (
    <div className="card">
      <h1 className="text-2xl font-bold mb-2 text-center">إنشاء حساب جديد</h1>
      <p className="text-gray-500 text-center mb-6 text-sm">
        سجّل بياناتك وسنرسل لك رمز تحقق على هاتفك
      </p>

      {state.error && <div className="alert alert-error mb-4">{state.error}</div>}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="role" value={role} />

        {/* نوع الحساب */}
        <div>
          <span className="form-label">نوع الحساب</span>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("SEEKER")}
              className={`p-3 rounded-lg border-2 text-center transition-colors ${
                role === "SEEKER"
                  ? "border-blue-900 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="block text-2xl mb-1">👤</span>
              <span className="font-semibold text-sm">باحث عن عمل</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("EMPLOYER")}
              className={`p-3 rounded-lg border-2 text-center transition-colors ${
                role === "EMPLOYER"
                  ? "border-blue-900 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="block text-2xl mb-1">🏠</span>
              <span className="font-semibold text-sm">صاحب عقار</span>
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="name" className="form-label">
            الاسم الكامل
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            className="form-input"
            required
          />
        </div>

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
          <p className="text-xs text-gray-400 mt-1">
            سيُرسل رمز التحقق إلى هذا الرقم
          </p>
        </div>

        <div>
          <label htmlFor="password" className="form-label">
            كلمة المرور
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            className="form-input"
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            8 أحرف على الأقل
          </p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="form-label">
            تأكيد كلمة المرور
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            className="form-input"
            required
          />
        </div>

        {role === "EMPLOYER" && (
          <div className="space-y-4 border-t border-gray-100 pt-4">
            <div>
              <label htmlFor="employerName" className="form-label">
                اسم صاحب العقار / الشركة
              </label>
              <input
                id="employerName"
                name="employerName"
                type="text"
                className="form-input"
                required
              />
            </div>
            <div>
              <label htmlFor="employerType" className="form-label">
                نوع صاحب العقار
              </label>
              <select
                id="employerType"
                name="employerType"
                className="form-input"
                defaultValue="INDIVIDUAL_OWNER"
                required
              >
                <option value="INDIVIDUAL_OWNER">مالك فرد</option>
                <option value="UNION_REP">ممثل اتحاد ملاك</option>
                <option value="MANAGEMENT_COMPANY">شركة إدارة عقارات</option>
              </select>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-full justify-center"
          disabled={isPending}
        >
          {isPending ? "جارٍ إنشاء الحساب..." : "إنشاء الحساب"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        لديك حساب بالفعل؟{" "}
        <Link
          href="/login"
          className="font-semibold"
          style={{ color: "var(--color-primary)" }}
        >
          تسجيل الدخول
        </Link>
      </p>
    </div>
  );
}
