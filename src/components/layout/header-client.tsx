"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Menu, X, LogOut, LayoutDashboard, UserRound } from "lucide-react";
import Logo from "@/components/ui/logo";
import { logoutAction } from "@/server/actions/auth";

export type HeaderLink = { href: string; label: string };

type HeaderClientProps = {
  navLinks: HeaderLink[];
  dashboardLinks: HeaderLink[];
  user: { name: string } | null;
};

export default function HeaderClient({
  navLinks,
  dashboardLinks,
  user,
}: HeaderClientProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);

  // إغلاق القائمة عند تغيّر المسار (معايرة الحالة أثناء العرض)
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-surface/90 backdrop-blur-md transition-shadow ${
        scrolled ? "border-line shadow-sm" : "border-line/70"
      }`}
    >
      <div className="container-app flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
        <Logo size={38} />

        {/* التنقّل — سطح المكتب */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="التنقّل الرئيسي">
          {dashboardLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`rounded-soft px-3 py-2 text-sm font-bold transition-colors ${
                isActive(link.href)
                  ? "bg-navy-50 text-navy"
                  : "text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`rounded-soft px-3 py-2 text-sm font-semibold transition-colors ${
                isActive(link.href)
                  ? "bg-muted text-ink"
                  : "text-ink-soft hover:bg-muted hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* الإجراءات — سطح المكتب */}
        <div className="hidden items-center gap-2.5 lg:flex">
          {user ? (
            <>
              <span className="max-w-[12rem] truncate text-sm font-semibold text-ink-soft">
                مرحباً، {user.name}
              </span>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="btn btn-secondary btn-sm"
                  aria-label="تسجيل الخروج"
                  title="تسجيل الخروج"
                >
                  <LogOut size={15} aria-hidden />
                  خروج
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">
                تسجيل الدخول
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                إنشاء حساب
              </Link>
            </>
          )}
        </div>

        {/* زر القائمة — الجوال */}
        <button
          type="button"
          className="icon-btn lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* قائمة الجوال */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="animate-drop border-t border-line bg-surface lg:hidden"
      >
        <nav
          className="container-app flex flex-col gap-1 py-4"
          aria-label="التنقّل في الجوال"
        >
          {dashboardLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`flex items-center gap-2 rounded-soft px-3 py-2.5 text-sm font-bold ${
                isActive(link.href)
                  ? "bg-navy-50 text-navy"
                  : "text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              <LayoutDashboard size={16} aria-hidden />
              {link.label}
            </Link>
          ))}
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`rounded-soft px-3 py-2.5 text-sm font-semibold ${
                isActive(link.href) ? "bg-muted text-ink" : "text-ink-soft"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-3 border-t border-line pt-3">
            <MobileActions user={user} />
          </div>
        </nav>
      </div>
    </header>
  );
}

function MobileActions({ user }: { user: { name: string } | null }): ReactNode {
  if (user) {
    return (
      <div className="flex items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-2">
          <UserRound size={16} aria-hidden className="shrink-0 text-ink-mute" />
          <span className="truncate text-sm font-semibold text-ink">
            {user.name}
          </span>
        </span>
        <form action={logoutAction}>
          <button
            type="submit"
            className="btn btn-secondary btn-sm"
            aria-label="تسجيل الخروج"
          >
            <LogOut size={15} aria-hidden />
            خروج
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2.5">
      <Link href="/login" className="btn btn-secondary">
        تسجيل الدخول
      </Link>
      <Link href="/register" className="btn btn-primary">
        إنشاء حساب
      </Link>
    </div>
  );
}
