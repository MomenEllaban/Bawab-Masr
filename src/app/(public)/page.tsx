import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import type { Prisma } from "@prisma/client";
import {
  Search,
  ArrowLeft,
  ShieldCheck,
  UserRound,
  Building2,
  Smartphone,
  ListChecks,
  MousePointerClick,
  Lock,
  BadgeCheck,
  Send,
  ClipboardCheck,
  House,
  UsersRound,
  MapPin,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import JobCard from "@/components/jobs/job-card";
import Reveal from "@/components/ui/reveal";
import FaqAccordion from "@/components/ui/faq-accordion";
import { FAQ_ITEMS } from "@/lib/faq-data";

export const metadata: Metadata = {
  title: "بواب مصر — منصة توظيف البوابين والحراسة في مصر",
  description:
    "ابحث عن وظيفة بواب أو حارس عقار في الإسكندرية ومصر. بواب مصر تربط البوابين والحراس بأصحاب العقارات واتحادات الملاك مباشرةً.",
};

type JobListItem = Prisma.JobGetPayload<{
  include: {
    province: { select: { name: true; slug: true } };
    area: { select: { name: true } };
    poster: { select: { displayName: true } };
  };
}>;

async function getHomeData(): Promise<{
  jobs: JobListItem[];
  provinces: { id: string; name: string; slug: string }[];
  dbError: boolean;
}> {
  try {
    const [jobs, provinces] = await Promise.all([
      prisma.job.findMany({
        where: { status: "PUBLISHED", reviewStatus: "APPROVED" },
        orderBy: { publishedAt: "desc" },
        take: 6,
        include: {
          province: { select: { name: true, slug: true } },
          area: { select: { name: true } },
          poster: { select: { displayName: true } },
        },
      }),
      prisma.province.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        select: { id: true, name: true, slug: true },
      }),
    ]);
    return { jobs, provinces, dbError: false };
  } catch (error) {
    console.error("[home-page]", error);
    return { jobs: [], provinces: [], dbError: true };
  }
}

const AUDIENCES = [
  {
    icon: UserRound,
    image: "/images/security-guard.jpg",
    badge: "فرص عمل مستقرة وسكن",
    title: "للباحثين عن عمل",
    desc: "ابنِ ملفك، قدّم على الوظائف المناسبة، وتابع طلباتك خطوة بخطوة مع أصحاب العقارات.",
    points: [
      "ملف شخصي يبرز خبرتك ومناطق عملك",
      "تقديم بنقرة واحدة على كل وظيفة تناسبك",
      "متابعة حالة كل طلب حتى قرار التوظيف",
      "التسجيل والتقديم مجاني بالكامل بدون أي عمولات",
    ],
    cta: { href: "/register?role=SEEKER", label: "أنشئ حساب باحث الآن" },
    secondary: { href: "/for-job-seekers", label: "دليل الباحث عن عمل" },
  },
  {
    icon: Building2,
    image: "/images/property-manager.jpg",
    badge: "إدارة وتسكين موثوق",
    title: "لأصحاب العقارات والإدارات",
    desc: "انشر إعلانك، واستقبل طلبات متقدّمين جاهزين ومؤكدين في مكان واحد منظم.",
    points: [
      "نشر وظائف خلال دقائق وإرسالها للمراجعة",
      "قائمة متقدّمين مرتبة بحالات واضحة وتواصل مباشر",
      "إضافة عقارك وبيانات السكن ومميزات الوظيفة",
      "إدارة طلبات كل وظيفة من لوحة تحكم واحدة",
    ],
    cta: { href: "/register?role=EMPLOYER", label: "أنشئ حساب صاحب عقار" },
    secondary: { href: "/for-property-owners", label: "دليل أصحاب العقارات" },
  },
];

