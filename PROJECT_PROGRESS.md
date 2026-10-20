# PROJECT_PROGRESS — بواب مصر (Bawab-Masr)

آخر تحديث: 2026-10-19
مرجع الخطة الأصلية: [`Bawab_Masr_Full_Project_Plan_and_OpenCode_Prompt.md`](./Bawab_Masr_Full_Project_Plan_and_OpenCode_Prompt.md)

---

## A. نظرة عامة

منصة ويب مصرية (عربية RTL) تربط البوابين والحراس بأصحاب العقارات واتحادات الملاك
وشركات إدارة العقارات — البداية في الإسكندرية.

**المرحلة الحالية:** اكتمال **المراحل 1–6** من الخطة — الأساس + المصادقة +
الوظائف والتقديمات + لوحات التحكم الثلاثة + الإدارة + SEO + جاهزية العرض
للعميل (بيانات تجريبية + 25 اختبار E2E أخضر).

### الإصدارات المثبّتة

| الحزمة | الإصدار | ملاحظة |
|---|---|---|
| next | 16.4.2 | App Router + Turbopack |
| react / react-dom | 19.3.0 | |
| typescript | 5.x | |
| tailwindcss | 4.x | عبر `@tailwindcss/turbopack` |
| prisma / @prisma/client | **7.10.1** (مثبّت بالضبط) | Prisma 7 — إعادة تصميم |
| @prisma/adapter-pg + pg | 7.10.1 / 8.23.1 | driver adapter (مطلوب في Prisma 7) |
| next-auth | 5.0.0-beta.32 | Credentials + JWT sessions |
| zod | 4.6.7 | |
| bcryptjs | 3.0.3 | |

---

## B. ما تم إنجازه

### 1) تصحيح الأساس (كان معطلاً عند التسليم)
- **تعارض إصدارات Prisma:** كان `prisma` (CLI) على `^8.0.0-rc.23` بينما
  `@prisma/client` على `^7.10.1`. تم تثبيت `"prisma": "7.10.1"` بالضبط +
  `npm install` — الآن CLI والـ client متوافقان.
- **Prisma 7 كسر `datasource`:** أُزيل `url`/`directUrl` من `prisma/schema.prisma`
  (لم يعد مسموحًا في Prisma 7).
- أُنشئ `prisma7.config.ts` (اسم ملف إعداد Prisma 7 — Prisma 8 RC يستخدم
  `prisma.config.ts`): يحمّل `.env.local` ثم `.env` عبر dotenv، ويحدد
  `datasource.url = DIRECT_URL ?? DATABASE_URL`.
- **Prisma 7 يتطلب driver adapter:** `src/lib/db/prisma.ts` أُعيد كتابته ليستخدم
  `PrismaPg` مع singleton في التطوير وفحص وجود `DATABASE_URL`.
- **أخطاء TypeScript (كانت 5) → 0:** إصلاح `required_error` → `error` في Zod v4،
  وإنشاء الـ client، وأخطاء implicit any.
- **`next-auth/jwt` TS2664:** لا يمكن عمل module augmentation على `next-auth/jwt`
  (يعيد التصدير فقط). الحل المُطبَّق: augmentation على المصدر `@auth/core/jwt`
  في `src/lib/auth/types.ts`.

### 2) قاعدة البيانات (Neon PostgreSQL) — تم التحقق فعليًا
- الاتصال ناجح (قاعدة `neondb`).
- قاعدة البيانات كانت فارغة → أُنشئت وتُطُبّقت أول migration:
  `prisma/migrations/20261018132401_init/`.
- زرع بيانات أساسية بنجاح: 4 أدوار نظام + 26 محافظة + 30 منطقة إسكندرية.

### 3) Next.js 16 — إزاحة deprecated
- `src/middleware.ts` → **`src/proxy.ts`** (وسطاء معتمد في Next 16).
  يحمي `/seeker`, `/employer`, `/admin`، ويحوّل المستخدم غير المؤكد هاتفياً إلى
  `/verify-phone`، ويمنع المسجّل من `/login` و`/register`.

