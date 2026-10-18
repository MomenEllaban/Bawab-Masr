import type { Metadata } from "next";
import RegisterForm from "@/components/forms/register-form";

export const metadata: Metadata = {
  title: "إنشاء حساب — بواب مصر",
};

type RegisterPageProps = {
  searchParams: Promise<{ role?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const defaultRole =
    params.role === "EMPLOYER" || params.role === "SEEKER"
      ? params.role
      : undefined;

  return <RegisterForm defaultRole={defaultRole} />;
}
