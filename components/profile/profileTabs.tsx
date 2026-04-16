"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { usePostStore } from "@/store/usePostStore";
import PostModal from "@/components/profile/postModal"; 
import type { PostLike } from "@/lib/post-likes";

type Props = {
  userId: string;
};

export default function ProfileTabs({ userId }: Props) {
  const [active, setActive] = useState("posts");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null); // 👈 ADD

  const posts = usePostStore((state) => state.posts) || [];
  const setPosts = usePostStore((state) => state.setPosts);
  const isFetched = usePostStore((state) => state.isFetched);
  const updatePostLikes = usePostStore((state) => state.updatePostLikes);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/posts/user/${userId}`,
          { withCredentials: true }
        );

        setPosts(res.data.result.posts);
      } catch (error) {
        console.log("Failed to fetch posts");
      }
    };

    if (active === "posts" && userId) {
      fetchPosts();
    }
  }, [active, userId]);

  const tabs = ["posts", "collections"];

  return (
    <div className="mt-6">
      <div className="flex justify-center gap-6 border-b border-outline-variant">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`pb-2 text-sm capitalize ${
              active === tab
                ? "text-primary border-b-2 border-primary"
                : "text-on-surface-variant"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-4 text-center text-on-surface-variant">
        {active === "posts" && (
          <div>
            {posts.length === 0 ? (
              <p>No posts yet</p>
            ) : (
              <div className="grid grid-cols-3 gap-1 sm:gap-2">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    onClick={() => setSelectedPostId(post._id)} // 👈 ADD
                    className="relative w-full aspect-square overflow-hidden cursor-pointer group"
                  >
                    {post.image ? (
                      <img
                        src={post.image}
                        alt="post"
                        className="w-full h-full object-cover rounded-4xl transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="bg-gray-200 w-full h-full" />
                    )}

                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {active === "collections" && <p>Collections content</p>}
      </div>

      {/* ✅ MODAL */}
      {selectedPostId && (
        <PostModal
          postId={selectedPostId}
          initialLikes={
            ((posts as any[]).find((p) => p._id === selectedPostId) as any)
              ?.likes ?? []
          }
          onLikesChange={(likes: PostLike[]) => {
            updatePostLikes(selectedPostId, likes);
          }}
          onClose={() => setSelectedPostId(null)}
        />
      )}
    </div>
  );
}