### 4) مسار المصادقة الكامل (جديد)
- `src/lib/rate-limit/index.ts` — حد محاولات في الذاكرة (مناسب لنسخة واحدة؛
  يحتاج Redis عند التوسع متعدد النسخ).
- `src/server/services/auth-service.ts` — منطق: تسجيل مستخدم + إنشاء بروفايل
  (Seeker/Employer) + إنشاء وإرسال OTP + التحقق. خصائص الأمان: OTP مُهشَّر
  (bcrypt) لا يُخزَّن كنص، صلاحية 5 دقائق، 5 محاولات كحد أقصى، cooldown 60 ثانية
  لإعادة الإرسال، وحدود لكل IP.
- `src/server/actions/auth.ts` — Server Actions: `registerAction`, `loginAction`,
  `verifyOtpAction`, `resendOtpAction`, `logoutAction`. كل المدخلات تُتحقق على
  الخادم بـ Zod.
- صفحات: `/login`، `/register`، `/verify-phone` تحت `src/app/(auth)/` مع
  مكوّنات client في `src/components/forms/`.
- `prisma/seed.ts` + أوامر npm جديدة. `eslint.config.mjs` يتجاهل الآن
  المعاملات التي تبدأ بـ `_`.

### 5) جاهزية العرض للعميل (المرحلة 3)
- **إغلاق كل روابط 404:** أُنشئت 13 صفحة عامة — `/jobs` (قائمة حقيقية من
  قاعدة البيانات مع فلترة بالمحافظة والبحث، مع states فارغة/خطأ/تحميل)
  و`/jobs/[slug]` (تفاصيل الوظيفة مع `notFound()` و`generateMetadata`)،
  و`/how-it-works`, `/about`, `/contact`, `/faq`, `/terms`, `/privacy`,
  `/safety`, `/for-job-seekers`, `/for-property-owners` (محتوى عربي حقيقي).
- **صفحتا خطأ عربيتان:** `src/app/error.tsx` (حدود خطأ عامة مع زر إعادة
  المحاولة) و`src/app/not-found.tsx` (404 عربي).
- **Header حسب حالة الجلسة:** `src/components/layout/site-header.tsx`
  (Server Component) يعرض اسم المستخدم + زر تسجيل الخروج للمسجّل، وأزرار
  الدخول/التسجيل للزائر.
- **تحصين كامل لكل server action:** كل Action يلف منطقه في try/catch
  (مع `console.error` مُوسوم على الخادم + رسالة عربية عامة)، ورسائل Zod
  تظهر في الواجهة، و`redirect()` خارج الـ try حتى لا يبتلع NEXT_REDIRECT.
- **إصلاح بناء الإنتاج:** `smsProvider` كان يُبنى وقت تحميل الوحدة ويوقف
  `npm run build` بخطأ `SMS_PROVIDER=dev غير مسموح في الإنتاج` — أصبح
  التحديد كسولًا (يحدث عند الإرسال فقط مع بقاء الحظر في الإنتاج).
- **تنظيف الكونسول:** أُلغي تحذير `pg` عن أوضاع sslmode (إزالة `sslmode`
  من الرابط وتمرير `ssl` صريحًا في `src/lib/db/prisma.ts`)، وأُلغي log
  استعلامات Prisma في التطوير، وأُلغي تحذير Auth.js debug (التفعيل عبر
  `AUTH_DEBUG=1` فقط)، وتصحيح كشف `NEXT_REDIRECT` في `logoutAction`
  (كانت تُطبع في الكونسول).
- **اختبارات E2E حقيقية بـ Playwright** (`tests/e2e/auth.spec.ts`):
  19 اختبارًا — فتح كل المسارات بدون أي خطأ في كونسول المتصفح، تحويل
  المسارات المحمية، رسائل الخطأ العربية (دخول خاطئ / OTP خاطئ)، ومسار
  كامل: تسجيل → تأكيد الهاتف → دخول → ظهور الاسم → خروج.

### 6) المراحل 4–6: الخدمات والتقديمات واللوحات (هذه الجلسة)

