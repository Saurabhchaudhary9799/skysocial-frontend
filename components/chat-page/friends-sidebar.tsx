"use client";

import { useUserStore } from "@/store/useUserStore";
import { useChatStore } from "@/store/useChatStore";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { formatTimeAgo } from "@/lib/format";
import SkeletonItem from "../skeleton/friends-skeleton";
import Image from "next/image";

type SearchUser = {
  _id: string;
  username: string;
  profile_image?: string;
};

const FriendsSidebar = () => {
  const currentUser = useUserStore((s) => s.user);
  const { conversations, setConversations, setActiveChat, activeChat } =
    useChatStore();

  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchUser[]>([]);

  // ✅ Fetch conversations (runs when page loads)
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/messages/${currentUser?._id}/conversations`,
          { withCredentials: true },
        );

        setConversations(res.data || []);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?._id) fetchConversations();
  }, [currentUser?._id, setConversations]);

  // ✅ Debounced search
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        setSearchLoading(true);

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/search-user`,
          {
            params: { username: query },
            withCredentials: true,
          },
        );

        setResults(res.data?.result || []);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  // ✅ When selecting a user from search
  const handleSelectUser = (user: SearchUser) => {
    setActiveChat({
      _id: user._id,
      username: user.username,
      profile_image: user.profile_image,
    });

    // reset search
    setQuery("");
    setResults([]);
  };

  return (
    <div className="bg-white p-5 h-full overflow-y-auto rounded-4xl">
      <h2 className="text-lg font-medium mb-4">Conversations</h2>

      {/* 🔍 Search */}
      <div className="relative w-full mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search chats..."
          className="w-full pl-10 pr-4 py-2 rounded-full bg-surface-active focus:ring-1 focus:ring-primary outline-none"
        />
      </div>

      {query ? (
        searchLoading ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonItem key={i} />
            ))}
          </>
        ) : results.length === 0 ? (
          <p className="text-sm text-gray-400 text-center mt-6">
            No users found
          </p>
        ) : (
          results.map((user) => (
            <div
              key={user._id}
              onClick={() => handleSelectUser(user)}
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-200"
            >
              <Image
                src={user.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                alt="Profile Image"
                width={400}
                height={400}
                className="h-10 w-10 rounded-full object-cover"
              />

              <p className="font-medium">{user.username}</p>
            </div>
          ))
        )
      ) : (
        <>
          {loading ? (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonItem key={i} />
              ))}
            </>
          ) : conversations.length === 0 ? (
            <p className="text-sm text-gray-400 text-center mt-10">
              No conversations yet
            </p>
          ) : (
            conversations.map((c, i) => (
              <div
                key={i}
                onClick={() =>
                  setActiveChat({
                    _id: c.userId,
                    username: c.username,
                    profile_image: c.profile_image,
                  })
                }
                className={`flex items-start justify-between p-3 mb-2 gap-2 rounded-2xl cursor-pointer ${
                  activeChat?._id === c.userId
                    ? "bg-primary text-white"
                    : "hover:bg-gray-200 text-gray-800"
                }`}
              >
                <div className="flex items-start  gap-3 min-w-0 ">
                  <Image
                    src={c.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.username}`}
                    alt="profile Image"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />

                  <div className="flex flex-col    min-w-0 ">
                    <p className="font-normal  truncate leading-none">
                      {c.username}
                    </p>
                    <p className="text-xs  truncate leading-tight">
                      {c.isOwn ? "You: " : ""}
                      {c.lastMessage}
                    </p>
                  </div>
                </div>

                <span className="text-xs text-on-surface whitespace-nowrap">
                  {formatTimeAgo(c.createdAt)}
                </span>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default FriendsSidebar;
