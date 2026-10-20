"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { UserRound, Building2, UserPlus, Phone, KeyRound } from "lucide-react";
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
    <div className="card p-6 shadow-soft sm:p-8">
      <h1 className="text-center text-2xl font-extrabold">إنشاء حساب جديد</h1>
      <p className="mb-6 mt-2 text-center text-sm leading-relaxed text-ink-soft">
        سجّل بياناتك وسنرسل لك رمز تحقق على هاتفك
      </p>

      {state.error && <div className="alert alert-error mb-4">{state.error}</div>}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="role" value={role} />

        {/* نوع الحساب */}
        <fieldset>
          <legend className="form-label">نوع الحساب</legend>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("SEEKER")}
              aria-pressed={role === "SEEKER"}
              className={`rounded-card border-2 p-4 text-center transition-colors ${
                role === "SEEKER"
                  ? "border-navy bg-navy-50"
                  : "border-line bg-surface hover:border-navy-700/40"
              }`}
            >
              <UserRound
                size={24}
                aria-hidden
                className={`mx-auto mb-2 ${
                  role === "SEEKER" ? "text-navy" : "text-ink-mute"
                }`}
              />
              <span className="block text-sm font-bold">باحث عن عمل</span>
              <span className="mt-1 block text-xs leading-relaxed text-ink-mute">
                ابحث عن وظائف وقّدم طلباتك
              </span>
            </button>
            <button
              type="button"
              onClick={() => setRole("EMPLOYER")}
              aria-pressed={role === "EMPLOYER"}
              className={`rounded-card border-2 p-4 text-center transition-colors ${
                role === "EMPLOYER"
                  ? "border-navy bg-navy-50"
                  : "border-line bg-surface hover:border-navy-700/40"
              }`}
            >
              <Building2
                size={24}
                aria-hidden
                className={`mx-auto mb-2 ${
                  role === "EMPLOYER" ? "text-navy" : "text-ink-mute"
                }`}
              />
              <span className="block text-sm font-bold">صاحب عقار</span>
              <span className="mt-1 block text-xs leading-relaxed text-ink-mute">
                انشر وظائف واستقبل الطلبات
              </span>
            </button>
          </div>
        </fieldset>

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
          <div className="relative">
            <Phone
              size={16}
              aria-hidden
              className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-ink-mute"
            />
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="01xxxxxxxxx"
              className="form-input ltr pe-10 text-start"
              dir="ltr"
              required
            />
          </div>
          <p className="form-hint">سيُرسل رمز التحقق إلى هذا الرقم</p>
        </div>

        <div>
          <label htmlFor="password" className="form-label">
            كلمة المرور
          </label>
          <div className="relative">
            <KeyRound
              size={16}
              aria-hidden
              className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-ink-mute"
            />
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              className="form-input pe-10"
              required
            />
          </div>
          <p className="form-hint">8 أحرف على الأقل</p>
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
          <div className="space-y-4 rounded-card border border-line bg-muted/40 p-4">
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
          className={`btn btn-primary btn-block${isPending ? " is-loading" : ""}`}
          disabled={isPending}
        >
          <UserPlus size={16} aria-hidden />
          إنشاء الحساب
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        لديك حساب بالفعل؟{" "}
        <Link href="/login" className="link text-sm">
          تسجيل الدخول
        </Link>
      </p>
    </div>
  );
}
