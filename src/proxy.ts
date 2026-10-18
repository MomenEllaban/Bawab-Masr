/**
 * proxy.ts (كان middleware.ts — تمت الإزاحة في Next.js 16)
 * حماية المسارات الخاصة على الخادم — لا تثق في أي بيانات من المتصفح
 */

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// المسارات التي تحتاج مصادقة
const PROTECTED_PREFIXES = ["/seeker", "/employer", "/admin"];

export default auth(function proxy(req: NextRequest & { auth: unknown }) {
  const { pathname } = req.nextUrl;
  const session = req.auth as
    | { user?: { id?: string; isPhoneVerified?: boolean } }
    | null;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  // زائر → صفحة الدخول
  if (isProtected && !session?.user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // مستخدم مسجل بس لم يؤكّد هاتفه → صفحة تأكيد الهاتف
  if (isProtected && session?.user && !session.user.isPhoneVerified) {
    const verifyUrl = new URL("/verify-phone", req.url);
    verifyUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(verifyUrl);
  }

  // المستخدم المسجّل لا يعود لصفحات الدخول/التسجيل
  // (تحقق الأدوار الإدارية يتم في كل صفحة على الخادم عبر requireAdmin)
  if (
    (pathname === "/login" || pathname === "/register") &&
    session?.user
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
