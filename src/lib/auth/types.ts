/**
 * NextAuth.js Type Augmentation
 * إضافة حقول مخصصة للـ Session والـ JWT
 */

import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      phone: string;
      status: string;
      isPhoneVerified: boolean;
      systemRoles: string[];
    } & DefaultSession["user"];
  }
}

// في NextAuth v5 يُعرَّف نوع JWT في @auth/core/jwt ويعيد next-auth/jwt تصديره،
// لذلك يتم عمل augmentation على المصدر مباشرة (متوافق مع TypeScript)
declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    phone?: string;
    status?: string;
    isPhoneVerified?: boolean;
    systemRoles?: string[];
  }
}
