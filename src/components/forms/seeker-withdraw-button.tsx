"use client";

/**
 * components/forms/seeker-withdraw-button.tsx
 * زر سحب طلب التقديم — يظهر فقط للحالات التي يسمح فيها بالسحب
 */

import { useActionState } from "react";
import {
  withdrawAction,
  type ActionState,
} from "@/server/actions/applications";

const initialState: ActionState = {};

export default function SeekerWithdrawButton({
  applicationId,
}: {
  applicationId: string;
}) {
  const [state, formAction, isPending] = useActionState(
    withdrawAction.bind(null, applicationId),
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
        {isPending ? "جارٍ السحب..." : "سحب الطلب"}
      </button>
    </form>
  );
}
