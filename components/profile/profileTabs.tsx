"use client";

import { useState, useEffect } from "react";
import { usePostStore } from "@/store/usePostStore";
import PostModal from "@/components/profile/postModal";
import type { PostLike } from "@/lib/post-likes";
import Image from "next/image";
import { PostCardProps } from "@/lib/types";
import API from "@/lib/axios";

type Props = {
  userId: string;
};

export default function ProfileTabs({ userId }: Props) {
  const [active, setActive] = useState("posts");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null); // 👈 ADD

  const posts = usePostStore((state) => state.posts) || [];

  const setPosts = usePostStore((state) => state.setPosts);

  const updatePostLikes = usePostStore((state) => state.updatePostLikes);

  //   useEffect(() => {
  //     if (!userId) {
  //       return
  //     }
  //     const fetchSavedPosts = async () => {
  //       const data = await getSavedPostByUser(userId);
  //       setSavedPosts(data || []);
  // // console.log(data);

  //     }

  //     fetchSavedPosts();
  //   }, [userId])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await API.get(`/posts/user/${userId}`);

        setPosts(res.data.result.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        console.log("Failed to fetch posts");
      }
    };

    if (active === "posts" && userId) {
      fetchPosts();
    }
  }, [active, userId, setPosts]);

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-2">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    onClick={() => setSelectedPostId(post._id)} // 👈 ADD
                    className="relative w-full aspect-square rounded-4xl overflow-hidden cursor-pointer group"
                  >
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt="post"
                        className="w-full h-full object-cover rounded-4xl  transition duration-300 group-hover:scale-105"
                        width={400}
                        height={400}
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

        {active === "collections" && <p>collection</p>}
      </div>

      {/* ✅ MODAL */}
      {selectedPostId && (
        <PostModal
          postId={selectedPostId}
          initialLikes={
            (posts as PostCardProps[]).find((p) => p._id === selectedPostId)
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
