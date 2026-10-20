import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Briefcase, SearchX } from "lucide-react";
import type { JobStatus, Prisma } from "@prisma/client";
import { requireAuth } from "@/lib/permissions";
import { prisma } from "@/lib/db/prisma";
import PageHeader from "@/components/ui/page-header";
import EmptyState from "@/components/ui/empty-state";
import StatusBadge from "@/components/ui/status-badge";
import Pagination from "@/components/ui/pagination";
import TabsNav from "@/components/ui/tabs-nav";
import JobActions from "@/components/employer/job-actions";
import EmployerOnboardingCard from "@/components/employer/onboarding-card";
import {
  JOB_STATUS_LABELS,
  JOB_STATUS_BADGE,
  WORK_TYPE_LABELS,
  formatDateAr,
  formatSalary,
} from "@/lib/labels";

export const metadata: Metadata = {
  title: "وظائفي — بواب مصر",
};

const PAGE_SIZE = 10;

const EDITABLE_STATUSES: JobStatus[] = [
  "DRAFT",
  "PENDING_REVIEW",
  "REJECTED",
  "PAUSED",
];

type JobsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}

export default async function EmployerJobsPage({ searchParams }: JobsPageProps) {
  const user = await requireAuth();
  const params = await searchParams;

  const statusFilter = firstParam(params.status).trim();
  const pageRaw = Number.parseInt(firstParam(params.page), 10);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  const profile = await prisma.employerProfile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!profile) {
    return <EmployerOnboardingCard />;
  }

  const validStatuses = Object.keys(JOB_STATUS_LABELS) as JobStatus[];
  const status = validStatuses.includes(statusFilter as JobStatus)
    ? (statusFilter as JobStatus)
    : undefined;

  const where: Prisma.JobWhereInput = {
    posterId: profile.id,
    ...(status ? { status } : {}),
  };

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        _count: { select: { applications: true } },
      },
    }),
    prisma.job.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const statusTabs = [
    { href: "/employer/jobs", label: "كل الوظائف", active: !status },
    ...validStatuses.map((jobStatus) => ({
      href: `/employer/jobs?status=${jobStatus}`,
      label: JOB_STATUS_LABELS[jobStatus],
      active: status === jobStatus,
    })),
  ];

  return (
    <>
      <PageHeader
        title="وظائفي"
        description="إدارة كل الوظائف التي نشرتها — مسودات ومنشورة ومغلقة"
        actions={
          <Link href="/employer/jobs/new" className="btn btn-primary">
            <Plus size={16} aria-hidden />
            أضف وظيفة
          </Link>
        }
      />

      <TabsNav label="تصفية حسب حالة الوظيفة" items={statusTabs} />

      {jobs.length === 0 ? (
        status ? (
          <EmptyState
            icon={SearchX}
            title="لا توجد وظائف بهذه الحالة"
            description="لا توجد وظائف مطابقة للحالة المختارة. جرّب تصفية حالة أخرى أو أضف وظيفة جديدة."
            actionHref="/employer/jobs/new"
            actionLabel="أضف وظيفة"
            secondaryHref="/employer/jobs"
            secondaryLabel="عرض كل الوظائف"
          />
        ) : (
          <EmptyState
            icon={Briefcase}
            title="لم تنشر أي وظيفة بعد"
            description="ابدأ بإضافة أول وظيفة لك لتستقبل طلبات الباحثين عن عمل."
            actionHref="/employer/jobs/new"
            actionLabel="أضف وظيفة"
          />
        )
      ) : (
        <>
          <ul className="card divide-y divide-line p-0">
            {jobs.map((job) => (
              <li
                key={job.id}
                className="px-5 py-4 transition-colors hover:bg-muted/60"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-base font-bold">
                      <Link href={`/employer/jobs/${job.id}`} className="link">
                        {job.title}
                      </Link>
                    </h2>
                    <p className="mt-1 text-xs leading-relaxed text-ink-mute">
                      أُنشئت في {formatDateAr(job.createdAt)} •{" "}
                      {job._count.applications} طلب
                      {job.applicationDeadline
                        ? ` • آخر موعد: ${formatDateAr(job.applicationDeadline)}`
                        : ""}
                    </p>
                  </div>
                  <StatusBadge
                    label={JOB_STATUS_LABELS[job.status]}
                    variant={JOB_STATUS_BADGE[job.status]}
                    dot
                  />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="badge badge-outline">
                    {WORK_TYPE_LABELS[job.workType]}
                  </span>
                  <span className="badge badge-hired">
                    {formatSalary(
                      job.salaryMin,
                      job.salaryMax,
                      job.salaryPeriod,
                      job.isSalaryPublic
                    )}
                  </span>
                </div>

                <div className="mt-4">
                  <JobActions
                    jobId={job.id}
                    canSubmit={job.status === "DRAFT" || job.status === "REJECTED"}
                    canPause={job.status === "PUBLISHED"}
                    canResume={job.status === "PAUSED"}
                    canClose={!["CLOSED", "ARCHIVED"].includes(job.status)}
                    canEdit={EDITABLE_STATUSES.includes(job.status)}
                  />
                </div>
              </li>
            ))}
          </ul>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/employer/jobs"
            searchParams={params}
          />
        </>
      )}
    </>
  );
}
