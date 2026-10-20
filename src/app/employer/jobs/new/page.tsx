import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { requireAuth } from "@/lib/permissions";
import { prisma } from "@/lib/db/prisma";
import PageHeader from "@/components/ui/page-header";
import EmployerOnboardingCard from "@/components/employer/onboarding-card";
import EmployerJobForm from "@/components/forms/employer-job-form";

export const metadata: Metadata = {
  title: "إضافة وظيفة — بواب مصر",
};

export default async function NewJobPage() {
  const user = await requireAuth();

  const profile = await prisma.employerProfile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!profile) {
    return <EmployerOnboardingCard />;
  }

  const [provinces, areas, properties] = await Promise.all([
    prisma.province.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.area.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, provinceId: true },
    }),
    prisma.property.findMany({
      where: { ownerId: profile.id, isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <>
      <PageHeader
        title="إضافة وظيفة جديدة"
        description="املأ بيانات الوظيفة بدقة — كلما كانت التفاصيل أوضح وصل الإعلان إلى بحثين عن عمل أنسب."
        actions={
          <Link href="/employer/jobs" className="btn btn-secondary">
            <ArrowRight size={16} aria-hidden />
            عرض وظائفي
          </Link>
        }
      />

      <p className="lede mb-6 max-w-2xl">
        يمكنك حفظ الوظيفة كمسودة والعودة لاحقاً، أو إرسالها مباشرة للمراجعة
        قبل نشرها للباحثين عن عمل.
      </p>

      <EmployerJobForm
        provinces={provinces}
        areas={areas}
        properties={properties}
      />
    </>
  );
}
