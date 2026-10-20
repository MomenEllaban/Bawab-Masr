export default function SeekerApplicationsLoading() {
  return (
    <div>
      <div className="mb-8 space-y-3">
        <div className="skeleton h-8 w-44" />
        <div className="skeleton h-4 w-80 max-w-full" />
      </div>

      <div className="card mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-56 space-y-2">
            <div className="skeleton h-4 w-20" />
            <div className="skeleton h-10 w-full" />
          </div>
          <div className="skeleton h-10 w-28" />
        </div>
      </div>

      <ul className="card divide-y divide-line overflow-hidden p-0">
        {[0, 1, 2, 3].map((row) => (
          <li
            key={row}
            className="flex items-start justify-between gap-4 px-5 py-4"
          >
            <div className="min-w-0 flex-1 space-y-2">
              <div className="skeleton h-5 w-1/2" />
              <div className="skeleton h-3.5 w-1/3" />
              <div className="skeleton h-4 w-3/4" />
            </div>
            <div className="skeleton h-8 w-24 shrink-0" />
          </li>
        ))}
      </ul>
    </div>
  );
}
