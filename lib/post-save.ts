import axios from "axios";
import API from "./axios";

export type SavedPost = {
  _id: string;
  user: string;
  post: {
    _id:string;
  };
};

export const hasAlreadySaved = (
  savedPosts: SavedPost[],
  postId: string
) => {
  return savedPosts.some((item) => item.post?._id === postId);
};

export const getSavedPostByUser = async (userId: string) => {

  try {
    const res = await API.get(`/users/${userId}/saved-posts`);
    return res.data.result; // 👈 already array
  } catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    console.error("API ERROR:", error.response?.data || error.message);
  } else if (error instanceof Error) {
    console.error("API ERROR:", error.message);
  } else {
    console.error("API ERROR:", error);
  }
}
};