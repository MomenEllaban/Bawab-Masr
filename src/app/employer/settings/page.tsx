import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { requireAuth } from "@/lib/permissions";
import { prisma } from "@/lib/db/prisma";
import PageHeader from "@/components/ui/page-header";
import EmployerOnboardingCard from "@/components/employer/onboarding-card";
import ChangePasswordForm from "@/components/forms/change-password-form";

export const metadata: Metadata = {
  title: "الأمان — بواب مصر",
};

export default async function EmployerSettingsPage() {
  const user = await requireAuth();

  const profile = await prisma.employerProfile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!profile) {
    return <EmployerOnboardingCard />;
  }

  return (
    <>
      <PageHeader
        title="الأمان"
        description="إدارة كلمة المرور الخاصة بحسابك"
      />

      <div className="alert alert-info mb-6 max-w-2xl">
        <ShieldCheck size={18} aria-hidden />
        <p>
          اختر كلمة مرور قوية لا تستخدمها في خدمات أخرى، ولا تشاركها مع أي
          شخص — إعلاناتك وطلباتك مرتبطة بحسابك.
        </p>
      </div>

      <ChangePasswordForm />
    </>
  );
}
