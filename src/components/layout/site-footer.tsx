import Link from "next/link";
import { LogoMark } from "@/components/ui/logo";

type FooterCol = {
  title: string;
  links: { href: string; label: string }[];
};

const COLUMNS: FooterCol[] = [
  {
    title: "للباحثين عن عمل",
    links: [
      { href: "/jobs", label: "تصفّح الوظائف" },
      { href: "/for-job-seekers", label: "دليل الباحث عن عمل" },
      { href: "/register?role=SEEKER", label: "سجّل كباحث" },
      { href: "/how-it-works", label: "كيف تعمل المنصة؟" },
    ],
  },
  {
    title: "لأصحاب العقارات",
    links: [
      { href: "/for-property-owners", label: "دليل أصحاب العقارات" },
      { href: "/register?role=EMPLOYER", label: "سجّل كصاحب عقار" },
      { href: "/faq", label: "الأسئلة الشائعة" },
      { href: "/contact", label: "تواصل معنا" },
    ],
  },
  {
    title: "المنصة",
    links: [
      { href: "/about", label: "عن بواب مصر" },
      { href: "/safety", label: "السلامة والأمان" },
      { href: "/terms", label: "شروط الاستخدام" },
      { href: "/privacy", label: "سياسة الخصوصية" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="mt-auto bg-navy-900 text-white/70 no-print">
      <div className="container-app py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <LogoMark size={38} />
              <span className="text-lg font-extrabold text-white">
                بواب <span className="text-emerald">مصر</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              منصة مصرية تربط البوابين والحراس بأصحاب العقارات واتحادات الملاك
              وشركات إدارة العقارات — مباشرة وبدون وسيط.
            </p>
            <p className="mt-4 text-xs font-semibold text-white/40">
              الإسكندرية — جمهورية مصر العربية
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="mb-4 text-sm font-bold text-white">{col.title}</h3>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/60 transition-colors hover:text-emerald"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row">
          <p>
            © {new Date().getFullYear()} بواب مصر — جميع الحقوق محفوظة.
          </p>
          <p>
            صُمّمت لخدمة العاملين في قطاع إدارة العقارات في مصر.
          </p>
        </div>
      </div>
    </footer>
  );
}
