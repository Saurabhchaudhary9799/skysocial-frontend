"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { Bookmark, Clock, EllipsisVertical, Heart, MessageCircle } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import {
  addLikeIfMissing,
  getLikeUserId,
  hasUserLiked,
  removeUserLike,
  type PostLike,
} from "@/lib/post-likes";
import { useSavedPostStore } from "@/store/useSavedPostStore";
import { hasAlreadySaved, SavedPost } from "@/lib/post-save";
import { toast } from "sonner";
import { useFollowStore } from "@/store/useFollowStore";

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
    likes
      .map((like) => `${like._id ?? ""}:${getLikeUserId(like.user)}`)
      .sort();

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
  const setUser = useUserStore((state)=>state.setUser);
  const { savedPosts, setSavedPosts, addSavedPost, removeSavedPost } =
    useSavedPostStore();
  const { isFollowing, followUser, unfollowUser, fetchFollowings } =
    useFollowStore();
  const [post, setPost] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [mounted, setMounted] = useState(false);
  const [localLikes, setLocalLikes] = useState<PostLike[]>(initialLikes);
  const [localComments, setLocalComments] = useState<Comment[]>([]);
  const [isPostLoading, setIsPostLoading] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [alreadyFollowing, setAlreadyFollowing] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const isSaved = hasAlreadySaved(savedPosts, postId);
  useEffect(() => {
    setLocalLikes((prev) => (areLikesEqual(prev, initialLikes) ? prev : initialLikes));
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
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`,
          { withCredentials: true }
        );
        setPost(res.data.post);
        const nextLikes = res.data.post?.likes || [];
        setLocalLikes(nextLikes);
        const nextComments = res.data.post?.comments || [];
        setLocalComments(nextComments);
        setAlreadyFollowing(isFollowing(res.data.post?.user?._id));
      } catch (err) {
        console.log("Failed to fetch post");
      } finally {
        setIsPostLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInHours = Math.floor(
      (now.getTime() - past.getTime()) / (1000 * 60 * 60)
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
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/like`,
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

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/comments`,
        { message: trimmedComment },
        { withCredentials: true }
      );

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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/save`, {}, { withCredentials: true })
      // console.log(response);
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
        removeSavedPost(postId);
      }

      // console.log("savedPosts",savedPosts);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/comments/${commentId}`, {
        withCredentials: true
      })

      setLocalComments((prev) =>
        prev.filter((comment) => comment._id !== commentId)
      );

      console.log("Comment deleted:", res.data);
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error(error)
    }
  }

  const handleFollowUnfollow = async () => {
    const authorId = post?.user?._id;
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
    } catch (err) {
      console.error(err);
    }
  };

  // console.log("savedPost",savedPosts);
  // ❗ Prevent SSR crash
  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white w-[95%] max-w-5xl rounded-3xl overflow-hidden flex shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* LEFT - IMAGE */}
        <div className="w-1/2 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-8">
          {isPostLoading || !post ? (
            <div className="animate-pulse w-full h-[500px] bg-gray-300 rounded-2xl" />
          ) : (
            <div className="relative w-full h-[500px] flex items-center justify-center">
              <img
                src={post.image}
                alt="post"
                className="max-w-full max-h-full object-contain rounded-2xl shadow-lg"
              />
            </div>
          )}
        </div>

        {/* RIGHT - DETAILS */}
        <div className="w-1/2 flex flex-col bg-white">
          {isPostLoading || !post ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-white p-0.5">
                      {post.user?.profile_image ? (
                        <img
                          src={post.user.profile_image}
                          alt={post.user.username}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {post.user?.username}
                    </p>
                  </div>
                </div>

                {currentUser?._id !== post?.user?._id && (
                  <button
                    className={`rounded-full px-4 py-1 text-sm font-semibold transition cursor-pointer bg-gradient-to-r from-primary to-primary-container text-white
     
    `}
                    onClick={handleFollowUnfollow}
                  >
                    {alreadyFollowing ? "Following" : "Follow"}
                  </button>
                )}
              </div>

              {/* Caption */}
              <div className="p-5 border-b border-gray-100">
                <p className="text-gray-800 leading-relaxed">
                  {post.bio}
                  {post.tags?.length > 0 && (
                    <span className="ml-2">
                      {post.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="text-primary font-medium mr-1 hover:underline cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </span>
                  )}
                </p>
              </div>

              {/* Comments */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5 max-h-[280px]">
                {localComments?.length ? (
                  localComments.map((comment: Comment) => (
                    <div key={comment._id} className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0 p-0.5">
                        <div className="w-full h-full rounded-full bg-white p-0.5">
                          {comment.user?.profile_image ? (
                            <img
                              src={comment.user.profile_image}
                              alt={comment.user.username}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-red-400" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 flex justify-between items-start bg-surface-container p-4 rounded-bl-4xl rounded-r-4xl">
                        <div>
                          <p className="font-medium text-sm">
                            {comment.user?.username}
                          </p>
                          <p className="text-gray-600 text-xs mt-0.5 ">
                            {comment.message || "No message"}
                          </p>
                        </div>
                        <div className="cursor-pointer " onClick={() => handleCommentDelete(comment._id)}>
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
              <div className="border-t border-gray-100 p-5">
                <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-on-surface-variant mb-4">
                  <div className="flex items-center gap-2">
                    <Heart
                      className={`h-4 w-4 cursor-pointer ${isLiked ? "fill-red-500 text-red-500" : ""
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
                    <Bookmark onClick={handleBookmark}
                      className={`h-4 w-4 cursor-pointer transition-transform duration-200 ease-out hover:scale-125 active:scale-95 ${isSaved ? "fill-black text-black" : ""
                        }`}
                    />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400" />
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-gray-100 rounded-full px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-200"
                  />
                  <button
                    className={`min-w-[68px] font-semibold text-sm cursor-pointer transition-transform duration-200 ease-out hover:scale-125 active:scale-95 ${isCommenting ? "opacity-70 cursor-not-allowed" : ""}`}
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
    document.body
  );
}