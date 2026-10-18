/**
 * lib/permissions/index.ts
 * فحص الصلاحيات على الخادم — لا تثق في بيانات المتصفح
 */

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";

// ============================================================
// الحصول على الجلسة الحالية
// ============================================================

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireVerifiedPhone() {
  const user = await requireAuth();
  if (!user.isPhoneVerified) redirect("/verify-phone");
  return user;
}

// ============================================================
// فحص الأدوار الإدارية
// ============================================================

export async function isAdmin(userId: string): Promise<boolean> {
  const roles = await prisma.systemUserRole.findMany({
    where: { userId },
    include: { role: true },
  });
  return roles.some((r) => r.role.name === "ADMIN");
}

export async function isModerator(userId: string): Promise<boolean> {
  const roles = await prisma.systemUserRole.findMany({
    where: { userId },
    include: { role: true },
  });
  return roles.some((r) =>
    ["ADMIN", "MODERATOR"].includes(r.role.name)
  );
}

export async function requireAdmin() {
  const user = await requireVerifiedPhone();
  const ok = await isAdmin(user.id);
  if (!ok) redirect("/");
  return user;
}

export async function requireModerator() {
  const user = await requireVerifiedPhone();
  const ok = await isModerator(user.id);
  if (!ok) redirect("/");
  return user;
}

// ============================================================
// فحص ملكية السجلات
// ============================================================

/**
 * تحقق أن المستخدم هو ناشر الوظيفة أو عضو مخول في مؤسستها
 */
export async function canManageJob(
  userId: string,
  jobId: string
): Promise<boolean> {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      poster: true,
      org: {
        include: {
          members: {
            where: {
              userId,
              isActive: true,
              role: { in: ["OWNER", "HR_MANAGER"] },
            },
          },
        },
      },
    },
  });

  if (!job) return false;

  // ناشر الوظيفة مباشرة
  if (job.poster.userId === userId) return true;

  // عضو مخول في المؤسسة
  if (job.org && job.org.members.length > 0) return true;

  return false;
}

/**
 * تحقق أن المستخدم هو صاحب الطلب
 */
export async function canManageApplication(
  userId: string,
  applicationId: string
): Promise<boolean> {
  const app = await prisma.jobApplication.findUnique({
    where: { id: applicationId },
    include: {
      job: {
        include: {
          poster: true,
          org: {
            include: {
              members: {
                where: {
                  userId,
                  isActive: true,
                  role: { in: ["OWNER", "HR_MANAGER"] },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!app) return false;

  // صاحب الوظيفة أو عضو مؤسستها
  if (app.job.poster.userId === userId) return true;
  if (app.job.org && app.job.org.members.length > 0) return true;

  return false;
}

/**
 * تحقق أن المستخدم هو المتقدم نفسه
 */
export async function isApplicationOwner(
  userId: string,
  applicationId: string
): Promise<boolean> {
  const app = await prisma.jobApplication.findUnique({
    where: { id: applicationId },
    select: { applicantId: true },
  });
  return app?.applicantId === userId;
}
