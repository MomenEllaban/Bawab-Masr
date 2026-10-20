import type { Metadata } from "next";
import Link from "next/link";
import {
  UserRound,
  Smartphone,
  FileText,
  MousePointerClick,
  ClipboardCheck,
  Send,
  MessageCircleQuestion,
  ArrowLeft,
  ListChecks,
  UsersRound,
} from "lucide-react";
import Reveal from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "كيف يعمل بواب مصر؟ — بواب مصر",
  description:
    "تعرّف على خطوات التسجيل والتحقق وإكمال الملف الشخصي والتقديم على الوظائف أو نشرها على منصة بواب مصر.",
};

const seekerSteps = [
  {
    icon: UserRound,
    title: "أنشئ حسابك",
    desc: "سجّل بياناتك الأساسية (الاسم، رقم الهاتف، البريد الإلكتروني) واختر نوع الحساب: باحث عن عمل.",
  },
  {
    icon: Smartphone,
    title: "أكّد رقم هاتفك",
    desc: "أرسلنا رمز تحقق إلى رقمك، أدخله لتأكيد ملكيتك للحساب وحماية بياناتك.",
  },
  {
    icon: FileText,
    title: "أكمل ملفك الشخصي",
    desc: "أضف خبرتك السابقة، مهاراتك، والمناطق التي تفضّل العمل فيها لتزيد فرص قبولك.",
  },
  {
    icon: MousePointerClick,
    title: "قدّم على الوظائف",
    desc: "تصفّح الوظائف المعتمدة وقدّم طلبك بنقرة واحدة، وتابع حالة طلبك من لوحة التحكم.",
  },
];

const employerSteps = [
  {
    icon: UserRound,
    title: "أنشئ حسابك",
    desc: "سجّل بياناتك واختر نوع الحساب: صاحب عقار أو شركة إدارة عقارات.",
  },
  {
    icon: Smartphone,
    title: "أكّد رقم هاتفك",
    desc: "أكّد رقم هاتفك عبر رمز التحقق ليصبح حسابك موثوقاً لدى الباحثين عن عمل.",
  },
  {
    icon: Send,
    title: "انشر وظيفة",
    desc: "أضف تفاصيل الوظيفة (العنوان، الموقع، المهام، الأجر) وأرسلها للمراجعة، ثم تُنشر بعد الاعتماد.",
  },
  {
    icon: ClipboardCheck,
    title: "راجع الطلبات",
    desc: "استعرض طلبات المتقدمين، قارن الخبرات، وتواصل مع من تراه مناسباً لتوظيفه.",
  },
];

function StepCard({
  step,
  index,
}: {
  step: { icon: typeof UserRound; title: string; desc: string };
  index: number;
}) {
  const Icon = step.icon;
  return (
    <article className="card h-full p-6">
      <div className="flex items-center gap-3.5">
        <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy text-white">
          <Icon size={21} aria-hidden />
          <span className="absolute -top-1 -end-1 flex h-5.5 w-5.5 items-center justify-center rounded-full bg-emerald-700 text-[0.68rem] font-bold text-white">
            {index + 1}
          </span>
        </span>
        <h3 className="text-lg font-bold">{step.title}</h3>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-ink-soft">{step.desc}</p>
    </article>
  );
}

export default function HowItWorksPage() {
  return (
    <main>
      {/* ترويسة الصفحة */}
      <section className="border-b border-line bg-navy text-white">
        <div className="container-app py-12 lg:py-16">
          <span className="eyebrow border-emerald/40 bg-emerald/15 text-emerald">
            <ListChecks size={13} aria-hidden />
            رحلة واضحة للطرفين
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-[1.35] sm:text-4xl">
            كيف يعمل بواب مصر؟
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-loose text-white/75 lg:text-lg">
            صمّمنا بواب مصر لتكون بسيطة وواضحة للطرفين: الباحثين عن عمل من
            البوابين والحراس، وأصحاب العقارات الباحثين عن كوادر موثوقة. إليك
            الرحلة الكاملة لكل طرف.
          </p>
        </div>
      </section>

      {/* للباحثين عن عمل */}
      <section className="container-app py-14 lg:py-20">
        <Reveal>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">
                <UserRound size={13} aria-hidden />
                للباحثين عن عمل
              </span>
              <h2 className="mt-4 text-2xl font-extrabold lg:text-3xl">
                من التسجيل إلى قرار التوظيف
              </h2>
              <p className="mt-2 max-w-2xl text-ink-soft">
                أربع خطوات بسيطة تفصلك عن فرصة عمل تناسبك وقريبة من سكنك.
              </p>
            </div>
            <Link href="/register?role=SEEKER" className="btn btn-primary">
              سجّل كباحث عن عمل
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2">
          {seekerSteps.map((step, index) => (
            <Reveal key={step.title} delay={index * 70}>
              <StepCard step={step} index={index} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* لأصحاب العقارات */}
      <section className="border-y border-line bg-surface">
        <div className="container-app py-14 lg:py-20">
          <Reveal>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="eyebrow">
                  <UsersRound size={13} aria-hidden />
                  لأصحاب العقارات
                </span>
                <h2 className="mt-4 text-2xl font-extrabold lg:text-3xl">
                  من إنشاء الحساب إلى استقبال الطلبات
                </h2>
                <p className="mt-2 max-w-2xl text-ink-soft">
                  انشر وظيفتك خلال دقائق، واستقبل طلبات متقدّمين جاهزين للمراجعة
                  في مكان واحد.
                </p>
              </div>
              <Link href="/register?role=EMPLOYER" className="btn btn-primary">
                سجّل كصاحب عقار
              </Link>
            </div>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {employerSteps.map((step, index) => (
              <Reveal key={step.title} delay={index * 70}>
                <StepCard step={step} index={index} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* أسئلة إضافية */}
      <section className="container-app py-14 lg:py-20">
        <Reveal>
          <div className="card mx-auto max-w-2xl p-8 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <MessageCircleQuestion size={26} aria-hidden />
            </span>
            <h2 className="mt-5 text-xl font-extrabold lg:text-2xl">
              هل لديك أسئلة أخرى؟
            </h2>
            <p className="mt-3 leading-relaxed text-ink-soft">
              اطّلع على الأسئلة الشائعة أو تواصل مع فريق الدعم مباشرة.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/faq" className="btn btn-secondary">
                الأسئلة الشائعة
                <ArrowLeft size={16} aria-hidden />
              </Link>
              <Link href="/contact" className="btn btn-secondary">
                تواصل معنا
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
