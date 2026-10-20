/**
 * lib/auth/index.ts
 * إعداد NextAuth.js v5 (beta)
 * المصادقة عبر رقم الهاتف + OTP
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db/prisma";
import { loginSchema } from "@/lib/validation/auth";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        phone: { label: "رقم الهاتف", type: "text" },
        password: { label: "كلمة المرور", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { phone, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { phone },
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            passwordHash: true,
            status: true,
            phoneVerifiedAt: true,
            systemRoles: {
              include: { role: true },
            },
            employerProfile: { select: { id: true } },
            seekerProfile: { select: { id: true } },
          },
        });

        if (!user || !user.passwordHash) return null;

        // تحقق من الحساب النشط
        if (user.status === "SUSPENDED" || user.status === "DEACTIVATED") {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return null;

        // تحديث آخر دخول
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        const systemRoles = user.systemRoles.map((r) => r.role.name);
        const isSystemAdmin = systemRoles.some((r) =>
          ["ADMIN", "MODERATOR", "CUSTOMER_SUPPORT"].includes(r)
        );

        let defaultDashboard = "/";
        if (isSystemAdmin) {
          defaultDashboard = "/admin";
        } else if (user.employerProfile) {
          defaultDashboard = "/employer";
        } else if (user.seekerProfile) {
          defaultDashboard = "/seeker";
        }

        return {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email ?? undefined,
          status: user.status,
          isPhoneVerified: !!user.phoneVerifiedAt,
          systemRoles,
          defaultDashboard,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 يوم
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.phone = (user as { phone?: string }).phone;
        token.status = (user as { status?: string }).status;
        token.isPhoneVerified = (user as { isPhoneVerified?: boolean }).isPhoneVerified;
        token.systemRoles = (user as { systemRoles?: string[] }).systemRoles ?? [];
        token.defaultDashboard = (user as { defaultDashboard?: string }).defaultDashboard ?? "/";
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.phone = token.phone as string;
        session.user.status = token.status as string;
        session.user.isPhoneVerified = token.isPhoneVerified as boolean;
        session.user.systemRoles = token.systemRoles as string[];
        (session.user as { defaultDashboard?: string }).defaultDashboard =
          (token.defaultDashboard as string) ?? "/";
      }
      return session;
    },
  },

  // عدم الكشف عن stack traces — التفعيل عبر AUTH_DEBUG=1 فقط
  debug: process.env.AUTH_DEBUG === "1",
});
