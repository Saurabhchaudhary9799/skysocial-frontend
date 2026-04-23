"use client";

import { useEffect } from "react";
import { fetchCurrentUser } from "@/lib/auth-client";
import {
  clearAuthSession,
  markAuthResolved,
  setAuthenticatedUser,
  readAccessToken,
} from "@/lib/auth-state";

export default function AuthInitializer() {
  useEffect(() => {
    let isMounted = true;
    const token = readAccessToken();

    if (!token) {
      markAuthResolved();
      return;
    }

    const fetchUser = async () => {
      try {
        const user = await fetchCurrentUser();
        if (!isMounted) return;
        setAuthenticatedUser(user);
      } catch {
        if (!isMounted) return;
        clearAuthSession();
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return null;
}
