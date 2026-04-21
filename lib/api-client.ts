import axios from "axios";


const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const toggleLikePost = async (postId: string) => {
  const res = await API.post(`/posts/${postId}/like`);
  return res.data;
};

export const toggleSavePost = async (postId: string) => {
  const res = await API.post(`/posts/${postId}/save`);
  return res.data;
};



// Get saved posts
export const fetchSavedPosts = async (userId: string) => {
  const res = await API.get(`/posts/saved/${userId}`);
  return res.data;
};

export const toggleFollowUser = async (userId: string) => {
  const res = await API.post(`/users/${userId}/follower`);
  return res.data;
};