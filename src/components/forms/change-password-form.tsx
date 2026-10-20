"use client";

import { useActionState } from "react";
import {
  changePasswordAction,
  type ActionState,
} from "@/server/actions/account";

const initialState: ActionState = {};

export default function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(
    changePasswordAction,
    initialState
  );

  return (
    <div className="card max-w-lg">
      <h2 className="text-xl font-bold mb-4">تغيير كلمة المرور</h2>

      {state.error && <div className="alert alert-error mb-4">{state.error}</div>}
      {state.success && (
        <div className="alert alert-success mb-4">{state.success}</div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="currentPassword" className="form-label">
            كلمة المرور الحالية
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            className="form-input"
            required
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="form-label">
            كلمة المرور الجديدة
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            className="form-input"
            required
          />
          <p className="text-xs text-ink-mute mt-1">8 أحرف على الأقل</p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="form-label">
            تأكيد كلمة المرور الجديدة
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

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isPending}
        >
          {isPending ? "جارٍ التغيير..." : "تغيير كلمة المرور"}
        </button>
      </form>
    </div>
  );
}
