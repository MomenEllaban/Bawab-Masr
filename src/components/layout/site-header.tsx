import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import HeaderClient, { type HeaderLink } from "./header-client";

const NAV_LINKS: HeaderLink[] = [
  { href: "/jobs", label: "الوظائف" },
  { href: "/how-it-works", label: "كيف يعمل؟" },
  { href: "/for-job-seekers", label: "للباحثين" },
  { href: "/for-property-owners", label: "لأصحاب العقارات" },
  { href: "/about", label: "عن المنصة" },
];

async function getDashboardLinks(
  userId: string,
  systemRoles: string[] | undefined
): Promise<HeaderLink[]> {
  const links: HeaderLink[] = [];

  if (systemRoles?.some((role) => role === "ADMIN" || role === "MODERATOR")) {
    links.push({ href: "/admin", label: "لوحة الإدارة" });
  }

  const [employerProfile, seekerProfile] = await Promise.all([
    prisma.employerProfile.findUnique({
      where: { userId },
      select: { id: true },
    }),
    prisma.seekerProfile.findUnique({
      where: { userId },
      select: { id: true },
    }),
  ]);

  if (employerProfile) {
    links.push({ href: "/employer", label: "لوحة صاحب العقار" });
  }
  if (seekerProfile) {
    links.push({ href: "/seeker", label: "حسابي" });
  }

  return links;
}

export default async function SiteHeader() {
  const session = await auth();
  const user = session?.user;

  const dashboardLinks = user
    ? await getDashboardLinks(user.id, user.systemRoles)
    : [];

  return (
    <HeaderClient
      navLinks={NAV_LINKS}
      dashboardLinks={dashboardLinks}
      user={user ? { name: user.name ?? "مستخدم" } : null}
    />
  );
}
