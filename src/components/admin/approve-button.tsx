"use client";

import { useActionState, useState } from "react";
import { Check } from "lucide-react";
import {
  approveJobAction,
  type AdminActionState,
} from "@/server/actions/admin";

const initialState: AdminActionState = {};

export default function ApproveButton({ jobId }: { jobId: string }) {
  const [state, formAction, isPending] = useActionState(
    approveJobAction,
    initialState
  );
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="btn btn-primary btn-sm"
        >
          <Check size={16} aria-hidden />
          موافقة
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
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="jobId" value={jobId} />
      <span className="text-xs text-ink-soft">متأكد من نشر الوظيفة؟</span>
      <button
        type="submit"
        className="btn btn-primary btn-sm"
        disabled={isPending}
      >
        <Check size={16} aria-hidden />
        {isPending ? "جارٍ..." : "نعم، انشر"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="btn btn-secondary btn-sm"
        disabled={isPending}
      >
        تراجع
      </button>
      {state.error && (
        <span className="alert alert-error text-xs py-1 px-2">
          {state.error}
        </span>
      )}
    </form>
  );
}
