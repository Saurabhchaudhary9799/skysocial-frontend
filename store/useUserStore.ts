// store/useUserStore.ts

import { create } from "zustand";

type User = {
  _id: string;
  name: string;
  username: string;
  bio?: string;
  profile_image?: string;
  cover_image?: string;
  followers?: number;
  followings?: number;
  posts?: number;
};

type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  clearUser: () => set({ user: null }),
}));