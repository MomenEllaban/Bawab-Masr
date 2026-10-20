import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  /** المسار الأساسي مثل: /seeker/applications */
  basePath: string;
  /** معاملات الاستعلام المحفوظة (تُضاف مع page) */
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  function hrefFor(page: number): string {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (typeof value === "string") params.set(key, value);
      else if (Array.isArray(value)) params.set(key, value[0] ?? "");
    }
    params.set("page", String(page));
    return `${basePath}?${params.toString()}`;
  }

  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  return (
    <nav
      className="mt-8 flex items-center justify-center gap-3"
      aria-label="تنقّل بين الصفحات"
    >
      {prevDisabled ? (
        <span
          className="btn btn-secondary btn-sm cursor-not-allowed opacity-45"
          aria-disabled="true"
        >
          <ChevronRight size={16} aria-hidden />
          السابقة
        </span>
      ) : (
        <Link href={hrefFor(currentPage - 1)} className="btn btn-secondary btn-sm">
          <ChevronRight size={16} aria-hidden />
          السابقة
        </Link>
      )}

      <span className="rounded-full bg-muted px-4 py-1.5 text-sm font-bold text-ink-soft">
        صفحة <span className="text-ink">{currentPage}</span> من {totalPages}
      </span>

      {nextDisabled ? (
        <span
          className="btn btn-secondary btn-sm cursor-not-allowed opacity-45"
          aria-disabled="true"
        >
          التالية
          <ChevronLeft size={16} aria-hidden />
        </span>
      ) : (
        <Link href={hrefFor(currentPage + 1)} className="btn btn-secondary btn-sm">
          التالية
          <ChevronLeft size={16} aria-hidden />
        </Link>
      )}
    </nav>
  );
}