const FEATURES = [
  {
    icon: Smartphone,
    title: "حسابات موثّقة",
    desc: "كل حساب يمر بتأكيد رقم هاتفه وبياناته قبل استخدام المنصة.",
  },
  {
    icon: ShieldCheck,
    title: "إعلانات مراجَعة",
    desc: "كل وظيفة تُنشر بعد مراجعتها وتدقيقها من فريق الإدارة.",
  },
  {
    icon: ListChecks,
    title: "متابعة كاملة",
    desc: "سجل واضح ومحدث لكل طلب من التقديم حتى التوظيف أو الرفض.",
  },
  {
    icon: Lock,
    title: "أمان وخصوصية",
    desc: "بياناتك محمية ولا نشارك معلومات الاتصال إلا مع الطرف المعني بالتوظيف.",
  },
  {
    icon: MousePointerClick,
    title: "تقديم مباشر",
    desc: "تقديم بسيط وسريع من الموبايل أو الكمبيوتر في ثوانٍ معدودة.",
  },
  {
    icon: BadgeCheck,
    title: "مجاني للباحثين",
    desc: "التسجيل وإنشاء الملف الشخصي والتقديم مجاني تماماً.",
  },
];

const STEPS = [
  {
    icon: UserRound,
    title: "أنشئ حسابك",
    desc: "سجّل رقم هاتفك وأكد الرمز، ثم أنشئ ملفك الشخصي بخطوات بسيطة.",
  },
  {
    icon: Search,
    title: "تصفّح وقدّم",
    desc: "اختر الوظائف المناسبة لخبرتك ومناطقك، وقدّم بنقرة واحدة.",
  },
  {
    icon: ClipboardCheck,
    title: "تابع طلبك",
    desc: "شاهد حالة كل طلب لحظة بلحظة حتى وصول قرار صاحب العقار.",
  },
];

