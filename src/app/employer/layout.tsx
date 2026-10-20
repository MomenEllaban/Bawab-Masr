import type { ReactNode } from "react";
import { requireAuth } from "@/lib/permissions";
import DashboardShell from "@/components/layout/dashboard-shell";
import type { NavItem } from "@/components/layout/nav-icons";

const NAV_LINKS: NavItem[] = [
  { href: "/employer", label: "الرئيسية", icon: "home" },
  { href: "/employer/jobs", label: "إعلاناتي", icon: "briefcase" },
  { href: "/employer/jobs/new", label: "إضافة وظيفة", icon: "plus", action: true },
  { href: "/employer/applications", label: "الطلبات الواردة", icon: "inbox" },
  { href: "/employer/properties", label: "العقارات", icon: "building" },
  { href: "/employer/profile", label: "الملف الشخصي", icon: "user" },
  { href: "/employer/settings", label: "الإعدادات", icon: "settings" },
];

export default async function EmployerLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAuth();

  return (
    <DashboardShell links={NAV_LINKS} sectionLabel="بوابة صاحب العقار">
      {children}
    </DashboardShell>
  );
}
