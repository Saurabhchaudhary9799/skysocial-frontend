"use client";

import Image from "next/image";
import { Bell, MessageCircle, Plus } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useState } from "react";
import NotificationModal from "./notificationModal";
import ProfileModal from "./profileModal";
import Link from "next/link";
import Logo from "../logo/logo";
import CreatePostModal from "../post/createPostModal";

export default function Header() {
  const currentUser = useUserStore((state) => state.user);
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  //   console.log("Header render - Unread Count:", unreadCount);

  const [open, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openCreatePost, setOpenCreatePost] = useState(false);

  const name = currentUser?.name || currentUser?.username || "User";

  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

  return (
    <header className="w-full h-16 px-6 flex items-center justify-between lg:justify-end  bg-white sticky top-0 z-10 rounded-b-2xl shadow-sm">
      <div className="flex items-center gap-2 sm:gap-3 lg:hidden">
        <Logo />

        <div className="leading-tight">
          <Link href="/home">
            <p className="text-base sm:text-lg font-extrabold tracking-tight text-on-surface">
              SkySocial
            </p>
          </Link>
        </div>
      </div>
      <div className="flex items-center  gap-2 md:gap-4">
        <button
          className="p-2 block lg:hidden hover:bg-surface-active transition rounded-full cursor-pointer"
          onClick={() => {
            setOpenCreatePost((prev) => !prev);
            setOpen(false);
            setOpenProfile(false);
          }}
        >
          <Plus />
        </button>
        <Link
          href="/messages"
          className="p-2 rounded-full hover:bg-surface-active transition block lg:hidden"
        >
          <MessageCircle className="h-5 w-5 cursor-pointer hover:text-gray-600 transition" />
        </Link>

        <button
          onClick={() => {
            setOpen((prev) => !prev);
            setOpenProfile(false);
          }}
          className="relative p-2 rounded-full hover:bg-surface-active transition cursor-pointer "
        >
          <Bell className="h-5 w-5" />

          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 text-[10px] px-1.5 py-0.5 rounded-full bg-red-500 text-white">
              {unreadCount}
            </span>
          )}
        </button>

        {/* 👤 Avatar */}
        <div
          className="relative h-10 w-10 rounded-full overflow-hidden bg-gradient-to-br from-[#171717] to-[#6f6f6f] flex items-center justify-center text-xs font-bold text-white cursor-pointer"
          onClick={() => {
            setOpenProfile((prev) => !prev);
            setOpen(false);
          }}
        >
          {currentUser?.profile_image ? (
            <Image
              src={currentUser.profile_image}
              alt={name}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          ) : (
            initials
          )}
        </div>
      </div>
      {open && <NotificationModal />}
      {openProfile && currentUser && <ProfileModal user={currentUser} />}
      {openCreatePost && <CreatePostModal onClose={() => setOpenCreatePost(false)} />}
    </header>
  );
}
