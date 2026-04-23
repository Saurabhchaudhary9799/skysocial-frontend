// store/useUserStore.ts

import { create } from "zustand";

export type User = {
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
  isLoaded: boolean;
  setUser: (user: User) => void;
  setLoaded: (value: boolean) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoaded: false,
  setUser: (user) => set({ user, isLoaded: true }),
  setLoaded: (value) => set({ isLoaded: value }),

  clearUser: () => set({ user: null, isLoaded: true }),
}));
