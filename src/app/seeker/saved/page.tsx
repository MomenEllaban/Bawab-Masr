/**
 * app/seeker/saved/page.tsx
 * الوظائف المحفوظة — عرض وإزالة
 */

import type { Metadata } from "next";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/permissions";
import PageHeader from "@/components/ui/page-header";
import EmptyState from "@/components/ui/empty-state";
import StatusBadge from "@/components/ui/status-badge";
import SeekerRemoveSavedButton from "@/components/forms/seeker-remove-saved-button";
import {
  JOB_STATUS_BADGE,
  JOB_STATUS_LABELS,
  WORK_TYPE_LABELS,
  formatDateAr,
  formatSalary,
} from "@/lib/labels";

export const metadata: Metadata = {
  title: "الوظائف المحفوظة — بواب مصر",
};

export default async function SeekerSavedPage() {
  const user = await requireAuth();

  const savedJobs = await prisma.savedJob.findMany({
    where: { userId: user.id },
    orderBy: { savedAt: "desc" },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          workType: true,
          salaryMin: true,
          salaryMax: true,
          salaryPeriod: true,
          isSalaryPublic: true,
          poster: { select: { displayName: true } },
          province: { select: { name: true } },
        },
      },
    },
  });

  return (
    <div>
      <PageHeader
        title="الوظائف المحفوظة"
        description="قائمة الوظائف التي حفظتها لتراجعها وتقديم عليها في الوقت المناسب."
      />

      {savedJobs.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="لم تحفظ أي وظيفة بعد"
          description="اضغط على أيقونة الحفظ في أي وظيفة تهمك لتجدها هنا في أي وقت."
          actionHref="/jobs"
          actionLabel="تصفّح الوظائف"
        />
      ) : (
        <ul className="card divide-y divide-line overflow-hidden p-0">
          {savedJobs.map((saved) => {
            const isPublished = saved.job.status === "PUBLISHED";

            return (
              <li
                key={saved.id}
                className="flex flex-wrap items-start justify-between gap-3 px-5 py-4 transition-colors hover:bg-muted/60"
              >
                <div className="min-w-0 flex-1 basis-64">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-bold">
                      {isPublished ? (
                        <Link
                          href={`/jobs/${saved.job.slug}`}
                          className="link"
                        >
                          {saved.job.title}
                        </Link>
                      ) : (
                        saved.job.title
                      )}
                    </h2>
                    {!isPublished ? (
                      <StatusBadge
                        label={JOB_STATUS_LABELS[saved.job.status]}
                        variant={JOB_STATUS_BADGE[saved.job.status]}
                        dot
                      />
                    ) : null}
                  </div>

                  <p className="mt-1 text-xs text-ink-mute">
                    {[
                      saved.job.poster.displayName,
                      saved.job.province?.name,
                    ]
                      .filter(Boolean)
                      .join(" • ")}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="badge badge-outline">
                      {WORK_TYPE_LABELS[saved.job.workType]}
                    </span>
                    <span className="badge badge-neutral">
                      {formatSalary(
                        saved.job.salaryMin,
                        saved.job.salaryMax,
                        saved.job.salaryPeriod,
                        saved.job.isSalaryPublic
                      )}
                    </span>
                    <span className="text-xs text-ink-mute">
                      حُفظت في {formatDateAr(saved.savedAt)}
                    </span>
                  </div>

                  {!isPublished ? (
                    <p className="mt-2 text-xs text-ink-mute">
                      هذه الوظيفة لم تعد متاحة حالياً، ويمكنك إزالتها من
                      القائمة.
                    </p>
                  ) : null}
                </div>

                <div className="shrink-0">
                  <SeekerRemoveSavedButton jobId={saved.job.id} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
