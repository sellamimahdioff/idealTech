export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col animate-pulse">
      <div className="h-36 bg-gray-200" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 w-1/3 bg-gray-200 rounded" />
        <div className="h-3 w-1/2 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-5 w-1/3 bg-gray-200 rounded" />
        <div className="h-9 w-full bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}