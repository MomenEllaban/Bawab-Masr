import Link from "next/link";

/**
 * شعار بواب مصر — علامة SVG (بوابة/مدخل مقوّس) + اسم نصّي.
 * قابل لإعادة الاستخدام في الهيدر والفوتر وصفحات المصادقة.
 */
export function LogoMark({
  size = 40,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="40" height="40" rx="11" fill="#0B2E4F" />
      <path
        d="M20 6.5c-6.35 0-11.5 5.15-11.5 11.5V34h23V18c0-6.35-5.15-11.5-11.5-11.5Z"
        fill="#ffffff"
        fillOpacity="0.1"
      />
      <path
        d="M12.5 33.5V19a7.5 7.5 0 0 1 15 0v14.5h-15Z"
        fill="#ffffff"
      />
      <path
        d="M16.5 33.5V19.8a3.5 3.5 0 0 1 7 0v13.7h-7Z"
        fill="#0E9F6E"
      />
      <circle cx="22" cy="26.5" r="1.15" fill="#ffffff" />
    </svg>
  );
}

export default function Logo({
  size = 40,
  className = "",
  onDark = false,
}: {
  size?: number;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label="بواب مصر — الصفحة الرئيسية"
    >
      <LogoMark size={size} />
      <span className="flex flex-col leading-none">
        <span
          className={`text-[1.15rem] font-extrabold tracking-tight ${
            onDark ? "text-white" : "text-navy"
          }`}
        >
          بواب <span className="text-emerald-700">مصر</span>
        </span>
        <span
          className={`mt-1 hidden text-[0.65rem] font-semibold sm:block ${
            onDark ? "text-white/60" : "text-ink-mute"
          }`}
        >
          منصة توظيف البوابين والحراسة
        </span>
      </span>
    </Link>
  );
}
