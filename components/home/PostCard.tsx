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
import { getSavedPostByUser, hasAlreadySaved, SavedPost } from "@/lib/post-save";
import { useSavedPostStore } from "@/store/useSavedPostStore";
import { useFollowStore } from "@/store/useFollowStore";

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
  message?: string;
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
  const setUser = useUserStore((state)=>state.setUser);
  const { savedPosts, setSavedPosts, addSavedPost, removeSavedPost } =
    useSavedPostStore();
  const { isFollowing, followUser, unfollowUser, fetchFollowings } =
    useFollowStore();
  const author = user?.name || user?.username || "Unknown";
  const handle = `@${user?.username || "unknown"}`;
  const time = formatTimeAgo(createdAt);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localLikes, setLocalLikes] = useState<PostLike[]>(likes);

  const [localComments, setLocalComments] = useState<PostComment[]>(comments);
  const [isLiking, setIsLiking] = useState(false);

  // console.log(user);
  useEffect(() => {
    setLocalLikes(likes);
  }, [likes]);

  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  const currentUserId = currentUser?._id || (currentUser as any)?.id;
  const authorId = user?._id;
  const alreadyFollowing = authorId
    ? isFollowing(authorId)
    : false;
  const isLiked = hasUserLiked(localLikes, currentUserId);
  const isSaved = hasAlreadySaved(savedPosts, _id);
  const likeCount = formatCount(localLikes.length);
  const commentCount = formatCount(localComments.length);

  useEffect(() => {
    if (!currentUserId) return;

    fetchFollowings(currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId) {
      return
    }
    const fetchSavedPosts = async () => {
      const data = await getSavedPostByUser(currentUserId);
      // console.log(data);
      setSavedPosts(data || []);

    }

    fetchSavedPosts();
  }, [currentUserId])

  // console.log("savedPosts",savedPosts);

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

  const handleBookmark = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/posts/${_id}/save`, {}, { withCredentials: true })
      console.log(response);
      const message = response.data?.message;
      const savedItem = response.data?.save;
      if (message === "Post saved") {
        addSavedPost({
          _id: savedItem._id,
          user: currentUserId,
          post: {
            _id: savedItem.post
          },
        });
      }

      if (message === "Post unsaved") {
        removeSavedPost(_id);
      }

      // console.log("savedPosts",savedPosts);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFollowUnfollow = async () => {
    if (!authorId) return;
  
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${authorId}/follower`,
        {},
        { withCredentials: true }
      );
  // console.log("after follow",res.data)
      const message = res.data?.message;
  
      if (message === "Followed successfully") {
        followUser({
          _id: authorId,
          name: user?.name || "",
          username: user?.username || "",
          profile_image: user?.profile_image,
        });
        if (!currentUser) return;

        setUser({
          ...currentUser,
          followings: (currentUser.followings || 0) + 1,
        });
      }
  
      if (message === "Unfollowed successfully") {
        unfollowUser(authorId);

        if (!currentUser) return;

        setUser({
          ...currentUser,
          followings: (currentUser.followings || 0) - 1,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
  // console.log(savedPosts);
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

        <div className="flex justify-center items-center gap-3">
        {currentUser?._id !== authorId && (
  <button
    className={`rounded-full px-4 py-1 text-sm font-semibold transition cursor-pointer bg-gradient-to-r from-primary to-primary-container text-white
     
    `}
    onClick={handleFollowUnfollow}
  >
    {alreadyFollowing ? "Following" : "Follow"}
  </button>
)}

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
            className={`h-6 w-6 cursor-pointer transition-transform duration-200 ease-out hover:scale-125 active:scale-95 ${isLiked ? "fill-red-500 text-red-500" : ""
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

        <button className="ml-auto text-on-surface-variant" onClick={handleBookmark}>
          <Bookmark
            className={`h-6 w-6 cursor-pointer transition-transform duration-200 ease-out hover:scale-125 active:scale-95 ${isSaved ? "fill-black text-black" : ""
              }`}
          />
        </button>
      </div>
      <p className="mt-4 text-sm leading-7 text-on-surface-variant">{bio}</p>
      {isModalOpen && (
        <PostModal
          postId={_id}
          initialLikes={localLikes}

          onLikesChange={setLocalLikes}
          onCommentsChange={(comments) => {
            // update post card state here
            setLocalComments(comments);
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </article>
  );
}