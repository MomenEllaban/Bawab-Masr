import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container-app flex items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏢</span>
            <span
              className="text-xl font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              بواب مصر
            </span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-start justify-center py-10 px-4">
        <div className="w-full max-w-lg">{children}</div>
      </main>
    </div>
  );
}
