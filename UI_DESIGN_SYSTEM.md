# بواب مصر — نظام التصميم (UI Design System)

مرجع إلزامي لكل من يعدّل واجهات هذا المشروع. اقرأ `src/app/globals.css` عند الشك.

## القواعد غير القابلة للتفاوض
1. **لا إيموجي كأيقونة إطلاقاً.** استخدم `lucide-react` فقط. أي مكوّن يحتاج أيقونة يمرّرها كـ `icon={LucideIcon}` أو يرسمها `<Icon size={16} aria-hidden />`.
2. **لا إحالات inline إلى CSS variables** مثل `style={{ color: "var(--color-primary)" }}` — استخدم كلاسات التصميم (`text-navy`, `link`, إلخ).
3. **لا ألوان رمادية قديمة** (`text-gray-500`, `bg-gray-50`, `divide-gray-100`, `border-gray-200`) — استخدم توكنات التصميم: `text-ink-soft`, `text-ink-mute`, `bg-muted`, `divide-line`, `border-line`.
4. **RTL أول:** استخدم `ps-`/`pe-`/`ms-`/`me-`/`text-start`/`text-end` و`border-s`/`border-e` بدل `left`/`right`/`ml`/`mr`. أرقام/هواتف/إيميلات داخل `dir="ltr"` مع `text-start`.
5. **حافظ 100% على منطق البيانات:** لا تعدّل استعلامات prisma، server actions، صلاحيات، أنواع zod، شكل `state` المُرسل، ولا أسماء `name` في الحقول (الخادم يقرأها). إعادة ترتيب JSX وتبديل كلاسات التصميم مسموحة.
6. **كل صفحة عامة (public) تحتوي `<main>`** (الـ layout لا يوفّر main).
7. **الصور:** `next/image` مع `width/height` و`alt` عربي وصحيح. لا روابط Unsplash/Pexels. التوضيحات من ملفات SVG المكوّنة في `src/components/illustrations/` أو أيقونات lucide.
8. **الحركة:** كلاسات `reveal` (IntersectionObserver عبر `src/components/ui/reveal.tsx`) + توكنات `duration-brand`/`ease-brand`. لا framer-motion. لا حركة بدون `@media (prefers-reduced-motion: no-preference)` (مُعالَج في globals.css).
9. **العربية:** اكتب محتوى عربياً حقيقياً ومحلياً (Egyptian-friendly، مصطلحات سوق العمل العقاري المصري). لا نصوص لاتينية ولا نص بديل وهمي.
10. **لا اختراع بيانات:** إحصاءات وأسماء وأرقام يجب أن تأتي من قاعدة أو من بيانات فعلية موجودة. لا "10,000 مستخدم" وهمي.

## توكنات الألوان (Tailwind utilities جاهزة)
| الدلالة | كلاسات |
|---|---|
| كحلي أساسي (CTA/ترويسة) | `text-navy`, `bg-navy`, `bg-navy-50`, `border-navy` |
| زمردي (ثانيوي/نجاح/تمييز) | `text-emerald-700`, `bg-emerald-50`, `bg-emerald`, `border-emerald/40` |
| خلفية عامة | `bg-canvas` (الجذر), `bg-surface` (الأبيض) |
| نص | `text-ink` (رئيسي), `text-ink-soft` (ثانوي), `text-ink-mute` (خافت) |
| حدود وخطوط فاصلة | `border-line`, `divide-line`, `bg-muted` |
| حالات | `text-success bg-success-bg`, `text-warning bg-warning-bg`, `text-danger bg-danger-bg`, `text-info bg-info-bg` |
| ظلال | `shadow-xs`, `shadow-soft`, `shadow-brand` |

