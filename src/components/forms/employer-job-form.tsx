"use client";

import { useActionState, useState } from "react";
import {
  createJobAction,
  updateJobAction,
  type EmployerActionState,
} from "@/server/actions/employer";
import {
  WORK_TYPE_LABELS,
  WORK_SCHEDULE_LABELS,
  SALARY_PERIOD_LABELS,
} from "@/lib/labels";

const initialState: EmployerActionState = {};

type ProvinceOption = { id: string; name: string };
type AreaOption = { id: string; name: string; provinceId: string };
type PropertyOption = { id: string; name: string };

export type JobFormValues = {
  title?: string;
  description?: string;
  responsibilities?: string | null;
  requirements?: string | null;
  workType?: string;
  workSchedule?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryPeriod?: string;
  isSalaryPublic?: boolean;
  experienceYears?: number | null;
  housingProvided?: boolean;
  provinceId?: string | null;
  areaId?: string | null;
  propertyId?: string | null;
  applicationDeadline?: string | null;
};

type EmployerJobFormProps = {
  provinces: ProvinceOption[];
  areas: AreaOption[];
  properties: PropertyOption[];
  mode?: "create" | "edit";
  jobId?: string;
  initialValues?: JobFormValues;
};

export default function EmployerJobForm({
  provinces,
  areas,
  properties,
  mode = "create",
  jobId,
  initialValues,
}: EmployerJobFormProps) {
  const boundAction =
    mode === "edit" && jobId
      ? updateJobAction.bind(null, jobId)
      : createJobAction;
  const [state, formAction, isPending] = useActionState(
    boundAction,
    initialState
  );
  const [provinceId, setProvinceId] = useState(initialValues?.provinceId ?? "");

  const filteredAreas = provinceId
    ? areas.filter((area) => area.provinceId === provinceId)
    : areas;

  return (
    <div className="card max-w-2xl">
      <h2 className="text-xl font-bold mb-4">
        {mode === "edit" ? "تعديل بيانات الوظيفة" : "بيانات الوظيفة"}
      </h2>

      {state.error && <div className="alert alert-error mb-4">{state.error}</div>}
      {state.success && (
        <div className="alert alert-success mb-4">{state.success}</div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="title" className="form-label">
            عنوان الوظيفة
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className="form-input"
            minLength={5}
            maxLength={150}
            placeholder="مثال: حارس أمن لفيلا سكنية"
            defaultValue={initialValues?.title ?? ""}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="form-label">
            وصف الوظيفة
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            className="form-input"
            minLength={20}
            maxLength={5000}
            placeholder="اشرح طبيعة العمل والمهام المطلوبة"
            defaultValue={initialValues?.description ?? ""}
            required
          />
        </div>

        <div>
          <label htmlFor="responsibilities" className="form-label">
            المهام (اختياري)
          </label>
          <textarea
            id="responsibilities"
            name="responsibilities"
            rows={3}
            className="form-input"
            maxLength={3000}
            placeholder="مثال: حراسة المدخل الرئيسي، تسجيل الزوار"
            defaultValue={initialValues?.responsibilities ?? ""}
          />
        </div>

        <div>
          <label htmlFor="requirements" className="form-label">
            المتطلبات (اختياري)
          </label>
          <textarea
            id="requirements"
            name="requirements"
            rows={3}
            className="form-input"
            maxLength={3000}
            placeholder="مثال: خبرة سنتين، بطاقة رقم قومي سارية"
            defaultValue={initialValues?.requirements ?? ""}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="workType" className="form-label">
              نوع الدوام
            </label>
            <select
              id="workType"
              name="workType"
              className="form-input"
              defaultValue={initialValues?.workType ?? ""}
              required
            >
              <option value="" disabled>
                اختر نوع الدوام
              </option>
              {Object.entries(WORK_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="workSchedule" className="form-label">
              موعد الدوام (اختياري)
            </label>
            <select
              id="workSchedule"
              name="workSchedule"
              className="form-input"
              defaultValue={initialValues?.workSchedule ?? ""}
            >
              <option value="">غير محدد</option>
              {Object.entries(WORK_SCHEDULE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="salaryMin" className="form-label">
              الحد الأدنى للراتب (ج.م)
            </label>
            <input
              id="salaryMin"
              name="salaryMin"
              type="number"
              inputMode="numeric"
              min={0}
              className="form-input"
              dir="ltr"
              defaultValue={initialValues?.salaryMin ?? ""}
            />
          </div>

          <div>
            <label htmlFor="salaryMax" className="form-label">
              الحد الأعلى للراتب (ج.م)
            </label>
            <input
              id="salaryMax"
              name="salaryMax"
              type="number"
              inputMode="numeric"
              min={0}
              className="form-input"
              dir="ltr"
              defaultValue={initialValues?.salaryMax ?? ""}
            />
          </div>

          <div>
            <label htmlFor="salaryPeriod" className="form-label">
              فترة الراتب
            </label>
            <select
              id="salaryPeriod"
              name="salaryPeriod"
              className="form-input"
              defaultValue={initialValues?.salaryPeriod ?? "MONTHLY"}
            >
              {Object.entries(SALARY_PERIOD_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isSalaryPublic"
            defaultChecked={initialValues?.isSalaryPublic ?? true}
            className="size-4"
          />
          <span className="text-sm">إظهار الراتب للعامة</span>
        </label>
        <p className="text-xs text-ink-mute -mt-2">
          إخفاء الراتب يزيد التقييم لكن قد يقلل عدد الطلبات
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="experienceYears" className="form-label">
              سنوات الخبرة المطلوبة (اختياري)
            </label>
            <input
              id="experienceYears"
              name="experienceYears"
              type="number"
              inputMode="numeric"
              min={0}
              max={50}
              className="form-input"
              dir="ltr"
              defaultValue={initialValues?.experienceYears ?? ""}
            />
          </div>

          <div>
            <label htmlFor="applicationDeadline" className="form-label">
              آخر موعد لتقديم الطلبات (اختياري)
            </label>
            <input
              id="applicationDeadline"
              name="applicationDeadline"
              type="date"
              className="form-input"
              dir="ltr"
              defaultValue={initialValues?.applicationDeadline ?? ""}
            />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="housingProvided"
            defaultChecked={initialValues?.housingProvided ?? false}
            className="size-4"
          />
          <span className="text-sm">توفير سكن للعامل</span>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="provinceId" className="form-label">
              المحافظة (اختياري)
            </label>
            <select
              id="provinceId"
              name="provinceId"
              className="form-input"
              value={provinceId}
              onChange={(e) => setProvinceId(e.target.value)}
            >
              <option value="">غير محدد</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="areaId" className="form-label">
              المنطقة (اختياري)
            </label>
            <select
              id="areaId"
              name="areaId"
              className="form-input"
              defaultValue={initialValues?.areaId ?? ""}
            >
              <option value="">غير محدد</option>
              {filteredAreas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {mode === "create" && properties.length > 0 && (
          <div>
            <label htmlFor="propertyId" className="form-label">
              العقار (اختياري)
            </label>
            <select
              id="propertyId"
              name="propertyId"
              className="form-input"
              defaultValue={initialValues?.propertyId ?? ""}
            >
              <option value="">بدون ربط بعقار</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {mode === "create" ? (
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              name="intent"
              value="draft"
              className="btn btn-secondary"
              disabled={isPending}
            >
              {isPending ? "جارٍ الحفظ..." : "حفظ كمسودة"}
            </button>
            <button
              type="submit"
              name="intent"
              value="submit"
              className="btn btn-primary"
              disabled={isPending}
            >
              {isPending ? "جارٍ الإرسال..." : "إرسال للمراجعة"}
            </button>
          </div>
        ) : (
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isPending}
          >
            {isPending ? "جارٍ الحفظ..." : "حفظ التعديلات"}
          </button>
        )}
      </form>
    </div>
  );
}
