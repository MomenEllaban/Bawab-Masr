export default function JobDetailLoading() {
  return (
    <main className="container-app py-8 lg:py-10">
      <div className="skeleton mb-6 h-4 w-40" />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <div className="card p-6 lg:p-8">
            <div className="mb-4 flex gap-2">
              <div className="skeleton h-6 w-24" />
              <div className="skeleton h-6 w-28" />
            </div>
            <div className="skeleton mb-3 h-8 w-3/4" />
            <div className="skeleton h-4 w-1/2" />
          </div>
          <div className="card space-y-3 p-6 lg:p-8">
            <div className="skeleton h-5 w-40" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-5/6" />
          </div>
          <div className="card space-y-3 p-6 lg:p-8">
            <div className="skeleton h-5 w-48" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-4/5" />
          </div>
        </div>
        <aside className="card space-y-4 p-6">
          <div className="skeleton h-8 w-40" />
          <div className="space-y-3">
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-2/3" />
          </div>
          <div className="skeleton h-11 w-full" />
        </aside>
      </div>
    </main>
  );
}
