"use client";

import { useActionState, useState } from "react";
import {
  setUserStatusAction,
  type AdminActionState,
} from "@/server/actions/admin";

const initialState: AdminActionState = {};

type UserStatus = "ACTIVE" | "SUSPENDED" | "DEACTIVATED";

const STATUS_ACTIONS: { status: UserStatus; label: string; variant: string }[] =
  [
    { status: "SUSPENDED", label: "إيقاف", variant: "btn-danger" },
    { status: "ACTIVE", label: "تفعيل", variant: "btn-primary" },
    { status: "DEACTIVATED", label: "إلغاء التفعيل", variant: "btn-secondary" },
  ];

function StatusAction({
  userId,
  status,
  label,
  variant,
  currentStatus,
}: {
  userId: string;
  status: UserStatus;
  label: string;
  variant: string;
  currentStatus: string;
}) {
  const [state, formAction, isPending] = useActionState(
    setUserStatusAction,
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
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="status" value={status} />
      <span className="text-xs text-ink-soft">
        تأكيد {label}؟ (الحالة الحالية: {currentStatus})
      </span>
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

export default function UserStatusActions({
  userId,
  currentStatus,
  statusLabel,
}: {
  userId: string;
  currentStatus: string;
  statusLabel: string;
}) {
  const options = STATUS_ACTIONS.filter((a) => a.status !== currentStatus);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((a) => (
        <StatusAction
          key={a.status}
          userId={userId}
          status={a.status}
          label={a.label}
          variant={a.variant}
          currentStatus={statusLabel}
        />
      ))}
    </div>
  );
}
