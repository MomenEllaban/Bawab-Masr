"use client";

import { useActionState, useState } from "react";
import {
  changeApplicationStatusAction,
  type EmployerActionState,
} from "@/server/actions/employer";
import { APPLICATION_STATUS_LABELS } from "@/lib/labels";

const initialState: EmployerActionState = {};

const TARGET_STATUSES = [
  "VIEWED",
  "SHORTLISTED",
  "INTERVIEW_SCHEDULED",
  "OFFERED",
  "HIRED",
  "REJECTED",
] as const;

const TERMINAL_STATUSES = ["HIRED", "REJECTED", "WITHDRAWN"];

type StatusChangeFormProps = {
  applicationId: string;
  currentStatus: string;
};

export default function StatusChangeForm({
  applicationId,
  currentStatus,
}: StatusChangeFormProps) {
  const [state, formAction, isPending] = useActionState(
    changeApplicationStatusAction.bind(null, applicationId),
    initialState
  );
  const [open, setOpen] = useState(false);

  if (TERMINAL_STATUSES.includes(currentStatus)) {
    return null;
  }

  const targets = TARGET_STATUSES.filter((status) => status !== currentStatus);

  return (
    <div className="mt-3">
      {!open ? (
        <button
          type="button"
          className="btn btn-secondary text-sm"
          onClick={() => setOpen(true)}
        >
          تحديث الحالة
        </button>
      ) : (
        <form action={formAction} className="rounded-lg border border-line p-4 space-y-3 bg-muted/40">
          {state.error && (
            <div className="alert alert-error text-sm">{state.error}</div>
          )}
          {state.success && (
            <div className="alert alert-success text-sm">{state.success}</div>
          )}

          <div>
            <label htmlFor={`status-${applicationId}`} className="form-label">
              الحالة الجديدة
            </label>
            <select
              id={`status-${applicationId}`}
              name="targetStatus"
              className="form-input"
              defaultValue=""
              required
            >
              <option value="" disabled>
                اختر الحالة
              </option>
              {targets.map((status) => (
                <option key={status} value={status}>
                  {APPLICATION_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={`note-${applicationId}`} className="form-label">
              ملاحظة (اختياري)
            </label>
            <textarea
              id={`note-${applicationId}`}
              name="note"
              rows={2}
              maxLength={500}
              className="form-input"
              placeholder="مثال: سيتم التواصل معك خلال ٣ أيام"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isPending}
            >
              {isPending ? "جارٍ التحديث..." : "حفظ"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setOpen(false)}
            >
              إلغاء
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
