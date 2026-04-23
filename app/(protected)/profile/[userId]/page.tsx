"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProfileClient from "@/components/profile/profileClient";
import ProfileTabs from "@/components/profile/profileTabs";
import API from "@/lib/axios";
import type { User } from "@/store/useUserStore";

export default function Page() {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    if (userId) fetchUser();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <section className="space-y-6 px-2 py-4">
      <ProfileClient user={user} />
      <ProfileTabs userId={userId as string} />
    </section>
  );
}
