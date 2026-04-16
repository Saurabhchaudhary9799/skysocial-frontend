export type LikeUserValue =
  | string
  | {
      _id?: string;
      id?: string;
    }
  | null
  | undefined;

export type PostLike = {
  _id?: string;
  user?: LikeUserValue;
};

export function getLikeUserId(user: LikeUserValue) {
  if (typeof user === "string") {
    return user;
  }

  if (user && typeof user === "object") {
    return user._id || user.id || "";
  }

  return "";
}

export function hasUserLiked(likes: PostLike[], userId?: string | null) {
  if (!userId) {
    return false;
  }

  return likes.some((like) => getLikeUserId(like.user) === userId);
}

export function addLikeIfMissing(
  likes: PostLike[],
  userId: string,
  nextLike?: PostLike,
) {
  if (hasUserLiked(likes, userId)) {
    return likes;
  }

  return [...likes, nextLike ?? { user: userId }];
}

export function removeUserLike(likes: PostLike[], userId: string) {
  return likes.filter((like) => getLikeUserId(like.user) !== userId);
}
