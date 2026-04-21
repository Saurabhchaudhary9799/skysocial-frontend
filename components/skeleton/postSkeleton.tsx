export default function PostSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-white/70 p-4 shadow-sm space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          
          {/* Avatar */}
          <div className="h-10 w-10 rounded-full bg-gray-300" />

          {/* Username + handle */}
          <div className="space-y-2">
            <div className="h-3 w-28 bg-gray-300 rounded" />
            <div className="h-2 w-20 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Follow button */}
        <div className="h-8 w-16 bg-gray-300 rounded-full" />
      </div>

      {/* Image */}
      <div className="w-full h-64 rounded-xl bg-gray-300" />

      {/* Actions (like, comment, share) */}
      <div className="flex items-center gap-4">
        <div className="h-5 w-5 bg-gray-300 rounded" />
        <div className="h-5 w-5 bg-gray-300 rounded" />
        <div className="h-5 w-5 bg-gray-300 rounded" />
      </div>

      {/* Caption */}
      <div className="space-y-2">
        <div className="h-3 w-full bg-gray-300 rounded" />
        <div className="h-3 w-5/6 bg-gray-200 rounded" />
      </div>

      {/* Tags */}
      <div className="flex gap-2 flex-wrap">
        <div className="h-5 w-16 bg-gray-200 rounded-full" />
        <div className="h-5 w-20 bg-gray-200 rounded-full" />
        <div className="h-5 w-14 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}