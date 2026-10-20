import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  /** لون أيقونة اختياري */
  tone?: "brand" | "accent" | "warning" | "danger";
};

const TONES: Record<NonNullable<StatCardProps["tone"]>, string> = {
  brand: "bg-navy-50 text-navy",
  accent: "bg-emerald-50 text-emerald-700",
  warning: "bg-warning-bg text-warning",
  danger: "bg-danger-bg text-danger",
};

export default function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "brand",
}: StatCardProps) {
  return (
    <div className="card flex items-center gap-4 p-5">
      {Icon ? (
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-card ${TONES[tone]}`}
          aria-hidden
        >
          <Icon size={21} />
        </span>
      ) : null}
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink-mute">{label}</p>
        <p className="mt-0.5 truncate text-2xl font-extrabold leading-tight text-ink">
          {value}
        </p>
        {hint ? (
          <p className="mt-0.5 truncate text-xs text-ink-mute">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}
