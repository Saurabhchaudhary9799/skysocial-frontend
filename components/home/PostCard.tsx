"use client";
import { Bookmark, Ellipsis, Heart, MessageCircle, Share } from "lucide-react";
import { useEffect, useState } from "react";
import PostModal from "../profile/postModal";
import axios from "axios";
import { useUserStore } from "@/store/useUserStore";
import {
  addLikeIfMissing,
  hasUserLiked,
  removeUserLike,
  type PostLike,
} from "@/lib/post-likes";

type PostUser = {
  _id?: string;
  id?: string;
  name?: string;
  username?: string;
  profile_image?: string | null;
};

type PostCommentUser = {
  id?: string;
  username?: string;
  profile_image?: string | null;
};

type PostComment = {
  _id: string;
  text?: string;
  createdAt?: string;
  user?: PostCommentUser | null;
};

export type PostCardProps = {
  _id: string;
  bio: string;
  image?: string | null;
  createdAt: string;
  user?: PostUser | null;
  comments?: PostComment[];
  likes?: PostLike[];
};

function formatTimeAgo(date: string) {
  const now = new Date();
  const past = new Date(date);
  const diffInHours = Math.floor(
    (now.getTime() - past.getTime()) / (1000 * 60 * 60),
  );

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${Math.floor(diffInHours / 24)}d ago`;
}

function formatCount(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

export default function PostCard({
  _id,
  bio,
  image,
  createdAt,
  user,
  comments = [],
  likes = [],
}: PostCardProps) {
  const currentUser = useUserStore((state) => state.user);
  const author = user?.name || user?.username || "Unknown";
  const handle = `@${user?.username || "unknown"}`;
  const time = formatTimeAgo(createdAt);
  const commentCount = formatCount(comments.length);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localLikes, setLocalLikes] = useState<PostLike[]>(likes);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    setLocalLikes(likes);
  }, [likes]);

  const currentUserId = currentUser?._id;
  const isLiked = hasUserLiked(localLikes, currentUserId);
  const likeCount = formatCount(localLikes.length);

  const handleLike = async () => {
    if (!currentUserId || isLiking) {
      return;
    }

    try {
      setIsLiking(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${_id}/like`,
        {},
        {
          withCredentials: true,
        },
      );

      const message = response.data?.message;
      const returnedLike = response.data?.like;

      if (message === "Post liked") {
        setLocalLikes((prevLikes) =>
          addLikeIfMissing(prevLikes, currentUserId, returnedLike),
        );
      }

      if (message === "Post unliked") {
        setLocalLikes((prevLikes) => removeUserLike(prevLikes, currentUserId));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <article className="home-panel bg-white rounded-4xl p-5 lg:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#171717] to-[#6f6f6f] text-xs font-bold text-white">
            {author
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </div>

          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-on-surface">
              {author}
            </p>
            <p className="text-xs text-neutral">
              {handle} · {time}
            </p>
          </div>
        </div>

        <div>
          <Ellipsis className="h-4 w-4 text-on-surface-variant" />
        </div>
      </div>

     

      {image ? (
        <div className="mt-4 overflow-hidden rounded-[1.5rem]">
          <img src={image} alt="post" className="h-96 w-full object-cover" />
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-5 text-sm font-medium text-on-surface-variant">
        <div className="flex items-center gap-2">
          <Heart
            className={`h-6 w-6 cursor-pointer transition-transform duration-200 ease-out hover:scale-125 active:scale-95 ${
              isLiked ? "fill-red-500 text-red-500" : ""
            } ${isLiking ? "pointer-events-none opacity-70" : ""}`}
            onClick={handleLike}
          />
          <span>{likeCount}</span>
        </div>

        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
          role="button"
          tabIndex={0}
        >
          <MessageCircle className="h-6 w-6 cursor-pointer transition-transform duration-200 ease-out hover:scale-125 active:scale-95" />
          <span>{commentCount}</span>
        </div>

        <div className="flex items-center gap-2">
          <Share className="h-6 w-6 cursor-pointer transition-transform duration-200 ease-out hover:scale-125 active:scale-95" />
          {/* <span>0</span> */}
        </div>

        <button className="ml-auto text-on-surface-variant">
          <Bookmark className="h-6 w-6 cursor-pointer transition-transform duration-200 ease-out hover:scale-125 active:scale-95" />
        </button>
      </div>
      <p className="mt-4 text-sm leading-7 text-on-surface-variant">{bio}</p>
      {isModalOpen && (
        <PostModal
          postId={_id}
          initialLikes={localLikes}
          onLikesChange={setLocalLikes}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </article>
  );
}