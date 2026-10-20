import type { Metadata } from "next";
import { UserSearch } from "lucide-react";
import type { ApplicationStatus, Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
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
  title: "طلبات الوظيفة — بواب مصر",
};

const PAGE_SIZE = 10;

type JobApplicationsPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}

export default async function JobApplicationsPage({
  params,
  searchParams,
}: JobApplicationsPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const user = await requireAuth();

  const statusFilter = firstParam(query.status).trim();
  const pageRaw = Number.parseInt(firstParam(query.page), 10);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  const profile = await prisma.employerProfile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!profile) {
    return <EmployerOnboardingCard />;
  }

  const job = await prisma.job.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      poster: { select: { userId: true } },
    },
  });

  if (!job || job.poster.userId !== user.id) {
    notFound();
  }

  const validStatuses = Object.keys(APPLICATION_STATUS_LABELS) as ApplicationStatus[];
  const status = validStatuses.includes(statusFilter as ApplicationStatus)
    ? (statusFilter as ApplicationStatus)
    : undefined;

  const where: Prisma.JobApplicationWhereInput = {
    jobId: job.id,
    ...(status ? { status } : {}),
  };

  const [applications, total] = await Promise.all([
    prisma.jobApplication.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        applicant: { select: { name: true, phone: true } },
      },
    }),
    prisma.jobApplication.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const basePath = `/employer/jobs/${job.id}/applications`;
  const statusTabs = [
    { href: basePath, label: "كل الطلبات", active: !status },
    ...validStatuses.map((appStatus) => ({
      href: `${basePath}?status=${appStatus}`,
      label: APPLICATION_STATUS_LABELS[appStatus],
      active: status === appStatus,
    })),
  ];

  return (
    <>
      <PageHeader
        title={`طلبات وظيفة: ${job.title}`}
        description={`${total} طلب حتى الآن`}
      />

      <TabsNav label="تصفية حسب حالة الطلب" items={statusTabs} />

      {applications.length === 0 ? (
        status ? (
          <EmptyState
            icon={UserSearch}
            title="لا توجد طلبات بهذه الحالة"
            description="لم يقدّم أحد بهذه الحالة على هذه الوظيفة بعد. جرّب تصفية حالة أخرى."
            secondaryHref={basePath}
            secondaryLabel="عرض كل الطلبات"
          />
        ) : (
          <EmptyState
            icon={UserSearch}
            title="لا توجد طلبات على هذه الوظيفة بعد"
            description="حين يقدّم أحد الباحثين عن عمل على إعلانك ستظهر طلباته هنا."
          />
        )
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
            basePath={basePath}
            searchParams={query}
          />
        </>
      )}
    </>
  );
}
