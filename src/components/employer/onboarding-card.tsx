import { Building2 } from "lucide-react";
import PageHeader from "@/components/ui/page-header";
import EmployerProfileCreateForm from "@/components/forms/employer-profile-create-form";

export default function EmployerOnboardingCard() {
  return (
    <>
      <PageHeader
        eyebrow="خطوة أولى"
        title="أنشئ ملف صاحب العقار"
        description="ملفك يظهر للباحثين عن عمل ويُستخدم في نشر إعلانات التوظيف الخاصة بعقاراتك."
      />

      <div className="alert alert-info mb-6 max-w-2xl">
        <Building2 size={18} aria-hidden />
        <p>
          بعد إنشاء الملف ستتمكن من نشر وظائفك وربطها بعقاراتك ومتابعة طلبات
          الباحثين عن عمل من مكان واحد.
        </p>
      </div>

      <EmployerProfileCreateForm />
    </>
  );
}
