"use server";

/**
 * server/actions/admin.ts
 * Server Actions للوحة الإدارة — كل عملية تتطلب صلاحية مشرف على الأقل
 */

import { revalidatePath } from "next/cache";
import { requireModerator, isAdmin } from "@/lib/permissions";
import {
  approveJobSchema,
  rejectJobSchema,
  resolveReportSchema,
  setUserStatusSchema,
  grantRoleSchema,
  revokeRoleSchema,
} from "@/lib/validation/admin";
import {
  reviewJobDecision,
  resolveReport,
  setUserStatus,
  grantSystemRole,
  revokeSystemRole,
} from "@/server/services/admin-service";

export type AdminActionState = {
  error?: string;
  success?: string;
};

const GENERIC_ERROR = "حدث خطأ غير متوقع، حاول مرة أخرى";
const ADMIN_ONLY_ERROR = "هذه العملية تتطلب صلاحية مدير";

/** يعيد أول رسالة خطأ من Zod */
function firstIssue(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? "بيانات غير صحيحة";
}

async function requireAdminActor() {
  const user = await requireModerator();
  const ok = await isAdmin(user.id);
  if (!ok) return null;
  return user;
}

// ============================================================
// مراجعة الوظائف
// ============================================================

export async function approveJobAction(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const user = await requireModerator();

  const parsed = approveJobSchema.safeParse({
    jobId: formData.get("jobId"),
  });
  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  try {
    const result = await reviewJobDecision({
      adminId: user.id,
      jobId: parsed.data.jobId,
      decision: "APPROVED",
    });
    if (!result.ok) {
      return { error: result.error };
    }
  } catch (error) {
    console.error("[approveJobAction]", error);
    return { error: GENERIC_ERROR };
  }

  revalidatePath("/admin/jobs");
  revalidatePath("/admin");
  return { success: "تمت الموافقة على الوظيفة ونشرها" };
}

export async function rejectJobAction(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const user = await requireModerator();

  const parsed = rejectJobSchema.safeParse({
    jobId: formData.get("jobId"),
    reason: formData.get("reason"),
  });
  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  try {
    const result = await reviewJobDecision({
      adminId: user.id,
      jobId: parsed.data.jobId,
      decision: "REJECTED",
      reason: parsed.data.reason,
    });
    if (!result.ok) {
      return { error: result.error };
    }
  } catch (error) {
    console.error("[rejectJobAction]", error);
    return { error: GENERIC_ERROR };
  }

  revalidatePath("/admin/jobs");
  revalidatePath("/admin");
  return { success: "تم رفض الوظيفة" };
}

// ============================================================
// معالجة البلاغات
// ============================================================

export async function resolveReportAction(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const user = await requireModerator();

  const parsed = resolveReportSchema.safeParse({
    reportId: formData.get("reportId"),
    resolution: "RESOLVED",
  });
  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  try {
    const result = await resolveReport(
      user.id,
      parsed.data.reportId,
      parsed.data.resolution
    );
    if (!result.ok) {
      return { error: result.error };
    }
  } catch (error) {
    console.error("[resolveReportAction]", error);
    return { error: GENERIC_ERROR };
  }

  revalidatePath("/admin/reports");
  revalidatePath("/admin");
  return { success: "تمت معالجة البلاغ" };
}

export async function dismissReportAction(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const user = await requireModerator();

  const parsed = resolveReportSchema.safeParse({
    reportId: formData.get("reportId"),
    resolution: "DISMISSED",
  });
  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  try {
    const result = await resolveReport(
      user.id,
      parsed.data.reportId,
      parsed.data.resolution
    );
    if (!result.ok) {
      return { error: result.error };
    }
  } catch (error) {
    console.error("[dismissReportAction]", error);
    return { error: GENERIC_ERROR };
  }

  revalidatePath("/admin/reports");
  revalidatePath("/admin");
  return { success: "تم رفض/إغلاق البلاغ" };
}

// ============================================================
// إدارة المستخدمين — تتطلب صلاحية مدير
// ============================================================

export async function setUserStatusAction(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const user = await requireAdminActor();
  if (!user) {
    return { error: ADMIN_ONLY_ERROR };
  }

  const parsed = setUserStatusSchema.safeParse({
    userId: formData.get("userId"),
    status: formData.get("status"),
  });
  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  try {
    const result = await setUserStatus(
      user.id,
      parsed.data.userId,
      parsed.data.status
    );
    if (!result.ok) {
      return { error: result.error };
    }
  } catch (error) {
    console.error("[setUserStatusAction]", error);
    return { error: GENERIC_ERROR };
  }

  revalidatePath("/admin/users");
  return { success: "تم تحديث حالة المستخدم" };
}

export async function grantRoleAction(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const user = await requireAdminActor();
  if (!user) {
    return { error: ADMIN_ONLY_ERROR };
  }

  const parsed = grantRoleSchema.safeParse({
    userId: formData.get("userId"),
    roleName: formData.get("roleName"),
  });
  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  try {
    const result = await grantSystemRole(
      user.id,
      parsed.data.userId,
      parsed.data.roleName
    );
    if (!result.ok) {
      return { error: result.error };
    }
  } catch (error) {
    console.error("[grantRoleAction]", error);
    return { error: GENERIC_ERROR };
  }

  revalidatePath("/admin/users");
  return { success: "تم منح الدور بنجاح" };
}

export async function revokeRoleAction(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const user = await requireAdminActor();
  if (!user) {
    return { error: ADMIN_ONLY_ERROR };
  }

  const parsed = revokeRoleSchema.safeParse({
    userId: formData.get("userId"),
    roleName: formData.get("roleName"),
  });
  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  try {
    const result = await revokeSystemRole(
      user.id,
      parsed.data.userId,
      parsed.data.roleName
    );
    if (!result.ok) {
      return { error: result.error };
    }
  } catch (error) {
    console.error("[revokeRoleAction]", error);
    return { error: GENERIC_ERROR };
  }

  revalidatePath("/admin/users");
  return { success: "تم سحب الدور بنجاح" };
}
