import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  BadgeDollarSign,
  ShieldCheck,
  ClipboardCheck,
  MessageCircle,
  SlidersHorizontal,
  Smartphone,
  ListChecks,
  BadgeCheck,
  ArrowLeft,
  Send,
} from "lucide-react";
import Reveal from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "لأصحاب العقارات — بواب مصر",
  description:
    "مزايا منصة بواب مصر لأصحاب العقارات: انشر وظيفة مجاناً، راجع طلبات المتقدمين، ووظّف بواباً موثوقاً بسهولة.",
};

const benefits = [
  {
    icon: BadgeDollarSign,
    title: "نشر وظيفة مجاناً",
    desc: "أضف تفاصيل الوظيفة وانشرها للمراجعة والاعتماد دون أي تكلفة.",
  },
  {
    icon: ShieldCheck,
    title: "مرشحون موثوقون",
    desc: "كل حساب باحث يمرّ بتأكيد رقم الهاتف، مما يقلل الحسابات الوهمية.",
  },
  {
    icon: ClipboardCheck,
    title: "مراجعة الطلبات في مكان واحد",
    desc: "استعرض طلبات المتقدمين وقارن بين الخبرات من لوحة تحكم واحدة.",
  },
  {
    icon: MessageCircle,
    title: "تواصل مباشر مع المتقدمين",
    desc: "تواصل مع من تراه مناسباً مباشرة واتفق على التفاصيل بسهولة.",
  },
  {
    icon: SlidersHorizontal,
    title: "إدارة إعلاناتك",
    desc: "تحكّم في وظائفك وإيقافها أو حذفها في أي وقت من لوحة التحكم.",
  },
  {
    icon: Smartphone,
    title: "واجهة عربية بسيطة",
    desc: "منصة مصمّمة من اليمين لليسار وسهلة الاستخدام على الهاتف والحاسوب.",
  },
];

const abilities = [
  "إنشاء حساب صاحب عقار وتأكيد رقم هاتفك في دقائق.",
  "نشر وظائف لحارس أو بواب بمهام وأجر واضحين.",
  "متابعة حالة كل إعلان حتى اعتماده ونشره.",
  "استعراض طلبات المتقدمين واختيار الأنسب.",
  "التواصل المباشر مع الباحثين وإتمام التعيين.",
];

export default function ForPropertyOwnersPage() {
  return (
    <main>
      {/* ترويسة الصفحة */}
      <section className="border-b border-line bg-navy text-white">
        <div className="container-app py-12 lg:py-16">
          <span className="eyebrow border-emerald/40 bg-emerald/15 text-emerald">
            <Building2 size={13} aria-hidden />
            لأصحاب العقارات
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-[1.35] sm:text-4xl">
            بواب يليق بعمارتك…{" "}
            <span className="text-emerald">يبدأ من هنا</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-loose text-white/75 lg:text-lg">
            إذا كنت صاحب عقار أو اتحاد ملاك أو شركة إدارة، تساعدك بواب مصر على
            الوصول إلى بوابين وحراس موثوقين بسرعة ووضوح، وبدون تعقيد.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/register?role=EMPLOYER" className="btn btn-accent btn-lg">
              سجّل مجاناً الآن
            </Link>
            <Link href="/how-it-works" className="btn btn-on-navy btn-lg">
              اعرف كيف تعمل المنصة
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
              <ShieldCheck size={13} aria-hidden />
              لماذا تنشر معنا؟
            </span>
            <h2 className="mt-4 text-2xl font-extrabold lg:text-3xl">
              توظيف أسرع بمعايير أوضح
            </h2>
            <p className="mt-2 text-ink-soft">
              كل ميزة مصمّمة لتوفير وقت الإدارة وضمان وصولك إلى كوادر حراسة
              موثوقة.
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
                  من النشر حتى التعيين
                </h2>
                <p className="mt-3 text-ink-soft">
                  كل خطوات التوظيف في لوحة تحكم واحدة بسيطة تعمل على الهاتف
                  والحاسوب.
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
              <Send size={32} className="mx-auto text-emerald" aria-hidden />
              <h2 className="mt-5 text-2xl font-extrabold lg:text-3xl">
                ابدأ التوظيف الآن
              </h2>
              <p className="mt-3 leading-loose text-white/75">
                أنشئ حسابك المجاني وانشر أول وظيفة للوصول إلى كوادر حراسة
                موثوقة.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/register?role=EMPLOYER" className="btn btn-accent btn-lg">
                  سجّل كصاحب عقار
                </Link>
                <Link href="/how-it-works" className="btn btn-on-navy btn-lg">
                  اعرف كيف تعمل المنصة
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
