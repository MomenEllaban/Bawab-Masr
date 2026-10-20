import type { ReactNode } from "react";
import { requireModerator } from "@/lib/permissions";
import DashboardShell from "@/components/layout/dashboard-shell";
import type { NavItem } from "@/components/layout/nav-icons";

const NAV_LINKS: NavItem[] = [
  { href: "/admin", label: "الرئيسية", icon: "grid" },
  { href: "/admin/jobs", label: "مراجعة الوظائف", icon: "shield" },
  { href: "/admin/reports", label: "البلاغات", icon: "flag" },
  { href: "/admin/users", label: "المستخدمون", icon: "users" },
  { href: "/admin/audit", label: "سجل التدقيق", icon: "scroll" },
];

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireModerator();

  return (
    <DashboardShell links={NAV_LINKS} sectionLabel="لوحة الإدارة">
      {children}
    </DashboardShell>
  );
}
