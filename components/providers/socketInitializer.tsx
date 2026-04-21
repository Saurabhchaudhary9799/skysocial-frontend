"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { useUserStore } from "@/store/useUserStore";
import { useNotificationStore } from "@/store/useNotificationStore";

export default function SocketInitializer() {
  const user = useUserStore((s) => s.user);
  const addNotification = useNotificationStore((s) => s.addNotification);

  useEffect(() => {
  socket.on("receiveNotification", (data) => {
    addNotification({
      id: crypto.randomUUID(),
      type: data.type,
      message: data.message,
      read: false,
      createdAt: Date.now(),
    });
  });

  return () => {
    socket.off("receiveNotification");
  };
}, []);


  useEffect(() => {
    if (!user?._id) return;

    if (!socket.connected) {
      socket.connect();
      socket.emit("user-joined", user._id);
      console.log("Socket connected:", socket.id);
    }

    // ❌ DO NOT disconnect on unmount
  }, [user?._id]);

  return null;
}