import "server-only";

import axios from "axios";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type CurrentUser = {
  id: string;
  _id: string;
  name: string;
  username: string;
  email: string;
  profile_image: string | null;
  cover_image: string | null;
  bio: string;
  raw: Record<string, unknown>;
};

function getString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function getOptionalString(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function normalizeUser(payload: unknown): CurrentUser | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const raw = payload as Record<string, unknown>;
  const _id = getOptionalString(raw._id);
  const name = getString(raw.name);
  const username = getString(raw.username);
  const email = getString(raw.email);

  if (!_id || !name || !username || !email) {
    return null;
  }

  return {
    id: _id,
    _id,
    name,
    username,
    email,
    profile_image: getOptionalString(raw.profile_image),
    cover_image: getOptionalString(raw.cover_image),
    bio: getString(raw.bio),
    raw,
  };
}

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value;
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8000/api/v1";

  if (!jwt || !apiBaseUrl) {
    return null;
  }

  try {
    const response = await axios.get(`${apiBaseUrl}/users/me`, {
      headers: {
        Accept: "application/json",
        Cookie: cookieStore.toString(),
      },
      withCredentials: true,
    });
    
    return normalizeUser(response?.data?.result?.user);
  } catch {
    return null;
  }
});

export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
