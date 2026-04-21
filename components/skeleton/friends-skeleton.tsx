export  default function  SkeletonItem() {
  return (
    <div className="flex items-center gap-3 p-3 animate-pulse">
      <div className="h-10 w-10 rounded-full bg-gray-300" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-24 bg-gray-300 rounded" />
        <div className="h-3 w-40 bg-gray-200 rounded" />
      </div>
    </div>
  );
}