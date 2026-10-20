"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  submitJobForReviewAction,
  setJobPausedAction,
  closeJobAction,
  type EmployerActionState,
} from "@/server/actions/employer";

const initialState: EmployerActionState = {};

type JobActionsProps = {
  jobId: string;
  canSubmit: boolean;
  canPause: boolean;
  canResume: boolean;
  canClose: boolean;
  canEdit: boolean;
};

export default function JobActions({
  jobId,
  canSubmit,
  canPause,
  canResume,
  canClose,
  canEdit,
}: JobActionsProps) {
  const [submitState, submitAction, submitPending] = useActionState(
    submitJobForReviewAction.bind(null, jobId),
    initialState
  );
  const [pauseState, pauseAction, pausePending] = useActionState(
    setJobPausedAction.bind(null, jobId, true),
    initialState
  );
  const [resumeState, resumeAction, resumePending] = useActionState(
    setJobPausedAction.bind(null, jobId, false),
    initialState
  );
  const [closeState, closeAction, closePending] = useActionState(
    closeJobAction.bind(null, jobId),
    initialState
  );

  const error =
    submitState.error ??
    pauseState.error ??
    resumeState.error ??
    closeState.error;

  return (
    <div>
      {error && <div className="alert alert-error mb-3 text-sm">{error}</div>}
      <div className="flex flex-wrap items-center gap-2">
        {canSubmit && (
          <form action={submitAction}>
            <button
              type="submit"
              className="btn btn-secondary"
              disabled={submitPending}
            >
              {submitPending ? "جارٍ الإرسال..." : "إرسال للمراجعة"}
            </button>
          </form>
        )}
        {canPause && (
          <form action={pauseAction}>
            <button
              type="submit"
              className="btn btn-secondary"
              disabled={pausePending}
            >
              {pausePending ? "جارٍ الإيقاف..." : "إيقاف"}
            </button>
          </form>
        )}
        {canResume && (
          <form action={resumeAction}>
            <button
              type="submit"
              className="btn btn-secondary"
              disabled={resumePending}
            >
              {resumePending ? "جارٍ الاستئناف..." : "استئناف"}
            </button>
          </form>
        )}
        {canEdit && (
          <Link href={`/employer/jobs/${jobId}`} className="btn btn-secondary">
            تعديل
          </Link>
        )}
        <Link
          href={`/employer/jobs/${jobId}/applications`}
          className="btn btn-secondary"
        >
          الطلبات
        </Link>
        {canClose && (
          <form
            action={closeAction}
            onSubmit={(e) => {
              if (!confirm("هل أنت متأكد من إغلاق هذه الوظيفة؟ لن يمكن استقبال طلبات جديدة عليها.")) {
                e.preventDefault();
              }
            }}
          >
            <button
              type="submit"
              className="btn btn-secondary"
              disabled={closePending}
            >
              {closePending ? "جارٍ الإغلاق..." : "إغلاق"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
