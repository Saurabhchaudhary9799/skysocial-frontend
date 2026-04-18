import { create } from "zustand";
import { SavedPost } from "@/lib/post-save";

type SavedPostStore = {
  savedPosts: SavedPost[];
  setSavedPosts: (posts: SavedPost[]) => void;
  addSavedPost: (post: SavedPost) => void;
  removeSavedPost: (postId: string) => void;
};

export const useSavedPostStore = create<SavedPostStore>((set) => ({
  savedPosts: [],

  setSavedPosts: (posts) => set({ savedPosts: posts }),

  addSavedPost: (post) =>
    set((state) => ({
      savedPosts: [...state.savedPosts, post],
    })),

  removeSavedPost: (postId) =>
    set((state) => ({
      savedPosts: state.savedPosts.filter(
        (item) => item.post?._id !== postId
      ),
    })),
}));