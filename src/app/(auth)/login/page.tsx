import type { Metadata } from "next";
import LoginForm from "@/components/forms/login-form";

export const metadata: Metadata = {
  title: "تسجيل الدخول — بواب مصر",
};

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
    verified?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <LoginForm
      callbackUrl={params.callbackUrl}
      justVerified={params.verified === "1"}
    />
  );
}
