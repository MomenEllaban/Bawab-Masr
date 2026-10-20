import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Logo from "@/components/ui/logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="container-app flex items-center justify-between py-5">
        <Logo size={36} />
        <Link href="/" className="link-muted inline-flex items-center gap-1.5 text-sm">
          <ArrowRight size={15} aria-hidden />
          العودة للرئيسية
        </Link>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pb-14 pt-4 sm:pt-8">
        <div className="w-full max-w-lg animate-drop">{children}</div>
      </main>
    </div>
  );
}
