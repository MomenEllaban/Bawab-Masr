/**
 * app/seeker/settings/page.tsx
 * إعدادات الأمان — بيانات الحساب وتغيير كلمة المرور
 */

import type { Metadata } from "next";
import { ShieldCheck, UserRound } from "lucide-react";
import { requireAuth } from "@/lib/permissions";
import PageHeader from "@/components/ui/page-header";
import StatusBadge from "@/components/ui/status-badge";
import ChangePasswordForm from "@/components/forms/change-password-form";

export const metadata: Metadata = {
  title: "الأمان — بواب مصر",
};

export default async function SeekerSettingsPage() {
  const user = await requireAuth();

  return (
    <div>
      <PageHeader
        title="الأمان والحساب"
        description="راجع بيانات حسابك وغيّر كلمة المرور للحفاظ على أمان حسابك."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div className="min-w-0">
          <ChangePasswordForm />
        </div>

        <aside className="card p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-50 text-navy">
              <UserRound size={15} aria-hidden />
            </span>
            بيانات الحساب
          </h2>

          <dl className="mt-4 space-y-3.5 text-sm">
            <div>
              <dt className="text-ink-mute">الاسم</dt>
              <dd className="mt-0.5 font-semibold">{user.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-ink-mute">رقم الهاتف</dt>
              <dd
                dir="ltr"
                className="mt-0.5 text-start font-semibold"
              >
                {user.phone}
              </dd>
            </div>
            <div>
              <dt className="text-ink-mute">حالة تحقق الهاتف</dt>
              <dd className="mt-1.5">
                <StatusBadge
                  label={
                    user.isPhoneVerified ? "رقمك موثّق" : "رقمك غير موثّق"
                  }
                  variant={
                    user.isPhoneVerified ? "badge-success" : "badge-warning"
                  }
                  dot
                />
              </dd>
            </div>
          </dl>

          <div className="mt-5 flex items-start gap-2 rounded-soft bg-muted px-3 py-2.5 text-xs leading-relaxed text-ink-soft">
            <ShieldCheck
              size={15}
              className="mt-px shrink-0 text-emerald-700"
              aria-hidden
            />
            <span>
              لا تشارك كلمة المرور مع أي شخص، ولن نطلبها منك عبر الهاتف أو
              الرسائل إطلاقاً.
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}
