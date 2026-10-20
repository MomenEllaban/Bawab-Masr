import {
  Home,
  FileText,
  Bookmark,
  UserRound,
  Lock,
  Briefcase,
  Plus,
  Inbox,
  Building2,
  Search,
  Flag,
  UsersRound,
  ScrollText,
  Settings,
  ListChecks,
  LayoutGrid,
  ShieldCheck,
  KeyRound,
  type LucideIcon,
} from "lucide-react";

/** سجل أيقونات التنقّل — يُمرَّر مفتاح نصي من الخادم (قابل للتسلسل) */
export const NAV_ICONS: Record<string, LucideIcon> = {
  home: Home,
  fileText: FileText,
  bookmark: Bookmark,
  user: UserRound,
  lock: Lock,
  briefcase: Briefcase,
  plus: Plus,
  inbox: Inbox,
  building: Building2,
  search: Search,
  flag: Flag,
  users: UsersRound,
  scroll: ScrollText,
  settings: Settings,
  listChecks: ListChecks,
  grid: LayoutGrid,
  shield: ShieldCheck,
  key: KeyRound,
};

export type NavItem = {
  href: string;
  label: string;
  icon: keyof typeof NAV_ICONS;
  /** إجراء إنشاء — يُبرز بشكل مميّز */
  action?: boolean;
};
