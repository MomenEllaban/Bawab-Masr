"use client";

/**
 * components/forms/seeker-create-profile-form.tsx
 * نموذج إنشاء ملف الباحث لأول مرة
 */

import { useActionState } from "react";
import {
  createSeekerProfileAction,
  type SeekerActionState,
} from "@/server/actions/seeker";

const initialState: SeekerActionState = {};

export default function SeekerCreateProfileForm() {
  const [state, formAction, isPending] = useActionState(
    createSeekerProfileAction,
    initialState
  );

  return (
    <div className="card max-w-lg">
      <h2 className="text-xl font-bold mb-2">أنشئ ملف الباحث</h2>
      <p className="text-ink-soft text-sm mb-6">
        أنشئ ملفك لتتمكن من التقديم على الوظائف وإظهار بياناتك لأصحاب
        العقارات.
      </p>

      {state.error && (
        <div className="alert alert-error mb-4">{state.error}</div>
      )}
      {state.success && (
        <div className="alert alert-success mb-4">{state.success}</div>
      )}

      <form action={formAction}>
        <button
          type="submit"
          className="btn btn-primary w-full justify-center"
          disabled={isPending}
        >
          {isPending ? "جارٍ الإنشاء..." : "إنشاء ملف الباحث"}
        </button>
      </form>
    </div>
  );
}
