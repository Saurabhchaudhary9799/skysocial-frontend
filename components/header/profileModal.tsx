"use client";

import { useState } from "react";
import { User } from "@/store/useUserStore";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
  user: User;
  onLogout?: () => void;
};

export default function ProfileModal({ user, onLogout }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // 🔥 loading state
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/logout`,
        {},
        { withCredentials: true }
      );

      onLogout?.();
      setShowConfirm(false);

      router.push("/login");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const initials = user?.username
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <>
      {/* 🔹 Profile Dropdown */}
      <div className="absolute right-2 top-20 w-64 bg-white rounded-2xl z-50 shadow-lg">
        <div className="border-b border-gray-50">
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="h-11 w-11 rounded-full overflow-hidden bg-gradient-to-br from-[#171717] to-[#6f6f6f] flex items-center justify-center text-xs font-bold text-white">
              {user?.profile_image ? (
                <Image
                  src={user.profile_image}
                  alt="Profile"
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <div>
              <p className="text-sm font-semibold">
                {user?.name || user?.username}
              </p>
              <p className="text-xs text-gray-500">@{user?.username}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <Link
            href={`/profile/${user?._id}`}
            className="px-3 py-2 text-sm hover:bg-surface-active transition"
          >
            Go to profile
          </Link>

          <Link
            href="/settings"
            className="px-3 py-2 text-sm hover:bg-surface-active transition"
          >
            Settings
          </Link>

          <button
            onClick={() => setShowConfirm(true)}
            className="px-3 py-2 text-sm text-red-500 hover:bg-surface-active transition text-left"
          >
            Log out
          </button>
        </div>
      </div>

      {/* 🔥 Logout Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
          <div className="w-72 bg-white rounded-2xl shadow-lg p-4">
            <p className="text-sm font-medium text-center mb-4">
              Are you sure you want to log out?
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isLoggingOut}
                className="flex-1 py-2 rounded-lg bg-gray-100 text-sm disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoggingOut ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Logging out...
                  </>
                ) : (
                  "Log out"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}