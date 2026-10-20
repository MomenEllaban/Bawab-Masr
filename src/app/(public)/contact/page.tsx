import type { Metadata } from "next";
import Link from "next/link";
import {
  Mail,
  Phone,
  Clock,
  MessageCircle,
  Info,
  ArrowLeft,
  FileText,
  ShieldCheck,
  ScrollText,
} from "lucide-react";
import Reveal from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "تواصل معنا — بواب مصر",
  description:
    "بيانات التواصل مع فريق منصة بواب مصر، مواعيد العمل، وطرق الوصول إلى الدعم.",
};

const contactChannels = [
  {
    icon: Mail,
    title: "البريد الإلكتروني",
    value: "support@bawabmasr.example",
    ltr: true,
    desc: "للاستفسارات العامة والدعم الفني، نرد خلال يوم عمل واحد.",
  },
  {
    icon: Phone,
    title: "الهاتف",
    value: "+20 100 000 0000",
    ltr: true,
    desc: "متاح خلال مواعيد العمل الرسمية للاستفسارات العاجلة.",
  },
  {
    icon: Clock,
    title: "مواعيد العمل",
    value: "من الأحد إلى الخميس، 9 صباحاً إلى 5 مساءً",
    ltr: false,
    desc: "بتوقيت القاهرة. الطلبات الواردة خارج المواعيد يُردّ عليها في أول يوم عمل.",
  },
];

const helpLinks = [
  { href: "/faq", label: "الأسئلة الشائعة", icon: MessageCircle },
  { href: "/privacy", label: "سياسة الخصوصية", icon: ShieldCheck },
  { href: "/terms", label: "شروط الاستخدام", icon: ScrollText },
];

export default function ContactPage() {
  return (
    <main>
      {/* ترويسة الصفحة */}
      <section className="border-b border-line bg-navy text-white">
        <div className="container-app py-12 lg:py-16">
          <span className="eyebrow border-emerald/40 bg-emerald/15 text-emerald">
            <MessageCircle size={13} aria-hidden />
            نحن هنا لمساعدتك
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-[1.35] sm:text-4xl">
            تواصل معنا
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-loose text-white/75 lg:text-lg">
            يمكنك التواصل معنا عبر القنوات التالية، وسيبذل فريق الدعم قصارى
            جهده للرد عليك في أقرب وقت.
          </p>
        </div>
      </section>

      {/* قنوات التواصل */}
      <section className="container-app py-14 lg:py-20">
        <Reveal>
          <div className="mb-8 max-w-2xl">
            <span className="eyebrow">
              <Mail size={13} aria-hidden />
              قنوات التواصل
            </span>
            <h2 className="mt-4 text-2xl font-extrabold lg:text-3xl">
              اختر القنوة الأنسب لك
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {contactChannels.map((channel, index) => {
            const Icon = channel.icon;
            return (
              <Reveal key={channel.title} delay={index * 70}>
                <article className="card h-full p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-card bg-navy text-white">
                    <Icon size={22} aria-hidden />
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{channel.title}</h3>
                  <p
                    className={`mt-2 font-bold text-navy ${
                      channel.ltr ? "ltr" : "leading-relaxed"
                    }`}
                  >
                    {channel.value}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {channel.desc}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="alert alert-info mt-8">
            <Info size={18} aria-hidden className="shrink-0" />
            <span>
              لا يوجد نموذج تواصل داخل الموقع حالياً. للتواصل معنا فعلياً استخدم
              البريد الإلكتروني أو رقم الهاتف المذكورين أعلاه.
            </span>
          </div>
        </Reveal>
      </section>

      {/* إجابات سريعة */}
      <section className="border-t border-line bg-surface">
        <div className="container-app py-14 lg:py-20">
          <Reveal>
            <div className="card mx-auto max-w-2xl p-8 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <FileText size={26} aria-hidden />
              </span>
              <h2 className="mt-5 text-xl font-extrabold lg:text-2xl">
                هل تبحث عن إجابات سريعة؟
              </h2>
              <p className="mt-3 leading-relaxed text-ink-soft">
                قد تجد ما تبحث عنه في صفحة الأسئلة الشائعة، أو يمكنك مراجعة صفحات
                السياسات لمعرفة كيفية تعاملنا مع البيانات والشروط.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {helpLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="btn btn-secondary"
                    >
                      <Icon size={16} aria-hidden />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
              <Link href="/faq" className="link mt-6 inline-block text-sm">
                تصفّح كل الأسئلة الشائعة
                <ArrowLeft size={15} className="inline" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
