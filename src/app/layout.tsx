import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | بواب مصر",
    default: "بواب مصر — منصة توظيف البوابين والحراسة في مصر",
  },
  description:
    "منصة بواب مصر تربط البوابين والباحثين عن عمل بأصحاب العقارات واتحادات الملاك وشركات إدارة العقارات في الإسكندرية ومصر.",
  keywords: ["بواب", "وظائف", "مصر", "الإسكندرية", "عقارات", "توظيف"],
  authors: [{ name: "بواب مصر" }],
  openGraph: {
    title: "بواب مصر",
    description: "منصة توظيف البوابين والحراسة في مصر",
    locale: "ar_EG",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="font-cairo antialiased bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
