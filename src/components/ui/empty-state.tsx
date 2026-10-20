import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Inbox, ArrowLeft } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  icon?: LucideIcon;
  /** إجراء ثانوي (اختياري) */
  secondaryHref?: string;
  secondaryLabel?: string;
};

export default function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
  icon: Icon = Inbox,
  secondaryHref,
  secondaryLabel,
}: EmptyStateProps) {
  return (
    <div className="card flex flex-col items-center px-6 py-12 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-navy-50 text-navy">
        <Icon size={30} aria-hidden strokeWidth={1.75} />
      </span>
      <h2 className="mt-5 text-lg font-bold lg:text-xl">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-md leading-relaxed text-ink-soft">
          {description}
        </p>
      ) : null}
      {actionHref && actionLabel ? (
        <Link href={actionHref} className="btn btn-primary mt-6">
          {actionLabel}
          <ArrowLeft size={16} aria-hidden />
        </Link>
      ) : null}
      {secondaryHref && secondaryLabel ? (
        <Link href={secondaryHref} className="link mt-4 text-sm">
          {secondaryLabel}
        </Link>
      ) : null}
    </div>
  );
}
