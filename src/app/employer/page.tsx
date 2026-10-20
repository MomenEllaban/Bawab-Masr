import type { Metadata } from "next";
import Link from "next/link";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Inbox,
  Sparkles,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { requireAuth } from "@/lib/permissions";
import { prisma } from "@/lib/db/prisma";
import PageHeader from "@/components/ui/page-header";
import StatCard from "@/components/ui/stat-card";
import EmptyState from "@/components/ui/empty-state";
import StatusBadge from "@/components/ui/status-badge";
import EmployerOnboardingCard from "@/components/employer/onboarding-card";
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_BADGE,
  formatDateAr,
} from "@/lib/labels";

export const metadata: Metadata = {
  title: "لوحة صاحب العقار — بواب مصر",
};

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

export default async function EmployerOverviewPage() {
  const user = await requireAuth();

  const profile = await prisma.employerProfile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!profile) {
    return <EmployerOnboardingCard />;
  }

  const weekAgo = daysAgo(7);

  const [
    totalJobs,
    publishedJobs,
    pendingReviewJobs,
    totalApplications,
    newApplications,
    latestApplications,
  ] = await Promise.all([
    prisma.job.count({ where: { posterId: profile.id } }),
    prisma.job.count({ where: { posterId: profile.id, status: "PUBLISHED" } }),
    prisma.job.count({
      where: { posterId: profile.id, status: "PENDING_REVIEW" },
    }),
    prisma.jobApplication.count({
      where: { job: { posterId: profile.id } },
    }),
    prisma.jobApplication.count({
      where: { job: { posterId: profile.id }, createdAt: { gte: weekAgo } },
    }),
    prisma.jobApplication.findMany({
      where: { job: { posterId: profile.id } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        applicant: { select: { name: true } },
        job: { select: { title: true } },
      },
    }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow={`أهلاً، ${user.name ?? "صاحب عقار"}`}
        title="لوحة صاحب العقار"
        description="نظرة عامة على وظائفك والطلبات الواردة."
        actions={
          <Link href="/employer/jobs/new" className="btn btn-primary">
            <Plus size={16} aria-hidden />
            أضف وظيفة
          </Link>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard label="إجمالي الوظائف" value={totalJobs} icon={Briefcase} />
        <StatCard
          label="منشورة"
          value={publishedJobs}
          icon={CheckCircle2}
          tone="accent"
        />
        <StatCard
          label="قيد المراجعة"
          value={pendingReviewJobs}
          icon={Clock}
          tone="warning"
        />
        <StatCard
          label="إجمالي الطلبات الواردة"
          value={totalApplications}
          icon={Inbox}
        />
        <StatCard
          label="طلبات جديدة آخر ٧ أيام"
          value={newApplications}
          icon={Sparkles}
          tone="accent"
        />
      </div>

      {totalJobs === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="لم تنشر أي وظيفة بعد"
          description="أضف أول وظيفة لك لتبدأ في استقبال طلبات الباحثين عن عمل."
          actionHref="/employer/jobs/new"
          actionLabel="أضف وظيفة"
        />
      ) : (
        <section className="card p-0">
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
            <h2 className="text-lg font-bold">آخر الطلبات الواردة</h2>
            <Link href="/employer/applications" className="link text-sm">
              عرض كل الطلبات
              <ArrowLeft size={15} className="inline" aria-hidden />
            </Link>
          </div>

          {latestApplications.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm leading-relaxed text-ink-mute">
              لا توجد طلبات حتى الآن على وظائفك المنشورة.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {latestApplications.map((application) => (
                <li
                  key={application.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-muted/60"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold">
                      {application.applicant.name}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-mute">
                      {application.job.title} •{" "}
                      {formatDateAr(application.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <StatusBadge
                      label={APPLICATION_STATUS_LABELS[application.status]}
                      variant={APPLICATION_STATUS_BADGE[application.status]}
                      dot
                    />
                    <Link
                      href="/employer/applications"
                      className="btn btn-secondary btn-sm"
                    >
                      عرض
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </>
  );
}
