"use client";

import { useActionState } from "react";
import { Flag } from "lucide-react";
import { reportAction, type ActionState } from "@/server/actions/applications";
import { REPORT_REASONS } from "@/lib/validation/applications";

const initialState: ActionState = {};

export default function ReportJobForm({ jobId }: { jobId: string }) {
  const [state, formAction, isPending] = useActionState(
    reportAction.bind(null, jobId),
    initialState
  );

  if (state.success) {
    return <div className="alert alert-success">{state.success}</div>;
  }

  return (
    <details className="card">
      <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink-soft">
        <Flag size={14} aria-hidden />
        الإبلاغ عن الوظيفة
      </summary>
      <form action={formAction} className="space-y-4 mt-4">
        {state.error && <div className="alert alert-error">{state.error}</div>}

        <div>
          <label htmlFor="report-reason" className="form-label">
            سبب البلاغ
          </label>
          <select
            id="report-reason"
            name="reason"
            className="form-input"
            defaultValue=""
            required
          >
            <option value="" disabled>
              اختر سبب البلاغ
            </option>
            {REPORT_REASONS.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="report-details" className="form-label">
            تفاصيل إضافية (اختياري)
          </label>
          <textarea
            id="report-details"
            name="details"
            maxLength={1000}
            rows={3}
            className="form-input"
            placeholder="صف المشكلة إن أمكن..."
          />
        </div>

        <button
          type="submit"
          className={`btn btn-secondary btn-block${isPending ? " is-loading" : ""}`}
          disabled={isPending}
        >
          إرسال البلاغ
        </button>
      </form>
    </details>
  );
}
