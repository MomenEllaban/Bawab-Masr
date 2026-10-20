import type { Metadata } from "next";
import Link from "next/link";
import {
  UserRound,
  BadgeDollarSign,
  MapPin,
  MessageCircle,
  ListChecks,
  UserRoundCheck,
  Lock,
  BadgeCheck,
  Search,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import Reveal from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "للباحثين عن عمل — بواب مصر",
  description:
    "مزايا منصة بواب مصر للباحثين عن عمل من البوابين والحراس: تسجيل مجاني، تقديم سهل، ومتابعة كاملة للطلبات.",
};

const benefits = [
  {
    icon: BadgeDollarSign,
    title: "تسجيل وتقديم مجاني",
    desc: "إنشاء الحساب والتقديم على الوظائف مجاني تماماً، بدون أي رسوم أو اشتراكات.",
  },
  {
    icon: MapPin,
    title: "وظائف في منطقتك",
    desc: "تصفّح الوظائف القريبة من سكنك، ووفّر وقت التنقل وابحث عن فرص مناسبة لك.",
  },
  {
    icon: MessageCircle,
    title: "تواصل مباشر",
    desc: "يتواصل معك صاحب العقار مباشرة عند اهتمامه بطلبك، دون وسطاء.",
  },
  {
    icon: ListChecks,
    title: "متابعة طلباتك",
    desc: "تابع حالة كل طلب من لوحة التحكم وتعرّف على النتيجة بسهولة.",
  },
  {
    icon: UserRoundCheck,
    title: "ملف شخصي يعمل لأجلك",
    desc: "أضف خبرتك ومهاراتك مرة واحدة ليظهر ملفك عند التقديم على أي وظيفة.",
  },
  {
    icon: Lock,
    title: "بيانات محمية",
    desc: "بياناتك محمية ولا تُشارَك إلا بما تحتاجه عملية التوظيف.",
  },
];

const abilities = [
  "إنشاء حساب وتأكيد رقم هاتفك في دقائق.",
  "بناء ملف شخصي يبرز خبرتك ومهاراتك والمناطق التي تفضّلها.",
  "تصفّح الوظائف المعتمدة والتقديم بنقرة واحدة.",
  "متابعة حالة طلباتك من التقديم حتى التعيين.",
  "التواصل مع أصحاب العقارات المهتمين مباشرة.",
];

export default function ForJobSeekersPage() {
  return (
    <main>
      {/* ترويسة الصفحة */}
      <section className="border-b border-line bg-navy text-white">
        <div className="container-app py-12 lg:py-16">
          <span className="eyebrow border-emerald/40 bg-emerald/15 text-emerald">
            <UserRound size={13} aria-hidden />
            للباحثين عن عمل
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-[1.35] sm:text-4xl">
            فرصة عمل تليق بيك… <span className="text-emerald">تبدأ من هنا</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-loose text-white/75 lg:text-lg">
            إذا كنت بواباً أو حارساً تبحث عن عمل، فبواب مصر صُمّمت لتسهّل عليك
            رحلتك: حساب مجاني، وظائف موثوقة، وتقديم بسيط من هاتفك.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/register?role=SEEKER" className="btn btn-accent btn-lg">
              سجّل مجاناً الآن
            </Link>
            <Link href="/jobs" className="btn btn-on-navy btn-lg">
              تصفّح الوظائف
              <ArrowLeft size={17} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* المزايا */}
      <section className="container-app py-14 lg:py-20">
        <Reveal>
          <div className="mb-8 max-w-2xl">
            <span className="eyebrow">
              <Sparkles size={13} aria-hidden />
              لماذا تسجّل معنا؟
            </span>
            <h2 className="mt-4 text-2xl font-extrabold lg:text-3xl">
              مصمّمة لتسهيل رحلة البحث عن عمل
            </h2>
            <p className="mt-2 text-ink-soft">
              كل ميزة في المنصة مصمّمة لتوفّر وقتك وتحمي بياناتك وتقرّبك من
              الفرصة المناسبة.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Reveal key={benefit.title} delay={index * 60}>
                <div className="card card-hover h-full p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-card bg-emerald-50 text-emerald-700">
                    <Icon size={21} aria-hidden />
                  </span>
                  <h3 className="mt-4 font-bold">{benefit.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                    {benefit.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ماذا يمكنك أن تفعل؟ */}
      <section className="border-y border-line bg-surface">
        <div className="container-app py-14 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
            <Reveal>
              <div>
                <span className="eyebrow">
                  <ListChecks size={13} aria-hidden />
                  ماذا يمكنك أن تفعل؟
                </span>
                <h2 className="mt-4 text-2xl font-extrabold lg:text-3xl">
                  كل ما تحتاجه في رحلة التوظيف
                </h2>
                <p className="mt-3 text-ink-soft">
                  من إنشاء الحساب حتى متابعة قرار التوظيف — كل الخطوات في مكان
                  واحد وواضح.
                </p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <ul className="card divide-y divide-line p-0">
                {abilities.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 px-5 py-4 lg:px-6"
                  >
                    <BadgeCheck
                      size={19}
                      className="mt-0.5 shrink-0 text-emerald-700"
                      aria-hidden
                    />
                    <span className="leading-relaxed text-ink-soft">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* دعوة للتسجيل */}
      <section className="container-app py-14 lg:py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-pan bg-navy px-6 py-12 text-center text-white lg:px-16 lg:py-16">
            <div className="relative mx-auto max-w-2xl">
              <Search size={32} className="mx-auto text-emerald" aria-hidden />
              <h2 className="mt-5 text-2xl font-extrabold lg:text-3xl">
                ابدأ رحلتك الآن
              </h2>
              <p className="mt-3 leading-loose text-white/75">
                أنشئ حسابك المجاني وابدأ التقديم على الوظائف المناسبة لك.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/register?role=SEEKER" className="btn btn-accent btn-lg">
                  سجّل كباحث عن عمل
                </Link>
                <Link href="/jobs" className="btn btn-on-navy btn-lg">
                  تصفّح الوظائف
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
