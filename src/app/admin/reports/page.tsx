import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Flag, Inbox, RefreshCw, TriangleAlert } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import PageHeader from "@/components/ui/page-header";
import EmptyState from "@/components/ui/empty-state";
import StatusBadge from "@/components/ui/status-badge";
import Pagination from "@/components/ui/pagination";
import TabsNav from "@/components/ui/tabs-nav";
import ReportActionButton from "@/components/admin/report-action-button";
import {
  REPORT_STATUS_BADGE,
  REPORT_TARGET_LABELS,
} from "@/components/admin/constants";
import { REPORT_STATUS_LABELS, formatDateAr } from "@/lib/labels";

export const metadata: Metadata = {
  title: "البلاغات — بواب مصر",
};

const PAGE_SIZE = 10;

type ReportsTab = "open" | "all" | "resolved";

type ReportsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

type AdminReport = Prisma.ReportGetPayload<{
  include: { reporter: { select: { name: true; phone: true } } };
}>;

type TargetJob = { id: string; slug: string; title: string };

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function parsePage(value: string): number {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export default async function AdminReportsPage({ searchParams }: ReportsPageProps) {
  const params = await searchParams;

  const rawTab = firstParam(params.tab);
  const tab: ReportsTab =
    rawTab === "all" || rawTab === "resolved" ? rawTab : "open";
  const page = parsePage(firstParam(params.page));

  const where: Prisma.ReportWhereInput =
    tab === "open"
      ? { status: { in: ["OPEN", "UNDER_REVIEW"] } }
      : tab === "resolved"
        ? { status: { in: ["RESOLVED", "DISMISSED"] } }
        : {};

  let reports: AdminReport[] = [];
  let total = 0;
  let openCount = 0;
  let allCount = 0;
  let resolvedCount = 0;
  let targetJobs: TargetJob[] = [];
  let hasDbError = false;

  try {
    [reports, total, openCount, allCount, resolvedCount] = await Promise.all([
      prisma.report.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: {
          reporter: { select: { name: true, phone: true } },
        },
      }),
      prisma.report.count({ where }),
      prisma.report.count({
        where: { status: { in: ["OPEN", "UNDER_REVIEW"] } },
      }),
      prisma.report.count(),
      prisma.report.count({
        where: { status: { in: ["RESOLVED", "DISMISSED"] } },
      }),
    ]);

    // روابط الوظائف — مسارات الوظائف تعتمد slug وليس id
    const jobIds = reports
      .filter((r) => r.targetType === "JOB")
      .map((r) => r.targetId);
    if (jobIds.length > 0) {
      targetJobs = await prisma.job.findMany({
        where: { id: { in: jobIds } },
        select: { id: true, slug: true, title: true },
      });
    }
  } catch (error) {
    console.error("[admin-reports-page]", error);
    hasDbError = true;
  }

  const jobMap = new Map(targetJobs.map((j) => [j.id, j]));

  if (hasDbError) {
    return (
      <div>
        <PageHeader title="البلاغات" description="راجع البلاغات المقدمة من المستخدمين وعالجها" />
        <div className="alert alert-error flex-col items-center text-center">
          <TriangleAlert size={22} aria-hidden />
          <h2 className="text-lg font-bold">تعذّر تحميل البلاغات</h2>
          <p className="mt-1">
            حدث خطأ أثناء جلب قائمة البلاغات المقدَّمة من المستخدمين. يرجى
            المحاولة مرة أخرى بعد قليل.
          </p>
          <Link
            href={`/admin/reports?tab=${tab}`}
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
      href: "/admin/reports?tab=open",
      label: "مفتوحة",
      count: openCount,
      active: tab === "open",
    },
    {
      href: "/admin/reports?tab=all",
      label: "الكل",
      count: allCount,
      active: tab === "all",
    },
    {
      href: "/admin/reports?tab=resolved",
      label: "مغلقة",
      count: resolvedCount,
      active: tab === "resolved",
    },
  ];

  return (
    <div>
      <PageHeader
        title="البلاغات"
        description="راجع البلاغات المقدمة من المستخدمين وعالجها"
      />

      <TabsNav label="تصفية حسب حالة البلاغ" items={tabs} />

      {reports.length === 0 ? (
        tab === "open" ? (
          <EmptyState
            icon={Flag}
            title="لا توجد بلاغات مفتوحة"
            description="كل البلاغات تمت معالجتها."
            secondaryHref="/admin/reports?tab=all"
            secondaryLabel="عرض كل البلاغات"
          />
        ) : tab === "resolved" ? (
          <EmptyState
            icon={BadgeCheck}
            title="لا توجد بلاغات مغلقة"
            description="لم تُغلق أي بلاغات بعد — البلاغات المغلقة ستظهر هنا."
            secondaryHref="/admin/reports?tab=open"
            secondaryLabel="عرض البلاغات المفتوحة"
          />
        ) : (
          <EmptyState
            icon={Inbox}
            title="لا توجد بلاغات"
            description="لم يتقدّم أي مستخدم ببلاغ حتى الآن."
          />
        )
      ) : (
        <ul className="card divide-y divide-line p-0">
          {reports.map((report) => {
            const isClosed =
              report.status === "RESOLVED" || report.status === "DISMISSED";
            const targetJob =
              report.targetType === "JOB"
                ? jobMap.get(report.targetId)
                : undefined;

            return (
              <li
                key={report.id}
                className="px-5 py-4 transition-colors hover:bg-muted/60"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 basis-64">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-bold">{report.reason}</h2>
                      <span className="badge badge-outline">
                        {REPORT_TARGET_LABELS[report.targetType] ??
                          report.targetType}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-mute">
                      مقدَّم من {report.reporter.name} •{" "}
                      <span dir="ltr">{report.reporter.phone}</span> •{" "}
                      {formatDateAr(report.createdAt)}
                    </p>
                  </div>
                  <StatusBadge
                    label={REPORT_STATUS_LABELS[report.status]}
                    variant={REPORT_STATUS_BADGE[report.status]}
                    dot
                  />
                </div>

                {report.details ? (
                  <p className="mt-3 rounded-soft bg-muted px-3 py-2 text-sm leading-relaxed text-ink-soft">
                    {report.details}
                  </p>
                ) : null}

                {targetJob ? (
                  <p className="mt-2 text-sm">
                    الوظيفة المُبلَّغ عنها:{" "}
                    <Link href={`/jobs/${targetJob.slug}`} className="link">
                      {targetJob.title}
                    </Link>
                  </p>
                ) : null}

                <div className="mt-3 border-t border-line pt-3">
                  {isClosed ? (
                    <p className="text-xs text-ink-mute">
                      أُغلق بتاريخ {formatDateAr(report.resolvedAt)}
                    </p>
                  ) : (
                    <div className="flex flex-wrap items-center gap-3">
                      <ReportActionButton
                        reportId={report.id}
                        resolution="RESOLVED"
                        label="معالَج"
                        confirmLabel="تأكيد معالجة البلاغ؟"
                        variant="btn-primary"
                      />
                      <ReportActionButton
                        reportId={report.id}
                        resolution="DISMISSED"
                        label="مرفوض"
                        confirmLabel="تأكيد رفض/إغلاق البلاغ؟"
                        variant="btn-secondary"
                      />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/admin/reports"
        searchParams={{ tab }}
      />
    </div>
  );
}
