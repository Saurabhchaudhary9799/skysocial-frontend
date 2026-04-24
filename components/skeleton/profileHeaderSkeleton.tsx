"use client";

export default function ProfileSkeleton() {
  return (
    <div className="rounded-3xl bg-white p-4 md:p-6 shadow-sm animate-pulse">
      <div className="h-40 w-full rounded-2xl bg-gray-200" />

      <div className="flex items-start justify-between mt-4">
        <div className="flex gap-4 items-start">
          <div className="-mt-12">
            <div className="h-20 w-20 rounded-full border-4 border-white bg-gray-300" />
          </div>

          <div className="space-y-2 mt-2">
            <div className="h-4 w-40 bg-gray-300 rounded-md" />

            <div className="h-3 w-28 bg-gray-200 rounded-md" />

            <div className="h-3 w-64 bg-gray-200 rounded-md mt-2" />
            <div className="h-3 w-52 bg-gray-200 rounded-md" />
          </div>
        </div>

        <div className="h-10 w-28 bg-gray-300 rounded-full" />
      </div>

      <div className="flex gap-6 mt-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="pr-6 border-r last:border-none border-gray-200"
          >
            <div className="h-4 w-6 bg-gray-300 rounded mb-1" />

            <div className="h-3 w-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