**طبقة خدمات مشتركة (`src/server/services/`)**
- `result.ts` (ServiceResult)، `notification-service.ts` (`notify` — تفشل
  بصمت)، `audit-service.ts` (`logAudit` — يفشل بصمت).
- `application-service.ts` — تقديم/سحب/تغيير حالة مع سجل
  `ApplicationStatusHistory` وقواعد الانتقال من الخطة (سحب من
  SUBMITTED/VIEWED/SHORTLISTED/INTERVIEW_SCHEDULED؛ terminal =
  HIRED/REJECTED/WITHDRAWN).
- `job-service.ts` — إنشاء/تعديل (PENDING_REVIEW/PUBLISHED تُقبل التعديلات)،
  إرسال للمراجعة، إيقاف/استئناف، إغلاق، حفظ/إزالة، بلاغ — مع slug فريد
  وتحققات الملكية داخل الخدمة.
- `profile-service.ts` (بروفايل باحث/مالك + تغيير كلمة المرور)،
  `admin-service.ts` (موافقة/رفض وظيفة، إيقاف مستخدم، منح/سحب دور، حل بلاغ)
  — كل كتابة AuditLog + Notification.
- وسوم عربية موحدة `src/lib/labels.ts` + مكوّنات UI مشتركة
  (`page-header`, `stat-card`, `empty-state`, `status-badge`, `pagination`).

**لوحات التحكم الثلاث** (layouts محمية بـ `requireAuth`/`requireModerator`
+ `DashboardNav`، وروابط حسب الدور في SiteHeader)
- `/seeker` — الرئيسية (إحصائيات)، `/seeker/applications` (تقديماتي مع سحب)،
  `/seeker/saved` (المحفوظات)، `/seeker/profile` (إنشاء/تحديث بروفايل)،
  `/seeker/settings` (تغيير كلمة المرور).
- `/employer` — الرئيسية، `/jobs` (إعلاناتي + إجراءات النشر/الإيقاف/الإغلاق)،
  `/jobs/new` و`/jobs/[id]` (نموذج وظيفة)، `/jobs/[id]/applications`
  (متقدمو الوظيفة مع تغيير الحالة)، `/applications` (كل الطلبات)،
  `/properties` (إضافة/تعطيل عقار)، `/profile`، `/settings`.
- `/admin` — الرئيسية (إحصائيات)، `/admin/jobs` (مراجعة موافقة/رفض بسبب)،
  `/admin/reports` (بلاغات الوظائف مع حل)، `/admin/users` (إيقاف/تفعيل +
  إدارة الأدوار)، `/admin/audit` (سجل التدقيق).
- صفحات التفاصيل والقوائم تستعلم من الخدمات بحسابات تجريبية جاهزة —
  عند تسجيل دخول مستخدم جديد بدون بروفايل تعرض حالات "أنشئ ملفك" بدل الخطأ.

**وظائف وSEO**
- `/jobs/[slug]` — `generateMetadata` + Open Graph، بطاقة تقديم تفاعلية
  (زائر → تسجيل، غير مؤكد هاتفياً → تأكيد، مُقدِّم سابق → حالة الطلب،
  موظف/إداري → رسالة مخصصة)، زر حفظ، تحذير قرب الموعد النهائي، نموذج بلاغ.
- `src/app/sitemap.ts` (13 صفحة ثابتة + الوظائف المنشورة) و`src/app/robots.ts`
  (منع `/admin`, `/seeker`, `/employer` من الفهرسة).

**بيانات تجريبية للعرض** (`prisma/seed.ts` — تُتخطى في الإنتاج idempotent)
- 3 حسابات: باحث `01000000001` / صاحب عقار `01000000002` / مدير `01000000003`
  — كلمة المرور `Demo1234!` (موصول هاتفًا).
- 9 وظائف تجريبية (5 قيد المراجعة + 4 منشورة)، 2 تقديم (SHORTLISTED +
  SUBMITTED)، 1 وظيفة محفوظة، 1 عقار في سموحة.

