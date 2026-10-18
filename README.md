# بواب مصر — Bawab Masr

منصة ويب مصرية تربط البوابين والباحثين عن عمل بأصحاب العقارات واتحادات الملاك وشركات إدارة العقارات. البداية في الإسكندرية، مع قابلية التوسع لباقي مصر.

## التقنيات المستخدمة

| التقنية | الإصدار | الغرض |
|---------|---------|--------|
| Next.js | 16+ | App Router — واجهة وخادم |
| TypeScript | 5+ | Type safety |
| Tailwind CSS | 4+ | التصميم |
| Prisma | 6+ | ORM لقاعدة البيانات |
| Neon PostgreSQL | — | قاعدة البيانات |
| NextAuth.js | 5 (beta) | المصادقة |
| Zod | 3+ | التحقق من المدخلات |

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
npx prisma migrate dev

# 5. شغّل خادم التطوير
npm run dev
```

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
    (public)/          # صفحات عامة
    (auth)/            # تسجيل دخول / إنشاء حساب
    seeker/            # بوابة الباحث عن عمل
    employer/          # بوابة صاحب العقار
    admin/             # لوحة الإدارة
    api/               # API Routes
  components/
    ui/                # مكونات واجهة مشتركة
    layout/            # Header, Footer, Navigation
    jobs/              # بطاقات وقوائم الوظائف
    forms/             # نماذج المشروع
    dashboard/         # مكونات لوحات التحكم
  lib/
    auth/              # إعداد NextAuth
    db/                # Prisma client
    permissions/       # منطق الصلاحيات
    validation/        # Zod schemas
    notifications/     # إشعارات داخلية
    rate-limit/        # Rate limiting
  server/
    services/          # منطق الأعمال
    repositories/      # طبقة قاعدة البيانات
prisma/
  schema.prisma        # نموذج البيانات
  migrations/          # ملفات الـ migrations
  seed.ts              # بيانات تطوير أولية
tests/
  unit/
  integration/
  e2e/
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

# Bawab-Masr
