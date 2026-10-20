/**
 * app/seeker/page.tsx
 * لوحة الباحث — نظرة عامة على الطلبات والوظائف المحفوظة
 */

import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Clock,
  Star,
  CheckCircle2,
  Bookmark,
  ArrowLeft,
  UserRound,
} from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/permissions";
import PageHeader from "@/components/ui/page-header";
import StatCard from "@/components/ui/stat-card";
import EmptyState from "@/components/ui/empty-state";
import StatusBadge from "@/components/ui/status-badge";
import ProfileCompletionCard from "@/components/seeker/profile-completion-card";
import {
  APPLICATION_STATUS_BADGE,
  APPLICATION_STATUS_LABELS,
  formatDateAr,
} from "@/lib/labels";

export const metadata: Metadata = {
  title: "لوحة الباحث — بواب مصر",
};

export default async function SeekerDashboardPage() {
  const user = await requireAuth();

  const [
    total,
    underReview,
    shortlisted,
    hired,
    savedCount,
    latest,
    seekerProfile,
  ] = await Promise.all([
    prisma.jobApplication.count({ where: { applicantId: user.id } }),
    prisma.jobApplication.count({
      where: { applicantId: user.id, status: { in: ["SUBMITTED", "VIEWED"] } },
    }),
    prisma.jobApplication.count({
      where: {
        applicantId: user.id,
        status: { in: ["SHORTLISTED", "INTERVIEW_SCHEDULED", "OFFERED"] },
      },
    }),
    prisma.jobApplication.count({
      where: { applicantId: user.id, status: "HIRED" },
    }),
    prisma.savedJob.count({ where: { userId: user.id } }),
    prisma.jobApplication.findMany({
      where: { applicantId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { job: { select: { title: true, slug: true } } },
    }),
    prisma.seekerProfile.findUnique({
      where: { userId: user.id },
      include: {
        skills: { include: { skill: { select: { name: true } } } },
      },
    }),
  ]);

  return (
    <div>
      <PageHeader
        eyebrow={`أهلاً، ${user.name ?? "مستخدم"}`}
        title="لوحة الباحث عن عمل"
        description="تابع طلباتك ووظائفك المحفوظة من مكان واحد."
        actions={
          <Link href="/jobs" className="btn btn-primary">
            تصفّح الوظائف
            <ArrowLeft size={16} aria-hidden />
          </Link>
        }
      />

      <ProfileCompletionCard profile={seekerProfile} />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <StatCard label="إجمالي الطلبات" value={total} icon={FileText} />
        <StatCard
          label="قيد المراجعة"
          value={underReview}
          icon={Clock}
          tone="warning"
        />
        <StatCard
          label="ضمن القائمة"
          value={shortlisted}
          icon={Star}
          tone="accent"
        />
        <StatCard
          label="تم التوظيف"
          value={hired}
          icon={CheckCircle2}
          tone="accent"
        />
        <StatCard label="وظائف محفوظة" value={savedCount} icon={Bookmark} />
      </div>

      <section className="mt-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold">آخر الطلبات</h2>
          {total > 0 && (
            <Link href="/seeker/applications" className="link text-sm">
              عرض كل الطلبات
              <ArrowLeft size={15} className="inline" aria-hidden />
            </Link>
          )}
        </div>

        {total === 0 ? (
          <EmptyState
            icon={FileText}
            title="لا توجد طلبات بعد"
            description="قدّم على وظائف مناسبة لتتبع حالة طلباتك هنا."
            actionHref="/jobs"
            actionLabel="تصفّح الوظائف"
          />
        ) : (
          <ul className="card divide-y divide-line overflow-hidden p-0">
            {latest.map((application) => (
              <li
                key={application.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-muted/60"
              >
                <div className="min-w-0">
                  <Link
                    href={`/jobs/${application.job.slug}`}
                    className="link text-sm"
                  >
                    {application.job.title}
                  </Link>
                  <p className="mt-1 text-xs text-ink-mute">
                    قُدِّم في {formatDateAr(application.createdAt)}
                  </p>
                </div>
                <StatusBadge
                  label={APPLICATION_STATUS_LABELS[application.status]}
                  variant={APPLICATION_STATUS_BADGE[application.status]}
                  dot
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
