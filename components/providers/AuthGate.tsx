"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

type AuthGateMode = "guest" | "protected";

type Props = {
  children: React.ReactNode;
  mode: AuthGateMode;
  redirectTo: string;
};

export default function AuthGate({ children, mode, redirectTo }: Props) {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const isLoaded = useUserStore((state) => state.isLoaded);

  const isAllowed =
    mode === "protected" ? Boolean(user) : isLoaded && user === null;

  useEffect(() => {
    if (!isLoaded || isAllowed) return;
    router.replace(redirectTo);
  }, [isAllowed, isLoaded, redirectTo, router]);

  if (!isLoaded || !isAllowed) {
    return null;
  }

  return <>{children}</>;
}
