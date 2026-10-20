import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { requireAuth } from "@/lib/permissions";
import { prisma } from "@/lib/db/prisma";
import PageHeader from "@/components/ui/page-header";
import StatusBadge from "@/components/ui/status-badge";
import EmployerOnboardingCard from "@/components/employer/onboarding-card";
import JobActions from "@/components/employer/job-actions";
import EmployerJobForm from "@/components/forms/employer-job-form";
import {
  JOB_STATUS_LABELS,
  JOB_STATUS_BADGE,
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_BADGE,
  WORK_TYPE_LABELS,
  WORK_SCHEDULE_LABELS,
  formatDateAr,
  formatSalary,
} from "@/lib/labels";

export const metadata: Metadata = {
  title: "إدارة الوظيفة — بواب مصر",
};

const EDITABLE_STATUSES = ["DRAFT", "PENDING_REVIEW", "REJECTED", "PAUSED"];

type ManageJobPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ManageJobPage({ params }: ManageJobPageProps) {
  const { id } = await params;
  const user = await requireAuth();

  const profile = await prisma.employerProfile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!profile) {
    return <EmployerOnboardingCard />;
  }

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      poster: { select: { userId: true } },
      province: { select: { name: true } },
      area: { select: { name: true } },
      property: { select: { name: true } },
      _count: { select: { applications: true } },
    },
  });

  if (!job || job.poster.userId !== user.id) {
    notFound();
  }

  const [provinces, areas, properties, latestApplications] =
    await Promise.all([
      prisma.province.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
      prisma.area.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        select: { id: true, name: true, provinceId: true },
      }),
      prisma.property.findMany({
        where: { ownerId: profile.id, isActive: true },
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
      prisma.jobApplication.findMany({
        where: { jobId: job.id },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          applicant: { select: { name: true } },
        },
      }),
    ]);

  const isEditable = EDITABLE_STATUSES.includes(job.status);
  const locationParts = [
    job.province?.name,
    job.area?.name,
    job.property?.name,
  ].filter((part): part is string => Boolean(part));

  return (
    <>
      <PageHeader
        eyebrow="إعلان توظيف"
        title={job.title}
        description={`أُنشئت في ${formatDateAr(job.createdAt)} • ${job._count.applications} طلب`}
        badge={
          <StatusBadge
            label={JOB_STATUS_LABELS[job.status]}
            variant={JOB_STATUS_BADGE[job.status]}
            dot
          />
        }
        actions={
          <Link href="/employer/jobs" className="btn btn-secondary">
            <ArrowRight size={16} aria-hidden />
            عرض وظائفي
          </Link>
        }
      />

      {job.status === "REJECTED" && job.rejectionReason && (
        <div className="alert alert-warning mb-6">
          <AlertTriangle size={18} aria-hidden />
          <div>
            <p className="font-semibold">تم رفض هذه الوظيفة</p>
            <p className="text-sm">السبب: {job.rejectionReason}</p>
          </div>
        </div>
      )}

      <section className="card mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge badge-outline">
            {WORK_TYPE_LABELS[job.workType]}
          </span>
          {job.workSchedule && (
            <span className="badge badge-outline">
              {WORK_SCHEDULE_LABELS[job.workSchedule]}
            </span>
          )}
          <span className="badge badge-hired">
            {formatSalary(
              job.salaryMin,
              job.salaryMax,
              job.salaryPeriod,
              job.isSalaryPublic
            )}
          </span>
          {job.housingProvided && (
            <span className="badge badge-success">سكن متوفر</span>
          )}
        </div>

        {locationParts.length > 0 && (
          <p className="mt-4 flex items-center gap-2 text-sm text-ink-soft">
            <MapPin size={16} aria-hidden className="shrink-0 text-ink-mute" />
            {locationParts.join(" — ")}
          </p>
        )}

        <div className="mt-6 border-t border-line pt-5">
          <h2 className="text-lg font-bold">وصف الوظيفة</h2>
          <p className="mt-2 whitespace-pre-wrap leading-relaxed text-ink-soft">
            {job.description}
          </p>
        </div>

        {job.responsibilities && (
          <div className="mt-6 border-t border-line pt-5">
            <h2 className="text-lg font-bold">المهام</h2>
            <p className="mt-2 whitespace-pre-wrap leading-relaxed text-ink-soft">
              {job.responsibilities}
            </p>
          </div>
        )}

        {job.requirements && (
          <div className="mt-6 border-t border-line pt-5">
            <h2 className="text-lg font-bold">المتطلبات</h2>
            <p className="mt-2 whitespace-pre-wrap leading-relaxed text-ink-soft">
              {job.requirements}
            </p>
          </div>
        )}

        <dl className="mt-6 grid gap-3 border-t border-line pt-5 text-sm sm:grid-cols-2">
          {job.experienceYears !== null && (
            <div className="flex gap-2">
              <dt className="text-ink-mute">سنوات الخبرة:</dt>
              <dd className="font-semibold">{job.experienceYears}</dd>
            </div>
          )}
          <div className="flex gap-2">
            <dt className="text-ink-mute">آخر موعد لتقديم الطلبات:</dt>
            <dd className="font-semibold">
              {formatDateAr(job.applicationDeadline)}
            </dd>
          </div>
        </dl>

        <div className="mt-6 border-t border-line pt-5">
          <JobActions
            jobId={job.id}
            canSubmit={job.status === "DRAFT" || job.status === "REJECTED"}
            canPause={job.status === "PUBLISHED"}
            canResume={job.status === "PAUSED"}
            canClose={!["CLOSED", "ARCHIVED"].includes(job.status)}
            canEdit={false}
          />
        </div>
      </section>

      <section className="card mb-6 p-0">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <h2 className="text-lg font-bold">
            أحدث الطلبات ({job._count.applications})
          </h2>
          <Link
            href={`/employer/jobs/${job.id}/applications`}
            className="link text-sm"
          >
            عرض كل الطلبات
            <ArrowLeft size={15} className="inline" aria-hidden />
          </Link>
        </div>

        {latestApplications.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm leading-relaxed text-ink-mute">
            لا توجد طلبات على هذه الوظيفة بعد.
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

      {isEditable && (
        <section>
          <h2 className="text-lg font-bold">تعديل الوظيفة</h2>
          <p className="mb-4 mt-1 text-sm leading-relaxed text-ink-soft">
            حدّث بيانات الإعلان ثم احفظ التغييرات.
          </p>
          <EmployerJobForm
            mode="edit"
            jobId={job.id}
            provinces={provinces}
            areas={areas}
            properties={properties}
            initialValues={{
              title: job.title,
              description: job.description,
              responsibilities: job.responsibilities,
              requirements: job.requirements,
              workType: job.workType,
              workSchedule: job.workSchedule,
              salaryMin: job.salaryMin,
              salaryMax: job.salaryMax,
              salaryPeriod: job.salaryPeriod,
              isSalaryPublic: job.isSalaryPublic,
              experienceYears: job.experienceYears,
              housingProvided: job.housingProvided,
              provinceId: job.provinceId,
              areaId: job.areaId,
              propertyId: job.propertyId,
              applicationDeadline: job.applicationDeadline
                ? job.applicationDeadline.toISOString().slice(0, 10)
                : null,
            }}
          />
        </section>
      )}
    </>
  );
}
