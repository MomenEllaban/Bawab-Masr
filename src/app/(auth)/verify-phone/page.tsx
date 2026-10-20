import type { Metadata } from "next";
import Link from "next/link";
import VerifyPhoneForm from "@/components/forms/verify-phone-form";

export const metadata: Metadata = {
  title: "تأكيد رقم الهاتف — بواب مصر",
};

type VerifyPhonePageProps = {
  searchParams: Promise<{ phone?: string; otpFailed?: string }>;
};

export default async function VerifyPhonePage({
  searchParams,
}: VerifyPhonePageProps) {
  const params = await searchParams;
  const phone = params.phone;

  if (!phone) {
    return (
      <div className="card text-center">
        <h1 className="text-2xl font-bold mb-3">تأكيد رقم الهاتف</h1>
        <p className="text-ink-soft mb-6">
          لم يتم تحديد رقم الهاتف. ابدأ بإنشاء حساب أولاً.
        </p>
        <Link href="/register" className="btn btn-primary">
          إنشاء حساب
        </Link>
      </div>
    );
  }

  return (
    <VerifyPhoneForm phone={phone} otpFailed={params.otpFailed === "1"} />
  );
}
