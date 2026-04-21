import { create } from "zustand";
import type { PostLike } from "@/lib/post-likes";

type Post = {
  _id: string;
  bio: string;
  image?: string;
  tags: string[];
  createdAt: string;
  user: string;
  likes?: PostLike[];
};

type PostStore = {
  posts: Post[];
  isFetched: boolean;
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  deletePost: (postId: string) => void;
  updatePostLikes: (postId: string, likes: PostLike[]) => void;
};

export const usePostStore = create<PostStore>()((set) => ({
  posts: [],
  isFetched: false,

  setPosts: (posts: Post[]) =>
    set({
      posts,
      isFetched: true,
    }),

  addPost: (post: Post) =>
    set((state: PostStore) => ({
      posts: [post, ...state.posts],
    })),

  deletePost: (postId: string) =>
    set((state) => ({
      posts: state.posts.filter((post) => post._id !== postId),
    })),

  updatePostLikes: (postId, likes) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post._id === postId ? { ...post, likes } : post,
      ),
    })),
}));
