import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, MessagesSquare, ArrowLeft } from "lucide-react";
import Reveal from "@/components/ui/reveal";
import FaqAccordion from "@/components/ui/faq-accordion";
import { FAQ_ITEMS } from "@/lib/faq-data";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة — بواب مصر",
  description:
    "إجابات لأكثر الأسئلة شيوعاً عن التسجيل ورقم الهاتف والتقديم ونشر الوظائف والخصوصية والدعم على منصة بواب مصر.",
};

export default function FaqPage() {
  return (
    <main>
      {/* ترويسة الصفحة */}
      <section className="border-b border-line bg-navy text-white">
        <div className="container-app py-12 lg:py-16">
          <span className="eyebrow border-emerald/40 bg-emerald/15 text-emerald">
            <HelpCircle size={13} aria-hidden />
            إجابات واضحة
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-[1.35] sm:text-4xl">
            الأسئلة الشائعة
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-loose text-white/75 lg:text-lg">
            جمعنا هنا أكثر الأسئلة التي تصلنا من الباحثين عن عمل وأصحاب
            العقارات. إذا لم تجد إجابة سؤالك، يمكنك التواصل معنا مباشرة.
          </p>
        </div>
      </section>

      {/* الأسئلة */}
      <section className="container-app py-14 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <Reveal>
            <div className="lg:sticky lg:top-28 lg:self-start">
              <span className="eyebrow">
                <MessagesSquare size={13} aria-hidden />
                كل الأسئلة
              </span>
              <h2 className="mt-4 text-2xl font-extrabold lg:text-3xl">
                ابحث عن إجابتك هنا
              </h2>
              <p className="mt-3 text-ink-soft">
                {FAQ_ITEMS.length} سؤالاً شائعاً عن التسجيل والتقديم ونشر
                الوظائف والخصوصية.
              </p>
              <Link href="/contact" className="link mt-5 inline-block">
                لم تجد إجابتك؟ تواصل معنا
                <ArrowLeft size={16} className="inline" aria-hidden />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <FaqAccordion items={FAQ_ITEMS} />
          </Reveal>
        </div>
      </section>

      {/* دعوة للتواصل */}
      <section className="container-app pb-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-pan bg-navy px-6 py-12 text-center text-white lg:px-16">
            <div className="relative mx-auto max-w-2xl">
              <MessagesSquare
                size={32}
                className="mx-auto text-emerald"
                aria-hidden
              />
              <h2 className="mt-5 text-2xl font-extrabold">لم تجد إجابتك؟</h2>
              <p className="mt-3 leading-loose text-white/75">
                يسعد فريق الدعم بمساعدتك في أي استفسار إضافي.
              </p>
              <Link href="/contact" className="btn btn-accent btn-lg mt-7">
                تواصل معنا
                <ArrowLeft size={17} aria-hidden />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
