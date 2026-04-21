import { PostLike } from "./post-likes";

export type PostUser = {
  _id?: string;
  id?: string;
  name?: string;
  username?: string;
  profile_image?: string | null;
};

export type PostCommentUser = {
  id?: string;
  username?: string;
  profile_image?: string | null;
};

export type PostComment = {
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

