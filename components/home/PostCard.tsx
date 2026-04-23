"use client";
import {
  Bookmark,
  EllipsisVertical,
  Heart,
  Loader2,
  MessageCircle,
  Share,
} from "lucide-react";
import { useEffect, useState } from "react";
import PostModal from "../profile/postModal";
import { User, useUserStore } from "@/store/useUserStore";
import {
  addLikeIfMissing,
  hasUserLiked,
  removeUserLike,
  type PostLike,
} from "@/lib/post-likes";
import { getSavedPostByUser, hasAlreadySaved } from "@/lib/post-save";
import { useSavedPostStore } from "@/store/useSavedPostStore";
import { useFollowStore } from "@/store/useFollowStore";
import { formatCount, formatTimeAgo } from "@/lib/format";
import { PostCardProps, PostComment } from "@/lib/types";
import {
  toggleFollowUser,
  toggleLikePost,
  toggleSavePost,
} from "@/lib/api-client";
import PostOptionsModal from "../post/postOptionModal";
import { toast } from "sonner";

import Image from "next/image";
import { socket } from "@/lib/socket";
import API from "@/lib/axios";

export default function PostCard({
  _id,
  bio,
  image,
  createdAt,
  user,
  tags,
  comments = [],
  likes = [],
}: PostCardProps) {
  const currentUser = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const { savedPosts, setSavedPosts, addSavedPost, removeSavedPost } =
    useSavedPostStore();
  const { isFollowing, followUser, unfollowUser, fetchFollowings } =
    useFollowStore();

  const author = user?.name || user?.username || "Unknown";
  const handle = `@${user?.username || "unknown"}`;
  const time = formatTimeAgo(createdAt);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postOptionModalOpen, setPostOptionModalOpen] = useState(false);

  const [localLikes, setLocalLikes] = useState<PostLike[]>(likes);
  const [localComments, setLocalComments] = useState<PostComment[]>(comments);
  const [isLiking, setIsLiking] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    setLocalLikes(likes);
  }, [likes]);

  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  const currentUserId = currentUser?._id || (currentUser as User)?._id;
  const authorId = user?._id;
  const alreadyFollowing = authorId ? isFollowing(authorId) : false;
  const isLiked = hasUserLiked(localLikes, currentUserId);
  const isSaved = hasAlreadySaved(savedPosts, _id);
  const likeCount = formatCount(localLikes.length);
  const commentCount = formatCount(localComments.length);

  const [expanded, setExpanded] = useState(false);

  const isLong = bio.length > 50;
  const shortBio = bio.slice(0, 50);

  useEffect(() => {
    if (!currentUserId) return;

    fetchFollowings(currentUserId);
  }, [currentUserId, fetchFollowings]);

  useEffect(() => {
    if (!currentUserId) {
      return;
    }
    const fetchSavedPosts = async () => {
      const data = await getSavedPostByUser(currentUserId);
      // console.log(data);
      setSavedPosts(data || []);
    };

    fetchSavedPosts();
  }, [currentUserId, setSavedPosts]);

  const handleLike = async () => {
    if (!currentUserId || isLiking) {
      return;
    }

    try {
      setIsLiking(true);

      const data = await toggleLikePost(_id);

      const message = data?.message;
      const returnedLike = data?.like;

      if (message === "Post liked") {
        setLocalLikes((prevLikes) =>
          addLikeIfMissing(prevLikes, currentUserId, returnedLike),
        );
      }

      if (message === "Post unliked") {
        setLocalLikes((prevLikes) => removeUserLike(prevLikes, currentUserId));
      }

      socket.emit("likePost", {
        userId: authorId,
        username: currentUser?.username,
        action: message,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleBookmark = async () => {
    setSaveLoading(true);
    try {
      const data = await toggleSavePost(_id);
      const message = data?.message;
      const savedItem = data?.save;
      if (message === "Post saved") {
        addSavedPost({
          _id: savedItem._id,
          user: currentUserId,
          post: {
            _id: savedItem.post,
          },
        });
      }

      if (message === "Post unsaved") {
        removeSavedPost(_id);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleFollowUnfollow = async () => {
    if (!authorId) return;
    setFollowLoading(true);
    try {
      const data = await toggleFollowUser(authorId);

      const message = data?.message;

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

      socket.emit("followAndUnfollowUser", {
        userId: authorId,
        username: currentUser?.username,
        action: message,
      });

      toast.success(message);
    } catch (err) {
      console.error(err);
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <article className="home-panel bg-white rounded-2xl p-3 lg:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="h-11 w-11 rounded-full overflow-hidden">
            {user?.profile_image ? (
              <Image
                src={user.profile_image}
                alt="Profile"
                width={44}
                height={44}
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#171717] to-[#6f6f6f] text-xs font-bold text-white">
                {author
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)}
              </div>
            )}
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
          {currentUser?._id !== authorId && !alreadyFollowing && (
            <button
              className={`flex justify-center items-center w-20 rounded-full px-2 py-1 text-xs font-semibold  gap-2 transition cursor-pointer bg-gradient-to-r from-primary to-primary-container text-white
     
    `}
              onClick={handleFollowUnfollow}
              disabled={followLoading}
            >
              {followLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "follow"
              )}
            </button>
          )}
          <span
            className="hover:bg-surface-active px-2 py-2 rounded-full cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={() => setPostOptionModalOpen((prev) => !prev)}
          >
            <EllipsisVertical className="h-4 w-4 text-on-surface-variant" />
          </span>
        </div>
      </div>

      {image ? (
        <div className="mt-4 overflow-hidden rounded-[1.5rem]">
          <Image
            src={image}
            alt="post"
            width={400}
            height={400}
            className="h-96 w-full object-cover"
          />
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
        </div>

        <button
          className="ml-auto text-on-surface-variant"
          onClick={handleBookmark}
        >
          <Bookmark
            className={`h-6 w-6 cursor-pointer transition-transform duration-200 ease-out hover:scale-125 active:scale-95 ${
              isSaved ? "fill-black text-black" : ""
            } ${saveLoading ? "pointer-events-none opacity-70" : ""}`}
          />
        </button>
      </div>
      <p className="mt-2 text-sm leading-5 text-on-surface-variant">
        {expanded || !isLong ? bio : `${shortBio}... `}

        {isLong && (
          <span
            onClick={() => setExpanded(!expanded)}
            className="cursor-pointer  text-primary hover:underline"
          >
            {expanded ? " show less" : "read more"}
          </span>
        )}
      </p>
      {tags && tags.length > 0 && (
        <div className=" flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="text-sm font-medium text-primary   ">
              #{tag}
            </span>
          ))}
        </div>
      )}
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

      <PostOptionsModal
        isOpen={postOptionModalOpen}
        onClose={() => setPostOptionModalOpen(false)}
        isOwnPost={currentUser?._id === authorId}
        isFollowing={alreadyFollowing}
        onFollowToggle={handleFollowUnfollow}
        onDelete={async () => {
          try {
            await API.delete(`/posts/${_id}`);

            if (currentUser) {
              setUser({
                ...currentUser,
                posts: (currentUser.posts || 0) - 1,
              });
            }

            // Update global store to remove the post from UI
            // 👉 remove post from UI (you’ll need parent state or global store)
            toast.success("Post deleted successfully ");
          } catch (err) {
            console.error(err);
          }
        }}
      />
    </article>
  );
}
