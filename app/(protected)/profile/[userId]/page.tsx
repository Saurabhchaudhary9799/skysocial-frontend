"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import API from "@/lib/axios";
import type { User } from "@/store/useUserStore";
import ProfileSkeleton from "@/components/skeleton/profileHeaderSkeleton";
import ProfilePostSkeleton from "@/components/skeleton/profilePostSkeleton";

// ✅ Lazy load components
const ProfileClient = dynamic(
  () => import("@/components/profile/profileClient"),
  {
    loading: () => <ProfileSkeleton />,
  }
);

const ProfileTabs = dynamic(
  () => import("@/components/profile/profileTabs"),
  {
    loading: () => <ProfilePostSkeleton />, // 👈 posts skeleton
  }
);

export default function Page() {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const res = await API.get(`/users/${userId}`);
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  // ✅ Profile skeleton
  if (loading) return <ProfileSkeleton />;
  if (!user) return <p>User not found</p>;

  return (
    <section className="space-y-6 p-2 md:p-4">
      <ProfileClient user={user} />
      <ProfileTabs userId={userId as string} />
    </section>
  );
}