"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Bookmark,
  Clock,
  EllipsisVertical,
  Heart,
  Loader2,
  MessageCircle,
  X,
} from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import {
  addLikeIfMissing,
  getLikeUserId,
  hasUserLiked,
  removeUserLike,
  type PostLike,
} from "@/lib/post-likes";
import { useSavedPostStore } from "@/store/useSavedPostStore";
import { hasAlreadySaved } from "@/lib/post-save";
import { toast } from "sonner";
import { useFollowStore } from "@/store/useFollowStore";
import { socket } from "@/lib/socket";
import { PostCardProps } from "@/lib/types";
import Image from "next/image";
import {
  toggleFollowUser,
  toggleLikePost,
  toggleSavePost,
} from "@/lib/api-client";
import API from "@/lib/axios";

type Comment = {
  _id: string;
  user?: { username: string; profile_image?: string };
  message?: string;
};

type Props = {
  postId: string;

  onClose: () => void;
  initialLikes?: PostLike[];

  onLikesChange?: (likes: PostLike[]) => void;

  onCommentsChange?: (comments: Comment[]) => void;
};

function areLikesEqual(a: PostLike[], b: PostLike[]) {
  if (a === b) return true;
  if (a.length !== b.length) return false;

  const normalize = (likes: PostLike[]) =>
    likes.map((like) => `${like._id ?? ""}:${getLikeUserId(like.user)}`).sort();

  const aKeys = normalize(a);
  const bKeys = normalize(b);

  for (let i = 0; i < aKeys.length; i++) {
    if (aKeys[i] !== bKeys[i]) return false;
  }

  return true;
}

