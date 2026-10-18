/**
 * prisma/seed.ts
 * بيانات أساسية: أدوار النظام + المحافظات والمناطق
 * idempotent — يمكن تشغيله أكثر من مرة بأمان
 *
 * التشغيل: npm run db:seed
 */

import { config } from "dotenv";
config({ path: [".env.local", ".env"] });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL أو DIRECT_URL غير موجود في متغيرات البيئة");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const systemRoles: { name: string; description: string }[] = [
  { name: "ADMIN", description: "مدير النظام — صلاحيات كاملة" },
  { name: "MODERATOR", description: "مشرف — مراجعة الإعلانات والبلاغات" },
  { name: "CUSTOMER_SUPPORT", description: "دعم العملاء" },
  { name: "FINANCE", description: "المالية والمدفوعات" },
];

const provinces: { name: string; slug: string }[] = [
  { name: "الإسكندرية", slug: "alexandria" },
  { name: "القاهرة", slug: "cairo" },
  { name: "الجيزة", slug: "giza" },
  { name: "المنوفية", slug: "menoufia" },
  { name: "البحيرة", slug: "beheira" },
  { name: "الغربية", slug: "gharbia" },
  { name: "الدقهلية", slug: "dakahlia" },
  { name: "الشرقية", slug: "sharqia" },
  { name: "كفر الشيخ", slug: "kafr-el-sheikh" },
  { name: "دمياط", slug: "damietta" },
  { name: "بورسعيد", slug: "port-said" },
  { name: "الإسماعيلية", slug: "ismailia" },
  { name: "السويس", slug: "suez" },
  { name: "شمال سيناء", slug: "north-sinai" },
  { name: "جنوب سيناء", slug: "south-sinai" },
  { name: "الفيوم", slug: "fayoum" },
  { name: "بني سويف", slug: "beni-suef" },
  { name: "المنيا", slug: "minya" },
  { name: "أسيوط", slug: "asyut" },
  { name: "سوهاج", slug: "sohag" },
  { name: "قنا", slug: "qena" },
  { name: "الأقصر", slug: "luxor" },
  { name: "أسوان", slug: "aswan" },
  { name: "البحر الأحمر", slug: "red-sea" },
  { name: "الوادي الجديد", slug: "new-valley" },
  { name: "مطروح", slug: "matrouh" },
];

// مناطق الإسكندرية — الأولوية الأولى للمنصة
const alexandriaAreas: { name: string; slug: string }[] = [
  { name: "سموحة", slug: "smouha" },
  { name: "سيدي جابر", slug: "sidi-gaber" },
  { name: "لوران", slug: "loran" },
  { name: "محرم بك", slug: "moharam-bek" },
  { name: "كرموز", slug: "karmouz" },
  { name: "غبريال", slug: "ghabrial" },
  { name: "العطارين", slug: "attarin" },
  { name: "المنشية", slug: "mansheya" },
  { name: "اللبان", slug: "labban" },
  { name: "الأزاريطة", slug: "azarita" },
  { name: "سيدي بشر", slug: "sidi-bishr" },
  { name: "المنتزه", slug: "montazah" },
  { name: "المندرة", slug: "mandara" },
  { name: "العجمي", slug: "agami" },
  { name: "الهانوفيل", slug: "hanoville" },
  { name: "برج العرب", slug: "borg-el-arab" },
  { name: "الدخيلة", slug: "dakhela" },
  { name: "المعمورة", slug: "maamoura" },
  { name: "أبو قير", slug: "abu-qir" },
  { name: "الشاطبي", slug: "shatby" },
  { name: "سابا باشا", slug: "saba-pasha" },
  { name: "كامب شيزار", slug: "camp-cesar" },
  { name: "سبورتنج", slug: "sporting" },
  { name: "فلمنج", slug: "fleming" },
  { name: "زيزينيا", slug: "zizinia" },
  { name: "الماظة", slug: "mazah" },
  { name: "النزهة", slug: "nozha" },
  { name: "بكوس", slug: "bakos" },
  { name: "فيكتوريا", slug: "victoria" },
  { name: "سيدي كرير", slug: "sidi-kerir" },
];

async function main() {
  console.log("بدء زرع البيانات الأساسية...");

  for (const role of systemRoles) {
    await prisma.systemRole.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role,
    });
  }
  console.log(`✓ أدوار النظام: ${systemRoles.length}`);

  for (const province of provinces) {
    await prisma.province.upsert({
      where: { slug: province.slug },
      update: { name: province.name },
      create: province,
    });
  }
  console.log(`✓ المحافظات: ${provinces.length}`);

  const alexandria = await prisma.province.findUnique({
    where: { slug: "alexandria" },
    select: { id: true },
  });

  if (alexandria) {
    for (const area of alexandriaAreas) {
      await prisma.area.upsert({
        where: {
          provinceId_slug: {
            provinceId: alexandria.id,
            slug: area.slug,
          },
        },
        update: { name: area.name },
        create: { ...area, provinceId: alexandria.id },
      });
    }
    console.log(`✓ مناطق الإسكندرية: ${alexandriaAreas.length}`);
  }

  console.log("تم زرع البيانات بنجاح.");
}

main()
  .catch((error) => {
    console.error("فشل زرع البيانات:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
