
"use client";

import ChatArea from "@/components/chat-page/chat-area";
import FriendsSidebar from "@/components/chat-page/friends-sidebar";
import { socket } from "@/lib/socket";
import { useChatStore } from "@/store/useChatStore";
import { useUserStore } from "@/store/useUserStore";
import { useEffect } from "react";

export default function ChatPage() {
  const user = useUserStore((s) => s.user);
  const { activeChat } = useChatStore();
  // useEffect(() => {
  //   if (!user?._id) return;

  //   socket.connect();
  //   socket.emit("user-joined", user._id);

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [user?._id]);

  return (
   <div
  className={`
    grid h-[calc(100vh-64px)] px-2 py-4 gap-4 lg:max-w-[1440px] mx-auto 
    ${
      activeChat
        ? "grid-cols-1 md:grid-cols-[300px_1fr]"
        : "grid-cols-1 md:grid-cols-[300px_1fr]"
    }
  `}
>
  {/* Sidebar */}
  <div
    className={`
      ${activeChat ? "hidden md:block" : "block"}
      md:w-[300px] overflow-hidden
    `}
  >
    <FriendsSidebar />
  </div>

  {/* Chat */}
  <div className={`${!activeChat ? "hidden md:block" : "block"} min-w-0 overflow-hidden`}>
    <ChatArea />
  </div>
</div>
  );
}
