"use server";

/**
 * server/actions/applications.ts
 * Server Actions للتقديم على الوظائف وحفظها والإبلاغ عنها
 */

import { revalidatePath } from "next/cache";
import { requireAuth, requireVerifiedPhone } from "@/lib/permissions";
import { applySchema, reportSchema } from "@/lib/validation/applications";
import {
  applyToJob,
  withdrawApplication,
} from "@/server/services/application-service";
import {
  toggleSaveJob,
  reportJob,
} from "@/server/services/job-service";

export type ActionState = {
  error?: string;
  success?: string;
};

const GENERIC_ERROR = "حدث خطأ غير متوقع، حاول مرة أخرى";

function firstIssue(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? "بيانات غير صحيحة";
}

export async function applyAction(
  jobId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireVerifiedPhone();

  const parsed = applySchema.safeParse({
    coverMessage: formData.get("coverMessage") || undefined,
  });
  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  let result: { ok: boolean; error?: string };
  try {
    result = await applyToJob(user.id, jobId, parsed.data.coverMessage);
  } catch (error) {
    console.error("[applyAction]", error);
    return { error: GENERIC_ERROR };
  }

  if (!result.ok) {
    return { error: result.error };
  }

  revalidatePath("/jobs/[slug]", "page");
  revalidatePath("/seeker/applications");
  return { success: "تم إرسال طلبك بنجاح" };
}

export async function withdrawAction(
  applicationId: string,
  _prevState: ActionState,
  _formData: FormData
): Promise<ActionState> {
  const user = await requireAuth();

  let result: { ok: boolean; error?: string };
  try {
    result = await withdrawApplication(user.id, applicationId);
  } catch (error) {
    console.error("[withdrawAction]", error);
    return { error: GENERIC_ERROR };
  }

  if (!result.ok) {
    return { error: result.error };
  }

  revalidatePath("/seeker/applications");
  return { success: "تم سحب طلبك" };
}

export async function toggleSaveAction(
  jobId: string,
  _prevState: ActionState,
  _formData: FormData
): Promise<ActionState> {
  const user = await requireVerifiedPhone();

  let result: { ok: boolean; error?: string; data?: { saved: boolean } };
  try {
    result = await toggleSaveJob(user.id, jobId);
  } catch (error) {
    console.error("[toggleSaveAction]", error);
    return { error: GENERIC_ERROR };
  }

  if (!result.ok) {
    return { error: result.error };
  }

  revalidatePath("/jobs/[slug]", "page");
  revalidatePath("/seeker/saved");
  return {
    success: result.data?.saved ? "تم حفظ الوظيفة" : "تمت إزالة الوظيفة من المحفوظات",
  };
}

export async function reportAction(
  jobId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireVerifiedPhone();

  const parsed = reportSchema.safeParse({
    reason: formData.get("reason"),
    details: formData.get("details") || undefined,
  });
  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  try {
    const result = await reportJob(
      user.id,
      jobId,
      parsed.data.reason,
      parsed.data.details
    );
    if (!result.ok) {
      return { error: result.error };
    }
  } catch (error) {
    console.error("[reportAction]", error);
    return { error: GENERIC_ERROR };
  }

  return { success: "تم استلام البلاغ، شكراً لك" };
}
