/**
 * app/seeker/applications/page.tsx
 * طلبات التقديمي — عرض وفلترة وسحب الطلبات
 */

import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Funnel } from "lucide-react";
import type { ApplicationStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/permissions";
import PageHeader from "@/components/ui/page-header";
import EmptyState from "@/components/ui/empty-state";
import StatusBadge from "@/components/ui/status-badge";
import Pagination from "@/components/ui/pagination";
import SeekerWithdrawButton from "@/components/forms/seeker-withdraw-button";
import {
  APPLICATION_STATUS_BADGE,
  APPLICATION_STATUS_LABELS,
  WORK_TYPE_LABELS,
  formatDateAr,
} from "@/lib/labels";
import {
  APPLICATION_STATUSES,
  applicationStatusFilterSchema,
} from "@/lib/validation/seeker";

export const metadata: Metadata = {
  title: "طلباتي — بواب مصر",
};

const PAGE_SIZE = 10;

/** الحالات التي يسمح فيها المتقدم بسحب طلبه */
const WITHDRAWABLE_STATUSES: ApplicationStatus[] = [
  "SUBMITTED",
  "VIEWED",
  "SHORTLISTED",
  "INTERVIEW_SCHEDULED",
];

type ApplicationsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}

function excerpt(text: string): string {
  if (text.length <= 200) {
    return text;
  }
  return `${text.slice(0, 200).trimEnd()}…`;
}

export default async function SeekerApplicationsPage({
  searchParams,
}: ApplicationsPageProps) {
  const user = await requireAuth();
  const params = await searchParams;

  const rawStatus = firstParam(params.status);
  const statusParsed = applicationStatusFilterSchema.safeParse(rawStatus);
  const status = statusParsed.success ? statusParsed.data : undefined;

  const rawPage = firstParam(params.page);
  const page = Math.max(1, Number.parseInt(rawPage, 10) || 1);

  const where: Prisma.JobApplicationWhereInput = {
    applicantId: user.id,
    ...(status ? { status } : {}),
  };

  const [total, applications] = await Promise.all([
    prisma.jobApplication.count({ where }),
    prisma.jobApplication.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        job: {
          select: {
            title: true,
            slug: true,
            status: true,
            workType: true,
            province: { select: { name: true } },
            area: { select: { name: true } },
          },
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <PageHeader
        title="طلبات التقديم"
        description="تابع حالة كل طلب قدمته على وظيفة، واسحبه إن رغبت في التراجع عنه."
      />

      <form
        method="get"
        action="/seeker/applications"
        className="card mb-6 flex flex-wrap items-end gap-4"
      >
        <div className="min-w-56">
          <label htmlFor="status" className="form-label">
            حالة الطلب
          </label>
          <select
            id="status"
            name="status"
            className="form-input"
            defaultValue={status ?? ""}
          >
            <option value="">كل الحالات</option>
            {APPLICATION_STATUSES.map((applicationStatus) => (
              <option key={applicationStatus} value={applicationStatus}>
                {APPLICATION_STATUS_LABELS[applicationStatus]}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          <Funnel size={16} aria-hidden />
          تصفية النتائج
        </button>
        <p className="ms-auto pb-2.5 text-sm text-ink-mute">
          إجمالي الطلبات:{" "}
          <span className="font-bold text-ink">{total}</span>
        </p>
      </form>

      {applications.length === 0 ? (
        total === 0 ? (
          <EmptyState
            icon={FileText}
            title="لا توجد طلبات بعد"
            description="قدّم على وظائف مناسبة وستظهر طلباتك هنا لمتابعتها لحظة بلحظة."
            actionHref="/jobs"
            actionLabel="تصفّح الوظائف"
          />
        ) : (
          <EmptyState
            icon={FileText}
            title="لا توجد طلبات بهذه الحالة"
            description="جرّب اختيار حالة أخرى من الفلتر لعرض بقية طلباتك."
            actionHref="/seeker/applications"
            actionLabel="عرض كل الطلبات"
          />
        )
      ) : (
        <>
          <ul className="card divide-y divide-line overflow-hidden p-0">
            {applications.map((application) => (
              <li
                key={application.id}
                className="flex flex-wrap items-start justify-between gap-3 px-5 py-4 transition-colors hover:bg-muted/60"
              >
                <div className="min-w-0 flex-1 basis-64">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/jobs/${application.job.slug}`}
                      className="link text-sm font-bold"
                    >
                      {application.job.title}
                    </Link>
                    <StatusBadge
                      label={APPLICATION_STATUS_LABELS[application.status]}
                      variant={APPLICATION_STATUS_BADGE[application.status]}
                      dot
                    />
                  </div>
                  <p className="mt-1 text-xs text-ink-mute">
                    {[
                      WORK_TYPE_LABELS[application.job.workType],
                      application.job.province?.name,
                      application.job.area?.name,
                    ]
                      .filter(Boolean)
                      .join(" • ")}{" "}
                    — قُدِّم في {formatDateAr(application.createdAt)}
                  </p>
                  {application.coverMessage ? (
                    <p className="mt-2 line-clamp-2 rounded-soft bg-muted px-3 py-2 text-sm leading-relaxed text-ink-soft">
                      {excerpt(application.coverMessage)}
                    </p>
                  ) : null}
                </div>

                {WITHDRAWABLE_STATUSES.includes(application.status) ? (
                  <div className="shrink-0">
                    <SeekerWithdrawButton applicationId={application.id} />
                  </div>
                ) : null}
              </li>
            ))}
          </ul>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/seeker/applications"
            searchParams={status ? { status } : {}}
          />
        </>
      )}
    </div>
  );
}
