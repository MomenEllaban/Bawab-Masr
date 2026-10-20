/**
 * lib/seeker-utils.ts
 * دوال مساعدة لحساب نسبة اكتمال الملف الشخصي للباحث عن عمل
 */

export type SeekerProfileData = {
  bio?: string | null;
  yearsExperience?: number | null;
  preferredWorkType?: string | null;
  availability?: string | null;
  expectedSalaryMin?: number | null;
  expectedSalaryMax?: number | null;
  skills?: { skill?: { name: string }; [key: string]: unknown }[] | string[] | unknown[];
};

export type CompletionItem = {
  key: string;
  label: string;
  isComplete: boolean;
  weight: number;
};

export type CompletenessResult = {
  percentage: number;
  isComplete: boolean;
  items: CompletionItem[];
  missingCount: number;
  badgeColor: string;
  statusLabel: string;
};

export function calculateSeekerCompleteness(
  profile?: SeekerProfileData | null
): CompletenessResult {
  if (!profile) {
    return {
      percentage: 0,
      isComplete: false,
      items: [],
      missingCount: 5,
      badgeColor: "bg-red-500",
      statusLabel: "غير مكتمل",
    };
  }

  const hasBio = Boolean(profile.bio && profile.bio.trim().length >= 15);
  const hasExperience = typeof profile.yearsExperience === "number";
  const hasWorkType = Boolean(profile.preferredWorkType);
  const hasSkills = Boolean(profile.skills && profile.skills.length > 0);
  const hasSalary = Boolean(profile.expectedSalaryMin || profile.expectedSalaryMax);

  const items: CompletionItem[] = [
    {
      key: "bio",
      label: "نبذة تعريفية توضح خبراتك (15 حرفاً على الأقل)",
      isComplete: hasBio,
      weight: 25,
    },
    {
      key: "experience",
      label: "تحديد سنوات الخبرة في مجال الحراسة أو الخدمات",
      isComplete: hasExperience,
      weight: 25,
    },
    {
      key: "workType",
      label: "نوع العمل المفضل والجاهزية",
      isComplete: hasWorkType,
      weight: 20,
    },
    {
      key: "skills",
      label: "إضافة مهاراتك (حراسة، كاميرات، نظافة، صيانة...)",
      isComplete: hasSkills,
      weight: 15,
    },
    {
      key: "salary",
      label: "تحديد الراتب المتوقع التقريبي",
      isComplete: hasSalary,
      weight: 15,
    },
  ];

  const percentage = items.reduce(
    (acc, curr) => acc + (curr.isComplete ? curr.weight : 0),
    0
  );

  const missingCount = items.filter((i) => !i.isComplete).length;
  const isComplete = percentage >= 85;

  let badgeColor = "bg-rose-500";
  let statusLabel = "ملف غير مكتمل (ضعيف)";

  if (percentage >= 85) {
    badgeColor = "bg-emerald-500";
    statusLabel = "ملف مكتمل وممتاز";
  } else if (percentage >= 50) {
    badgeColor = "bg-amber-500";
    statusLabel = "ملف قيد الإكمال (متوسط)";
  }

  return {
    percentage,
    isComplete,
    items,
    missingCount,
    badgeColor,
    statusLabel,
  };
}
