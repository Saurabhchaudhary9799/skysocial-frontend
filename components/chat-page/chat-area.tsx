"use client";

import { ArrowLeft, SendHorizonal, Smile } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { useUserStore } from "@/store/useUserStore";
import { socket } from "@/lib/socket";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { MessageStatus } from "./message-status";

function MessageBubble({ message, isOwn, status }: any) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative max-w-xs p-3 pr-8 text-sm mb-2 break-all ${
          isOwn
            ? "bg-primary text-white rounded-tr-4xl rounded-l-4xl"
            : "bg-gray-200 rounded-tl-4xl rounded-r-4xl"
        }`}
      >
        {message}

        {/* ✅ status inside bubble */}
        {isOwn && (
          <div className="absolute bottom-1 right-2">
            <MessageStatus status={status} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatArea() {
  const { activeChat, setActiveChat, messages, setMessages, addMessage } = useChatStore();
  const currentUser = useUserStore((s) => s.user);
  const { updateConversation } = useChatStore();

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const typingTimeoutRef = useRef<any>(null);

  // ✅ NEW: bottom ref
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // ✅ NEW: date formatter
  const formatDateLabel = (date: string) => {
    const msgDate = new Date(date);
    const today = new Date();

    if (msgDate.toDateString() === today.toDateString()) return "Today";

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (msgDate.toDateString() === yesterday.toDateString()) return "Yesterday";

    return msgDate.toLocaleDateString();
  };

  // ✅ NEW: auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ INPUT
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);

    if (!isTyping && activeChat?._id) {
      setIsTyping(true);
      socket.emit("typing", {
        senderId: currentUser?._id,
        receiverId: activeChat._id,
      });
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit("stop-typing", {
        senderId: currentUser?._id,
        receiverId: activeChat?._id,
      });
    }, 1000);

    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  // ✅ RECEIVE MESSAGE
  useEffect(() => {
    if (!activeChat?._id) return;

    const handler = (data: any) => {
      if (data.senderId === activeChat._id) {
        addMessage({ ...data, status: "delivered" });
      }

      updateConversation(
        {
          sender: data.senderId,
          receiver: data.receiverId,
          message: data.message,
        },
        currentUser?._id || "",
        activeChat,
      );
    };

    socket.on("receive-message", handler);
    return () => {
      socket.off("receive-message", handler);
    };
  }, [activeChat?._id]);

  // ✅ FETCH (ONLY sorting added)
  useEffect(() => {
    if (!activeChat?._id) return;

    const fetchMessages = async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/messages/${activeChat._id}/message`,
        { withCredentials: true },
      );

      const msgs = (res.data?.result.allMessages || [])
        .sort(
          (a: any, b: any) =>
            new Date(a.createdAt || "").getTime() -
            new Date(b.createdAt || "").getTime(),
        )
        .map((m: any) => ({
          ...m,
          status: "delivered",
        }));

      setMessages(msgs);
    };

    fetchMessages();
  }, [activeChat?._id]);

  // ✅ TYPING LISTENER
  useEffect(() => {
    socket.on("typing", ({ senderId }) => {
      if (senderId === activeChat?._id) setTypingUser(senderId);
    });

    socket.on("stop-typing", ({ senderId }) => {
      if (senderId === activeChat?._id) setTypingUser(null);
    });

    return () => {
      socket.off("typing");
      socket.off("stop-typing");
    };
  }, [activeChat?._id]);

  // ✅ SEEN EMIT
  useEffect(() => {
    if (!activeChat?._id || !currentUser?._id) return;

    socket.emit("messages-seen", {
      senderId: activeChat._id,
      receiverId: currentUser._id,
    });
  }, [messages, activeChat?._id]);

  // ✅ SEEN LISTENER
  useEffect(() => {
    socket.on("messages-seen", ({ senderId }) => {
      if (senderId === activeChat?._id) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.sender === currentUser?._id ? { ...msg, status: "seen" } : msg,
          ),
        );
      }
    });

    return () => {
      socket.off("messages-seen");
    };
  }, [activeChat?._id]);

  if (!activeChat) {
    return (
      <div className="flex items-center bg-white rounded-4xl justify-center h-full">
        Start chatting 👋
      </div>
    );
  }

  // ✅ SEND
  const handleSend = async () => {
    if (!input) return;

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/users/messages/${activeChat._id}/message`,
      { message: input },
      { withCredentials: true },
    );

    const newMsg = {
      ...res.data?.result?.message,
      status: "sent",
    };

    addMessage(newMsg);

    socket.emit("send-message", {
      senderId: currentUser?._id,
      receiverId: activeChat?._id,
      message: input,
    });

    updateConversation(
      {
        sender: currentUser?._id || "",
        receiver: activeChat?._id,
        message: input,
      },
      currentUser?._id || "",
      activeChat,
    );

    setInput("");
    textareaRef.current && (textareaRef.current.style.height = "auto");
  };

  return (
    <div className="flex flex-col h-full bg-white   rounded-4xl ">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b border-gray-100">
        <button onClick={() => setActiveChat(null)} className="cursor-pointer p-2 rounded-full hover:bg-surface-active transition ">
          <ArrowLeft size={20} />
        </button>
        <img
          src={activeChat.profile_image || "/default-avatar.png"}
          className="h-10 w-10 rounded-full"
        />
        <div>
          <p>{activeChat.username}</p>
          {typingUser && <p className="text-xs text-gray-400">typing...</p>}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1  overflow-y-auto p-4">
        {messages.map((msg, i) => {
          const isOwn = msg.sender === currentUser?._id;

          const currentDate = new Date(msg.createdAt || "").toDateString();

          const prevDate =
            i > 0
              ? new Date(messages[i - 1]?.createdAt || "").toDateString()
              : "";

          const showDate = currentDate !== prevDate;

          return (
            <div key={i}>
              {/* ✅ DATE */}
              {showDate && (
                <div className="flex justify-center my-2">
                  <span className="text-xs bg-gray-200 px-3 py-1 rounded-full">
                    {formatDateLabel(msg.createdAt || "")}
                  </span>
                </div>
              )}

              {/* EXISTING UI */}
              <div
                className={`flex items-end gap-2 ${
                  isOwn ? "justify-end" : "justify-start"
                }`}
              >
                {!isOwn && (
                  <img
                    src={activeChat.profile_image || "/default-avatar.png"}
                    className="h-8 w-8 rounded-full"
                  />
                )}

                <div className="flex flex-col items-end">
                  <MessageBubble
                    message={msg.message}
                    isOwn={isOwn}
                    status={msg.status}
                  />
                </div>

                {isOwn && (
                  <img
                    src={currentUser?.profile_image || "/default-avatar.png"}
                    className="h-8 w-8 rounded-full"
                  />
                )}
              </div>
            </div>
          );
        })}

        {/* ✅ scroll target */}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 overflow-hidden">
        <div className="flex gap-2 bg-surface-active rounded  items-center min-w-0">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            rows={1}
            placeholder="Write something..."
            className="flex-1 min-w-0 p-3 rounded resize-none bg-transparent outline-none text-sm max-h-32 overflow-y-auto break-words focus:ring-1 focus:ring-primary outline-none"
          />

          <button
            onClick={handleSend}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-white shrink-0"
          >
            <SendHorizonal size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
