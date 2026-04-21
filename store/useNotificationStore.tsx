import { create } from "zustand";

type Notification = {
  id: string;
  type: "like" | "comment" | "follow";
  message: string;
  read: boolean;
  createdAt: number;
};

type Store = {
  notifications: Notification[];
  unreadCount: number;

  addNotification: (notif: Notification) => void;
  markAllRead: () => void;
  clearNotifications: () => void;
};

export const useNotificationStore = create<Store>((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notif) =>
    set((state) => ({
      notifications: [notif, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({
        ...n,
        read: true,
      })),
      unreadCount: 0,
    })),

  clearNotifications: () =>
    set({
      notifications: [],
      unreadCount: 0,
    }),
}));