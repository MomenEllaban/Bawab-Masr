import Link from "next/link";
import {
  CheckCircle2,
  CircleAlert,
  Sparkles,
  ArrowLeft,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import {
  calculateSeekerCompleteness,
  type SeekerProfileData,
} from "@/lib/seeker-utils";

export default function ProfileCompletionCard({
  profile,
  showFullChecklist = true,
}: {
  profile?: SeekerProfileData | null;
  showFullChecklist?: boolean;
}) {
  const result = calculateSeekerCompleteness(profile);

  // إذا كان الحساب مكتملاً تماماً، نظهر شارة نجاح لطيفة وهادئة
  if (result.isComplete && !showFullChecklist) {
    return (
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-emerald-50/60 p-4 text-emerald-950">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
            <UserCheck size={20} aria-hidden />
          </span>
          <div>
            <h4 className="text-sm font-bold text-emerald-900">
              ملفك الشخصي مكتمل ومفعّل ({result.percentage}%)
            </h4>
            <p className="text-xs text-emerald-850 text-emerald-800">
              بياناتك تظهر لأصحاب العقارات واتحادات الملاك في ترشيحات الوظائف.
            </p>
          </div>
        </div>
        <Link
          href="/seeker/profile"
          className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline underline-offset-4"
        >
          تعديل الملف
        </Link>
      </div>
    );
  }

  const barColor =
    result.percentage >= 85
      ? "bg-emerald-600"
      : result.percentage >= 50
      ? "bg-amber-500"
      : "bg-rose-500";

  return (
    <div className="card mb-8 overflow-hidden border-2 border-amber-500/25 bg-surface p-5 shadow-sm sm:p-6">
      {/* رأس البطاقة والشارة */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700">
            <AlertTriangle size={20} aria-hidden />
          </span>
          <div>
            <h3 className="text-base font-extrabold text-ink">
              نسبة اكتمال ملفك الشخصي:{" "}
              <span className="font-mono text-lg font-black text-navy">
                {result.percentage}%
              </span>
            </h3>
            <p className="text-xs text-ink-soft">
              {result.isComplete
                ? "ممتاز! ملفك مكتمل وجاهز للظهور لأصحاب العقارات."
                : "تنبيه: ملفك غير مكتمل! أكمل بياناتك لتظهر في نتائج البحث والتوظيف."}
            </p>
          </div>
        </div>

        <Link
          href="/seeker/profile"
          className="btn btn-primary text-xs font-bold shrink-0 inline-flex items-center gap-1.5"
        >
          <span>استكمال بيانات الملف</span>
          <ArrowLeft size={14} aria-hidden />
        </Link>
      </div>

      {/* شريط التقدم البروجرس */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-bold text-ink-mute mb-1.5">
          <span>مستوى الجاهزية</span>
          <span>{result.statusLabel}</span>
        </div>
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-line/60">
          <div
            className={`h-full transition-all duration-700 rounded-full ${barColor}`}
            style={{ width: `${result.percentage}%` }}
          />
        </div>
      </div>

      {/* قائمة الحقول المطلوبة */}
      {showFullChecklist && (
        <div className="mt-5 border-t border-line/70 pt-4">
          <p className="mb-3 text-xs font-bold text-ink">
            ما تحتاجه للوصول إلى نسبة 100%:
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {result.items.map((item) => (
              <div
                key={item.key}
                className={`flex items-start gap-2.5 rounded-xl p-2.5 text-xs transition-colors ${
                  item.isComplete
                    ? "bg-emerald-50/50 text-emerald-900 border border-emerald-500/20"
                    : "bg-surface-muted text-ink-soft border border-line/60"
                }`}
              >
                {item.isComplete ? (
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0 text-emerald-600"
                    aria-hidden
                  />
                ) : (
                  <CircleAlert
                    size={16}
                    className="mt-0.5 shrink-0 text-amber-600"
                    aria-hidden
                  />
                )}
                <span className={item.isComplete ? "font-semibold" : ""}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
