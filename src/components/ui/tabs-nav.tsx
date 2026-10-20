import Link from "next/link";

export type TabItem = {
  href: string;
  label: string;
  count?: number;
  active?: boolean;
};

/**
 * تبويبات تنقل (روابط) — تُحدَّد الحالة النشطة على الخادم من searchParams،
 * مع دلالات ARIA الصحيحة (aria-current).
 */
export default function TabsNav({
  items,
  label,
}: {
  items: TabItem[];
  label: string;
}) {
  return (
    <nav
      className="scroll-x mb-7 flex gap-1 border-b border-line"
      aria-label={label}
    >
      {items.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          aria-current={tab.active ? "page" : undefined}
          className={`relative flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-bold transition-colors ${
            tab.active
              ? "text-navy"
              : "text-ink-mute hover:text-ink"
          }`}
        >
          {tab.label}
          {typeof tab.count === "number" ? (
            <span
              className={`badge ${
                tab.active ? "badge-brand" : "badge-neutral"
              } text-[0.72rem]`}
            >
              {tab.count}
            </span>
          ) : null}
          {tab.active ? (
            <span
              aria-hidden
              className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-emerald-700"
            />
          ) : null}
        </Link>
      ))}
    </nav>
  );
}
