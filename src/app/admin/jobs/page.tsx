import type { Metadata } from "next";
import Link from "next/link";
import {
  Briefcase,
  RefreshCw,
  ShieldAlert,
  ShieldX,
  TriangleAlert,
} from "lucide-react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import PageHeader from "@/components/ui/page-header";
import EmptyState from "@/components/ui/empty-state";
import StatusBadge from "@/components/ui/status-badge";
import Pagination from "@/components/ui/pagination";
import TabsNav from "@/components/ui/tabs-nav";
import ApproveButton from "@/components/admin/approve-button";
import RejectForm from "@/components/admin/reject-form";
import {
  JOB_STATUS_BADGE,
  JOB_STATUS_LABELS,
  WORK_TYPE_LABELS,
  formatSalary,
  formatDateAr,
} from "@/lib/labels";

export const metadata: Metadata = {
  title: "مراجعة الوظائف — بواب مصر",
};

const PAGE_SIZE = 10;

type JobsTab = "pending" | "all" | "rejected";

type JobsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

type AdminJob = Prisma.JobGetPayload<{
  include: {
    poster: { select: { displayName: true } };
    area: { select: { name: true } };
    _count: { select: { applications: true } };
  };
}>;

const TAB_LABELS: Record<JobsTab, string> = {
  pending: "قيد المراجعة",
  all: "الكل",
  rejected: "مرفوضة",
};

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function applicationsLabel(count: number): string {
  return count === 0
    ? "لا طلبات"
    : count === 1
      ? "طلب واحد"
      : count === 2
        ? "طلبان"
        : `${count} طلبات`;
}

function parsePage(value: string): number {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export default async function AdminJobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;

  const rawTab = firstParam(params.tab);
  const tab: JobsTab =
    rawTab === "all" || rawTab === "rejected" ? rawTab : "pending";
  const page = parsePage(firstParam(params.page));

  const where: Prisma.JobWhereInput =
    tab === "pending"
      ? { status: "PENDING_REVIEW" }
      : tab === "rejected"
        ? { status: "REJECTED" }
        : {};

  let jobs: AdminJob[] = [];
  let total = 0;
  let pendingCount = 0;
  let allCount = 0;
  let rejectedCount = 0;
  let hasDbError = false;

  try {
    [jobs, total, pendingCount, allCount, rejectedCount] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: {
          poster: { select: { displayName: true } },
          area: { select: { name: true } },
          _count: { select: { applications: true } },
        },
      }),
      prisma.job.count({ where }),
      prisma.job.count({ where: { status: "PENDING_REVIEW" } }),
      prisma.job.count(),
      prisma.job.count({ where: { status: "REJECTED" } }),
    ]);
  } catch (error) {
    console.error("[admin-jobs-page]", error);
    hasDbError = true;
  }

  if (hasDbError) {
    return (
      <div>
        <PageHeader
          title="مراجعة الوظائف"
          description="راجع الوظائف المُقدَّمة للنشر قبل إتاحتها للباحثين عن عمل"
        />
        <div className="alert alert-error flex-col items-center text-center">
          <TriangleAlert size={22} aria-hidden />
          <h2 className="text-lg font-bold">تعذّر تحميل الوظائف</h2>
          <p className="mt-1">
            حدث خطأ أثناء جلب قائمة الوظائف المطلوب مراجعتها. يرجى المحاولة
            مرة أخرى بعد قليل.
          </p>
          <Link
            href={`/admin/jobs?tab=${tab}`}
            className="btn btn-primary mt-4"
          >
            <RefreshCw size={16} aria-hidden />
            إعادة المحاولة
          </Link>
        </div>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const tabs = [
    {
      href: "/admin/jobs?tab=pending",
      label: TAB_LABELS.pending,
      count: pendingCount,
      active: tab === "pending",
    },
    {
      href: "/admin/jobs?tab=all",
      label: TAB_LABELS.all,
      count: allCount,
      active: tab === "all",
    },
    {
      href: "/admin/jobs?tab=rejected",
      label: TAB_LABELS.rejected,
      count: rejectedCount,
      active: tab === "rejected",
    },
  ];

  return (
    <div>
      <PageHeader
        title="مراجعة الوظائف"
        description="راجع الوظائف المُقدَّمة للنشر قبل إتاحتها للباحثين عن عمل"
      />

      <TabsNav label="تصفية حسب حالة الوظيفة" items={tabs} />

      {jobs.length === 0 ? (
        tab === "pending" ? (
          <EmptyState
            icon={ShieldAlert}
            title="لا توجد وظائف بانتظار المراجعة"
            description="كل الوظائف المُقدَّمة تمت مراجعتها."
            secondaryHref="/admin/jobs?tab=all"
            secondaryLabel="عرض كل الوظائف"
          />
        ) : tab === "rejected" ? (
          <EmptyState
            icon={ShieldX}
            title="لا توجد وظائف مرفوضة"
            description="لم تُرفض أي وظيفة حتى الآن."
            secondaryHref="/admin/jobs?tab=pending"
            secondaryLabel="عرض الوظائف قيد المراجعة"
          />
        ) : (
          <EmptyState
            icon={Briefcase}
            title="لا توجد وظائف"
            description="لم تُقدَّم أي وظائف عبر المنصة حتى الآن."
          />
        )
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1 basis-64">
                  <h2 className="text-base font-bold">
                    <Link href={`/jobs/${job.slug}`} className="link">
                      {job.title}
                    </Link>
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-ink-mute">
                    {job.poster.displayName}
                    {job.area ? ` • ${job.area.name}` : ""} •{" "}
                    {formatDateAr(job.createdAt)} •{" "}
                    {applicationsLabel(job._count.applications)}
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

              {job.status === "REJECTED" && job.rejectionReason ? (
                <p className="mt-3 rounded-soft bg-muted px-3 py-2 text-sm leading-relaxed text-ink-soft">
                  <span className="font-bold text-ink">سبب الرفض: </span>
                  {job.rejectionReason}
                </p>
              ) : null}

              {job.status === "PENDING_REVIEW" ? (
                <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-3">
                  <ApproveButton jobId={job.id} />
                  <RejectForm jobId={job.id} />
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/admin/jobs"
        searchParams={{ tab }}
      />
    </div>
  );
}
