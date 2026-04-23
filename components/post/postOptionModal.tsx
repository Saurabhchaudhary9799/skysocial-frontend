"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  isOwnPost: boolean;
  isFollowing: boolean;
  onFollowToggle: () => void;
  onDelete: () => void;
};

export default function PostOptionsModal({
  isOpen,
  onClose,
  isOwnPost,
  isFollowing,
  onFollowToggle,
  onDelete,
}: Props) {

  // const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  // // ✅ Lock scroll
  // useEffect(() => {
  //   if (!mounted) return;

  //   document.body.style.overflow = "hidden";
  //   return () => {
  //     document.body.style.overflow = "auto";
  //   };
  // }, [mounted]);
  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 "
      onClick={onClose} // click outside closes
    >
      <div
        className="w-72 rounded-2xl bg-white   shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* FOLLOW / UNFOLLOW */}
        {!isOwnPost && (
          <button
            onClick={() => {
              onFollowToggle();
              onClose();
            }}
            className="w-full px-4 py-3 text-sm text-center font-medium hover:bg-gray-100 transition text-left"
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}

        {/* DELETE */}
        {isOwnPost && (
          <button
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="w-full px-4 py-3 text-sm text-center font-medium text-red-500 hover:bg-gray-100 transition text-left"
          >
            Delete Post
          </button>
        )}

        {/* CANCEL */}
        <button
          onClick={onClose}
          className="w-full px-4 py-3 text-sm text-center font-medium hover:bg-gray-100 transition text-left"
        >
          Cancel
        </button>
      </div>
    </div>,
    document.body
  );
}