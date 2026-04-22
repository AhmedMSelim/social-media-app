export default function ProfilePostSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border bg-white p-4 shadow-sm space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>

      <div className="h-3 bg-gray-200 rounded w-full"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6"></div>

      <div className="h-40 bg-gray-200 rounded-xl"></div>
    </div>
  );
}
