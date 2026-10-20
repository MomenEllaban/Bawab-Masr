export default function Loading() {
  return (
    <div>
      <div className="mb-8 space-y-3">
        <div className="skeleton h-8 w-56" />
        <div className="skeleton h-4 w-80 max-w-full" />
      </div>

      <div className="mb-7 flex gap-2 border-b border-line pb-3">
        <div className="skeleton h-9 w-28" />
        <div className="skeleton h-9 w-20" />
        <div className="skeleton h-9 w-24" />
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-ink-mute">جارٍ تحميل البيانات...</p>
        <div className="skeleton h-6 w-24" />
      </div>

      <ul className="card divide-y divide-line p-0">
        {[0, 1, 2].map((item) => (
          <li key={item} className="px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="skeleton h-5 w-1/2" />
                <div className="skeleton h-4 w-1/3" />
                <div className="flex gap-2">
                  <div className="skeleton h-6 w-24" />
                  <div className="skeleton h-6 w-20" />
                </div>
              </div>
              <div className="skeleton h-6 w-20 shrink-0" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
