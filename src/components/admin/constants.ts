export const SYSTEM_ROLE_LABELS: Record<string, string> = {
  ADMIN: "مدير",
  MODERATOR: "مشرف",
  CUSTOMER_SUPPORT: "دعم فني",
  FINANCE: "مالي",
};

export const USER_STATUS_LABELS: Record<string, string> = {
  ACTIVE: "نشط",
  SUSPENDED: "موقوف",
  PENDING_VERIFICATION: "بانتظار التحقق",
  DEACTIVATED: "ملغى",
};

export const USER_STATUS_BADGE: Record<string, string> = {
  ACTIVE: "badge-published",
  SUSPENDED: "badge-rejected",
  PENDING_VERIFICATION: "badge-pending",
  DEACTIVATED: "badge-draft",
};

export const REPORT_STATUS_BADGE: Record<string, string> = {
  OPEN: "badge-pending",
  UNDER_REVIEW: "badge-pending",
  RESOLVED: "badge-published",
  DISMISSED: "badge-draft",
};

export const REPORT_TARGET_LABELS: Record<string, string> = {
  JOB: "وظيفة",
  USER: "مستخدم",
  ORG: "مؤسسة",
};