## الكلاسات المكوّنة (`@layer components` في globals.css)
- **أزرار:** `btn btn-primary | btn-accent | btn-secondary | btn-ghost | btn-danger | btn-on-navy` مع مقاسات `btn-sm btn-lg btn-block`; وسم تحميل `is-loading` + `<span className="btn-spinner" aria-hidden />`; أيقونة صغيرة: `<Icon size={16} />` بعد النص.
- **روابط:** `link` (نص + سهم اختياري), `link-muted`.
- **بطاقات:** `card`, `card-hover`, `card-interactive`; للبطاقات بقوائم داخلية: `card p-0` + أسطر `divide-y divide-line px-5 py-4 hover:bg-muted/60`.
- **نماذج:** `form-label`, `form-input`, `form-textarea`, `form-select`, `form-hint` (نص مساعدة), `form-error` (ملاحظة: الاسم الصحيح `form-hint` وليس `form-help`).
- **تنبيهات:** `alert alert-success | alert-error | alert-warning | alert-info` (تقبل أيقونة lucide داخلها).
- **شارات:** `badge` + `badge-published/pending/rejected/draft/hired/success/warning/danger/info/neutral/brand/outline`; عبر المكوّن `<StatusBadge label variant dot />`.
- **حالات تحميل:** `skeleton`, `spinner`, ونُسخ `skeleton` متعددة الأسطر يدوياً.
- **نص عناوين:** `eyebrow` (شارة صغيرة خضراء), `lede` (سطر تمهيدي أكبر), `prose-ar` (سطور متن الرسائل), `ltr` (اتجاه RTL→LTR داخلي).
- **حركة:** `reveal`, `animate-rise/fade/drop` مع `style={{ animationDelay: "80ms" }}` و`--rise-delay`.
- **شريط تمرير أفقي:** `scroll-x` (للقوائم الأفقية على الجوال).

## مكوّنات UI الجاهزة (`src/components/ui/`)
| المكوّن | الاستخدام |
|---|---|
| `PageHeader` | `<PageHeader title description? actions? eyebrow? badge? />` أعلى كل صفحة لوحة تحكم |
| `StatCard` | `<StatCard label value icon={LucideIcon} hint? tone?="brand"\|"accent"\|"warning"\|"danger" />` |
| `EmptyState` | `<EmptyState icon? title description? actionHref? actionLabel? secondaryHref? secondaryLabel? />` |
| `StatusBadge` | `<StatusBadge label={label} variant={badgeVariant} dot />` — الأنواع من `@/lib/labels` (`*_BADGE`) |
| `TabsNav` | `<TabsNav label items={[{href,label,count?,active?}]} />` تبويبات `?tab=` (active يُمرَّر من searchParams على الخادم) |
| `Pagination` | `<Pagination basePath currentPage totalPages searchParams />` |
| `Reveal` | `<Reveal className? delay?>` لظهور تدريجي عند التمرير |
| `Logo` / `LogoMark` | شعار المنصة SVG |

الصور الرمزية للتنقّل في `src/components/layout/nav-icons.ts` (`NAV_ICONS` + مفتاح `NavItem.icon`).

## مصادر البيانات المسموح بها في الصفحات
- الوظائف: `prisma.job` مع `status: "PUBLISHED", reviewStatus: "APPROVED"` للعامة؛ الحالات الكاملة عبر `JOB_STATUS_LABELS`/`JOB_STATUS_BADGE` من `@/lib/labels`.
- المستخدم/الصلاحيات: `requireAuth()` / `requireModerator()` من `@/lib/permissions` (لا تكرّر منطقهم).
- تسميات موحّدة: `@/lib/labels` (`APPLICATION_STATUS_*`, `REPORT_STATUS_*`, `WORK_TYPE_LABELS`, `formatSalary`, `formatDateAr`).
- أخطاء قاعدة البيانات: لفّ الاستعلامات الحساسة في try/catch واعرض حالة خطأ مهذّبة (انظر `src/app/(public)/jobs/page.tsx` كنموذج).

## نماذج جاهزة للتقليد
- الصفحة الرئيسية: `src/app/(public)/page.tsx`
- قائمة الوظائف: `src/app/(public)/jobs/page.tsx`
- بطاقة وظيفة: `src/components/jobs/job-card.tsx`
- لوحة تحكم (هيكل): `src/app/seeker/page.tsx` + `src/components/layout/dashboard-shell.tsx`
- أكورديون أسئلة: `src/components/ui/faq-accordion.tsx` مع `src/lib/faq-data.ts`

## فحوص إلزامية قبل التسليم
```
npm run typecheck
npm run lint
```
كلاهما نظيف. أخطاء tsc/eslint من ملفات **خارج نطاقك** تجاهلها ولا تصلحها. اجعل `npm run build` ناجحاً عند تغيير مسارات.