export default function PostModal({
  postId,
  onClose,
  initialLikes = [],

  onLikesChange,
  onCommentsChange,
}: Props) {
  const currentUser = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const { savedPosts, addSavedPost, removeSavedPost } = useSavedPostStore();
  const { isFollowing, followUser, unfollowUser } = useFollowStore();
  const [post, setPost] = useState<PostCardProps | null>(null);
  const [comment, setComment] = useState("");
  const [mounted, setMounted] = useState(false);
  const [localLikes, setLocalLikes] = useState<PostLike[]>(initialLikes);
  const [localComments, setLocalComments] = useState<Comment[]>([]);
  const [isPostLoading, setIsPostLoading] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [alreadyFollowing, setAlreadyFollowing] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const isSaved = hasAlreadySaved(savedPosts, postId);

  const [expanded, setExpanded] = useState(false);
  const [isLong, setIsLong] = useState(false);
  const [shortBio, setShortBio] = useState("");

  useEffect(() => {
    setLocalLikes((prev) =>
      areLikesEqual(prev, initialLikes) ? prev : initialLikes,
    );
  }, [initialLikes]);

  useEffect(() => {
    onCommentsChange?.(localComments);
  }, [localComments, onCommentsChange]);

  useEffect(() => {
    if (!onLikesChange) return;
    if (areLikesEqual(localLikes, initialLikes)) return;
    onLikesChange(localLikes);
  }, [initialLikes, localLikes, onLikesChange]);

  // ✅ Mount check for SSR safety
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Lock scroll
  useEffect(() => {
    if (!mounted) return;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mounted]);

  // ✅ Fetch post (unchanged)
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsPostLoading(true);
        const res = await API.get(`/posts/${postId}`);
        setPost(res.data.post);
        setIsLong(res.data.post.bio.length > 50);
        setShortBio(res.data.post.bio.slice(0, 50));

        const nextLikes = res.data.post?.likes || [];
        setLocalLikes(nextLikes);
        const nextComments = res.data.post?.comments || [];
        setLocalComments(nextComments);
        setAlreadyFollowing(isFollowing(res.data.post?.user?._id));
      } catch (err) {
        console.error(err);
        console.log("Failed to fetch post");
      } finally {
        setIsPostLoading(false);
      }
    };

    fetchPost();
  }, [postId, isFollowing]);

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInHours = Math.floor(
      (now.getTime() - past.getTime()) / (1000 * 60 * 60),
    );
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const formatLikes = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  const currentUserId = currentUser?._id;
  const isLiked = hasUserLiked(localLikes, currentUserId);
  // const alreadyFollowing = isFollowing(post.user._id);

  console.log(alreadyFollowing);

  const handleLike = async () => {
    if (!currentUserId || isLiking || !post) {
      return;
    }

    try {
      setIsLiking(true);
      const data = await toggleLikePost(postId);
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
        userId: post?.user?._id,
        username: currentUser?.username,
        action: message,
      });
    } catch (error) {
      console.log("Failed to toggle like", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async () => {
    const trimmedComment = comment.trim();

    if (!currentUserId || !post || isCommenting || !trimmedComment) {
      return;
    }

    try {
      setIsCommenting(true);

      const response = await API.post(`/posts/${postId}/comments`, {
        message: trimmedComment,
      });

      console.log("Comment response:", response.data);
      const returnedComment =
        response.data?.result?.comment ?? response.data?.comment;

      const commentToAdd: Comment = returnedComment
        ? {
            ...returnedComment,
            user: currentUser,
          }
        : {
            _id: `temp-${Date.now()}`,
            message: trimmedComment,
            user: currentUser || undefined,
          };

      setLocalComments((prev) => [commentToAdd, ...prev]);
      socket.emit("commentOnPost", {
        userId: post?.user?._id,
        username: currentUser?.username,
        message: trimmedComment,
      });
      setComment("");
    } catch (error) {
      console.log("Failed to comment", error);
    } finally {
      setIsCommenting(false);
    }
  };

  const handleBookmark = async () => {
    if (!currentUserId || !post) {
      return;
    }
    try {
      const data = await toggleSavePost(postId);
      // console.log(response);
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
        removeSavedPost(postId);
      }

      // console.log("savedPosts",savedPosts);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    try {
      const res = await API.delete(`/posts/${postId}/comments/${commentId}`);

      setLocalComments((prev) =>
        prev.filter((comment) => comment._id !== commentId),
      );

      console.log("Comment deleted:", res.data);
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const handleFollowUnfollow = async () => {
    const authorId = post?.user?._id;
    if (!authorId) return;

    try {
      const data = await toggleFollowUser(authorId);
      // console.log("after follow",res.data)
      const message = data?.message;

      if (message === "Followed successfully") {
        followUser({
          _id: authorId,
          name: post?.user?.name || "",
          username: post?.user?.username || "",
          profile_image: post?.user?.profile_image,
        });
        setAlreadyFollowing(true);
        if (!currentUser) return;

        setUser({
          ...currentUser,
          followings: (currentUser.followings || 0) + 1,
        });
      }

      if (message === "Unfollowed successfully") {
        unfollowUser(authorId);
        setAlreadyFollowing(false);
        if (!currentUser) return;

        setUser({
          ...currentUser,
          followings: (currentUser.followings || 0) - 1,
        });
      }
      socket.emit("followAndUnfollowUser", {
        userId: post?.user?._id,
        username: currentUser?.username,
        action: message,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // console.log("savedPost",savedPosts);
  // ❗ Prevent SSR crash
  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="
      bg-white 
      w-full 
      max-h-screen 
      sm:h-auto 
      sm:max-h-[90vh]
      sm:max-w-2xl 
      md:max-w-4xl 
      lg:max-w-5xl 
      rounded-none sm:rounded-3xl 
      overflow-hidden 
      flex flex-col md:flex-row 
      shadow-2xl relative
      transition-transform 
      transform 
      scale-100
      "
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white backdrop-blur sm:hidden"
        >
          <X size={18} />
        </button>
        {/* LEFT - IMAGE */}
        <div className="w-full md:w-1/2 h-[40vh] sm:h-[45vh] md:h-auto bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-3 sm:p-6 md:p-8">
          {isPostLoading || !post ? (
            <div className="animate-pulse w-full h-full bg-gray-300 rounded-2xl" />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={
                  post?.image ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=User${post._id}`
                }
                alt="post"
                width={400}
                height={400}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-lg"
              />
            </div>
          )}
        </div>

        {/* RIGHT - DETAILS */}
        <div className="w-full md:w-1/2 flex flex-col bg-white min-h-0">
          {isPostLoading || !post ? (
            <div className="flex items-center justify-center h-full p-4">
              <Loader2 className="w-8 h-8 animate-spin"/>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-2 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-full h-full rounded-full bg-white p-0.5">
                    {post.user?.profile_image ? (
                      <Image
                        src={post?.user.profile_image}
                        alt={post?.user.username || "profile"}
                        width={400}
                        height={400}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
                    )}
                  </div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">
                    {post.user?.username}
                  </p>
                </div>

                {currentUser?._id !== post?.user?._id && (
                  <button
                    className="rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold transition cursor-pointer bg-gradient-to-r from-primary to-primary-container text-white"
                    onClick={handleFollowUnfollow}
                  >
                    {alreadyFollowing ? "Following" : "Follow"}
                  </button>
                )}
              </div>

              {/* Caption */}
              <div className="p-3 s border-b border-gray-100">
                <p className=" text-sm leading-5 text-on-surface-variant">
                  {expanded || !isLong ? post?.bio : `${shortBio}... `}

                  {isLong && (
                    <span
                      onClick={() => setExpanded(!expanded)}
                      className="cursor-pointer  text-primary hover:underline"
                    >
                      {expanded ? " show less" : "read more"}
                    </span>
                  )}
                </p>
                {post?.tags && post?.tags.length > 0 && (
                  <div className=" flex flex-wrap gap-2">
                    {post?.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-sm font-medium text-primary   "
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Comments */}
              <div className="flex-1 max-h-32 overflow-y-auto p-3 sm:p-4 md:p-5 space-y-4 sm:space-y-5">
                {localComments?.length ? (
                  localComments.map((comment: Comment) => (
                    <div key={comment._id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-white p-0.5">
                        {comment.user?.profile_image ? (
                          <Image
                            src={comment.user.profile_image}
                            alt={comment.user.username}
                            width={400}
                            height={400}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-red-400" />
                        )}
                      </div>

                      <div className="flex-1 flex justify-between items-start ">
                        <div>
                          <p className="font-medium text-xs sm:text-sm">
                            {comment.user?.username}
                          </p>
                          <p className="text-gray-600 text-xs mt-0.5">
                            {comment.message || "No message"}
                          </p>
                        </div>

                        <div
                          className="cursor-pointer"
                          onClick={() => handleCommentDelete(comment._id)}
                        >
                          <EllipsisVertical className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 text-center py-8">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 p-3 sm:p-4 md:p-5">
                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-5 text-xs font-medium text-on-surface-variant mb-3 sm:mb-4">
                  <div className="flex items-center gap-2">
                    <Heart
                      className={`h-4 w-4 cursor-pointer ${
                        isLiked ? "fill-red-500 text-red-500" : ""
                      } ${isLiking ? "pointer-events-none opacity-70" : ""}`}
                      onClick={handleLike}
                    />
                    <span className="font-semibold text-gray-900">
                      {formatLikes(localLikes.length)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>{localComments?.length || 0}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{formatTimeAgo(post.createdAt)}</span>
                  </div>

                  <button className="ml-auto text-on-surface-variant">
                    <Bookmark
                      onClick={handleBookmark}
                      className={`h-4 w-4 cursor-pointer transition-transform duration-200 ease-out hover:scale-125 active:scale-95 ${
                        isSaved ? "fill-black text-black" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Input */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div>
                    {currentUser?.profile_image ? (
                      <Image
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                        src={
                          currentUser.profile_image ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`
                        }
                        alt="profile"
                        width={400}
                        height={400}
                      />
                    ) : (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-400" />
                    )}
                  </div>

                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 min-w-0 bg-gray-100 rounded-full px-4 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm outline-none focus:ring-1 focus:ring-primary transition"
                  />

                  <button
                    className={`min-w-[60px] sm:min-w-[68px] font-semibold text-xs sm:text-sm cursor-pointer transition hover:underline ${
                      isCommenting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    disabled={!comment.trim() || isCommenting || !post}
                    onClick={handleComment}
                  >
                    {isCommenting ? "Posting..." : "Post"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
