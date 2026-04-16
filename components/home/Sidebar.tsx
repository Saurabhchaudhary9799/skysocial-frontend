"use client";

import { House, MessageSquareText, Plus, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../logo/logo";
import { useUserStore } from "@/store/useUserStore";
import { useState } from "react";
import CreatePostModal from "../post/createPostModal";

type SidebarProps = {
  items: Array<{
    label: string;
    href: string;
    icon: "home" | "messages" | "profile";
  }>;
};

const iconMap = {
  home: House,
  messages: MessageSquareText,
  profile: UserRound,
};

export default function Sidebar({ items }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();


  const user = useUserStore((state) => state.user);
  

  
  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="flex h-full max-h-screen flex-col justify-between gap-8 overflow-hidden bg-white p-5 lg:sticky lg:top-0 lg:h-screen lg:p-6 rounded-r-4xl">
      {/* Top */}
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <Logo />
          <div>
            <p className="text-sm font-extrabold tracking-tight text-on-surface">
              SkySocial
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-on-surface-variant/70">
              Celestial Ether
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="space-y-2">
          {items.map((item) => {
            const Icon = iconMap[item.icon];

            const isActive =
              item.icon === "profile"
                ? pathname.startsWith("/profile/")
                : pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-primary-container text-on-primary shadow-[0_14px_28px_rgba(89,92,251,0.24)]"
                    : "text-on-surface-variant hover:bg-surface-low hover:text-on-surface"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom */}
      <div className="space-y-6">
        {/* New Post */}
        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center cursor-pointer gap-2 rounded-full bg-gradient-to-r from-primary to-primary-container px-4 py-3 text-sm font-semibold text-on-primary shadow-[0_18px_36px_rgba(89,92,251,0.26)] transition hover:translate-y-[-1px]"
        >
          <Plus className="h-4 w-4" />
          New Post
        </button>

        {/* User Card */}
        <div className="flex items-center gap-3 rounded-2xl bg-surface-low/70 p-3">
          {user.profile_image ? (
            <img
              src={user.profile_image}
              alt={user.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#ffd7c2] to-[#f6a774] text-xs font-bold text-[#69370f]">
              {initials}
            </div>
          )}

          <Link href={`/profile/${user._id}`} className="min-w-0">
            <p className="truncate text-sm font-semibold text-on-surface">
              {user.name}
            </p>
            <p className="truncate text-xs text-on-surface-variant">
              @{user.username}
            </p>
          </Link>
        </div>
      </div>
      {open && <CreatePostModal onClose={() => setOpen(false)} />}
    </aside>
  );
}
