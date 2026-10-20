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
import bcrypt from "bcryptjs";

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

// ============================================================
// بيانات تجريبية للعرض (تُتخطى تلقائيًا في بيئة الإنتاج)
// ============================================================

const DEMO_PASSWORD = "Demo1234!";

const demoJobs: {
  slug: string;
  title: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
  workType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "TEMPORARY";
  workSchedule?: "MORNING" | "EVENING" | "NIGHT" | "ROTATING" | "FLEXIBLE";
  salaryMin: number;
  salaryMax: number;
  experienceYears?: number;
  housingProvided?: boolean;
  status: "PENDING_REVIEW" | "DRAFT";
  areaSlug?: string;
}[] = [
  {
    slug: "demo-gatekeeper-smouha",
    title: "بواب عمارة سكنية — سموحة",
    description:
      "مطلوب بواب عمارة سكنية بموقع مميز في سموحة، الإسكندرية. الدوام صباحي يومي مع إقامة مناسبة داخل العمارة.",
    responsibilities:
      "استقبال السكان والزوار\nتنظيم دخول وخروج المركبات\nمتابعة أمان العمارة مساءً\nاستلام وتسليم طرود السكان",
    requirements:
      "خبرة سنة على الأقل في الحراسة\nإقامة قريبة من سموحة\nالقدرة على العمل بشكل منتظم",
    workType: "FULL_TIME",
    workSchedule: "MORNING",
    salaryMin: 6000,
    salaryMax: 7500,
    experienceYears: 1,
    housingProvided: true,
    status: "PENDING_REVIEW",
    areaSlug: "smouha",
  },
  {
    slug: "demo-night-guard-sidi-gaber",
    title: "حارس ليلي — سيدي جابر",
    description:
      "مطلوب حارس ليلي لمجمع سكني في سيدي جابر. الوردية من 8 مساءً حتى 8 صباحاً، راتب أسبوعي منتظم.",
    responsibilities:
      "تأمين المدخل الرئيسي ليلاً\nجولات تفقدية دورية\nتسجيل أي حركة مشبوهة",
    requirements:
      "خبرة سابقة في الحراسة الليلية\nالقدرة على العمل الورديات",
    workType: "PART_TIME",
    workSchedule: "NIGHT",
    salaryMin: 4000,
    salaryMax: 5000,
    experienceYears: 2,
    status: "PENDING_REVIEW",
    areaSlug: "sidi-gaber",
  },
  {
    slug: "demo-resident-guard-montazah",
    title: "حارس سكن — المنتزه",
    description:
      "مطلوب حارس سكن لإقامة فاخرة في حي المنتزه. السكن والإيجار على العاتق مع راتب شهري.",
    responsibilities: "حراسة الإقامة على مدار الساعة بورديات\nتأمين مواقف السيارات",
    requirements: "إقامة داخلية متاحة\nحسن سيرة وسلوك",
    workType: "FULL_TIME",
    workSchedule: "ROTATING",
    salaryMin: 7000,
    salaryMax: 8500,
    housingProvided: true,
    status: "PENDING_REVIEW",
    areaSlug: "montazah",
  },
  {
    slug: "demo-contract-security-attarin",
    title: "حارس عقد — العطارين",
    description:
      "مطلوب حارس بموجب عقد لمنطقة تجارية في العطارين، وردية مسائية خمسة أيام أسبوعياً.",
    responsibilities: "تأمين واجهات المحلات بعد إغلاقها",
    requirements: "خبرة سنة أو أكثر",
    workType: "CONTRACT",
    workSchedule: "EVENING",
    salaryMin: 5500,
    salaryMax: 6500,
    experienceYears: 1,
    status: "PENDING_REVIEW",
    areaSlug: "attarin",
  },
  {
    slug: "demo-temporary-event-guard",
    title: "حارس مؤقت — فعاليات برج العرب",
    description:
      "مطلوب حارس مؤقت لتأمين فعاليات في منطقة برج العرب لمدة شهر قابل للتمديد.",
    workType: "TEMPORARY",
    workSchedule: "FLEXIBLE",
    salaryMin: 4500,
    salaryMax: 5500,
    status: "PENDING_REVIEW",
    areaSlug: "borg-el-arab",
  },
];

