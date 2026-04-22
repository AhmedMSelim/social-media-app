export function SuggestedSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 animate-pulse">
          <div className="w-10 h-10 bg-gray-300 rounded-full" />
          <div className="flex-1 h-4 bg-gray-300 rounded" />
        </div>
      ))}
    </div>
  );
}