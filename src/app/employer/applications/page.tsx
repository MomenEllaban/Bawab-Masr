import type { Metadata } from "next";
import Link from "next/link";
import { Inbox } from "lucide-react";
import type { ApplicationStatus, Prisma } from "@prisma/client";
import { requireAuth } from "@/lib/permissions";
import { prisma } from "@/lib/db/prisma";
import PageHeader from "@/components/ui/page-header";
import EmptyState from "@/components/ui/empty-state";
import StatusBadge from "@/components/ui/status-badge";
import Pagination from "@/components/ui/pagination";
import TabsNav from "@/components/ui/tabs-nav";
import StatusChangeForm from "@/components/employer/status-change-form";
import EmployerOnboardingCard from "@/components/employer/onboarding-card";
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_BADGE,
  formatDateAr,
} from "@/lib/labels";

export const metadata: Metadata = {
  title: "الطلبات الواردة — بواب مصر",
};

const PAGE_SIZE = 10;

type ApplicationsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}

export default async function EmployerApplicationsPage({
  searchParams,
}: ApplicationsPageProps) {
  const user = await requireAuth();
  const query = await searchParams;

  const statusFilter = firstParam(query.status).trim();
  const jobFilter = firstParam(query.job).trim();
  const pageRaw = Number.parseInt(firstParam(query.page), 10);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  const profile = await prisma.employerProfile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!profile) {
    return <EmployerOnboardingCard />;
  }

  const validStatuses = Object.keys(APPLICATION_STATUS_LABELS) as ApplicationStatus[];
  const status = validStatuses.includes(statusFilter as ApplicationStatus)
    ? (statusFilter as ApplicationStatus)
    : undefined;

  const where: Prisma.JobApplicationWhereInput = {
    job: { posterId: profile.id },
    ...(status ? { status } : {}),
    ...(jobFilter ? { jobId: jobFilter } : {}),
  };

  const [applications, total, ownJobs] = await Promise.all([
    prisma.jobApplication.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        applicant: { select: { name: true, phone: true } },
        job: { select: { id: true, title: true } },
      },
    }),
    prisma.jobApplication.count({ where }),
    prisma.job.findMany({
      where: { posterId: profile.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const jobQuery = jobFilter ? `&job=${encodeURIComponent(jobFilter)}` : "";
  const statusTabs = [
    {
      href: `/employer/applications${jobQuery}`,
      label: "كل الطلبات",
      active: !status,
    },
    ...validStatuses.map((appStatus) => ({
      href: `/employer/applications?status=${appStatus}${jobQuery}`,
      label: APPLICATION_STATUS_LABELS[appStatus],
      active: status === appStatus,
    })),
  ];

  return (
    <>
      <PageHeader
        title="الطلبات الواردة"
        description="كل طلبات الباحثين عن عمل على وظائفك"
      />

      <TabsNav label="تصفية حسب حالة الطلب" items={statusTabs} />

      {ownJobs.length > 0 && (
        <form
          method="get"
          action="/employer/applications"
          className="card mb-6 flex flex-wrap items-end gap-4"
        >
          {status && <input type="hidden" name="status" value={status} />}
          <div className="min-w-56 flex-1">
            <label htmlFor="apps-job" className="form-label">
              الوظيفة
            </label>
            <select
              id="apps-job"
              name="job"
              className="form-input"
              defaultValue={jobFilter}
            >
              <option value="">كل الوظائف</option>
              {ownJobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary btn-sm">
            تصفية
          </button>
        </form>
      )}

      {applications.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="لا توجد طلبات"
          description="لم يقم أحد بالتقديم على وظائفك بعد، أو لا توجد طلبات مطابقة للفلاتر الحالية."
          secondaryHref="/employer/jobs"
          secondaryLabel="إدارة وظائفي"
        />
      ) : (
        <>
          <ul className="card divide-y divide-line p-0">
            {applications.map((application) => (
              <li
                key={application.id}
                className="px-5 py-5 transition-colors hover:bg-muted/60"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-base font-bold">
                      {application.applicant.name}
                    </h2>
                    <p className="mt-1 text-sm">
                      <Link
                        href={`/employer/jobs/${application.job.id}`}
                        className="link"
                      >
                        {application.job.title}
                      </Link>
                    </p>
                    <p className="mt-1 text-sm text-ink-soft">
                      <span className="ltr">
                        {application.applicant.phone}
                      </span>
                    </p>
                    <p className="mt-0.5 text-xs text-ink-mute">
                      قُدِّم في {formatDateAr(application.createdAt)}
                    </p>
                  </div>
                  <StatusBadge
                    label={APPLICATION_STATUS_LABELS[application.status]}
                    variant={APPLICATION_STATUS_BADGE[application.status]}
                    dot
                  />
                </div>

                {application.coverMessage && (
                  <p className="mt-3 whitespace-pre-wrap rounded-soft bg-muted p-3 text-sm leading-relaxed text-ink-soft">
                    {application.coverMessage}
                  </p>
                )}

                <StatusChangeForm
                  applicationId={application.id}
                  currentStatus={application.status}
                />
              </li>
            ))}
          </ul>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/employer/applications"
            searchParams={query}
          />
        </>
      )}
    </>
  );
}
