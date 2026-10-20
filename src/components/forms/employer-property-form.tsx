"use client";

import { useActionState, useMemo } from "react";
import {
  createPropertyAction,
  type EmployerActionState,
} from "@/server/actions/employer";

const initialState: EmployerActionState = {};

type AreaOption = {
  id: string;
  name: string;
  provinceName: string;
};

export default function EmployerPropertyForm({
  areas,
}: {
  areas: AreaOption[];
}) {
  const [state, formAction, isPending] = useActionState(
    createPropertyAction,
    initialState
  );

  const groupedAreas = useMemo(() => {
    const groups = new Map<string, AreaOption[]>();
    for (const area of areas) {
      const list = groups.get(area.provinceName) ?? [];
      list.push(area);
      groups.set(area.provinceName, list);
    }
    return Array.from(groups.entries()).sort((a, b) =>
      a[0].localeCompare(b[0], "ar")
    );
  }, [areas]);

  return (
    <div className="card max-w-lg">
      <h2 className="text-xl font-bold mb-4">إضافة عقار جديد</h2>

      {state.error && <div className="alert alert-error mb-4">{state.error}</div>}
      {state.success && (
        <div className="alert alert-success mb-4">{state.success}</div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="property-name" className="form-label">
            اسم العقار
          </label>
          <input
            id="property-name"
            name="name"
            type="text"
            className="form-input"
            minLength={2}
            maxLength={150}
            placeholder="مثال: فيلا السلام"
            required
          />
        </div>

        <div>
          <label htmlFor="property-description" className="form-label">
            وصف العقار (اختياري)
          </label>
          <textarea
            id="property-description"
            name="description"
            rows={3}
            className="form-input"
            maxLength={1000}
            placeholder="وصف مختصر للعقار وموقعه"
          />
        </div>

        <div>
          <label htmlFor="property-area" className="form-label">
            المنطقة
          </label>
          <select
            id="property-area"
            name="areaId"
            className="form-input"
            required
          >
            <option value="" disabled>
              اختر المنطقة
            </option>
            {groupedAreas.map(([provinceName, provinceAreas]) => (
              <optgroup key={provinceName} label={provinceName}>
                {provinceAreas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="property-notes" className="form-label">
            ملاحظات داخلية (اختياري)
          </label>
          <textarea
            id="property-notes"
            name="privateNotes"
            rows={2}
            className="form-input"
            maxLength={1000}
            placeholder="ملاحظات خاصة بك فقط"
          />
          <p className="text-xs text-ink-mute mt-1">
            ملاحظات داخلية لا تظهر للعامة
          </p>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isPending}
        >
          {isPending ? "جارٍ الإضافة..." : "إضافة العقار"}
        </button>
      </form>
    </div>
  );
}
