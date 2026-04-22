export default function PostSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-full bg-slate-200"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 bg-slate-200 rounded"></div>
          <div className="h-2 w-16 bg-slate-200 rounded"></div>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="h-3 bg-slate-200 rounded w-full"></div>
        <div className="h-3 bg-slate-200 rounded w-5/6"></div>
      </div>

      <div className="h-48 bg-slate-200 rounded-xl"></div>
    </div>
  );
}
