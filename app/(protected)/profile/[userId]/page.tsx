import ProfileClient from "@/components/profile/profileClient";
import ProfileTabs from "@/components/profile/profileTabs";
import axios from "axios";
import { cookies } from "next/headers";



async function getUser(userId: string) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value;
 
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8000/api/v1";
  
  if (!jwt || !apiBaseUrl) {
    return null;
  }
  try {
    const res = await axios.get(`${apiBaseUrl}/users/${userId}`, {
      headers: {
        Accept: "application/json",
        Cookie: cookieStore.toString(),
      },
      withCredentials: true,
    });
  
    return res.data.user;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user = await getUser(userId);

  if (!user) return <p>User not found</p>;

  return (
    <section className="space-y-6 px-2 py-4 ">
      {/* <ProfileHeader
        name={user.name}
        username={user.username}
        bio={user.bio}
        profileImage={user.profile_image}
        coverImage={user.cover_image}
        followers={user.followersCount || 0}
        following={user.followingCount || 0}
        posts={user.postsCount || 0}
      /> */}
      <ProfileClient user={user} />

      <ProfileTabs userId={userId} />
    </section>
  );
}
