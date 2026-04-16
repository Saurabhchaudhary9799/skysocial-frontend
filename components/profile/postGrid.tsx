type Props = {
  posts: any[];
  onClickPost: (id: string) => void;
};

export default function PostGrid({ posts, onClickPost }: Props) {
  if (!posts.length) {
    return <p className="text-center">No posts yet</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-1 sm:gap-2">
      {posts.map((post) => (
        <div
          key={post._id}
          onClick={() => onClickPost(post._id)}
          className="relative w-full aspect-square overflow-hidden cursor-pointer group"
        >
          {post.image ? (
            <img
              src={post.image}
              alt="post"
              className="w-full h-full object-cover rounded-2xl transition group-hover:scale-105"
            />
          ) : (
            <div className="bg-gray-200 w-full h-full" />
          )}

          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition" />
        </div>
      ))}
    </div>
  );
}