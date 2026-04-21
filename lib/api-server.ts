
import axios from "axios";
import { cookies } from "next/headers";

export default async function getHomeFeed(): Promise<any[]> {
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt")?.value;

    if (!jwt) return [];

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_URL?.trim() ||
      "http://localhost:8000/api/v1";

    const res = await axios.get(`${apiBaseUrl}/posts/home-feed`, {
      headers: {
        Accept: "application/json",
        Cookie: cookieStore.toString(),
      },
      withCredentials: true,
    });

    return res?.data?.result?.posts ?? [];
  } catch (error) {
    console.error("Home feed error:", error);
    return [];
  }
}