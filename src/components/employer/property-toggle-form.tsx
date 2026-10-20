"use client";

import { useActionState } from "react";
import {
  setPropertyActiveAction,
  type EmployerActionState,
} from "@/server/actions/employer";

const initialState: EmployerActionState = {};

type PropertyToggleFormProps = {
  propertyId: string;
  isActive: boolean;
};

export default function PropertyToggleForm({
  propertyId,
  isActive,
}: PropertyToggleFormProps) {
  const [state, formAction, isPending] = useActionState(
    setPropertyActiveAction.bind(null, propertyId, !isActive),
    initialState
  );

  return (
    <form action={formAction}>
      {state.error && (
        <div className="alert alert-error text-sm mb-2">{state.error}</div>
      )}
      {state.success && (
        <div className="alert alert-success text-sm mb-2">{state.success}</div>
      )}
      <button type="submit" className="btn btn-secondary" disabled={isPending}>
        {isPending
          ? "جارٍ التحديث..."
          : isActive
            ? "إيقاف العرض"
            : "تفعيل العرض"}
      </button>
    </form>
  );
}
