import SiteFooter from "@/components/layout/site-footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-col lg:min-h-[calc(100dvh-4.5rem)]">
      {children}
      <SiteFooter />
    </div>
  );
}
