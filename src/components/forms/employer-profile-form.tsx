"use client";

import { useActionState } from "react";
import {
  updateEmployerProfileAction,
  type EmployerActionState,
} from "@/server/actions/employer";
import { EMPLOYER_TYPE_LABELS } from "@/lib/labels";

const initialState: EmployerActionState = {};

type EmployerProfileFormProps = {
  profile: {
    displayName: string;
    employerType: string;
  };
};

export default function EmployerProfileForm({
  profile,
}: EmployerProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateEmployerProfileAction,
    initialState
  );

  return (
    <div className="card max-w-lg">
      <h2 className="text-xl font-bold mb-4">بيانات الملف الشخصي</h2>

      {state.error && <div className="alert alert-error mb-4">{state.error}</div>}
      {state.success && (
        <div className="alert alert-success mb-4">{state.success}</div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="profile-displayName" className="form-label">
            الاسم الظاهر
          </label>
          <input
            id="profile-displayName"
            name="displayName"
            type="text"
            className="form-input"
            minLength={2}
            maxLength={150}
            defaultValue={profile.displayName}
            required
          />
          <p className="text-xs text-ink-mute mt-1">
            هذا الاسم يظهر لأصحاب العمل والباحثين عن عمل
          </p>
        </div>

        <div>
          <label htmlFor="profile-employerType" className="form-label">
            نوع صاحب العقار
          </label>
          <select
            id="profile-employerType"
            name="employerType"
            className="form-input"
            defaultValue={profile.employerType}
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
          {isPending ? "جارٍ الحفظ..." : "حفظ التعديلات"}
        </button>
      </form>
    </div>
  );
}
