"use client";

import Link from "next/link";
import { TriangleAlert, RefreshCw, House } from "lucide-react";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-4 py-10">
      <div className="card w-full max-w-md px-6 py-10 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-danger-bg text-danger">
          <TriangleAlert size={30} aria-hidden />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold">حدث خطأ غير متوقع</h1>
        <p className="mt-3 leading-relaxed text-ink-soft">
          نعتذر، حدث خطأ أثناء معالجة الطلب. حاول مرة أخرى أو عُد للصفحة
          الرئيسية.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="btn btn-primary">
            <RefreshCw size={16} aria-hidden />
            حاول مرة أخرى
          </button>
          <Link href="/" className="btn btn-secondary">
            <House size={16} aria-hidden />
            الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </main>
  );
}
