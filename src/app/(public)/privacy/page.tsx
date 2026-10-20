import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Database,
  Target,
  Share2,
  Cookie,
  UserCheck,
  Archive,
  Mail,
  List,
  ScrollText,
  ArrowLeft,
} from "lucide-react";

export const metadata: Metadata = {
  title: "سياسة الخصوصية — بواب مصر",
  description:
    "سياسة خصوصية منصة بواب مصر: البيانات التي نجمعها، وأغراض استخدامها، وحمايتها، وحقوق المستخدم.",
};

const clauses = [
  {
    icon: Database,
    title: "البيانات المجمعة",
    body: "نجمع البيانات التي تقدّمها عند التسجيل مثل الاسم ورقم الهاتف والبريد الإلكتروني، إضافة إلى بيانات الملف الشخصي والوظائف والطلبات التي تنشئها على المنصة.",
  },
  {
    icon: Target,
    title: "الغرض من الجمع",
    body: "نستخدم بياناتك لتشغيل المنصة وتأكيد هويتك وربط الباحثين بأصحاب العقارات، وتحسين تجربة الاستخدام وإرسال الإشعارات المهمة المتعلقة بحسابك.",
  },
  {
    icon: Share2,
    title: "مشاركة البيانات",
    body: "لا نبيع بياناتك ولا نشاركها مع أطراف أخرى لأغراض تجارية. قد تُشارَك بيانات التواصل مع الطرف الآخر عند وجود طلب توظيف، وبموافقتك الضمنية عند التقديم.",
  },
  {
    icon: ShieldCheck,
    title: "حماية البيانات",
    body: "نتّخذ إجراءات تقنية وتنظيمية معقولة لحماية بياناتك من الوصول أو التعديل أو الإفشاء غير المصرّح به، مع تحديث هذه الإجراءات بشكل دوري.",
  },
  {
    icon: Cookie,
    title: "ملفات الارتباط",
    body: "نستخدم ملفات ارتباط وبيانات جلسة ضرورية لتسجيل الدخول والحفاظ على أمان حسابك وتحسين أداء الموقع. يمكنك ضبط إعدادات المتصفح للتحكم في هذه الملفات.",
  },
  {
    icon: UserCheck,
    title: "حقوق المستخدم",
    body: "يحق لك الوصول إلى بياناتك وتصحيحها أو طلب حذفها، كما يحق لك الاعتراض على بعض أوجه المعالجة وفقاً للقوانين المعمول بها.",
  },
  {
    icon: Archive,
    title: "الاحتفاظ بالبيانات",
    body: "نحتفظ ببياناتك طالما كان حسابك نشطاً أو حسب الحاجة لتقديم الخدمة والامتثال للالتزامات القانونية، ثم نحذفها أو نجعلها مجهولة الهوية.",
  },
  {
    icon: Mail,
    title: "التواصل",
    body: "لأي استفسار أو طلب يتعلق بخصوصيتك وبياناتك، يمكنك التواصل معنا عبر صفحة تواصل معنا وسنعمل على الرد في أقرب وقت.",
  },
];

export default function PrivacyPage() {
  return (
    <main>
      {/* ترويسة الصفحة */}
      <section className="border-b border-line bg-navy text-white">
        <div className="container-app py-12 lg:py-16">
          <span className="eyebrow border-emerald/40 bg-emerald/15 text-emerald">
            <ShieldCheck size={13} aria-hidden />
            خصوصيتك أمانة
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-[1.35] sm:text-4xl">
            سياسة الخصوصية
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-loose text-white/75 lg:text-lg">
            نلتزم في بواب مصر بحماية خصوصيتك وشفافية تعاملنا مع بياناتك. توضّح
            هذه السياسة أنواع البيانات التي نجمعها وكيفية استخدامها وحمايتها.
          </p>
        </div>
      </section>

      {/* المحتويات */}
      <section className="container-app pt-10">
        <nav aria-label="محتويات السياسة" className="card mx-auto max-w-3xl p-0">
          <div className="flex items-center gap-2.5 border-b border-line px-5 py-4 lg:px-6">
            <List size={18} className="text-navy" aria-hidden />
            <h2 className="font-bold">محتويات السياسة</h2>
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

      {/* بنود السياسة */}
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
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-card bg-emerald-50 text-emerald-700">
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
            <ShieldCheck size={26} aria-hidden />
          </span>
          <p className="mt-5 leading-relaxed text-ink-soft">
            لأي سؤال حول خصوصيتك يمكنك مراجعة صفحة التواصل أو صفحات السياسات.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn btn-primary">
              تواصل معنا
              <ArrowLeft size={16} aria-hidden />
            </Link>
            <Link href="/terms" className="btn btn-secondary">
              <ScrollText size={16} aria-hidden />
              شروط الاستخدام
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
