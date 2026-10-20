"use client";

import { useActionState, useState } from "react";
import { X } from "lucide-react";
import {
  rejectJobAction,
  type AdminActionState,
} from "@/server/actions/admin";

const initialState: AdminActionState = {};

export default function RejectForm({ jobId }: { jobId: string }) {
  const [state, formAction, isPending] = useActionState(
    rejectJobAction,
    initialState
  );
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn btn-danger btn-sm"
        >
          <X size={16} aria-hidden />
          رفض
        </button>
        {state.error && (
          <span className="alert alert-error text-xs py-1 px-2">
            {state.error}
          </span>
        )}
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-2 space-y-2">
      <input type="hidden" name="jobId" value={jobId} />
      <label htmlFor={`reject-reason-${jobId}`} className="form-label">
        سبب الرفض (5 أحرف على الأقل)
      </label>
      <textarea
        id={`reject-reason-${jobId}`}
        name="reason"
        rows={2}
        minLength={5}
        maxLength={1000}
        required
        className="form-input"
        placeholder="اكتب سبب الرفض ليصل إلى صاحب الوظيفة"
      />
      {state.error && (
        <div className="alert alert-error text-xs">{state.error}</div>
      )}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="btn btn-danger btn-sm"
          disabled={isPending}
        >
          <X size={16} aria-hidden />
          {isPending ? "جارٍ الرفض..." : "تأكيد الرفض"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="btn btn-secondary btn-sm"
          disabled={isPending}
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}
