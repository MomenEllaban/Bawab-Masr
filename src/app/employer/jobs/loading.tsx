export default function Loading() {
  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-3">
          <div className="skeleton h-8 w-48" />
          <div className="skeleton h-4 w-72 max-w-full" />
        </div>
        <div className="skeleton h-10 w-32" />
      </div>

      <div
        className="scroll-x mb-7 flex gap-3 border-b border-line"
        aria-hidden
      >
        {[0, 1, 2, 3, 4].map((item) => (
          <div key={item} className="skeleton h-6 w-20 shrink-0" />
        ))}
      </div>

      <div className="card divide-y divide-line p-0">
        {[0, 1, 2].map((item) => (
          <div key={item} className="space-y-3 px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="skeleton h-5 w-1/3" />
              <div className="skeleton h-6 w-20" />
            </div>
            <div className="skeleton h-4 w-1/2" />
            <div className="flex gap-2">
              <div className="skeleton h-6 w-24" />
              <div className="skeleton h-6 w-36" />
            </div>
            <div className="skeleton h-9 w-40" />
          </div>
        ))}
      </div>
    </div>
  );
}
