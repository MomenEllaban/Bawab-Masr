"use client";

/**
 * components/forms/seeker-profile-form.tsx
 * نموذج تعديل ملف الباحث — نبذة، خبرة، دوام مفضل، راتب متوقع، مهارات
 */

import { useActionState } from "react";
import type { SeekerAvailability, WorkType } from "@prisma/client";
import { AVAILABILITY_LABELS, WORK_TYPE_LABELS } from "@/lib/labels";
import {
  updateSeekerProfileAction,
  type SeekerActionState,
} from "@/server/actions/seeker";
import { SEEKER_AVAILABILITIES, WORK_TYPES } from "@/lib/validation/seeker";

const initialState: SeekerActionState = {};

export type SeekerProfileValues = {
  bio: string | null;
  yearsExperience: number | null;
  preferredWorkType: WorkType | null;
  availability: SeekerAvailability;
  expectedSalaryMin: number | null;
  expectedSalaryMax: number | null;
  isProfilePublic: boolean;
  skills: string[];
};

export default function SeekerProfileForm({
  profile,
}: {
  profile: SeekerProfileValues;
}) {
  const [state, formAction, isPending] = useActionState(
    updateSeekerProfileAction,
    initialState
  );

  return (
    <div className="card max-w-2xl">
      <h2 className="text-xl font-bold mb-4">تعديل ملف الباحث</h2>

      {state.error && (
        <div className="alert alert-error mb-4">{state.error}</div>
      )}
      {state.success && (
        <div className="alert alert-success mb-4">{state.success}</div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="bio" className="form-label">
            نبذة عنك
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            maxLength={1000}
            className="form-input"
            placeholder="عرّف بنفسك وخبراتك باختصار"
            defaultValue={profile.bio ?? ""}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="yearsExperience" className="form-label">
              سنوات الخبرة
            </label>
            <input
              id="yearsExperience"
              name="yearsExperience"
              type="number"
              min={0}
              max={50}
              inputMode="numeric"
              className="form-input"
              defaultValue={profile.yearsExperience ?? ""}
            />
          </div>

          <div>
            <label htmlFor="preferredWorkType" className="form-label">
              نوع الدوام المفضل
            </label>
            <select
              id="preferredWorkType"
              name="preferredWorkType"
              className="form-input"
              defaultValue={profile.preferredWorkType ?? ""}
            >
              <option value="">غير محدد</option>
              {WORK_TYPES.map((workType) => (
                <option key={workType} value={workType}>
                  {WORK_TYPE_LABELS[workType]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="availability" className="form-label">
            مدى جاهزيتك للعمل
          </label>
          <select
            id="availability"
            name="availability"
            className="form-input"
            defaultValue={profile.availability}
            required
          >
            {SEEKER_AVAILABILITIES.map((availability) => (
              <option key={availability} value={availability}>
                {AVAILABILITY_LABELS[availability]}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="expectedSalaryMin" className="form-label">
              الراتب المتوقع (الحد الأدنى) — ج.م
            </label>
            <input
              id="expectedSalaryMin"
              name="expectedSalaryMin"
              type="number"
              min={0}
              inputMode="numeric"
              className="form-input"
              defaultValue={profile.expectedSalaryMin ?? ""}
            />
          </div>

          <div>
            <label htmlFor="expectedSalaryMax" className="form-label">
              الراتب المتوقع (الحد الأعلى) — ج.م
            </label>
            <input
              id="expectedSalaryMax"
              name="expectedSalaryMax"
              type="number"
              min={0}
              inputMode="numeric"
              className="form-input"
              defaultValue={profile.expectedSalaryMax ?? ""}
            />
          </div>
        </div>

        <div>
          <label htmlFor="skillsCsv" className="form-label">
            المهارات
          </label>
          <input
            id="skillsCsv"
            name="skillsCsv"
            type="text"
            className="form-input"
            placeholder="حراسة، مفاتيح إقفال، كاميرات مراقبة"
            defaultValue={profile.skills.join("، ")}
          />
          <p className="text-xs text-ink-mute mt-1">
            افصل بين المهارات بفاصلة (حد أقصى 20 مهارة)
          </p>
        </div>

        <div>
          <label
            htmlFor="isProfilePublic"
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              id="isProfilePublic"
              name="isProfilePublic"
              type="checkbox"
              className="h-4 w-4"
              defaultChecked={profile.isProfilePublic}
            />
            <span className="text-sm font-semibold">
              إظهار ملفي لأصحاب العقارات
            </span>
          </label>
          <p className="text-xs text-ink-mute mt-1">
            عند إخفائه لن يظهر ملفك لأصحاب العقارات
          </p>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full justify-center"
          disabled={isPending}
        >
          {isPending ? "جارٍ الحفظ..." : "حفظ الملف الشخصي"}
        </button>
      </form>
    </div>
  );
}
