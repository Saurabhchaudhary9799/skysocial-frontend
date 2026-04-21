"use client";

import ChatArea from "@/components/chat-page/chat-area";
import FriendsSidebar from "@/components/chat-page/friends-sidebar";
import { socket } from "@/lib/socket";
import { useUserStore } from "@/store/useUserStore";
import { useEffect } from "react";

export default function ChatPage() {
  const user = useUserStore((s) => s.user);

  // useEffect(() => {
  //   if (!user?._id) return;

  //   socket.connect();
  //   socket.emit("user-joined", user._id);

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [user?._id]);

  return (
    <div className="grid grid-cols-[300px_1fr] h-[calc(100vh-64px)] px-2 py-4 gap-4 lg:max-w-[1440px] mx-auto">
      <div className="overflow-hidden">
        <FriendsSidebar />
      </div>

      <div className="overflow-hidden">
        <ChatArea />
      </div>
    </div>
  );
}
