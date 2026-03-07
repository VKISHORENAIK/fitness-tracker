export function CardSkeleton() {
  return (
    <div className="bg-surface-elevated rounded-2xl p-6 shadow-card animate-pulse">
      <div className="h-4 w-24 bg-neutral-200 rounded mb-4" />
      <div className="h-8 w-32 bg-neutral-200 rounded mb-2" />
      <div className="h-3 w-20 bg-neutral-100 rounded" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="h-8 w-48 bg-neutral-200 rounded-lg animate-pulse" />
        <div className="flex gap-2">
          <div className="h-9 w-28 bg-neutral-200 rounded-lg animate-pulse" />
          <div className="h-9 w-24 bg-neutral-200 rounded-lg animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-surface-elevated rounded-2xl overflow-hidden shadow-card animate-pulse">
          <div className="h-14 px-6 flex items-center border-b border-neutral-100">
            <div className="h-5 w-36 bg-neutral-200 rounded" />
          </div>
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-neutral-100 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="bg-surface-elevated rounded-2xl overflow-hidden shadow-card animate-pulse">
          <div className="h-14 px-6 flex items-center border-b border-neutral-100">
            <div className="h-5 w-28 bg-neutral-200 rounded" />
          </div>
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-neutral-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
