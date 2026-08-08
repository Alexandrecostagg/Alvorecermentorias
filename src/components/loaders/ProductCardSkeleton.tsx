export function ProductCardSkeleton() {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 animate-pulse">
        {/* Optional badge skeleton */}
        <div className="absolute bottom-3 left-3 h-6 w-24 rounded-full bg-slate-200" />
      </div>

      {/* Content Skeleton */}
      <div className="p-5">
        {/* Category */}
        <div className="h-3 w-16 bg-slate-200 rounded mb-2 animate-pulse" />
        {/* Title (2 lines) */}
        <div className="h-5 w-full bg-slate-200 rounded mb-1.5 animate-pulse" />
        <div className="h-5 w-3/4 bg-slate-200 rounded mb-3 animate-pulse" />
        {/* Author */}
        <div className="h-3 w-1/2 bg-slate-200 rounded mb-4 animate-pulse" />

        {/* Price and Button */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex flex-col mb-5">
            <div className="h-3 w-12 bg-slate-200 rounded mb-1 animate-pulse" />
            <div className="h-6 w-24 bg-slate-200 rounded animate-pulse" />
          </div>

          <div className="w-full h-12 bg-slate-100 rounded-lg animate-pulse" />
        </div>
      </div>
    </article>
  )
}
