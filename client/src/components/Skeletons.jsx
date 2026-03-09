export function ProductCardSkeleton() {
  return (
    <div className="card">
      <div className="skeleton aspect-[4/5] w-full" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="skeleton h-5 w-2/3 rounded" />
          <div className="skeleton h-5 w-12 rounded" />
        </div>
        <div className="skeleton h-4 w-16 rounded-full" />
        <div className="skeleton h-10 w-full rounded-candle" />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-28 pb-16 grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="skeleton aspect-square w-full rounded-candle" />
      <div className="space-y-4">
        <div className="skeleton h-8 w-3/4 rounded" />
        <div className="skeleton h-6 w-24 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-5/6 rounded" />
        <div className="skeleton h-4 w-4/6 rounded" />
        <div className="skeleton h-12 w-full rounded-candle mt-6" />
      </div>
    </div>
  );
}

export function DashboardStatSkeleton() {
  return (
    <div className="skeleton h-28 w-full rounded-candle" />
  );
}
