"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";

export default function Page() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const isLoaded = useUserStore((state) => state.isLoaded);

  useEffect(() => {
    if (!isLoaded) return;
    router.replace(user ? "/home" : "/login");
  }, [isLoaded, router, user]);

  return null;
}
