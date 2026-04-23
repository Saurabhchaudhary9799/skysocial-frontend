"use client";

import { useEffect, useState } from "react";
import API from "@/lib/axios";
import PostCard from "@/components/home/PostCard";
import { PostCardProps } from "@/lib/types";
import PostListSkeleton from "@/components/skeleton/postListSkeleton";

export default function PostList() {
  const [posts, setPosts] = useState<PostCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await API.get("/posts/home-feed");
        setPosts(res.data.result.posts || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <PostListSkeleton />;

  if (posts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        No posts yet 👀
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {posts.map((post) => (
        <PostCard key={post._id} {...post} />
      ))}
    </div>
  );
}