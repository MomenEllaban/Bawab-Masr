/**
 * app/seeker/profile/page.tsx
 * الملف الشخصي للباحث — إنشاء أو تعديل
 */

import type { Metadata } from "next";
import { Lightbulb, Sparkles } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/permissions";
import PageHeader from "@/components/ui/page-header";
import SeekerCreateProfileForm from "@/components/forms/seeker-create-profile-form";
import SeekerProfileForm, {
  type SeekerProfileValues,
} from "@/components/forms/seeker-profile-form";

import ProfileCompletionCard from "@/components/seeker/profile-completion-card";

export const metadata: Metadata = {
  title: "الملف الشخصي — بواب مصر",
};

const PROFILE_TIPS = [
  "اكتب نبذة واضحة عن خبراتك السابقة في الحراسة وأعمال العقارات.",
  "حدّد دوامك المفضل وراتبك المتوقع بواقعية لتناسب عروض أصحاب العقارات.",
  "أضف مهارات دقيقة تصف ما تتقنه فعلاً مثل الكاميرات وأنظمة الإنذار.",
  "أبقِ ملفك عاماً ليظهر لأصحاب العقارات عند مراجعتهم المتقدمين.",
];

export default async function SeekerProfilePage({
  searchParams,
}: {
  searchParams?: Promise<{ welcome?: string; incomplete?: string }>;
}) {
  const user = await requireAuth();
  const params = await searchParams;
  const isWelcome = params?.welcome === "1" || params?.incomplete === "1";

  const profile = await prisma.seekerProfile.findUnique({
    where: { userId: user.id },
    include: {
      skills: { include: { skill: { select: { name: true } } } },
    },
  });

  if (!profile) {
    return (
      <div>
        <PageHeader
          eyebrow="خطوة واحدة تفصلك"
          title="الملف الشخصي"
          description="أنشئ ملفك ليظهر لأصحاب العقارات عند التقديم نيابةً عنك على الوظائف."
        />
        <div className="max-w-xl">
          <SeekerCreateProfileForm />
        </div>
      </div>
    );
  }

  const values: SeekerProfileValues = {
    bio: profile.bio,
    yearsExperience: profile.yearsExperience,
    preferredWorkType: profile.preferredWorkType,
    availability: profile.availability,
    expectedSalaryMin: profile.expectedSalaryMin,
    expectedSalaryMax: profile.expectedSalaryMax,
    isProfilePublic: profile.isProfilePublic,
    skills: profile.skills.map((entry) => entry.skill.name),
  };

  return (
    <div>
      {isWelcome && (
        <div className="mb-6 rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/90 p-5 text-emerald-950 shadow-sm animate-drop">
          <div className="flex items-start gap-3.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-xs">
              <Sparkles size={22} aria-hidden />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-emerald-900">
                أهلاً بك في منصة بواب مصر! 👋
              </h2>
              <p className="mt-1 text-sm text-emerald-850 leading-relaxed">
                لكي تبدأ استلام عروض العمل وتظهر سيرتك الذاتية لأصحاب العقارات واتحادات الملاك، يرجى استكمال بياناتك الأساسية والمهارات بالأسفل.
              </p>
            </div>
          </div>
        </div>
      )}

      <PageHeader
        title="الملف الشخصي"
        description="حدّث بياناتك ليظهر ملفك لأصحاب العقارات بشكل صحيح ويزيد فرص قبول طلباتك."
      />

      <ProfileCompletionCard profile={profile} showFullChecklist={true} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
        <div className="min-w-0">
          <SeekerProfileForm profile={values} />
        </div>

        <aside className="card p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <Sparkles size={15} aria-hidden />
            </span>
            نصائح لملف أقوى
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-soft">
            {PROFILE_TIPS.map((tip) => (
              <li key={tip} className="flex items-start gap-2">
                <Lightbulb
                  size={14}
                  className="mt-1 shrink-0 text-emerald-700"
                  aria-hidden
                />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
