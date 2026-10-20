import type { Metadata } from "next";
import Link from "next/link";
import {
  ScrollText,
  UserRound,
  Scale,
  FileText,
  Briefcase,
  Ban,
  ShieldAlert,
  RefreshCw,
  List,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";

export const metadata: Metadata = {
  title: "شروط الاستخدام — بواب مصر",
  description:
    "شروط استخدام منصة بواب مصر، بما يشمل الحسابات والمحتوى والمسؤوليات وحقوق الإدارة.",
};

const clauses = [
  {
    icon: ScrollText,
    title: "القبول بالشروط",
    body: "باستخدامك منصة بواب مصر أو إنشاء حساب عليها، فإنك توافق على هذه الشروط وجميع السياسات المرتبطة بها. إذا لم توافق على أي بند، يُرجى عدم استخدام المنصة.",
  },
  {
    icon: UserRound,
    title: "الحساب والمسؤولية",
    body: "أنت مسؤول عن صحة البيانات التي تسجّلها وعن الحفاظ على سرية بيانات الدخول إلى حسابك. يجب إبلاغنا فوراً عند اكتشاف أي استخدام غير مصرّح به لحسابك.",
  },
  {
    icon: Scale,
    title: "الاستخدام المسموح",
    body: "تُستخدم المنصة فقط للأغراض المشروعة المتعلقة بالتوظيف في مجال البوابين والحراسة. يُحظر استخدامها في أي نشاط مخالف للقانون أو مضلل أو ضار بالآخرين.",
  },
  {
    icon: FileText,
    title: "المحتوى المنشور",
    body: "أنت مسؤول عن دقة ووضوح المحتوى الذي تنشره من بيانات ووظائف وملفات شخصية. يحق للإدارة رفض أو حذف أي محتوى غير مناسب أو مخالف.",
  },
  {
    icon: Briefcase,
    title: "الإعلانات والوظائف",
    body: "تمرّ الإعلانات والوظائف بمراجعة إدارية قبل نشرها. لا نضمن توفّر وظيفة معينة أو توظيف متقدم معين، فالقرار النهائي يعود لصاحب العقار والباحث.",
  },
  {
    icon: Ban,
    title: "الإيقاف والتعليق",
    body: "يحق للإدارة تعليق أو إيقاف أي حساب يخالف هذه الشروط أو يقدّم بيانات مضللة، وذلك دون إشعار مسبق عند الضرورة.",
  },
  {
    icon: ShieldAlert,
    title: "حدود المسؤولية",
    body: "تُقدَّم المنصة كما هي. لا نتحمّل المسؤولية عن أي اتفاق أو تعامل مباشر يتم بين المستخدمين خارج نطاق المنصة أو عن أي خسائر ناتجة عنه.",
  },
  {
    icon: RefreshCw,
    title: "تعديل الشروط",
    body: "قد نحدّث هذه الشروط من وقت لآخر. استمرارك في استخدام المنصة بعد نشر التعديلات يعني موافقتك على الشروط المحدّثة.",
  },
];

export default function TermsPage() {
  return (
    <main>
      {/* ترويسة الصفحة */}
      <section className="border-b border-line bg-navy text-white">
        <div className="container-app py-12 lg:py-16">
          <span className="eyebrow border-emerald/40 bg-emerald/15 text-emerald">
            <Scale size={13} aria-hidden />
            قواعد الاستخدام
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-[1.35] sm:text-4xl">
            شروط الاستخدام
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-loose text-white/75 lg:text-lg">
            توضّح هذه الشروط القواعد المنظّمة لاستخدام منصة بواب مصر. يُرجى
            قراءتها بعناية قبل استخدام المنصة.
          </p>
        </div>
      </section>

      {/* المحتويات */}
      <section className="container-app pt-10">
        <nav aria-label="محتويات الشروط" className="card mx-auto max-w-3xl p-0">
          <div className="flex items-center gap-2.5 border-b border-line px-5 py-4 lg:px-6">
            <List size={18} className="text-navy" aria-hidden />
            <h2 className="font-bold">محتويات الشروط</h2>
          </div>
          <ol className="divide-y divide-line">
            {clauses.map((clause, index) => (
              <li key={clause.title}>
                <a
                  href={`#clause-${index + 1}`}
                  className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/60 lg:px-6"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="font-medium">{clause.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </section>

      {/* بنود الشروط */}
      <section className="container-app py-10 lg:py-14">
        <div className="mx-auto max-w-3xl space-y-4">
          {clauses.map((clause, index) => {
            const Icon = clause.icon;
            return (
              <section
                key={clause.title}
                id={`clause-${index + 1}`}
                aria-labelledby={`clause-${index + 1}-title`}
                className="card scroll-mt-28 p-6 lg:p-8"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-card bg-navy-50 text-navy">
                    <Icon size={20} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h2
                      id={`clause-${index + 1}-title`}
                      className="text-lg font-bold"
                    >
                      <span className="me-2 text-ink-mute">
                        {index + 1}.
                      </span>
                      {clause.title}
                    </h2>
                    <div className="prose-ar mt-2.5 text-ink-soft">
                      <p>{clause.body}</p>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </section>

      {/* استفسارات */}
      <section className="container-app pb-16">
        <div className="card mx-auto max-w-3xl p-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <MessageCircle size={26} aria-hidden />
          </span>
          <p className="mt-5 leading-relaxed text-ink-soft">
            لأي استفسار حول هذه الشروط يمكنك التواصل معنا عبر صفحة الدعم.
          </p>
          <Link href="/contact" className="btn btn-primary mt-6">
            تواصل معنا
            <ArrowLeft size={16} aria-hidden />
          </Link>
        </div>
      </section>
    </main>
  );
}
