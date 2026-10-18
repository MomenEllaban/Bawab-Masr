// Prisma 7 config — Bawab Masr
// يقرأ رابط الاتصال من متغيرات البيئة؛ لا تضع أسرارًا هنا.
import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

// تحميل .env.local أولاً ( convention الخاص بـ Next.js) ثم .env
loadEnv({ path: [".env.local", ".env"] });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // نستخدم الرابط المباشر (DIRECT_URL) للترحيلات لتجنب مشاكل الـ pooling
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
