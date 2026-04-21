"use client";

import { useNotificationStore } from "@/store/useNotificationStore";

export default function NotificationModal() {
  const { notifications, markAllRead } = useNotificationStore();

  return (
    <div className="absolute right-2 top-20 w-80 bg-white rounded-2xl shadow-lg p-4 z-50">
      
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">Notifications</h3>
        <button
          onClick={markAllRead}
          className="text-xs text-blue-500 cursor-pointer hover:underline"
        >
          Mark all read
        </button>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-sm text-gray-500 text-center">
            No notifications
          </p>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3 rounded-lg text-sm ${
                notif.read ? "bg-gray-50" : "bg-blue-50"
              }`}
            >
              {notif.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
}