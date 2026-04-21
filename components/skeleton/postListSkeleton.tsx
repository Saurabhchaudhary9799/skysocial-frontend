import PostSkeleton from "@/components/skeleton/postSkeleton";

export default function PostListSkeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );
}