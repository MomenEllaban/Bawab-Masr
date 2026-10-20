"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { NAV_ICONS, type NavItem } from "./nav-icons";

/**
 * هيكل لوحات التحكم:
 * — شريط جانبي ثابت على سطح المكتب (RTL على اليمين ضمن الشبكة).
 * — شريط تبويبات أفقي قابل للتمرير على الجوال.
 * الحالة النشطة تُحدَّد بأطول مسار مطابق لتفادي تداخل المسارات.
 */
export default function DashboardShell({
  links,
  sectionLabel,
  children,
}: {
  links: NavItem[];
  sectionLabel?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();

  let activeHref: string | null = null;
  let activeLength = -1;
  for (const link of links) {
    const isMatch =
      pathname === link.href || pathname.startsWith(`${link.href}/`);
    if (isMatch && link.href.length > activeLength) {
      activeHref = link.href;
      activeLength = link.href.length;
    }
  }

  return (
    <div className="container-app py-6 lg:py-10">
      <div className="lg:grid lg:grid-cols-[15.5rem_minmax(0,1fr)] lg:items-start lg:gap-8">
        {/* الشريط الجانبي — سطح المكتب */}
        <aside className="sticky top-24 hidden lg:block">
          <nav
            aria-label="تنقّل لوحة التحكم"
            className="card overflow-hidden p-3"
          >
            {sectionLabel ? (
              <p className="px-3 pb-2 pt-1 text-xs font-bold text-ink-mute">
                {sectionLabel}
              </p>
            ) : null}
            <ul className="space-y-1">
              {links.map((link) => {
                const Icon = NAV_ICONS[link.icon] ?? NAV_ICONS.home;
                const active = activeHref === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-soft px-3 py-2.5 text-sm transition-colors ${
                        link.action
                          ? "font-bold text-emerald-700 hover:bg-emerald-50"
                          : active
                            ? "bg-navy font-bold text-white shadow-xs"
                            : "font-semibold text-ink-soft hover:bg-muted hover:text-ink"
                      }`}
                    >
                      <Icon size={17} aria-hidden strokeWidth={2} />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <div className="min-w-0">
          {/* شريط التنقّل — الجوال */}
          <nav
            aria-label="تنقّل لوحة التحكم"
            className="scroll-x -mx-4 mb-6 flex gap-1.5 border-b border-line bg-canvas/95 px-4 py-2.5 backdrop-blur-sm sticky top-16 z-30 lg:hidden"
          >
            {links.map((link) => {
              const Icon = NAV_ICONS[link.icon] ?? NAV_ICONS.home;
              const active = activeHref === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-bold transition-colors ${
                    active
                      ? "bg-navy text-white"
                      : link.action
                        ? "border border-emerald/40 bg-emerald-50 text-emerald-700"
                        : "border border-line bg-surface text-ink-soft"
                  }`}
                >
                  <Icon size={14} aria-hidden strokeWidth={2} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
