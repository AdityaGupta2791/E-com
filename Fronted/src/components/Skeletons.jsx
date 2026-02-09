function ProductGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse rounded-lg border border-slate-200 bg-white p-3"
        >
          <div className="aspect-[4/5] w-full rounded-md bg-slate-200" />
          <div className="mt-3 space-y-2">
            <div className="h-4 w-3/4 rounded bg-slate-200" />
            <div className="h-3 w-1/2 rounded bg-slate-200" />
            <div className="h-4 w-1/3 rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse rounded-md border border-slate-200 bg-white p-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="h-4 w-16 rounded bg-slate-200" />
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-3 w-24 rounded bg-slate-200" />
            <div className="h-3 w-40 rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[auto_1fr]">
      <div className="animate-pulse overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="aspect-[4/5] w-[460px] max-w-none bg-slate-200" />
      </div>
      <div className="space-y-4">
        <div className="h-6 w-3/4 rounded bg-slate-200" />
        <div className="h-4 w-1/3 rounded bg-slate-200" />
        <div className="h-6 w-1/2 rounded bg-slate-200" />
        <div className="h-16 w-full rounded bg-slate-200" />
        <div className="h-10 w-32 rounded bg-slate-200" />
      </div>
    </div>
  );
}

export { ProductGridSkeleton, OrdersSkeleton, ProductDetailSkeleton };
