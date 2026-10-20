/**
 * lib/labels.ts
 * تسميات عربية للحالات والأنواع — تُستخدم في الواجهة والخادم
 */

import type {
  ApplicationStatus,
  JobStatus,
  WorkType,
  WorkSchedule,
  SalaryPeriod,
  SeekerAvailability,
  EmployerType,
  ReportStatus,
} from "@prisma/client";

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  DRAFT: "مسودة",
  PENDING_REVIEW: "قيد المراجعة",
  PUBLISHED: "منشورة",
  PAUSED: "موقوفة",
  CLOSED: "مغلقة",
  REJECTED: "مرفوضة",
  EXPIRED: "منتهية",
  ARCHIVED: "مؤرشفة",
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  SUBMITTED: "مُقدَّم",
  VIEWED: "تمت المشاهدة",
  SHORTLISTED: "ضمن القائمة",
  INTERVIEW_SCHEDULED: "مقابلة محددة",
  OFFERED: "عرض وظيفي",
  HIRED: "تم التوظيف",
  REJECTED: "مرفوض",
  WITHDRAWN: "مسحوب",
};

export const WORK_TYPE_LABELS: Record<WorkType, string> = {
  FULL_TIME: "دوام كامل",
  PART_TIME: "دوام جزئي",
  CONTRACT: "عقد",
  TEMPORARY: "مؤقت",
};

export const WORK_SCHEDULE_LABELS: Record<WorkSchedule, string> = {
  MORNING: "صباحي",
  EVENING: "مسائي",
  NIGHT: "ليلي",
  ROTATING: "متقلب",
  FLEXIBLE: "مرن",
};

export const SALARY_PERIOD_LABELS: Record<SalaryPeriod, string> = {
  MONTHLY: "شهري",
  DAILY: "يومي",
  WEEKLY: "أسبوعي",
};

export const AVAILABILITY_LABELS: Record<SeekerAvailability, string> = {
  IMMEDIATE: "فوري",
  TWO_WEEKS: "خلال أسبوعين",
  ONE_MONTH: "خلال شهر",
  NOT_LOOKING: "لا أبحث حالياً",
};

export const EMPLOYER_TYPE_LABELS: Record<EmployerType, string> = {
  INDIVIDUAL_OWNER: "مالك فردي",
  UNION_REP: "ممثل اتحاد ملاك",
  MANAGEMENT_COMPANY: "شركة إدارة عقارات",
};

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  OPEN: "مفتوح",
  UNDER_REVIEW: "قيد المراجعة",
  RESOLVED: "مُحل",
  DISMISSED: "مُلغى",
};

/** ألوان badge لكل حالة وظيفة */
export const JOB_STATUS_BADGE: Record<JobStatus, string> = {
  DRAFT: "badge-draft",
  PENDING_REVIEW: "badge-pending",
  PUBLISHED: "badge-published",
  PAUSED: "badge-pending",
  CLOSED: "badge-draft",
  REJECTED: "badge-rejected",
  EXPIRED: "badge-rejected",
  ARCHIVED: "badge-draft",
};

/** ألوان badge لكل حالة طلب */
export const APPLICATION_STATUS_BADGE: Record<ApplicationStatus, string> = {
  SUBMITTED: "badge-pending",
  VIEWED: "badge-pending",
  SHORTLISTED: "badge-hired",
  INTERVIEW_SCHEDULED: "badge-hired",
  OFFERED: "badge-hired",
  HIRED: "badge-published",
  REJECTED: "badge-rejected",
  WITHDRAWN: "badge-draft",
};

export function formatDateAr(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" }).format(d);
}

export function formatSalary(
  salaryMin: number | null,
  salaryMax: number | null,
  salaryPeriod: SalaryPeriod,
  isSalaryPublic: boolean
): string {
  if (!isSalaryPublic) return "الراتب غير معلن";
  const period = SALARY_PERIOD_LABELS[salaryPeriod];
  if (salaryMin && salaryMax) {
    return `${salaryMin.toLocaleString("ar-EG")} – ${salaryMax.toLocaleString("ar-EG")} ج.م ${period}`;
  }
  if (salaryMin) {
    return `يبدأ من ${salaryMin.toLocaleString("ar-EG")} ج.م ${period}`;
  }
  if (salaryMax) {
    return `حتى ${salaryMax.toLocaleString("ar-EG")} ج.م ${period}`;
  }
  return "الراتب غير معلن";
}
