"use client";

import { useActionState, useState } from "react";
import {
  resolveReportAction,
  dismissReportAction,
  type AdminActionState,
} from "@/server/actions/admin";

const initialState: AdminActionState = {};

type ReportActionButtonProps = {
  reportId: string;
  resolution: "RESOLVED" | "DISMISSED";
  label: string;
  confirmLabel: string;
  variant: "btn-primary" | "btn-secondary";
};

export default function ReportActionButton({
  reportId,
  resolution,
  label,
  confirmLabel,
  variant,
}: ReportActionButtonProps) {
  const action =
    resolution === "RESOLVED" ? resolveReportAction : dismissReportAction;
  const [state, formAction, isPending] = useActionState(
    action,
    initialState
  );
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className={`btn ${variant} btn-sm`}
        >
          {label}
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
      <input type="hidden" name="reportId" value={reportId} />
      <span className="text-xs text-ink-soft">{confirmLabel}</span>
      <button
        type="submit"
        className={`btn ${variant} btn-sm`}
        disabled={isPending}
      >
        {isPending ? "جارٍ..." : "نعم"}
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