async function seedDemoData() {
  if (process.env.NODE_ENV === "production") {
    console.log("✓ تخطّي البيانات التجريبية (بيئة إنتاج)");
    return;
  }

  console.log("بدء زرع البيانات التجريبية (للعرض فقط)...");

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const alexandria = await prisma.province.findUnique({
    where: { slug: "alexandria" },
    select: { id: true },
  });
  const areas = alexandria
    ? await prisma.area.findMany({
        where: { provinceId: alexandria.id },
        select: { id: true, slug: true },
      })
    : [];
  const areaIdBySlug = new Map(areas.map((a) => [a.slug, a.id]));

  // المستخدم التجريبي: باحث عن عمل
  const seeker = await prisma.user.upsert({
    where: { phone: "01000000001" },
    update: { status: "ACTIVE" },
    create: {
      phone: "01000000001",
      name: "أحمد علي (حساب تجريبي)",
      passwordHash,
      status: "ACTIVE",
      phoneVerifiedAt: new Date(),
      seekerProfile: {
        create: {
          bio: "بواب وحارس عقار ذو خبرة 3 سنوات في الإسكندرية، أبحث عن عمل ثابت قريب من سكني.",
          yearsExperience: 3,
          preferredWorkType: "FULL_TIME",
          availability: "IMMEDIATE",
          expectedSalaryMin: 6000,
          expectedSalaryMax: 9000,
        },
      },
    },
    select: { id: true },
  });

  const seekerProfile = await prisma.seekerProfile.findUnique({
    where: { userId: seeker.id },
    select: { id: true },
  });
  if (seekerProfile) {
    for (const skillName of ["حراسة عقارات", "مراقبة كاميرات", "تعامل رصين مع السكان"]) {
      const skill = await prisma.skill.upsert({
        where: { name: skillName },
        update: {},
        create: { name: skillName },
      });
      await prisma.seekerSkill.upsert({
        where: {
          seekerProfileId_skillId: {
            seekerProfileId: seekerProfile.id,
            skillId: skill.id,
          },
        },
        update: {},
        create: { seekerProfileId: seekerProfile.id, skillId: skill.id },
      });
    }
  }

  // المستخدم التجريبي: صاحب عقار
  const employer = await prisma.user.upsert({
    where: { phone: "01000000002" },
    update: { status: "ACTIVE" },
    create: {
      phone: "01000000002",
      name: "محمود حسن (حساب تجريبي)",
      passwordHash,
      status: "ACTIVE",
      phoneVerifiedAt: new Date(),
      employerProfile: {
        create: {
          displayName: "اتحاد ملاك سموحة (تجريبي)",
          employerType: "UNION_REP",
          isVerified: true,
          verifiedAt: new Date(),
        },
      },
    },
    select: { id: true, employerProfile: { select: { id: true } } },
  });

  const employerProfile = employer.employerProfile;
  if (!employerProfile) {
    throw new Error("فشل إنشاء ملف صاحب العقار التجريبي");
  }

  // عقار تجريبي
  const property = await prisma.property.upsert({
    where: { id: "demo-property-smouha" },
    update: {},
    create: {
      id: "demo-property-smouha",
      name: "عمارة النور — سموحة (تجريبية)",
      description: "عمارة سكنية من 8 أدوار أمام ساحة سموحة.",
      areaId: areaIdBySlug.get("smouha") ?? null,
      ownerId: employerProfile.id,
    },
    select: { id: true },
  });

  // وظائف تجريبية — 5 قيد المراجعة
  for (const job of demoJobs) {
    const existing = await prisma.job.findUnique({
      where: { slug: job.slug },
      select: { id: true },
    });
    if (existing) continue;

    await prisma.job.create({
      data: {
        slug: job.slug,
        title: job.title,
        description: job.description,
        responsibilities: job.responsibilities ?? null,
        requirements: job.requirements ?? null,
        workType: job.workType,
        workSchedule: job.workSchedule ?? null,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        salaryPeriod: "MONTHLY",
        isSalaryPublic: true,
        experienceYears: job.experienceYears ?? null,
        housingProvided: job.housingProvided ?? false,
        status: "PENDING_REVIEW",
        reviewStatus: "PENDING",
        posterId: employerProfile.id,
        areaId: job.areaSlug ? (areaIdBySlug.get(job.areaSlug) ?? null) : null,
        provinceId: alexandria?.id ?? null,
        propertyId: job.areaSlug === "smouha" ? property.id : null,
      },
    });
  }

  // 4 وظائف منشورة جاهزة للتصفح والتقديم
  const publishedJobs = [
    {
      slug: "demo-published-smouha-guard",
      title: "بواب عمارة — سموحة (منشورة)",
      description:
        "مطلوب بواب لعمارة سكنية هادئة في شارع سموحة الرئيسي. ساعات العمل من 8 صباحاً حتى 8 مساءً بورديات ثابتة.",
      responsibilities: "استقبال الزوار\nتأمين المدخل الرئيسي",
      requirements: "خبرة سنة على الأقل",
      workType: "FULL_TIME" as const,
      workSchedule: "MORNING" as const,
      salaryMin: 6500,
      salaryMax: 7500,
      areaSlug: "smouha",
    },
    {
      slug: "demo-published-loran-evening",
      title: "حارس مسائي — لوران (منشورة)",
      description:
        "مطلوب حارس مسائي لعمارة في حي لوران، الوردية من 2 ظهراً حتى 10 مساءً، خمسة أيام في الأسبوع.",
      responsibilities: "تأمين المدخل مساءً\nجولات تفقدية",
      requirements: "حسن سيرة وسلوك",
      workType: "PART_TIME" as const,
      workSchedule: "EVENING" as const,
      salaryMin: 4500,
      salaryMax: 5500,
      areaSlug: "loran",
    },
    {
      slug: "demo-published-mansheya-contract",
      title: "حارس مستودع — المنشية (منشورة)",
      description:
        "مطلوب حارس مستودع تجاري في المنشية بعقد شهري متجدد، وردية ليلية من 10 مساءً حتى 6 صباحاً.",
      responsibilities: "تأمين المستودع ليلاً\nتسجيل حركة الدخول والخروج",
      requirements: "خبرة في الحراسة الليلية",
      workType: "CONTRACT" as const,
      workSchedule: "NIGHT" as const,
      salaryMin: 5500,
      salaryMax: 6800,
      areaSlug: "mansheya",
    },
    {
      slug: "demo-published-borg-arab-temp",
      title: "حارس مواقف — برج العرب (منشورة)",
      description:
        "مطلوب حارس لتنظيم مواقف السيارات في مجمع تجاري ببرج العرب، وردية صباحية ثابتة.",
      responsibilities: "تنظيم مواقف السيارات",
      requirements: "لا توجد خبرة مطلوبة — التدريب على الموقع",
      workType: "TEMPORARY" as const,
      workSchedule: "MORNING" as const,
      salaryMin: 4000,
      salaryMax: 4800,
      areaSlug: "borg-el-arab",
    },
  ];

  for (const job of publishedJobs) {
    const existing = await prisma.job.findUnique({
      where: { slug: job.slug },
      select: { id: true },
    });
    if (existing) continue;

    const { areaSlug, ...jobData } = job;

    await prisma.job.create({
      data: {
        ...jobData,
        salaryPeriod: "MONTHLY",
        isSalaryPublic: true,
        housingProvided: false,
        status: "PUBLISHED",
        reviewStatus: "APPROVED",
        publishedAt: new Date(),
        posterId: employerProfile.id,
        areaId: areaIdBySlug.get(areaSlug) ?? null,
        provinceId: alexandria?.id ?? null,
      },
    });
  }

  // تقديم تجريبيان من الباحث
  const applications = [
    {
      slug: "demo-published-smouha-guard",
      status: "SHORTLISTED" as const,
      coverMessage: "عندي خبرة 3 سنوات في حراسة العمارات في سموحة، جاهز للبدء فوراً.",
    },
    {
      slug: "demo-published-loran-evening",
      status: "SUBMITTED" as const,
      coverMessage: "أبحث عن عمل مسائي قريب من منطقة لوران، عندي خبرة سابقة.",
    },
  ];

  for (const app of applications) {
    const job = await prisma.job.findUnique({
      where: { slug: app.slug },
      select: { id: true },
    });
    if (!job) continue;

    const existing = await prisma.jobApplication.findUnique({
      where: { jobId_applicantId: { jobId: job.id, applicantId: seeker.id } },
      select: { id: true },
    });
    if (existing) continue;

    await prisma.jobApplication.create({
      data: {
        jobId: job.id,
        applicantId: seeker.id,
        coverMessage: app.coverMessage,
        status: app.status,
        statusHistory: {
          create: {
            toStatus: "SUBMITTED",
            changedByUserId: seeker.id,
          },
        },
      },
    });

    if (app.status === "SHORTLISTED") {
      await prisma.applicationStatusHistory.create({
        data: {
          application: {
            connect: {
              jobId_applicantId: {
                jobId: job.id,
                applicantId: seeker.id,
              },
            },
          },
          fromStatus: "SUBMITTED",
          toStatus: "SHORTLISTED",
          changedByUserId: seeker.id,
          note: "تجربة العرض — ضمن القائمة المختصرة",
        },
      });
      await prisma.jobApplication.update({
        where: { jobId_applicantId: { jobId: job.id, applicantId: seeker.id } },
        data: { status: "SHORTLISTED" },
      });
    }
  }

  // حفظ وظيفة من الباحث
  const savedJob = await prisma.job.findUnique({
    where: { slug: "demo-published-mansheya-contract" },
    select: { id: true },
  });
  if (savedJob) {
    await prisma.savedJob.upsert({
      where: { userId_jobId: { userId: seeker.id, jobId: savedJob.id } },
      update: {},
      create: { userId: seeker.id, jobId: savedJob.id },
    });
  }

  // حساب إدارة تجريبي
  const adminRole = await prisma.systemRole.findUnique({
    where: { name: "ADMIN" },
    select: { id: true },
  });
  const admin = await prisma.user.upsert({
    where: { phone: "01000000003" },
    update: { status: "ACTIVE" },
    create: {
      phone: "01000000003",
      name: "مدير النظام (حساب تجريبي)",
      passwordHash,
      status: "ACTIVE",
      phoneVerifiedAt: new Date(),
    },
    select: { id: true },
  });
  if (adminRole) {
    await prisma.systemUserRole.upsert({
      where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } },
      update: {},
      create: { userId: admin.id, roleId: adminRole.id },
    });
  }

  console.log(
    "✓ البيانات التجريبية: باحث + صاحب عقار + مدير + 9 وظائف + تقديمان (كلمات المرور: " +
      DEMO_PASSWORD +
      ")"
  );
}

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

  await seedDemoData();
}

main()
  .catch((error) => {
    console.error("فشل زرع البيانات:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
