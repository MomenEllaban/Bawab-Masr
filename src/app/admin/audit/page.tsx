import type { Metadata } from "next";
import Link from "next/link";
import {
  Funnel,
  RefreshCw,
  ScrollText,
  TriangleAlert,
} from "lucide-react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import PageHeader from "@/components/ui/page-header";
import EmptyState from "@/components/ui/empty-state";
import Pagination from "@/components/ui/pagination";
import { formatDateAr } from "@/lib/labels";

export const metadata: Metadata = {
  title: "سجل التدقيق — بواب مصر",
};

const PAGE_SIZE = 10;

type AuditPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

type AuditLogEntry = Prisma.AuditLogGetPayload<{
  include: { actor: { select: { name: true; phone: true } } };
}>;

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function parsePage(value: string): number {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function formatMetadata(metadata: unknown): string | null {
  if (metadata === null || metadata === undefined) return null;
  try {
    return JSON.stringify(metadata, null, 2);
  } catch {
    return null;
  }
}

function truncateId(entityId: string): string {
  return entityId.length > 18 ? `${entityId.slice(0, 18)}…` : entityId;
}

export default async function AdminAuditPage({ searchParams }: AuditPageProps) {
  const params = await searchParams;

  const action = firstParam(params.action).trim();
  const actionLike = firstParam(params.q).trim();
  const entityType = firstParam(params.entityType).trim();
  const page = parsePage(firstParam(params.page));

  const where: Prisma.AuditLogWhereInput = {};
  if (actionLike.length > 0) {
    where.action = { contains: actionLike, mode: "insensitive" };
  } else if (action.length > 0) {
    where.action = action;
  }
  if (entityType.length > 0) {
    where.entityType = entityType;
  }

  let logs: AuditLogEntry[] = [];
  let total = 0;
  let actionGroups: { action: string; _count: { _all: number } }[] = [];
  let entityGroups: { entityType: string; _count: { _all: number } }[] = [];
  let hasDbError = false;

  try {
    [logs, total, actionGroups, entityGroups] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: {
          actor: { select: { name: true, phone: true } },
        },
      }),
      prisma.auditLog.count({ where }),
      prisma.auditLog.groupBy({
        by: ["action"],
        _count: { _all: true },
        orderBy: { action: "asc" },
      }),
      prisma.auditLog.groupBy({
        by: ["entityType"],
        _count: { _all: true },
        orderBy: { entityType: "asc" },
      }),
    ]);
  } catch (error) {
    console.error("[admin-audit-page]", error);
    hasDbError = true;
  }

  if (hasDbError) {
    return (
      <div>
        <PageHeader
          title="سجل التدقيق"
          description="سجل كامل لجميع العمليات الإدارية والحساسة في النظام"
        />
        <div className="alert alert-error flex-col items-center text-center">
          <TriangleAlert size={22} aria-hidden />
          <h2 className="text-lg font-bold">تعذّر تحميل سجل التدقيق</h2>
          <p className="mt-1">
            حدث خطأ أثناء جلب سجل العمليات الإدارية. يرجى المحاولة مرة أخرى
            بعد قليل.
          </p>
          <Link href="/admin/audit" className="btn btn-primary mt-4">
            <RefreshCw size={16} aria-hidden />
            إعادة المحاولة
          </Link>
        </div>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasFilters =
    action.length > 0 || actionLike.length > 0 || entityType.length > 0;

  return (
    <div>
      <PageHeader
        title="سجل التدقيق"
        description="سجل كامل لجميع العمليات الإدارية والحساسة في النظام"
      />

      <form
        method="get"
        action="/admin/audit"
        className="card mb-6 grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end"
      >
        <div>
          <label className="form-label" htmlFor="audit-action">
            الإجراء
          </label>
          <select
            id="audit-action"
            name="action"
            className="form-input"
            defaultValue={action}
          >
            <option value="">كل الإجراءات</option>
            {actionGroups.map((g) => (
              <option key={g.action} value={g.action}>
                {g.action} ({g._count._all})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor="audit-q">
            بحث نصي في الإجراء
          </label>
          <input
            id="audit-q"
            type="text"
            name="q"
            className="form-input"
            placeholder="مثال: JOB"
            defaultValue={actionLike}
          />
        </div>
        <div>
          <label className="form-label" htmlFor="audit-entity">
            نوع السجل
          </label>
          <select
            id="audit-entity"
            name="entityType"
            className="form-input"
            defaultValue={entityType}
          >
            <option value="">كل الأنواع</option>
            {entityGroups.map((g) => (
              <option key={g.entityType} value={g.entityType}>
                {g.entityType} ({g._count._all})
              </option>
            ))}
          </select>
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            <Funnel size={16} aria-hidden />
            تصفية
          </button>
        </div>
      </form>

      {logs.length === 0 ? (
        hasFilters ? (
          <EmptyState
            icon={ScrollText}
            title="لا توجد سجلات"
            description="لا توجد عمليات مسجلة تطابق عوامل التصفية الحالية."
            actionHref="/admin/audit"
            actionLabel="عرض كل السجلات"
          />
        ) : (
          <EmptyState
            icon={ScrollText}
            title="لا توجد سجلات بعد"
            description="لم تُسجَّل أي عملية إدارية في النظام حتى الآن."
          />
        )
      ) : (
        <ul className="card divide-y divide-line p-0">
          {logs.map((log) => {
            const metadataText = formatMetadata(log.metadata);
            return (
              <li
                key={log.id}
                className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-muted/60"
              >
                <span
                  aria-hidden
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy"
                >
                  <ScrollText size={15} />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                    <p className="text-sm font-semibold text-ink">
                      {log.actor ? log.actor.name : "النظام"}
                      {log.actor ? (
                        <span
                          dir="ltr"
                          className="ltr ms-2 text-xs font-normal text-ink-mute"
                        >
                          {log.actor.phone}
                        </span>
                      ) : null}
                    </p>
                    <time
                      className="shrink-0 text-xs text-ink-mute"
                      dateTime={log.createdAt.toISOString()}
                    >
                      {formatDateAr(log.createdAt)}
                    </time>
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <code className="ltr rounded-soft bg-muted px-2 py-0.5 text-xs font-mono font-semibold text-navy">
                      {log.action}
                    </code>
                    <span className="text-xs text-ink-mute">
                      {log.entityType}
                    </span>
                    <span
                      dir="ltr"
                      title={log.entityId}
                      className="ltr text-xs font-mono text-ink-mute"
                    >
                      {truncateId(log.entityId)}
                    </span>
                  </div>

                  {metadataText ? (
                    <pre
                      dir="ltr"
                      className="ltr mt-2.5 w-full overflow-x-auto rounded-soft bg-muted p-3 text-xs font-mono leading-relaxed text-ink-soft"
                    >
                      {metadataText}
                    </pre>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/admin/audit"
        searchParams={{ action, q: actionLike, entityType }}
      />
    </div>
  );
}
