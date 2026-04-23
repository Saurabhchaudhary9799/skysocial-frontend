
"use client";

import ChatArea from "@/components/chat-page/chat-area";
import FriendsSidebar from "@/components/chat-page/friends-sidebar";
import { useChatStore } from "@/store/useChatStore";

export default function ChatPage() {
  const { activeChat } = useChatStore();
 

  return (
   <div
  className={`
    grid h-[calc(100vh-64px)]  py-2 gap-4 lg:max-w-[1440px] mx-auto 
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