**تصحيحات وجدولة E2E**
- إصلاح bug حقيقي: `applyToJob` كان يُرسل إشعارًا لـ `posterId` (معرّف
  EmployerProfile) بدل `poster.userId` → `ForeignKeyConstraintViolation`
  (فشل صامت — الإشعار لم يصل).
- إصلاحات الاختبارات: روابط الهيدر المكررة (`.first()`)، اقتباس SQL
  للأعمدة camelCase، اتساع assertion بعد إعادة التحقق من الصفحة، تضييق
  locators لـ `.badge` لتجاوز strict mode، ورفع `expect.timeout` إلى 120s
  لتباطؤ ترجمة المسارات الباردة في خادم التطوير.

### 7) إعادة تصميم الواجهة بالكامل (جلسة UI/UX)

**نظام تصميم جديد** — `src/app/globals.css` أُعيد كتابته: توكنات `@theme`
(ألوان/ظلال/خطوط/حركة/أنصاف أقطار) + `@layer base` + `@layer components`
(أزرار بأنواعها، بطاقات، نماذج، تنبيهات، شارات، هياكل تحميل، حركة
`reveal/animate-*`) مع احترام `prefers-reduced-motion` وطباعة. التفاصيل في
`UI_DESIGN_SYSTEM.md`.

**مكوّنات مشتركة جديدة** — `Logo/LogoMark` (SVG)، `Reveal`
(IntersectionObserver)، `SiteHeader` + `HeaderClient` (قائمة جوال + ظل تمرير)،
`SiteFooter`، `DashboardShell` + `nav-icons` (شريط جانبي لاصق للوحات + تبويبات
جوال؛ حُذف `dashboard-nav.tsx` القديم)، `FaqAccordion` + `faq-data.ts`،
وتطوير `PageHeader/StatCard/EmptyState/StatusBadge/Pagination` + `TabsNav`.

**نقل المسارات** — كل الصفحات العامة إلى `src/app/(public)/` مع
`layout.tsx` يوفّر الفوتر. **إعادة تصميم ~35 صفحة**: الرئيسية (Hero بحث +
وظائف حقيقية + FAQ)، قائمة الوظائف، تفاصيل الوظيفة، المصادقة الثلاث، التسع
صفحات العامة، ولوحات (باحث/صاحب عقار/إدارة) بكامل صفحاتها الفرعية، إضافة
حالات تحميل لمسارات رئيسية، وتحديث `error.tsx`/`not-found.tsx`.

**التزامات** — صفر إيموجي (lucide فقط)، صفر أنماط inline، صفر `gray-*`، RTL
سليم (`ps/pe/ms/me`)، ولا تغيير في أي منطق خادم أو استعلام أو action. توضيحات
SVG داخلية بدل صور خارجية (لا يمكن معاينة الصور في بيئة العمل — مُوثَّق في
`UI_UX_AUDIT.md`).

---

## C. الملفات الأساسية

| الملف | الدور |
|---|---|
| `prisma7.config.ts` | إعداد Prisma 7 (env + migrations + datasource) |
| `prisma/schema.prisma` | نموذج البيانات الكامل (بدون urls) |
| `prisma/seed.ts` | أدوار النظام + المحافظات + مناطق الإسكندرية |
| `src/lib/db/prisma.ts` | Prisma singleton + PrismaPg adapter |
| `src/lib/auth/index.ts` | NextAuth v5 (Credentials) + callbacks |
| `src/lib/auth/types.ts` | Augmentation لـ `next-auth` و`@auth/core/jwt` |
| `src/lib/permissions/index.ts` | requireAuth / requireAdmin / requireVerifiedPhone |
| `src/lib/validation/auth.ts` | Zod: login / register / otp |
| `src/lib/rate-limit/index.ts` | Rate limiting |
| `src/lib/sms/index.ts` | DevSmsProvider (يطبع بالكونسول، ممنوع في الإنتاج) + Twilio placeholder |
| `src/server/services/auth-service.ts` | منطق التسجيل وOTP |
| `src/server/actions/auth.ts` | Server Actions للمصادقة |
| `src/proxy.ts` | حماية المسارات (بديل middleware) |
| `src/app/(auth)/**` | صفحات المصادقة |
| `src/components/forms/**` | نماذج المصادقة |

