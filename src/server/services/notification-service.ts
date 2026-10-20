import { prisma } from "@/lib/db/prisma";
import type { NotificationType } from "@prisma/client";

/**
 * إرسال إشعار داخلي — يفشل الصمت إذا فشل الإشعار (لا يوقف العملية الأساسية)
 */
export async function notify(params: {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  internalUrl?: string;
}): Promise<void> {
  try {
    await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        body: params.body,
        internalUrl: params.internalUrl,
      },
    });
  } catch (error) {
    console.error("[notify]", error);
  }
}
