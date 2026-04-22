import axios from "axios";

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
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  try {
    const res = await axios.get(
      `${apiBaseUrl}/users/${userId}/saved-posts`,
      {
        withCredentials: true,
      }
    );

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