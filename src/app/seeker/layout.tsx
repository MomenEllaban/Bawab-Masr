import type { ReactNode } from "react";
import { requireAuth } from "@/lib/permissions";
import DashboardShell from "@/components/layout/dashboard-shell";
import type { NavItem } from "@/components/layout/nav-icons";

const NAV_LINKS: NavItem[] = [
  { href: "/seeker", label: "الرئيسية", icon: "home" },
  { href: "/seeker/applications", label: "تقديماتي", icon: "fileText" },
  { href: "/seeker/saved", label: "الوظائف المحفوظة", icon: "bookmark" },
  { href: "/seeker/profile", label: "الملف الشخصي", icon: "user" },
  { href: "/seeker/settings", label: "الإعدادات", icon: "settings" },
];

export default async function SeekerLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAuth();

  return (
    <DashboardShell links={NAV_LINKS} sectionLabel="بوابة الباحث عن عمل">
      {children}
    </DashboardShell>
  );
}
