import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  Banknote,
  KeyRound,
  UserRoundCheck,
  MapPin,
  FileSignature,
  CreditCard,
  SearchCheck,
  Flag,
  TriangleAlert,
  ArrowLeft,
} from "lucide-react";
import Reveal from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "السلامة والأمان — بواب مصر",
  description:
    "نصائح السلامة والأمان للباحثين عن عمل وأصحاب العقارات على منصة بواب مصر لتجنّب الاحتيال.",
};

const tips = [
  {
    icon: Banknote,
    title: "لا تدفع أي رسوم تسجيل",
    desc: "بواب مصر لا تطلب منك أي مبلغ مقابل التسجيل أو التقديم على الوظائف. أي طلب لدفع رسوم مقابل وظيفة هو مؤشر احتيال.",
  },
  {
    icon: KeyRound,
    title: "لا تشارك رمز التحقق OTP",
    desc: "لا تشارك رمز التحقق المرسل إلى هاتفك مع أي شخص مهما كان السبب. لا يطلب أي فريق شرعي منك هذا الرمز.",
  },
  {
    icon: UserRoundCheck,
    title: "تحقق من هوية صاحب العقار",
    desc: "تأكد من شخصية صاحب العقار وملكيته للعقار قبل أي التزام، واطلب ما يوثّق ذلك عند الشك.",
  },
  {
    icon: MapPin,
    title: "قابل صاحب العقار في مكان عام",
    desc: "عند إجراء أي مقابلة، فضّل الاجتماع في مكان عام ومزدحم، وأخبر شخصاً تثق به بمكان وموعد اللقاء.",
  },
  {
    icon: FileSignature,
    title: "وثّق الاتفاقات كتابياً",
    desc: "اطلب توضيح المهام والأجر ومواعيد العمل ومدة الإخطار كتابياً، ووقع على اتفاق واضح يحمي الطرفين.",
  },
  {
    icon: CreditCard,
    title: "لا تشارك بياناتك البنكية",
    desc: "لا ترسل بيانات حسابك البنكي أو بطاقتك لأي طرف. بيانات التواصل والوظيفة لا تتطلب تفاصيلك المالية.",
  },
  {
    icon: SearchCheck,
    title: "تحقّق من تفاصيل الوظيفة",
    desc: "راجع وصف الوظيفة والموقع والأجر بعناية، واحذر من العروض المبالغ فيها أو الغامضة أو العاجلة بشكل غير طبيعي.",
  },
  {
    icon: Flag,
    title: "بلّغ عن أي محتوى مخالف",
    desc: "إذا صادفت إعلاناً مضللاً أو حساباً مريباً، أبلغ فريق الدعم فوراً لاتخاذ اللازم وحماية بقية المستخدمين.",
  },
];

export default function SafetyPage() {
  return (
    <main>
      {/* ترويسة الصفحة */}
      <section className="border-b border-line bg-navy text-white">
        <div className="container-app py-12 lg:py-16">
          <span className="eyebrow border-emerald/40 bg-emerald/15 text-emerald">
            <ShieldCheck size={13} aria-hidden />
            سلامتك أولاً
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-[1.35] sm:text-4xl">
            السلامة والأمان
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-loose text-white/75 lg:text-lg">
            اطّلع على هذه النصائح المهمة قبل التقديم على أي وظيفة أو التعامل مع
            أي طرف عبر المنصة.
          </p>
        </div>
      </section>

      {/* تنبيه */}
      <section className="container-app pt-10">
        <div className="alert alert-warning">
          <TriangleAlert size={18} aria-hidden className="shrink-0" />
          <span>
            احترس من أي شخص يطلب منك دفع مبلغ مالي أو مشاركة رمز التحقق للحصول
            على وظيفة. هذه العلامات تدل على محاولة احتيال.
          </span>
        </div>
      </section>

      {/* النصائح */}
      <section className="container-app py-12 lg:py-16">
        <Reveal>
          <div className="mb-8 max-w-2xl">
            <span className="eyebrow">
              <ShieldCheck size={13} aria-hidden />
              نصائح مهمة
            </span>
            <h2 className="mt-4 text-2xl font-extrabold lg:text-3xl">
              ثمان خطوات تحميك من الاحتيال
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2">
          {tips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <Reveal key={tip.title} delay={index * 60}>
                <article className="card h-full p-6">
                  <div className="flex items-center gap-3.5">
                    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-warning-bg text-warning">
                      <Icon size={22} aria-hidden />
                      <span className="absolute -top-1 -end-1 flex h-5.5 w-5.5 items-center justify-center rounded-full bg-navy text-[0.68rem] font-bold text-white">
                        {index + 1}
                      </span>
                    </span>
                    <h3 className="text-lg font-bold">{tip.title}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                    {tip.desc}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* الإبلاغ */}
      <section className="container-app pb-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-pan bg-navy px-6 py-12 text-center text-white lg:px-16">
            <div className="relative mx-auto max-w-2xl">
              <ShieldAlert size={32} className="mx-auto text-emerald" aria-hidden />
              <h2 className="mt-5 text-2xl font-extrabold">
                هل واجهت محتوى مشبوهاً؟
              </h2>
              <p className="mt-3 leading-loose text-white/75">
                أبلغنا فوراً لنتمكن من مراجعة المحتوى واتخاذ الإجراء المناسب.
              </p>
              <Link href="/contact" className="btn btn-accent btn-lg mt-7">
                الإبلاغ عبر صفحة التواصل
                <ArrowLeft size={17} aria-hidden />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
