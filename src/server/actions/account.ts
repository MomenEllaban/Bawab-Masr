"use server";

/**
 * server/actions/account.ts
 * Server Actions لإعدادات الأمان (تغيير كلمة المرور)
 */

import { requireAuth } from "@/lib/permissions";
import { changePasswordSchema } from "@/lib/validation/applications";
import { changePassword } from "@/server/services/profile-service";
import type { ActionState } from "./applications";

export type { ActionState };

const GENERIC_ERROR = "حدث خطأ غير متوقع، حاول مرة أخرى";

function firstIssue(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? "بيانات غير صحيحة";
}

export async function changePasswordAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAuth();

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  let result: { ok: boolean; error?: string };
  try {
    result = await changePassword(
      user.id,
      parsed.data.currentPassword,
      parsed.data.newPassword
    );
  } catch (error) {
    console.error("[changePasswordAction]", error);
    return { error: GENERIC_ERROR };
  }

  if (!result.ok) {
    return { error: result.error };
  }

  return { success: "تم تغيير كلمة المرور بنجاح" };
}
