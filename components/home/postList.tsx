import getHomeFeed from "@/lib/api-server";
import PostCard from "@/components/home/PostCard";

export default async function PostList() {
  const posts = await getHomeFeed();

  if (posts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        No posts yet 👀
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {posts.map((post: any) => (
        <PostCard key={post._id} {...post} />
      ))}
    </div>
  );
}