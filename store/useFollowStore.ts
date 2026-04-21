import { create } from "zustand";
import axios from "axios";

type FollowUser = {
  _id: string;
  name: string;
  username: string;
  profile_image?: string | null;
  bio?: string;
};

type Follower = {
  _id: string;
  follower: FollowUser;
};

type Following = {
  _id: string;
  following: FollowUser;
};

type FollowStore = {
  followers: Follower[];
  followings: Following[];

  followingIds: Set<string>; // 🔥 important for fast lookup

  fetchFollowers: (userId: string) => Promise<void>;
  fetchFollowings: (userId: string) => Promise<void>;

  isFollowing: (userId: string) => boolean;

  followUser: (user: FollowUser) => void;
  unfollowUser: (userId: string) => void;
};

export const useFollowStore = create<FollowStore>((set, get) => ({
  followers: [],
  followings: [],
  followingIds: new Set(),

  // ✅ fetch followers
  fetchFollowers: async (userId) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/followers`,
        { withCredentials: true }
      );

      set({
        followers: res.data || [],
      });
    } catch (err) {
      console.error(err);
    }
  },

  // ✅ fetch followings
  fetchFollowings: async (userId) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/followings`,
        { withCredentials: true }
      );

      // console.log(res.data);

      const followings: Following[] = res.data.result || [];

      // 🔥 build fast lookup set
      const ids = new Set(
        followings.map((f) => f.following._id)
      );

      set({
        followings,
        followingIds: ids,
      });
    } catch (err) {
      console.error(err);
    }
  },

  // ✅ check if already following
  isFollowing: (userId) => {
    return get().followingIds.has(userId);
  },

  // ✅ optimistic follow
  followUser: (user) =>
    set((state) => {
      state.followingIds.add(user._id);

      state.followings.push({
        _id: "temp-" + user._id,
        following: user,
      });

      return {
        followings: [...state.followings],
        followingIds: new Set(state.followingIds),
      };
    }),

  // ✅ optimistic unfollow
  unfollowUser: (userId) =>
    set((state) => {
      state.followingIds.delete(userId);

      return {
        followings: state.followings.filter(
          (f) => f.following._id !== userId
        ),
        followingIds: new Set(state.followingIds),
      };
    }),
}));