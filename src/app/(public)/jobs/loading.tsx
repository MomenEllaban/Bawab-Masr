export default function Loading() {
  return (
    <main className="container-app py-10">
      <header className="mb-8 space-y-3">
        <div className="skeleton h-9 w-56" />
        <div className="skeleton h-4 w-80 max-w-full" />
      </header>

      <div className="card mb-8">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <div className="space-y-2">
            <div className="skeleton h-4 w-24" />
            <div className="skeleton h-10 w-full" />
          </div>
          <div className="space-y-2">
            <div className="skeleton h-4 w-24" />
            <div className="skeleton h-10 w-full" />
          </div>
          <div className="skeleton h-10 w-24" />
        </div>
      </div>

      <p className="text-ink-soft mb-4">جارٍ تحميل الوظائف...</p>

      <div className="space-y-4">
        {[0, 1, 2].map((item) => (
          <div key={item} className="card">
            <div className="skeleton h-6 w-2/3 mb-3" />
            <div className="skeleton h-4 w-1/3 mb-4" />
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="skeleton h-6 w-28" />
              <div className="skeleton h-6 w-32" />
            </div>
            <div className="skeleton h-4 w-full mb-2" />
            <div className="skeleton h-4 w-5/6" />
          </div>
        ))}
      </div>
    </main>
  );
}
