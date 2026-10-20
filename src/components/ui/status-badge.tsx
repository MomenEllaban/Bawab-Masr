const VARIANTS = [
  "badge-published",
  "badge-pending",
  "badge-rejected",
  "badge-draft",
  "badge-hired",
  "badge-success",
  "badge-warning",
  "badge-danger",
  "badge-info",
  "badge-neutral",
  "badge-brand",
  "badge-outline",
] as const;

export type BadgeVariant = (typeof VARIANTS)[number];

type StatusBadgeProps = {
  label: string;
  variant: BadgeVariant | (string & {});
  /** نقطة صغيرة أمام النص (دلالة حيّة) */
  dot?: boolean;
};

export default function StatusBadge({ label, variant, dot }: StatusBadgeProps) {
  const isKnown = (VARIANTS as readonly string[]).includes(variant);
  return (
    <span className={`badge ${isKnown ? variant : "badge-neutral"}`}>
      {dot ? (
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-70"
        />
      ) : null}
      {label}
    </span>
  );
}
