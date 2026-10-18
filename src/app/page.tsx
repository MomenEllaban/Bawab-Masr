import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "بواب مصر — منصة توظيف البوابين والحراسة",
  description:
    "ابحث عن وظيفة بواب أو حارس عقار في الإسكندرية ومصر. منصة بواب مصر تربطك بأصحاب العقارات مباشرة.",
};

export default function HomePage() {
  return (
    <main>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container-app flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏢</span>
            <span
              className="text-xl font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              بواب مصر
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/jobs"
              className="text-gray-600 hover:text-blue-900 font-medium transition-colors"
            >
              الوظائف
            </Link>
            <Link
              href="/how-it-works"
              className="text-gray-600 hover:text-blue-900 font-medium transition-colors"
            >
              كيف يعمل؟
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-blue-900 font-medium transition-colors"
            >
              عن المنصة
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn btn-secondary">
              تسجيل الدخول
            </Link>
            <Link href="/register" className="btn btn-primary">
              إنشاء حساب
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative overflow-hidden py-20"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 60%, #1a6091 100%)",
        }}
      >
        <div className="container-app text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            ابحث عن وظيفة بواب
            <br />
            <span style={{ color: "#7dd3fc" }}>في مصر بسهولة</span>
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            بواب مصر تربطك بأصحاب العقارات واتحادات الملاك وشركات الإدارة
            مباشرة — بدون وسيط، بدون تعقيد.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/jobs" className="btn btn-accent btn-lg">
              🔍 ابحث عن وظيفة الآن
            </Link>
            <Link
              href="/register?role=EMPLOYER"
              className="btn btn-lg"
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "white",
                border: "2px solid rgba(255,255,255,0.5)",
              }}
            >
              📢 انشر وظيفة مجاناً
            </Link>
          </div>
        </div>

        {/* موجة زخرفية */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 60L1440 60L1440 30C1080 0 360 0 0 30L0 60Z"
              fill="#f8fafc"
            />
          </svg>
        </div>
      </section>

      {/* إحصائيات مؤقتة */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container-app">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "وظيفة متاحة", value: "—", icon: "💼" },
              { label: "صاحب عقار", value: "—", icon: "🏠" },
              { label: "باحث عن عمل", value: "—", icon: "👤" },
              { label: "تعيين ناجح", value: "—", icon: "✅" },
            ].map((stat) => (
              <div key={stat.label} className="card text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ color: "var(--color-primary)" }}
                >
                  {stat.value}
                </div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-400 text-sm mt-4">
            * الإحصائيات تُحدَّث عند إطلاق المنصة رسمياً
          </p>
        </div>
      </section>

      {/* كيف يعمل */}
      <section className="py-16 bg-gray-50">
        <div className="container-app">
          <h2
            className="text-3xl font-bold text-center mb-4"
            style={{ color: "var(--color-primary)" }}
          >
            كيف يعمل بواب مصر؟
          </h2>
          <p className="text-center text-gray-500 mb-12">
            ثلاث خطوات بسيطة للوصول إلى وظيفتك
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "١",
                title: "أنشئ حسابك",
                desc: "سجّل بياناتك وأكد رقم هاتفك بدقيقة واحدة",
                icon: "📱",
              },
              {
                step: "٢",
                title: "أكمل ملفك الشخصي",
                desc: "أضف خبرتك ومهاراتك والمناطق التي تفضّلها",
                icon: "📝",
              },
              {
                step: "٣",
                title: "قدّم على الوظائف",
                desc: "تصفّح الوظائف وقدّم بنقرة واحدة، وتابع طلباتك مباشرة",
                icon: "🚀",
              },
            ].map((item) => (
              <div key={item.step} className="card text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4"
                  style={{ background: "var(--color-primary)" }}
                >
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ميزات الأمان */}
      <section className="py-16 bg-white">
        <div className="container-app">
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{ color: "var(--color-primary)" }}
          >
            لماذا بواب مصر؟
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🔒", title: "حسابات موثوقة", desc: "تحقق من رقم الهاتف لكل حساب" },
              { icon: "🏘️", title: "عقارات حقيقية", desc: "إعلانات من أصحاب عقارات حقيقيين" },
              { icon: "📊", title: "متابعة شاملة", desc: "تابع طلباتك من التقديم حتى التعيين" },
              { icon: "🛡️", title: "بيانات آمنة", desc: "بياناتك محمية ولا تُشارَك بدون إذنك" },
              { icon: "⚡", title: "سريع وسهل", desc: "تقديم بنقرة واحدة بدون تعقيد" },
              { icon: "🆓", title: "مجاني للباحثين", desc: "التسجيل والتقديم مجاني للباحثين عن عمل" },
            ].map((feature) => (
              <div key={feature.title} className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="text-3xl flex-shrink-0">{feature.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-gray-500 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-16 text-center text-white"
        style={{ background: "var(--color-primary)" }}
      >
        <div className="container-app">
          <h2 className="text-3xl font-bold mb-4">مستعد للبدء؟</h2>
          <p className="text-blue-200 mb-8 text-lg">
            انضم إلى بواب مصر الآن وابدأ رحلتك
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=SEEKER" className="btn btn-accent btn-lg">
              أنا باحث عن عمل
            </Link>
            <Link
              href="/register?role=EMPLOYER"
              className="btn btn-lg"
              style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "2px solid rgba(255,255,255,0.5)" }}
            >
              أنا صاحب عقار
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container-app">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🏢</span>
                <span className="text-white font-bold text-lg">بواب مصر</span>
              </div>
              <p className="text-sm">
                منصة توظيف البوابين والحراسة في مصر — الإسكندرية أولاً
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/jobs" className="hover:text-white transition-colors">الوظائف</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white transition-colors">كيف يعمل؟</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">عن المنصة</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">تواصل معنا</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">للباحثين</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/register?role=SEEKER" className="hover:text-white transition-colors">سجّل كباحث</Link></li>
                <li><Link href="/for-job-seekers" className="hover:text-white transition-colors">دليل الباحث</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">الأسئلة الشائعة</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">قانوني</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms" className="hover:text-white transition-colors">شروط الاستخدام</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">سياسة الخصوصية</Link></li>
                <li><Link href="/safety" className="hover:text-white transition-colors">السلامة والأمان</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} بواب مصر — جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
