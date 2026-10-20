import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { Search, SlidersHorizontal, SearchX } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import JobCard from "@/components/jobs/job-card";
import EmptyState from "@/components/ui/empty-state";
import Reveal from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "الوظائف المتاحة — بواب مصر",
  description:
    "تصفّح أحدث وظائف البوابين والحراس المنشورة في الإسكندرية ومصر، وابحث بالكلمة والمحافظة.",
};

type JobsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

type JobListItem = Prisma.JobGetPayload<{
  include: {
    province: { select: { name: true; slug: true } };
    area: { select: { name: true } };
    poster: { select: { displayName: true } };
  };
}>;

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;
  const query = firstParam(params.q).trim();
  const provinceSlug = firstParam(params.province).trim();
  const hasFilters = query.length > 0 || provinceSlug.length > 0;

  let jobs: JobListItem[] = [];
  let total = 0;
  let provinces: { id: string; name: string; slug: string }[] = [];
  let hasDbError = false;

  try {
    const where: Prisma.JobWhereInput = {
      status: "PUBLISHED",
      reviewStatus: "APPROVED",
    };
    if (query.length > 0) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }
    if (provinceSlug.length > 0) {
      where.province = { slug: provinceSlug };
    }

    const [jobsResult, countResult, provincesResult] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        take: 20,
        include: {
          province: { select: { name: true, slug: true } },
          area: { select: { name: true } },
          poster: { select: { displayName: true } },
        },
      }),
      prisma.job.count({ where }),
      prisma.province.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        select: { id: true, name: true, slug: true },
      }),
    ]);

    jobs = jobsResult;
    total = countResult;
    provinces = provincesResult;
  } catch (error) {
    console.error("[jobs-page]", error);
    hasDbError = true;
  }

  if (hasDbError) {
    return (
      <main className="container-app py-12">
        <div className="mx-auto max-w-2xl">
          <div className="alert alert-error flex-col items-center text-center">
            <h1 className="text-xl font-bold">تعذّر تحميل الوظائف</h1>
            <p className="mt-1">
              حدث خطأ أثناء جلب قائمة الوظائف. يرجى المحاولة مرة أخرى بعد
              قليل.
            </p>
            <Link href="/jobs" className="btn btn-primary mt-4">
              إعادة المحاولة
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container-app py-10 lg:py-14">
      <header className="mb-8 max-w-2xl">
        <span className="eyebrow">
          <Search size={13} aria-hidden />
          ابحث وابدأ التقديم
        </span>
        <h1 className="mt-4 text-3xl font-extrabold lg:text-4xl">
          الوظائف المتاحة
        </h1>
        <p className="mt-2 leading-relaxed text-ink-soft">
          {total > 0
            ? `${total} وظيفة منشورة حتى الآن — صفِّ النتائج بالكلمة أو المحافظة.`
            : "تصفّح أحدث الوظائف المنشورة أو ابحث بالكلمة والمحافظة."}
        </p>
      </header>

      <form
        method="get"
        action="/jobs"
        className="card mb-10 grid gap-4 p-4 md:grid-cols-[1fr_1fr_auto] md:items-end lg:p-5"
      >
        <div>
          <label className="form-label" htmlFor="jobs-q">
            كلمة البحث
          </label>
          <input
            id="jobs-q"
            type="search"
            name="q"
            className="form-input"
            placeholder="ابحث بعنوان الوظيفة أو وصفها"
            defaultValue={query}
          />
        </div>
        {provinces.length > 0 && (
          <div>
            <label className="form-label" htmlFor="jobs-province">
              المحافظة
            </label>
            <select
              id="jobs-province"
              name="province"
              className="form-input"
              defaultValue={provinceSlug}
            >
              <option value="">كل المحافظات</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.slug}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary flex-1 md:flex-none">
            <Search size={17} aria-hidden />
            بحث
          </button>
          {hasFilters ? (
            <Link href="/jobs" className="btn btn-ghost">
              مسح الفلاتر
            </Link>
          ) : null}
        </div>
      </form>

      {jobs.length === 0 ? (
        <Reveal>
          {hasFilters ? (
            <EmptyState
              icon={SearchX}
              title="لا توجد نتائج مطابقة"
              description="جرّب كلمات بحث أخرى أو اختر محافظة مختلفة، أو أزل الفلاتر لعرض كل الوظائف."
              actionHref="/jobs"
              actionLabel="عرض كل الوظائف"
            />
          ) : (
            <EmptyState
              icon={SearchX}
              title="لا توجد وظائف متاحة حالياً"
              description="لم تُنشر وظائف جديدة بعد. أنشئ حسابك ليصلك جديد الوظائف أولاً بأول."
              actionHref="/register?role=SEEKER"
              actionLabel="إنشاء حساب باحث عن عمل"
            />
          )}
        </Reveal>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {jobs.map((job, index) => (
            <Reveal key={job.id} delay={Math.min(index, 5) * 60}>
              <JobCard job={job} />
            </Reveal>
          ))}
        </div>
      )}

      {jobs.length > 0 && hasFilters ? (
        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-ink-mute">
          <SlidersHorizontal size={15} aria-hidden />
          عرض {jobs.length} من أصل {total}
        </p>
      ) : null}
    </main>
  );
}
