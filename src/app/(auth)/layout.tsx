import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-[calc(100dvh-4.5rem)] items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-lg animate-drop">{children}</div>
    </main>
  );
}
