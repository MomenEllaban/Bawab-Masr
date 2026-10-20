"use client";

import { useActionState, useState } from "react";
import { Plus } from "lucide-react";
import {
  grantRoleAction,
  revokeRoleAction,
  type AdminActionState,
} from "@/server/actions/admin";
import { SYSTEM_ROLE_LABELS } from "@/components/admin/constants";

const initialState: AdminActionState = {};

const ALL_ROLES = [
  "ADMIN",
  "MODERATOR",
  "CUSTOMER_SUPPORT",
  "FINANCE",
] as const;

function RevokeRoleButton({
  userId,
  roleName,
}: {
  userId: string;
  roleName: string;
}) {
  const [state, formAction, isPending] = useActionState(
    revokeRoleAction,
    initialState
  );
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="btn btn-secondary btn-sm"
        >
          سحب
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
      <input type="hidden" name="roleName" value={roleName} />
      <span className="text-xs text-ink-soft">
        سحب دور {SYSTEM_ROLE_LABELS[roleName] ?? roleName}؟
      </span>
      <button
        type="submit"
        className="btn btn-primary btn-sm"
        disabled={isPending}
      >
        {isPending ? "..." : "نعم"}
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

export default function RoleManager({
  userId,
  grantedRoles,
}: {
  userId: string;
  grantedRoles: string[];
}) {
  const [state, formAction, isPending] = useActionState(
    grantRoleAction,
    initialState
  );
  const available = ALL_ROLES.filter((r) => !grantedRoles.includes(r));

  return (
    <div className="mt-3 border-t border-line pt-3">
      <p className="mb-2 text-xs font-bold text-ink-soft">الصلاحيات</p>

      {grantedRoles.length > 0 ? (
        <div className="mb-2 flex flex-col gap-2">
          {grantedRoles.map((role) => (
            <div key={role} className="flex flex-wrap items-center gap-2">
              <span className="badge badge-brand">
                {SYSTEM_ROLE_LABELS[role] ?? role}
              </span>
              <RevokeRoleButton userId={userId} roleName={role} />
            </div>
          ))}
        </div>
      ) : (
        <p className="mb-2 text-xs text-ink-mute">لا توجد صلاحيات إدارية</p>
      )}

      {available.length > 0 && (
        <form
          action={formAction}
          className="flex flex-wrap items-center gap-2"
        >
          <input type="hidden" name="userId" value={userId} />
          <select
            name="roleName"
            className="form-input text-xs w-auto"
            defaultValue={available[0]}
          >
            {available.map((role) => (
              <option key={role} value={role}>
                {SYSTEM_ROLE_LABELS[role] ?? role}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="btn btn-secondary btn-sm"
            disabled={isPending}
          >
            <Plus size={16} aria-hidden />
            {isPending ? "جارٍ..." : "منح دور"}
          </button>
          {state.error && (
            <span className="alert alert-error text-xs py-1 px-2">
              {state.error}
            </span>
          )}
          {state.success && (
            <span className="alert alert-success text-xs py-1 px-2">
              {state.success}
            </span>
          )}
        </form>
      )}
    </div>
  );
}
