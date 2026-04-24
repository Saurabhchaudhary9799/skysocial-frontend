"use client";

export default function ProfilePostSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square bg-gray-200 rounded-xl animate-pulse"
        />
      ))}
    </div>
  );
}