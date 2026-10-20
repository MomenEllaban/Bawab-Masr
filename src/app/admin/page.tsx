import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert, Flag, Users, FileCheck2, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import PageHeader from "@/components/ui/page-header";
import StatCard from "@/components/ui/stat-card";
import EmptyState from "@/components/ui/empty-state";
import StatusBadge from "@/components/ui/status-badge";
import {
  JOB_STATUS_BADGE,
  JOB_STATUS_LABELS,
  REPORT_STATUS_LABELS,
  formatDateAr,
} from "@/lib/labels";
import { REPORT_STATUS_BADGE } from "@/components/admin/constants";

export const metadata: Metadata = {
  title: "لوحة التحكم — بواب مصر",
};

export default async function AdminOverviewPage() {
  const [
    pendingJobsCount,
    openReportsCount,
    totalUsers,
    publishedJobs,
    pendingJobs,
    openReports,
  ] = await Promise.all([
    prisma.job.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.report.count({
      where: { status: { in: ["OPEN", "UNDER_REVIEW"] } },
    }),
    prisma.user.count(),
    prisma.job.count({ where: { status: "PUBLISHED" } }),
    prisma.job.findMany({
      where: { status: "PENDING_REVIEW" },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
        poster: { select: { displayName: true } },
      },
    }),
    prisma.report.findMany({
      where: { status: { in: ["OPEN", "UNDER_REVIEW"] } },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        reason: true,
        targetType: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="لوحة التحكم"
        description="نظرة عامة على الوظائف والبلاغات والمستخدمين."
      />

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="وظائف قيد المراجعة"
          value={pendingJobsCount}
          icon={ShieldAlert}
          tone="warning"
        />
        <StatCard
          label="بلاغات مفتوحة"
          value={openReportsCount}
          icon={Flag}
          tone="danger"
        />
        <StatCard label="إجمالي المستخدمين" value={totalUsers} icon={Users} />
        <StatCard
          label="وظائف منشورة"
          value={publishedJobs}
          icon={FileCheck2}
          tone="accent"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* بانتظار المراجعة */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">بانتظار المراجعة</h2>
            {pendingJobsCount > 0 && (
              <Link href="/admin/jobs?tab=pending" className="link text-sm">
                عرض الكل
                <ArrowLeft size={15} className="inline" aria-hidden />
              </Link>
            )}
          </div>

          {pendingJobs.length === 0 ? (
            <EmptyState
              icon={ShieldAlert}
              title="لا توجد وظائف بانتظار المراجعة"
              description="كل الوظائف المُقدَّمة تمت مراجعتها."
            />
          ) : (
            <ul className="card divide-y divide-line p-0">
              {pendingJobs.map((job) => (
                <li
                  key={job.id}
                  className="flex items-start justify-between gap-3 px-5 py-4 transition-colors hover:bg-muted/60"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/jobs/${job.slug}`}
                      className="link block truncate text-sm"
                    >
                      {job.title}
                    </Link>
                    <p className="mt-1 text-xs text-ink-mute">
                      {job.poster.displayName} • {formatDateAr(job.createdAt)}
                    </p>
                  </div>
                  <StatusBadge
                    label={JOB_STATUS_LABELS.PENDING_REVIEW}
                    variant={JOB_STATUS_BADGE.PENDING_REVIEW}
                    dot
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* البلاغات المفتوحة */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">البلاغات المفتوحة</h2>
            {openReportsCount > 0 && (
              <Link href="/admin/reports?tab=open" className="link text-sm">
                عرض الكل
                <ArrowLeft size={15} className="inline" aria-hidden />
              </Link>
            )}
          </div>

          {openReports.length === 0 ? (
            <EmptyState
              icon={Flag}
              title="لا توجد بلاغات مفتوحة"
              description="لا بلاغات بانتظار المعالجة حالياً."
            />
          ) : (
            <ul className="card divide-y divide-line p-0">
              {openReports.map((report) => (
                <li
                  key={report.id}
                  className="flex items-start justify-between gap-3 px-5 py-4 transition-colors hover:bg-muted/60"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{report.reason}</p>
                    <p className="mt-1 text-xs text-ink-mute">
                      {formatDateAr(report.createdAt)}
                    </p>
                  </div>
                  <StatusBadge
                    label={REPORT_STATUS_LABELS[report.status]}
                    variant={REPORT_STATUS_BADGE[report.status]}
                    dot
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
