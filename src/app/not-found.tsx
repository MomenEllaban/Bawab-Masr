import Link from "next/link";
import type { Metadata } from "next";
import { Search, House, Briefcase } from "lucide-react";

export const metadata: Metadata = {
  title: "الصفحة غير موجودة — بواب مصر",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-4 py-10">
      <div className="card w-full max-w-md px-6 py-10 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-navy-50 text-navy">
          <Search size={30} aria-hidden />
        </span>
        <h1 className="mt-5 text-3xl font-extrabold">404 — الصفحة غير موجودة</h1>
        <p className="mt-3 leading-relaxed text-ink-soft">
          ربما تم نقل الصفحة أو أن الرابط غير صحيح.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn btn-primary">
            <House size={16} aria-hidden />
            الصفحة الرئيسية
          </Link>
          <Link href="/jobs" className="btn btn-secondary">
            <Briefcase size={16} aria-hidden />
            تصفح الوظائف
          </Link>
        </div>
      </div>
    </main>
  );
}