export default async function HomePage() {
  const { jobs, provinces, dbError } = await getHomeData();

  return (
    <main>
      {/* ============ الواجهة الرئيسية ============ */}
      <section className="relative overflow-hidden bg-navy text-white">
        {/* خلفيات جمالية وتدرجات ضوئية هادئة */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 85% 15%, rgba(14,159,110,0.38), transparent 50%), radial-gradient(circle at 15% 85%, rgba(18,63,103,0.7), transparent 55%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="container-app relative grid items-center gap-12 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:py-20">
          <div className="animate-rise">
            <span className="eyebrow border-emerald/40 bg-emerald/15 text-emerald-300 font-bold inline-flex items-center gap-1.5 px-3 py-1 text-xs">
              <Sparkles size={13} aria-hidden />
              منصة توظيف قطاع حراسة وإدارة العقارات في مصر
            </span>

            <h1
              className="mt-5 text-3xl font-extrabold leading-[1.3] text-white sm:text-4xl lg:text-[2.85rem]"
              style={{ letterSpacing: "-0.015em" }}
            >
              وظيفة تليق بيك…
              <br />
              <span className="text-emerald-400 font-black">أو بواب يليق بعمارتك</span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80 lg:text-lg">
              بواب مصر يربط الباحثين عن عمل بأصحاب العقارات واتحادات الملاك
              وشركات إدارة العقارات مباشرةً — بدون وسيط وبدون تعقيد.
            </p>

            {/* صندوق البحث السريع المحدث */}
            <form
              method="get"
              action="/jobs"
              className="mt-7 rounded-2xl border border-white/15 bg-white p-2.5 shadow-2xl sm:p-3"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="pointer-events-none absolute inset-y-0 start-3 my-auto text-ink-mute"
                    aria-hidden
                  />
                  <label htmlFor="hero-q" className="sr-only">
                    كلمة البحث
                  </label>
                  <input
                    id="hero-q"
                    type="text"
                    name="q"
                    placeholder="ابحث بعنوان الوظيفة أو المنطقة…"
                    className="w-full rounded-xl border border-line bg-muted/50 py-2.5 pe-3 ps-10 text-sm font-semibold text-ink placeholder:text-ink-mute focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy"
                  />
                </div>

                {provinces.length > 0 ? (
                  <div className="sm:w-44">
                    <label htmlFor="hero-province" className="sr-only">
                      المحافظة
                    </label>
                    <select
                      id="hero-province"
                      name="province"
                      className="w-full rounded-xl border border-line bg-muted/50 py-2.5 px-3 text-sm font-semibold text-ink focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy"
                      defaultValue=""
                    >
                      <option value="">كل المحافظات</option>
                      {provinces.map((province) => (
                        <option key={province.id} value={province.slug}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}

                <button
                  type="submit"
                  className="btn btn-accent shrink-0 font-bold"
                >
                  <Search size={16} aria-hidden />
                  ابحث الآن
                </button>
              </div>
            </form>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/jobs" className="btn btn-accent btn-lg font-bold">
                ابحث عن وظيفة الآن
                <ArrowLeft size={18} aria-hidden />
              </Link>
              <Link href="/register?role=EMPLOYER" className="btn btn-on-navy btn-lg font-bold">
                انشر وظيفة لعمارتك
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-white/75 sm:text-sm">
              {[
                "تأكيد رقم الهاتف لكل حساب",
                "كل وظيفة تمر بمراجعة الإدارة",
                "مجاني بالكامل للباحثين عن عمل",
              ].map((item) => (
                <li key={item} className="inline-flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* الصورة التحريرية الرسمية المحدثة مع البطاقات العائمة */}
          <div
            className="relative mx-auto w-full max-w-[34rem] animate-rise"
            style={{ "--rise-delay": "150ms" } as React.CSSProperties}
          >
            <div className="relative overflow-hidden rounded-3xl border-2 border-white/20 shadow-2xl">
              <Image
                src="/images/hero-concierge.jpg"
                alt="مسؤول أمن واستقبال وبوابة عقار سكني بالإسكندرية"
                width={680}
                height={510}
                priority
                className="h-[25rem] w-full object-cover object-top sm:h-[28rem]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/20 to-transparent" />

              <div className="absolute bottom-4 inset-x-4 flex items-center justify-between text-white text-xs">
                <span className="font-bold flex items-center gap-1.5">
                  <MapPin size={15} className="text-emerald-400" />
                  الإسكندرية — سموحة، لوران، ميامي
                </span>
                <span className="rounded-full bg-emerald-700/90 px-3 py-1 font-bold text-[0.72rem] shadow-sm backdrop-blur-md">
                  عقارات ومجمعات سكنية موثقة
                </span>
              </div>
            </div>

            {/* بطاقة عائمة 1: إشعار توثيق */}
            <div className="absolute -top-3 start-2 animate-drop rounded-2xl glass-card p-3 shadow-lg flex items-center gap-2.5 text-ink">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <ShieldCheck size={18} aria-hidden />
              </span>
              <div className="text-right">
                <span className="text-xs font-extrabold leading-tight block">
                  تأكيد رقم الهاتف والهوية
                </span>
                <span className="text-[0.7rem] font-medium text-ink-mute">
                  فحص ومراجعة إدارية مسبقة
                </span>
              </div>
            </div>

            {/* بطاقة عائمة 2: فرص مباشرة */}
            <div className="absolute -bottom-4 end-4 animate-rise rounded-2xl glass-card p-3 shadow-lg flex items-center gap-2.5 text-ink">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-white">
                <Sparkles size={18} aria-hidden />
              </span>
              <div className="text-right">
                <span className="text-xs font-extrabold leading-tight block">
                  فرص مباشرة ومجانية
                </span>
                <span className="text-[0.7rem] font-medium text-ink-mute">
                  بدون وسيط أو عمولات
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ أحدث الوظائف ============ */}
      <section className="container-app py-14 lg:py-20">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">وظائف متاحة حالياً</span>
              <h2 className="mt-4 text-2xl font-extrabold lg:text-3xl">
                أحدث فرص العمل في الإسكندرية
              </h2>
              <p className="mt-2 text-ink-soft">
                وظائف مباشرة موثقة من أصحاب العقارات واتحادات الملاك.
              </p>
            </div>
            <Link href="/jobs" className="link font-bold">
              عرض كل الوظائف
              <ArrowLeft size={16} className="inline ms-1" aria-hidden />
            </Link>
          </div>
        </Reveal>

        {dbError ? (
          <div className="alert alert-error">
            تعذّر تحميل الوظائف حالياً.{" "}
            <Link href="/jobs" className="link font-bold">
              انتقل لصفحة الوظائف
            </Link>{" "}
            أو حاول لاحقاً.
          </div>
        ) : jobs.length === 0 ? (
          <Reveal>
            <div className="card surface-muted flex flex-col items-center gap-3 p-10 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface text-navy shadow-xs">
                <Building2 size={26} aria-hidden />
              </span>
              <h3 className="text-lg font-bold">لا توجد وظائف منشورة الآن</h3>
              <p className="max-w-md text-sm text-ink-soft">
                كن أول من يعرف عند نشر وظائف جديدة — أنشئ حسابك مجاناً وتابع
                أحدث الفرص.
              </p>
              <Link href="/register?role=SEEKER" className="btn btn-primary mt-2">
                إنشاء حساب باحث عن عمل
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job, index) => (
              <Reveal key={job.id} delay={index * 70}>
                <JobCard job={job} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* ============ لكل طرف مكانه ============ */}
      <section className="border-y border-line bg-surface">
        <div className="container-app py-14 lg:py-20">
          <Reveal>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="eyebrow">لكل طرف مكانه</span>
              <h2 className="mt-4 text-2xl font-extrabold lg:text-3xl">
                سواء تبحث عن عمل، أو تبحث عن بواب موثوق
              </h2>
              <p className="mt-3 text-ink-soft">
                حلول مصممة خصيصاً لتلبية متطلبات الباحثين وأصحاب العقارات في مصر.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-8 lg:grid-cols-2">
            {AUDIENCES.map((audience, index) => {
              const Icon = audience.icon;
              return (
                <Reveal key={audience.title} delay={index * 90}>
                  <article className="card group relative flex h-full flex-col overflow-hidden p-0 transition-all hover:shadow-xl">
                    {/* غلاف الصورة التحريرية */}
                    <div className="relative h-48 w-full overflow-hidden bg-navy sm:h-56">
                      <Image
                        src={audience.image}
                        alt={audience.title}
                        width={600}
                        height={340}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/40 to-transparent" />
                      
                      <div className="absolute bottom-4 inset-x-5 flex items-center justify-between text-white">
                        <span className="flex items-center gap-2.5">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md text-white border border-white/30">
                            <Icon size={20} aria-hidden />
                          </span>
                          <h3 className="text-xl font-extrabold text-white">
                            {audience.title}
                          </h3>
                        </span>
                        <span className="rounded-full bg-emerald-700/90 px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-md">
                          {audience.badge}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-6 lg:p-7">
                      <p className="leading-relaxed text-ink-soft">
                        {audience.desc}
                      </p>

                      <ul className="mt-5 grid gap-3">
                        {audience.points.map((point) => (
                          <li
                            key={point}
                            className="flex items-start gap-2.5 text-sm text-ink-soft"
                          >
                            <CheckCircle2
                              size={18}
                              className="mt-0.5 shrink-0 text-emerald-700"
                              aria-hidden
                            />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-line/70 pt-5">
                        <Link href={audience.cta.href} className="btn btn-primary font-bold">
                          {audience.cta.label}
                        </Link>
                        <Link href={audience.secondary.href} className="link text-sm font-bold inline-flex items-center gap-1">
                          <span>{audience.secondary.label}</span>
                          <ArrowLeft size={15} aria-hidden />
                        </Link>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ كيف يعمل ============ */}
      <section className="container-app py-14 lg:py-20">
        <Reveal>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="eyebrow">ثلاث خطوات فقط</span>
            <h2 className="mt-4 text-2xl font-extrabold lg:text-3xl">
              كيف يعمل بواب مصر؟
            </h2>
            <p className="mt-3 text-ink-soft">
              من التسجيل حتى متابعة طلبك — رحلة بسيطة وواضحة.
            </p>
          </div>
        </Reveal>

        <div className="relative grid gap-6 md:grid-cols-3">
          <div
            aria-hidden
            className="absolute inset-x-0 top-8 hidden h-px bg-line md:block"
          />
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.title} delay={index * 90} className="relative">
                <div className="flex h-full flex-col items-center gap-4 rounded-card bg-canvas p-6 text-center">
                  <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 border-canvas bg-navy text-white">
                    <Icon size={26} aria-hidden />
                    <span className="absolute -top-1 -end-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-700 text-[0.7rem] font-bold text-white">
                      {index + 1}
                    </span>
                  </span>
                  <h3 className="text-lg font-bold">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-soft">
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link href="/how-it-works" className="link">
            اعرف المزيد عن طريقة الاستخدام
            <ArrowLeft size={16} className="inline" aria-hidden />
          </Link>
        </div>
      </section>

      {/* ============ المميزات ============ */}
      <section className="border-y border-line bg-surface">
        <div className="container-app py-14 lg:py-20">
          <Reveal>
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="eyebrow">لماذا بواب مصر؟</span>
                <h2 className="mt-4 text-2xl font-extrabold lg:text-3xl">
                  منصة مبنية على الثقة والوضوح
                </h2>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Reveal key={feature.title} delay={index * 60}>
                  <div className="card card-hover h-full p-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-card bg-emerald-50 text-emerald-700">
                      <Icon size={21} aria-hidden />
                    </span>
                    <h3 className="mt-4 font-bold">{feature.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                      {feature.desc}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ الأسئلة الشائعة ============ */}
      <section className="container-app py-14 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <Reveal>
            <div className="lg:sticky lg:top-28 lg:self-start">
              <span className="eyebrow">
                <UsersRound size={13} aria-hidden />
                أسئلة متكررة
              </span>
              <h2 className="mt-4 text-2xl font-extrabold lg:text-3xl">
                قبل ما تبدأ، ممكن تسأل
              </h2>
              <p className="mt-3 text-ink-soft">
                جمعنا هنا أكثر الأسئلة التي تصلنا من الباحثين عن عمل وأصحاب
                العقارات.
              </p>
              <Link href="/faq" className="link mt-5 inline-block">
                كل الأسئلة الشائعة
                <ArrowLeft size={16} className="inline" aria-hidden />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <FaqAccordion items={FAQ_ITEMS.slice(0, 6)} />
          </Reveal>
        </div>
      </section>

      {/* ============ دعوة أخيرة ============ */}
      <section className="container-app pb-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-pan bg-navy px-6 py-12 text-center text-white lg:px-16 lg:py-16">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 20%, rgba(14,159,110,0.4), transparent 45%), radial-gradient(circle at 85% 80%, rgba(18,63,103,0.7), transparent 50%)",
              }}
            />
            <div className="relative mx-auto max-w-2xl">
              <House size={34} className="mx-auto text-emerald" aria-hidden />
              <h2 className="mt-5 text-2xl font-extrabold lg:text-3xl">
                جاهز تبدأ؟
              </h2>
              <p className="mt-3 leading-loose text-white/75">
                سواء تبحث عن شغل يناسبك، أو تبحث عن بواب يهتم بعمارتك — التسجيل
                يبدأ من هنا.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/register?role=SEEKER" className="btn btn-accent btn-lg">
                  أنا باحث عن عمل
                </Link>
                <Link
                  href="/register?role=EMPLOYER"
                  className="btn btn-on-navy btn-lg"
                >
                  أنا صاحب عقار
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
