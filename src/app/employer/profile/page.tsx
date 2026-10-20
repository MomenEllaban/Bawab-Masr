import type { Metadata } from "next";
import { requireAuth } from "@/lib/permissions";
import { prisma } from "@/lib/db/prisma";
import PageHeader from "@/components/ui/page-header";
import StatusBadge from "@/components/ui/status-badge";
import EmployerOnboardingCard from "@/components/employer/onboarding-card";
import EmployerProfileForm from "@/components/forms/employer-profile-form";
import { EMPLOYER_TYPE_LABELS, formatDateAr } from "@/lib/labels";

export const metadata: Metadata = {
  title: "الملف الشخصي — بواب مصر",
};

export default async function EmployerProfilePage() {
  const user = await requireAuth();

  const profile = await prisma.employerProfile.findUnique({
    where: { userId: user.id },
    select: {
      id: true,
      displayName: true,
      employerType: true,
      isVerified: true,
      createdAt: true,
    },
  });

  if (!profile) {
    return <EmployerOnboardingCard />;
  }

  return (
    <>
      <PageHeader
        eyebrow="حسابك لدى بواب مصر"
        title="الملف الشخصي"
        description={`عضو منذ ${formatDateAr(profile.createdAt)}`}
        badge={
          <StatusBadge
            label={profile.isVerified ? "موثّق" : "غير موثّق"}
            variant={profile.isVerified ? "badge-published" : "badge-draft"}
            dot
          />
        }
      />

      <div className="card mb-6 max-w-lg">
        <dl className="space-y-3 text-sm">
          <div className="flex gap-2">
            <dt className="text-ink-mute">الاسم الظاهر:</dt>
            <dd className="font-semibold">{profile.displayName}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-ink-mute">نوع صاحب العقار:</dt>
            <dd className="font-semibold">
              {EMPLOYER_TYPE_LABELS[profile.employerType]}
            </dd>
          </div>
        </dl>
      </div>

      <p className="lede mb-4 max-w-2xl">
        عدّل بيانات ملفك التي تظهر للباحثين عن عمل داخل إعلاناتك.
      </p>

      <EmployerProfileForm
        profile={{
          displayName: profile.displayName,
          employerType: profile.employerType,
        }}
      />
    </>
  );
}
