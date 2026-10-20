import type { Metadata } from "next";
import { Building2, MapPin } from "lucide-react";
import { requireAuth } from "@/lib/permissions";
import { prisma } from "@/lib/db/prisma";
import PageHeader from "@/components/ui/page-header";
import EmptyState from "@/components/ui/empty-state";
import StatusBadge from "@/components/ui/status-badge";
import EmployerOnboardingCard from "@/components/employer/onboarding-card";
import PropertyToggleForm from "@/components/employer/property-toggle-form";
import EmployerPropertyForm from "@/components/forms/employer-property-form";
import { formatDateAr } from "@/lib/labels";

export const metadata: Metadata = {
  title: "عقاراتي — بواب مصر",
};

export default async function EmployerPropertiesPage() {
  const user = await requireAuth();

  const profile = await prisma.employerProfile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!profile) {
    return <EmployerOnboardingCard />;
  }

  const [properties, areas] = await Promise.all([
    prisma.property.findMany({
      where: { ownerId: profile.id },
      orderBy: { createdAt: "desc" },
      include: {
        area: {
          select: {
            name: true,
            province: { select: { name: true } },
          },
        },
      },
    }),
    prisma.area.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        province: { select: { name: true } },
      },
    }),
  ]);

  const areaOptions = areas.map((area) => ({
    id: area.id,
    name: area.name,
    provinceName: area.province.name,
  }));

  return (
    <>
      <PageHeader
        title="عقاراتي"
        description="إدارة العقارات الخاصة بك وربطها بالوظائف التي تنشرها"
      />

      {properties.length === 0 ? (
        <div className="mb-8">
          <EmptyState
            icon={Building2}
            title="لم تضف أي عقار بعد"
            description="أضف عقارك لتتمكن من ربطه بالوظائف التي تنشرها وظهوره للباحثين عن عمل."
          />
        </div>
      ) : (
        <ul className="card mb-8 divide-y divide-line p-0">
          {properties.map((property) => (
            <li
              key={property.id}
              className="px-5 py-5 transition-colors hover:bg-muted/60"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-base font-bold">{property.name}</h2>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-soft">
                    <MapPin
                      size={15}
                      aria-hidden
                      className="shrink-0 text-ink-mute"
                    />
                    {property.area ? (
                      <span>
                        {property.area.province.name} — {property.area.name}
                      </span>
                    ) : (
                      <span>بدون تحديد منطقة</span>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-ink-mute">
                    أُضيف في {formatDateAr(property.createdAt)}
                  </p>
                  {property.description && (
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                      {property.description}
                    </p>
                  )}
                </div>
                <StatusBadge
                  label={property.isActive ? "نشط" : "معطل"}
                  variant={
                    property.isActive ? "badge-published" : "badge-draft"
                  }
                  dot
                />
              </div>

              <div className="mt-4">
                <PropertyToggleForm
                  propertyId={property.id}
                  isActive={property.isActive}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <EmployerPropertyForm areas={areaOptions} />
    </>
  );
}
