"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";

export default function UserHydrator({ user }: { user: any }) {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (user) setUser(user);
  }, [user, setUser]);

  return null;
}