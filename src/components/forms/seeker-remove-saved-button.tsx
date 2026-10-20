"use client";

/**
 * components/forms/seeker-remove-saved-button.tsx
 * زر إزالة وظيفة من قائمة المحفوظات
 */

import { useActionState } from "react";
import {
  removeSavedJobAction,
  type SeekerActionState,
} from "@/server/actions/seeker";

const initialState: SeekerActionState = {};

export default function SeekerRemoveSavedButton({
  jobId,
}: {
  jobId: string;
}) {
  const [state, formAction, isPending] = useActionState(
    removeSavedJobAction.bind(null, jobId),
    initialState
  );

  return (
    <form action={formAction} className="mt-4">
      {state.error && (
        <div className="alert alert-error mb-3 text-sm">{state.error}</div>
      )}
      <button
        type="submit"
        className="btn btn-secondary"
        disabled={isPending}
      >
        {isPending ? "جارٍ الإزالة..." : "إزالة من المحفوظات"}
      </button>
    </form>
  );
}
