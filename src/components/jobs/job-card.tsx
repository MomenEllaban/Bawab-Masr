import Link from "next/link";
import { MapPin, Briefcase, Wallet, ArrowLeft, Building2 } from "lucide-react";
import type { JobStatus, SalaryPeriod, WorkType } from "@prisma/client";
import {
  JOB_STATUS_LABELS,
  JOB_STATUS_BADGE,
  WORK_TYPE_LABELS,
  formatSalary,
  formatDateAr,
} from "@/lib/labels";

export type JobCardData = {
  slug: string;
  title: string;
  description: string;
  workType: WorkType;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryPeriod: SalaryPeriod;
  isSalaryPublic: boolean;
  housingProvided?: boolean;
  publishedAt?: Date | null;
  status?: JobStatus;
  province?: { name: string } | null;
  area?: { name: string } | null;
  poster: { displayName: string };
};

function excerpt(text: string, max = 150): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).trimEnd()}…`;
}

export default function JobCard({
  job,
  showStatus = false,
}: {
  job: JobCardData;
  showStatus?: boolean;
}) {
  const location = [job.province?.name, job.area?.name]
    .filter(Boolean)
    .join(" • ");

  return (
    <article className="card card-interactive group relative flex flex-col justify-between overflow-hidden p-5 transition-all lg:p-6 hover:shadow-lg">
      {/* مؤشر بصري علوي هادئ */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-navy via-emerald to-navy opacity-0 transition-opacity group-hover:opacity-100" />

      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy border border-navy/10 group-hover:bg-emerald-50 group-hover:text-emerald-700 group-hover:border-emerald/20 transition-colors">
              <Building2 size={20} aria-hidden />
            </span>
            <div className="min-w-0">
              <h3 className="text-base font-extrabold leading-snug lg:text-lg">
                <Link
                  href={`/jobs/${job.slug}`}
                  className="link text-ink hover:text-emerald-700 transition-colors"
                >
                  {job.title}
                </Link>
              </h3>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-ink-mute">
                <span className="font-semibold text-ink-soft">
                  {job.poster.displayName}
                </span>
                {location ? (
                  <>
                    <span aria-hidden className="text-line-strong">•</span>
                    <span className="inline-flex items-center gap-1 text-ink-mute">
                      <MapPin size={13} className="text-emerald-700" aria-hidden />
                      {location}
                    </span>
                  </>
                ) : null}
              </p>
            </div>
          </div>

          {job.publishedAt ? (
            <time
              className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[0.7rem] font-medium text-ink-mute"
              dateTime={job.publishedAt.toISOString()}
            >
              {formatDateAr(job.publishedAt)}
            </time>
          ) : null}
        </div>

        {/* شارات المزايا والحالة */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {showStatus && job.status ? (
            <span className={`badge ${JOB_STATUS_BADGE[job.status]}`}>
              {JOB_STATUS_LABELS[job.status]}
            </span>
          ) : null}
          <span className="badge badge-brand">
            <Wallet size={12} aria-hidden />
            {formatSalary(
              job.salaryMin,
              job.salaryMax,
              job.salaryPeriod,
              job.isSalaryPublic
            )}
          </span>
          <span className="badge badge-outline">
            <Briefcase size={12} aria-hidden />
            {WORK_TYPE_LABELS[job.workType]}
          </span>
          {job.housingProvided ? (
            <span className="badge badge-success font-bold inline-flex items-center gap-1">
              <Building2 size={12} aria-hidden />
              سكن متوفر
            </span>
          ) : null}
        </div>

        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-ink-soft">
          {excerpt(job.description)}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-line/70 pt-3 text-xs">
        <span className="font-semibold text-ink-mute">
          {job.area?.name ?? "الإسكندرية"}
        </span>
        <Link
          href={`/jobs/${job.slug}`}
          className="inline-flex items-center gap-1 font-bold text-navy group-hover:text-emerald-700 transition-colors"
        >
          <span>عرض التفاصيل والتقديم</span>
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
