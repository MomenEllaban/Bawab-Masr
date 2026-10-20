"use client";

import { useActionState } from "react";
import {
  createEmployerProfileAction,
  type EmployerActionState,
} from "@/server/actions/employer";
import { EMPLOYER_TYPE_LABELS } from "@/lib/labels";

const initialState: EmployerActionState = {};

export default function EmployerProfileCreateForm() {
  const [state, formAction, isPending] = useActionState(
    createEmployerProfileAction,
    initialState
  );

  return (
    <div className="card max-w-lg">
      <h1 className="text-xl font-bold mb-2">أنشئ ملف صاحب العقار</h1>
      <p className="text-ink-soft text-sm mb-4">
        أنشئ ملفك لتتمكن من نشر الوظائف وإدارة الطلبات والعقارات الخاصة بك.
      </p>

      {state.error && <div className="alert alert-error mb-4">{state.error}</div>}
      {state.success && (
        <div className="alert alert-success mb-4">{state.success}</div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="displayName" className="form-label">
            الاسم الظاهر
          </label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            className="form-input"
            minLength={2}
            maxLength={150}
            placeholder="مثال: أحمد محمود"
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
            {Object.entries(EMPLOYER_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isPending}
        >
          {isPending ? "جارٍ الإنشاء..." : "إنشاء الملف"}
        </button>
      </form>
    </div>
  );
}
