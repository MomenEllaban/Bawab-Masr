import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import {
  ArrowRight,
  MapPin,
  CalendarDays,
  Clock3,
  Briefcase,
  History,
  Building2,
  CircleCheck,
  ListChecks,
  FileText,
  TriangleAlert,
  LogIn,
  UserPlus,
} from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/permissions";
import ApplyForm from "@/components/jobs/apply-form";
import SaveJobButton from "@/components/jobs/save-job-button";
import ReportJobForm from "@/components/jobs/report-job-form";
import {
  WORK_TYPE_LABELS,
  WORK_SCHEDULE_LABELS,
  formatDateAr,
  formatSalary,
} from "@/lib/labels";

type JobDetailPageProps = {
  params: Promise<{ slug: string }>;
};

type JobDetail = Prisma.JobGetPayload<{
  include: {
    province: { select: { name: true; slug: true } };
    area: { select: { name: true } };
    poster: { select: { displayName: true } };
    category: { select: { name: true } };
  };
}>;

function experienceText(experienceYears: number | null): string {
  if (experienceYears === null || experienceYears === 0) {
    return "بدون خبرة مطلوبة";
  }
  return `خبرة ${experienceYears} سنة`;
}

function paragraphs(text: string | null): string[] {
  if (!text) {
    return [];
  }
  return text
    .split(/\r?\n+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

function isDeadlinePassed(deadline: Date): boolean {
  return deadline.getTime() < Date.now();
}

async function getPublishedJob(
  slug: string
): Promise<{ job: JobDetail | null; failed: boolean }> {
  try {
    const job = await prisma.job.findFirst({
      where: { slug, status: "PUBLISHED", reviewStatus: "APPROVED" },
      include: {
        province: { select: { name: true, slug: true } },
        area: { select: { name: true } },
        poster: { select: { displayName: true } },
        category: { select: { name: true } },
      },
    });
    return { job, failed: false };
  } catch (error) {
    console.error("[job-detail-page]", error);
    return { job: null, failed: true };
  }
}

export async function generateMetadata({
  params,
}: JobDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const job = await prisma.job.findFirst({
      where: { slug, status: "PUBLISHED", reviewStatus: "APPROVED" },
      select: { title: true, description: true, publishedAt: true },
    });
    if (!job) {
      return { title: "وظيفة غير موجودة" };
    }
    const excerpt =
      job.description.length > 160
        ? `${job.description.slice(0, 160).trim()}…`
        : job.description;
    return {
      title: job.title,
      description: excerpt,
      openGraph: {
        title: job.title,
        description: excerpt,
        type: "article",
        publishedTime: job.publishedAt?.toISOString(),
        locale: "ar_EG",
      },
    };
  } catch (error) {
    console.error("[job-detail-page]", error);
    return { title: "وظيفة" };
  }
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params;
  const { job, failed } = await getPublishedJob(slug);

  if (failed) {
    return (
      <main className="container-app py-10">
        <div className="card alert alert-error mx-auto max-w-2xl text-center">
          <h1 className="mb-2 text-xl font-bold">تعذّر تحميل الوظيفة</h1>
          <p className="mb-6">
            حدث خطأ أثناء جلب تفاصيل الوظيفة. يرجى المحاولة مرة أخرى بعد قليل.
          </p>
          <Link href="/jobs" className="btn btn-primary">
            العودة إلى الوظائف
          </Link>
        </div>
      </main>
    );
  }

  if (!job) {
    notFound();
  }

  const user = await getCurrentUser();
  const isStaff =
    user?.systemRoles.includes("ADMIN") ||
    user?.systemRoles.includes("MODERATOR") ||
    false;

  let alreadyApplied = false;
  let initiallySaved = false;
  if (user && !isStaff) {
    const [application, savedJob] = await Promise.all([
      prisma.jobApplication.findUnique({
        where: {
          jobId_applicantId: { jobId: job.id, applicantId: user.id },
        },
        select: { id: true },
      }),
      prisma.savedJob.findUnique({
        where: { userId_jobId: { userId: user.id, jobId: job.id } },
        select: { id: true },
      }),
    ]);
    alreadyApplied = application !== null;
    initiallySaved = savedJob !== null;
  }

  const loginHref = `/login?callbackUrl=/jobs/${encodeURIComponent(slug)}`;
  const registerHref = `/register?callbackUrl=/jobs/${encodeURIComponent(slug)}`;
  const deadlinePassed =
    job.applicationDeadline !== null && isDeadlinePassed(job.applicationDeadline);

  const descriptionParagraphs = paragraphs(job.description);
  const responsibilityParagraphs = paragraphs(job.responsibilities);
  const requirementParagraphs = paragraphs(job.requirements);
  const locationText = [job.province?.name, job.area?.name]
    .filter((part): part is string => Boolean(part))
    .join(" — ");

  return (
    <main className="container-app py-8 lg:py-10">
      <Link
        href="/jobs"
        className="link-muted mb-6 inline-flex items-center gap-1.5 text-sm"
      >
        <ArrowRight size={15} aria-hidden />
        العودة إلى كل الوظائف
      </Link>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          {/* ترويسة الوظيفة */}
          <div className="card p-6 lg:p-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="badge badge-outline">
                <Briefcase size={12} aria-hidden />
                {WORK_TYPE_LABELS[job.workType]}
              </span>
              {job.workSchedule && (
                <span className="badge badge-outline">
                  {WORK_SCHEDULE_LABELS[job.workSchedule]}
                </span>
              )}
              {job.category && (
                <span className="badge badge-neutral">{job.category.name}</span>
              )}
              {job.housingProvided && (
                <span className="badge badge-success">سكن متوفر</span>
              )}
            </div>

            <h1 className="text-2xl font-extrabold leading-snug tracking-tight lg:text-3xl">
              {job.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-soft">
              <span className="font-bold text-ink">{job.poster.displayName}</span>
              {locationText ? (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={15} aria-hidden className="text-ink-mute" />
                  {locationText}
                </span>
              ) : null}
              {job.publishedAt && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays
                    size={15}
                    aria-hidden
                    className="text-ink-mute"
                  />
                  نُشرت في {formatDateAr(job.publishedAt)}
                </span>
              )}
            </div>
          </div>

          {/* الوصف */}
          {descriptionParagraphs.length > 0 && (
            <section className="card p-6 lg:p-8">
              <h2 className="mb-4 flex items-center gap-2.5 text-lg font-bold">
                <span className="flex h-8 w-8 items-center justify-center rounded-soft bg-navy-50 text-navy">
                  <FileText size={16} aria-hidden />
                </span>
                وصف الوظيفة
              </h2>
              <div className="prose-ar space-y-3">
                {descriptionParagraphs.map((text, index) => (
                  <p key={`desc-${index}`}>{text}</p>
                ))}
              </div>
            </section>
          )}

          {/* المهام */}
          {responsibilityParagraphs.length > 0 && (
            <section className="card p-6 lg:p-8">
              <h2 className="mb-4 flex items-center gap-2.5 text-lg font-bold">
                <span className="flex h-8 w-8 items-center justify-center rounded-soft bg-emerald-50 text-emerald-700">
                  <ListChecks size={16} aria-hidden />
                </span>
                المهام والمسؤوليات
              </h2>
              <div className="prose-ar space-y-3">
                {responsibilityParagraphs.map((text, index) => (
                  <p key={`resp-${index}`}>{text}</p>
                ))}
              </div>
            </section>
          )}

          {/* المتطلبات */}
          {requirementParagraphs.length > 0 && (
            <section className="card p-6 lg:p-8">
              <h2 className="mb-4 flex items-center gap-2.5 text-lg font-bold">
                <span className="flex h-8 w-8 items-center justify-center rounded-soft bg-emerald-50 text-emerald-700">
                  <CircleCheck size={16} aria-hidden />
                </span>
                المتطلبات
              </h2>
              <div className="prose-ar space-y-3">
                {requirementParagraphs.map((text, index) => (
                  <p key={`req-${index}`}>{text}</p>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* لوحة التقديم */}
        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="card p-6">
            <p className="text-2xl font-extrabold text-navy">
              {formatSalary(
                job.salaryMin,
                job.salaryMax,
                job.salaryPeriod,
                job.isSalaryPublic
              )}
            </p>

            <dl className="mt-5 space-y-3.5 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="inline-flex items-center gap-2 text-ink-mute">
                  <Briefcase size={15} aria-hidden />
                  نوع الدوام
                </dt>
                <dd className="font-bold">{WORK_TYPE_LABELS[job.workType]}</dd>
              </div>
              {job.workSchedule && (
                <div className="flex items-center justify-between gap-3">
                  <dt className="inline-flex items-center gap-2 text-ink-mute">
                    <Clock3 size={15} aria-hidden />
                    الدوام
                  </dt>
                  <dd className="font-bold">
                    {WORK_SCHEDULE_LABELS[job.workSchedule]}
                  </dd>
                </div>
              )}
              <div className="flex items-center justify-between gap-3">
                <dt className="inline-flex items-center gap-2 text-ink-mute">
                  <History size={15} aria-hidden />
                  الخبرة
                </dt>
                <dd className="font-bold">
                  {experienceText(job.experienceYears)}
                </dd>
              </div>
              {job.applicationDeadline && (
                <div className="flex items-center justify-between gap-3">
                  <dt className="inline-flex items-center gap-2 text-ink-mute">
                    <CalendarDays size={15} aria-hidden />
                    آخر موعد للتقديم
                  </dt>
                  <dd className="font-bold">
                    {formatDateAr(job.applicationDeadline)}
                  </dd>
                </div>
              )}
              {job.category && (
                <div className="flex items-center justify-between gap-3">
                  <dt className="inline-flex items-center gap-2 text-ink-mute">
                    <Building2 size={15} aria-hidden />
                    المجال
                  </dt>
                  <dd className="font-bold">{job.category.name}</dd>
                </div>
              )}
            </dl>

            {deadlinePassed && (
              <div className="alert alert-warning mt-5 text-sm">
                <TriangleAlert size={16} aria-hidden />
                انتهى موعد التقديم على هذه الوظيفة
              </div>
            )}

            <div className="mt-6">
              {isStaff ? (
                <p className="text-center text-sm text-ink-mute">
                  حساب إداري — لا يمكن التقديم على الوظائف.
                </p>
              ) : !user ? (
                <div className="space-y-3">
                  <Link
                    href={loginHref}
                    className="btn btn-primary btn-lg btn-block"
                  >
                    <LogIn size={16} aria-hidden />
                    سجّل الدخول للتقديم
                  </Link>
                  <Link
                    href={registerHref}
                    className="btn btn-secondary btn-block"
                  >
                    <UserPlus size={16} aria-hidden />
                    ليس لديك حساب؟ أنشئ حساباً
                  </Link>
                </div>
              ) : !user.isPhoneVerified ? (
                <div className="space-y-3">
                  <div className="alert alert-warning text-sm">
                    تأكيد رقم الهاتف مطلوب قبل التقديم
                  </div>
                  <Link
                    href="/verify-phone"
                    className="btn btn-primary btn-block"
                  >
                    تأكيد رقم الهاتف
                  </Link>
                </div>
              ) : alreadyApplied ? (
                <div className="space-y-3 text-center">
                  <div className="alert alert-success">
                    تم تقديم طلبك على هذه الوظيفة
                  </div>
                  <Link
                    href="/seeker/applications"
                    className="btn btn-secondary btn-block"
                  >
                    متابعة طلباتي
                  </Link>
                </div>
              ) : (
                <ApplyForm jobId={job.id} />
              )}
            </div>
          </div>

          {!isStaff &&
            (user?.isPhoneVerified ? (
              <SaveJobButton jobId={job.id} initiallySaved={initiallySaved} />
            ) : (
              <Link
                href={loginHref}
                className="btn btn-secondary btn-block"
              >
                سجّل الدخول لحفظ الوظيفة
              </Link>
            ))}

          {user && !isStaff && <ReportJobForm jobId={job.id} />}
          {!user && (
            <p className="text-center text-xs text-ink-mute">
              <Link href={loginHref} className="link text-xs">
                سجّل الدخول
              </Link>{" "}
              للإبلاغ عن الوظيفة
            </p>
          )}
        </aside>
      </div>
    </main>
  );
}
