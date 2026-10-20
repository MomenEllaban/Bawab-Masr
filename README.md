# Bawab-Masr — بواب مصر

منصة ويب مصرية تربط البوابين والباحثين عن عمل بأصحاب العقارات واتحادات الملاك وشركات إدارة العقارات. البداية في الإسكندرية، مع قابلية التوسع لباقي مصر.

## التقنيات المستخدمة

| التقنية | الإصدار | الغرض |
|---------|---------|--------|
| Next.js | 16.4.2 | App Router — واجهة وخادم |
| TypeScript | 5+ | Type safety |
| Tailwind CSS | 4+ | التصميم |
| Prisma | 7.10.1 | ORM لقاعدة البيانات |
| Neon PostgreSQL | — | قاعدة البيانات |
| NextAuth.js | 5 (beta.32) | المصادقة |
## الميزات الرئيسية

- **مطور للـ client-demo**: 25 اختبار E2E أخضر، كونسول نظيف، بيانات تجريبية جاهزة.
- لوحات تحكم ثلاث (باحث عن عمل / صاحب عقار / إدارة) + سير عمل كامل للوظائف والتقديمات.
- طبقة خدمات مشتركة مع `ServiceResult` وسجلات تدقيق + إشعارات.
- حماية المسارات + صلاحيات، إضافةً إلى sitemap.xml / robots.txt.
- Next.js 16.4.2 (App Router) + Prisma 7 + NextAuth v5 + Zod 4 + Tailwind 4.

## متطلبات التشغيل

- Node.js 20+
- npm 10+
- حساب Neon PostgreSQL

## الإعداد المحلي

```bash
# 1. استنسخ المشروع
git clone <repo-url>
cd bawab-masr

# 2. ثبّت الحزم
npm install

# 3. أنشئ ملف البيئة
cp .env.example .env.local
# ثم عدّل .env.local وأضف بيانات Neon الخاصة بك

# 4. شغّل migrations قاعدة البيانات
npm run db:migrate

# 5. ازرع البيانات الأساسية (أدوار النظام + المحافظات والمناطق)
npm run db:seed

# 6. شغّل خادم التطوير
npm run dev
```

> **ملاحظة Prisma 7:** روابط الاتصال لم تعد تُوضع في `schema.prisma`؛ بل في
> `prisma7.config.ts` (يقرأ `.env.local` و`.env`). كما يتطلب Prisma 7 استخدام
> driver adapter (`@prisma/adapter-pg` + `pg`) — تم تكوينه في `src/lib/db/prisma.ts`.

## متغيرات البيئة المطلوبة

انسخ `.env.example` إلى `.env.local` وأضف القيم الحقيقية:

| المتغير | الوصف |
|---------|--------|
| `DATABASE_URL` | رابط Neon PostgreSQL (connection pooling) |
| `DIRECT_URL` | رابط Neon مباشر (للـ migrations) |
| `NEXTAUTH_SECRET` | مفتاح سري للجلسات (توليد: `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | عنوان التطبيق |

## هيكل المشروع

```
src/
  app/
    (auth)/            # تسجيل الدخول / إنشاء حساب / تأكيد الهاتف
    jobs/              # قائمة الوظائف + تفاصيل الوظيفة [slug]
    how-it-works/ about/ contact/ faq/ terms/ privacy/ safety/
    for-job-seekers/ for-property-owners/
    api/auth/          # NextAuth route handler
    page.tsx           # الصفحة الرئيسية (Landing)
    error.tsx          # حدود الخطأ العامة (عربي)
    not-found.tsx      # صفحة 404 (عربي)
  components/
    forms/             # نماذج المصادقة (client components)
    layout/            # SiteHeader حسب حالة الجلسة + تسجيل الخروج
  lib/
    auth/              # إعداد NextAuth + type augmentation
    db/                # Prisma client (+ driver adapter)
    permissions/       # منطق الصلاحيات
    validation/        # Zod schemas
    rate-limit/        # Rate limiting في الذاكرة
    sms/               # مزودو رسائل SMS (dev حقيقي مقيّد + Twilio غير مُنفَّذ)
  server/
    actions/           # Server Actions (كلها بمعالجة أخطاء كاملة)
    services/          # منطق الأعمال
  proxy.ts            # حماية المسارات (middleware سابقًا — Next 16)
prisma/
  schema.prisma        # نموذج البيانات
  migrations/          # ملفات الـ migrations
  seed.ts              # أدوار النظام + المحافظات والمناطق
prisma7.config.ts      # إعداد Prisma 7 (روابط الاتصال + migrations)
tests/
  e2e/                 # اختبارات Playwright
playwright.config.ts   # إعداد Playwright
```

## حسابات تجريبية (للعرض)

تُنشأ تلقائياً عند `npm run db:seed` (في بيئة التطوير). يُتجاوز الـ seed تلقائياً إذا `NODE_ENV === "production"`.

| الدور | رقم الهاتف | كلمة المرور | ملاحظات |
|---|---|---|---|
| باحث عن عمل (Seeker) | `01000000001` | `Demo1234!` | أحمد علي (حساب تجريبي) |
| صاحب عقار (Employer) | `01000000002` | `Demo1234!` | محمود حسن / اتحاد ملاك سموحة |
| مدير النظام (Admin) | `01000000003` | `Demo1234!` | مديرا النظام (ADMIN) |

يوجد 9 وظائف تجريبية (5 قيد المراجعة + 4 منشورة)، 2 طلب تقديم، 1 وظيفة محفوظة، 1 عقار تجريبي.

## الأوامر

```bash
npm run dev          # خادم التطوير
npm run build        # بناء الإنتاج
npm run start        # تشغيل الإنتاج
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run test:e2e     # اختبارات Playwright E2E (تستخدم dev server على 3000)
npm run db:generate  # prisma generate
npm run db:migrate   # prisma migrate dev
npm run db:seed      # زرع البيانات الأساسية
npm run db:studio    # Prisma Studio
```

## تشغيل الاختبارات

```bash
# Lint
npm run lint

# Type checking
npx tsc --noEmit

# Prisma schema validation
npx prisma validate

# Production build
npm run build
```

## إعداد Neon

1. أنشئ مشروعاً على [Neon Console](https://console.neon.tech)
2. من صفحة **Connect**، انسخ رابط الاتصال المناسب
3. ضع الرابط في `.env.local` — لا ترسله في أي مكان آخر
4. شغّل `npx prisma migrate dev` لتطبيق migrations

## ملاحظات الأمان

- لا تضع أسراراً في الكود أو Git
- ملفات `.env.local` و`.env` مستثناة من Git تلقائياً
- كل صلاحية تُفرض على الخادم
- لا يُرسل OTP حقيقي في بيئة التطوير

## وثيقة المشروع الأصلية

[Bawab_Masr_Full_Project_Plan_and_OpenCode_Prompt.md](../Bawab_Masr_Full_Project_Plan_and_OpenCode_Prompt.md)

## ملف التقدم

[PROJECT_PROGRESS.md](./PROJECT_PROGRESS.md)