---

## D. التحقق الذي تم تنفيذه (نتائج فعلية)

| الأمر | النتيجة |
|---|---|
| `npx prisma validate` | ✅ الـ schema صالح |
| `npx prisma generate` | ✅ توليد client v7.10.1 |
| `npx prisma migrate status` | ✅ متصل بقاعدة `neondb` (كانت غير مُدارة بـ Migrate) |
| `npx prisma migrate dev --name init` | ✅ أُنشئت وطُبِّقت أول migration |
| فحص جداول القاعدة عبر `pg` | ✅ كانت فارغة قبل الـ migration |
| `npm run db:seed` | ✅ 4 أدوار + 26 محافظة + 30 منطقة |
| `npm run typecheck` | ✅ 0 أخطاء (بعد جلسة إعادة التصميم كاملة) |
| `npm run lint` | ✅ 0 أخطاء / 0 تحذيرات |
| `npm run build` | ✅ نجح (Next 16.4.2 / Turbopack) — 38 مسارًا (36 (ƒ) + 2 static) |
| تشغيل `next start` + طلب `/login` | ✅ 200 |
| `npx playwright test` | ✅ **25/25 اختبار E2E ناجح** — auth (19) + dashboards (6) — بدون أخطاء كونسول المتصفح بعد إعادة التصميم (تحقّق نهائي على خادم نظيف: 3 دقائق) |

مسارات البناء الحالية: 38 مسارًا (36 طلبًا ديناميكيًا ƒ + `/robots.txt` + `/sitemap.xml` static). تحتوي على 13 صفحة عامة + مصادقة + لوحات تحكم (باحث/صاحب عقار/إدارة) + وظائف + تطبيقات + نظام مراجعة + تقارير + سجل تدقيق + إعدادات وملفات بروفايل.

---

## E. مشاكل معروفة / قيود

1. **SMS:** لا يوجد مزود SMS حقيقي. في التطوير يُطبع رمز OTP في console الخادم
   (`[DEV SMS]`). `TwilioSmsProvider` غير مُنفَّذ (يرجع فشلًا صريحًا، لا نجاحًا
   وهميًا). ملاحظة: رسائل CredentialsSignin في سجل الخادم أثناء الاختبارات هي
   سجلات لمحاولات دخول خاطئة متعمّدة — سلوك متوقع ومفيد للمراقبة.
2. **Rate limiting في الذاكرة:** لا يصلح إلا لنسخة واحدة — يحتاج Redis عند
   التوسع.
3. **ترقية الجلسة بعد تأكيد الهاتف:** لا يوجد تسجيل دخول تلقائي بعد OTP؛
   المستخدم يُحوَّل إلى `/login?verified=1` (`isPhoneVerified` تُحدَّث عند الدخول).
4. **`package.json` بلا `"type": "module"`** — تشغيل `prisma/seed.ts` يعمل عبر
   type-stripping في Node 24 مع تحذير `MODULE_TYPELESS_PACKAGE_JSON`
   (غير مؤثر على التطبيق).
5. **وظائف بالـ slug في `/jobs/[slug]`** (مُعتمدة للـ SEO).
6. **إضافة Playwright** كـ devDependency + `playwright.config.ts` + `tests/e2e/`
   (خادم الاختبار يستخدم dev server على المنفذ 3000) — جميعها 25/25 أخضر.

---

## F. الخطوات التالية المقترحة

1. لوحات التحكم مكتملة (انظر الفقرة أعلاه) — جاهزة للعرض.
2. مزود SMS حقيقي (Twilio/أو غيره) + تحديث `README.md`/`.env.example`.
3. اختبارات إضافية حسب الحاجة وتوسيع E2E للظروف الحدودية.
4. نشر الإنتاج: ضبط `NEXT_PUBLIC_SITE_URL`, `NEXTAUTH_SECRET`, بيانات Neon
   في بيئة الإنتاج؛ `seedDemoData` يتخطى تلقائياً إذا `NODE_ENV === "production"`.
