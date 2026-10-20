import { z } from "zod";

export const SYSTEM_ROLE_NAMES = [
  "ADMIN",
  "MODERATOR",
  "CUSTOMER_SUPPORT",
  "FINANCE",
] as const;

export const USER_STATUS_OPTIONS = [
  "ACTIVE",
  "SUSPENDED",
  "DEACTIVATED",
] as const;

export const approveJobSchema = z.object({
  jobId: z.string().min(1, { message: "معرّف الوظيفة مطلوب" }),
});

export const rejectJobSchema = z.object({
  jobId: z.string().min(1, { message: "معرّف الوظيفة مطلوب" }),
  reason: z
    .string()
    .trim()
    .min(5, { message: "سبب الرفض مطلوب (5 أحرف على الأقل)" })
    .max(1000, { message: "سبب الرفض يجب ألا يتجاوز 1000 حرف" }),
});

export const resolveReportSchema = z.object({
  reportId: z.string().min(1, { message: "معرّف البلاغ مطلوب" }),
  resolution: z.enum(["RESOLVED", "DISMISSED"], {
    message: "إجراء غير صحيح",
  }),
});

export const setUserStatusSchema = z.object({
  userId: z.string().min(1, { message: "معرّف المستخدم مطلوب" }),
  status: z.enum(USER_STATUS_OPTIONS, { message: "حالة غير صحيحة" }),
});

export const grantRoleSchema = z.object({
  userId: z.string().min(1, { message: "معرّف المستخدم مطلوب" }),
  roleName: z.enum(SYSTEM_ROLE_NAMES, { message: "دور غير صحيح" }),
});

export const revokeRoleSchema = z.object({
  userId: z.string().min(1, { message: "معرّف المستخدم مطلوب" }),
  roleName: z.enum(SYSTEM_ROLE_NAMES, { message: "دور غير صحيح" }),
});
