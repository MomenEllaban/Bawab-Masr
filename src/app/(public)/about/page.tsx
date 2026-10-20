import type { Metadata } from "next";
import Link from "next/link";
import {
  Target,
  UserRound,
  Building2,
  UsersRound,
  Briefcase,
  BadgeCheck,
  MessageCircle,
  ClipboardCheck,
  BadgeDollarSign,
  Smartphone,
  Lock,
  ArrowLeft,
  Mail,
} from "lucide-react";
import Reveal from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "عن المنصة — بواب مصر",
  description:
    "تعرّف على رسالة منصة بواب مصر في ربط البوابين والحراس بأصحاب العقارات في الإسكندرية ومصر.",
};

const audience = [
  {
    icon: UserRound,
    title: "البوابون والحراس",
    desc: "الباحثون عن عمل في حراسة الأبنية والمجمعات السكنية والشركات، ممن يبحثون عن فرص موثوقة وقريبة من سكنهم.",
  },
  {
    icon: Building2,
    title: "أصحاب العقارات",
    desc: "ملاك الأبنية والفيلات والشقق الذين يحتاجون إلى بواب أمين وموثوق لإدارة المبنى على مدار العام.",
  },
  {
    icon: UsersRound,
    title: "اتحادات الملاك",
    desc: "اتحادات شاغلي وملّاك العقارات التي تبحث عن كوادر حراسة وأمن بمعايير واضحة.",
  },
  {
    icon: Briefcase,
    title: "شركات إدارة العقارات",
    desc: "الشركات التي تدير محافظ عقارية وتحتاج إلى توظيف حراس وبوابين بسرعة وموثوقية.",
  },
];

const features = [
  {
    icon: BadgeCheck,
    title: "حسابات موثوقة",
    desc: "كل حساب يمرّ بخطوة تأكيد رقم الهاتف، مما يقلل الحسابات الوهمية ويزيد الثقة.",
  },
  {
    icon: MessageCircle,
    title: "تواصل مباشر",
    desc: "يتواصل صاحب العقار مع الباحث المناسب مباشرة دون وسطاء أو عمولات خفية.",
  },
  {
    icon: ClipboardCheck,
    title: "مراجعة الإعلانات",
    desc: "تمرّ الوظائف بمراجعة إدارية قبل نشرها لضمان جودة ووضوح المحتوى.",
  },
  {
    icon: BadgeDollarSign,
    title: "مجاني للباحثين",
    desc: "التسجيل والتقديم على الوظائف مجاني تماماً للباحثين عن عمل على المنصة.",
  },
  {
    icon: Smartphone,
    title: "مصمّم للهاتف",
    desc: "واجهة عربية من اليمين لليسار تعمل بسلاسة على الهاتف لتسهيل الاستخدام اليومي.",
  },
  {
    icon: Lock,
    title: "بيانات محمية",
    desc: "نحفظ بياناتك ونستخدمها وفق سياسة خصوصية واضحة دون مشاركتها دون إذنك.",
  },
];

export default function AboutPage() {
  return (
    <main>
      {/* ترويسة الصفحة */}
      <section className="border-b border-line bg-navy text-white">
        <div className="container-app py-12 lg:py-16">
          <span className="eyebrow border-emerald/40 bg-emerald/15 text-emerald">
            <Target size={13} aria-hidden />
            من نحن
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-[1.35] sm:text-4xl">
            عن المنصة
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-loose text-white/75 lg:text-lg">
            بواب مصر يربط البوابين والحراس بأصحاب العقارات واتحادات الملاك
            مباشرةً — بثقة ووضوح وبدون وسيط.
          </p>
        </div>
      </section>

      {/* الهدف */}
      <section className="container-app py-14 lg:py-20">
        <Reveal>
          <div className="card mx-auto max-w-3xl p-8 lg:p-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-card bg-navy text-white">
              <Target size={22} aria-hidden />
            </span>
            <h2 className="mt-5 text-2xl font-extrabold">الهدف</h2>
            <div className="prose-ar mt-4 text-ink-soft">
              <p>
                هدف بواب مصر هو ربط البوابين والحراس بأصحاب العقارات واتحادات
                الملاك وشركات إدارة العقارات في مكان واحد موثوق. نبدأ من
                الإسكندرية لأنها من أكبر أسواق العقارات في مصر، ثم نتوسّع تدريجياً
                لبقية المحافظات.
              </p>
              <p>
                نؤمن بأن الوصول إلى وظيفة بواب أو حارس يجب أن يكون بسيطاً وشفافاً،
                وأن يجد صاحب العقار الكفاءة المناسبة دون تعقيد أو وساطة غير ضرورية.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* لمن هذه المنصة؟ */}
      <section className="border-y border-line bg-surface">
        <div className="container-app py-14 lg:py-20">
          <Reveal>
            <div className="mb-8 max-w-2xl">
              <span className="eyebrow">
                <UsersRound size={13} aria-hidden />
                لمن هذه المنصة؟
              </span>
              <h2 className="mt-4 text-2xl font-extrabold lg:text-3xl">
                لكل طرف في سوق العقارات مكانه
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {audience.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={index * 70}>
                  <article className="card h-full p-6">
                    <div className="flex items-center gap-3.5">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-card bg-navy-50 text-navy">
                        <Icon size={20} aria-hidden />
                      </span>
                      <h3 className="text-lg font-bold">{item.title}</h3>
                    </div>
                    <p className="mt-3.5 text-sm leading-relaxed text-ink-soft">
                      {item.desc}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* المزايا */}
      <section className="container-app py-14 lg:py-20">
        <Reveal>
          <div className="mb-8 max-w-2xl">
            <span className="eyebrow">
              <BadgeCheck size={13} aria-hidden />
              لماذا بواب مصر؟
            </span>
            <h2 className="mt-4 text-2xl font-extrabold lg:text-3xl">
              مزايا مصمّمة لسوق العمل العقاري
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={index * 60}>
                <div className="card card-hover h-full p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-card bg-emerald-50 text-emerald-700">
                    <Icon size={21} aria-hidden />
                  </span>
                  <h3 className="mt-4 font-bold">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* دعوة للتواصل */}
      <section className="container-app pb-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-pan bg-navy px-6 py-12 text-center text-white lg:px-16">
            <div className="relative mx-auto max-w-2xl">
              <Mail size={32} className="mx-auto text-emerald" aria-hidden />
              <h2 className="mt-5 text-2xl font-extrabold">تواصل معنا</h2>
              <p className="mt-3 leading-loose text-white/75">
                هل لديك سؤال أو ملاحظة؟ يسعدنا أن نسمع منك.
              </p>
              <Link href="/contact" className="btn btn-accent btn-lg mt-7">
                انتقل إلى صفحة التواصل
                <ArrowLeft size={17} aria-hidden />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
