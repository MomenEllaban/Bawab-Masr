# PROJECT_PROGRESS — بواب مصر (Bawab-Masr)

آخر تحديث: 2026-10-18
مرجع الخطة الأصلية: [`Bawab_Masr_Full_Project_Plan_and_OpenCode_Prompt.md`](./Bawab_Masr_Full_Project_Plan_and_OpenCode_Prompt.md)

---

## A. نظرة عامة

منصة ويب مصرية (عربية RTL) تربط البوابين والحراس بأصحاب العقارات واتحادات الملاك
وشركات إدارة العقارات — البداية في الإسكندرية.

**المرحلة الحالية:** اكتمال الأساس (Foundation) + المصادقة الكاملة
(تسجيل → تأكيد رقم الهاتف بـ OTP → تسجيل دخول).

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
| `npm run typecheck` | ✅ 0 أخطاء |
| `npm run lint` | ✅ 0 أخطاء / 0 تحذيرات |
| `npm run build` | ✅ نجح (Next 16.4.2 / Turbopack) — بدون تحذير middleware |
| تشغيل `next start` + طلب `/login` | ✅ 200 |

مسارات البناء الحالية: `/` (static) و`/login` و`/register` و`/verify-phone`
و`/api/auth/[...nextauth]`.

---

## E. مشاكل معروفة / قيود

1. **فشل رفع Git (403):** المستودع المحلي جاهز والـ commit الأول تم، لكن الـ push
   إلى `github.com/MomenEllaban/Bawab-Masr` مرفوض لأن الـ credential المحفوظ
   (`momendevelopertech`) لا يملك صلاحية على المستودع. **مطلوب:** إضافة الحساب
   كـ collaborator أو استخدام حساب/توكن المالك.
2. **SMS:** لا يوجد مزود SMS حقيقي. في التطوير يُطبع رمز OTP في console الخادم.
   `TwilioSmsProvider` غير مُنفَّذ (يرجع فشلًا صريحًا، لا نجاحًا وهميًا).
3. **Rate limiting في الذاكرة:** لا يصلح إلا لنسخة واحدة.
4. **الصفحات العامة ناقصة:** `src/app/page.tsx` يربط إلى `/jobs`, `/how-it-works`,
   `/about`, `/contact`, `/faq`, `/terms`, `/privacy`, `/safety`,
   `/for-job-seekers` — كلها حاليًا 404.
5. **لا توجد لوحات تحكم بعد:** `/seeker`, `/employer`, `/admin` محمية في `proxy.ts`
   لكنها غير مُنشأة (404 بعد الدخول).
6. **ترقية الجلسة بعد تأكيد الهاتف:** لا يوجد تسجيل دخول تلقائي بعد OTP؛
   المستخدم يُحوَّل إلى `/login?verified=1` (`isPhoneVerified` تُحدَّث عند الدخول).
7. **`searchParams`/`headers`/`cookies` غير متزامنة** في Next 16 — تم مراعاة ذلك
   (`await searchParams`، `await headers()`).
8. **`package.json` بلا `"type": "module"`** — تشغيل `prisma/seed.ts` يعمل عبر
   type-stripping في Node 24 مع تحذير `MODULE_TYPELESS_PACKAGE_JSON`
   (غير مؤثر).

---

## F. الخطوات التالية المقترحة

1. لوحات التحكم: `/seeker/dashboard` (تقديماتي + الملف الشخصي)
   و`/employer/dashboard` (إعلاناتي + إدارة العقارات) + `/admin` لمراجعة الإعلانات.
2. الصفحات العامة الناقصة: `/jobs` (قائمة + فلاتر محافظة/منطقة/نوع الوظيفة) و
   `/jobs/[id]`، ثم `/how-it-works`, `/about`, `/contact`, `/faq`, والشروط.
3. تحديث الهيدر حسب حالة الجلسة (زر Logout موجود كـ `logoutAction`) وإظهار
   اسم المستخدم بدلًا من أزرار الدخول/التسجيل.
4. طبقة `src/server/repositories/` لفصل الاستعلامات، والانتقال بـ NextAuth إلى
   تحديث `isPhoneVerified` دون إعادة تسجيل دخول.
5. تحديث `README.md`/`.env.example` مع كل مزود SMS حقيقي يُضاف.
6. إضافة اختبارات (unit لـ Zod/الأدوار، integration لمسار OTP) قبل الانتقال
   لمرحلة المدفوعات.
