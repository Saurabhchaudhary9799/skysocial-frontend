import { useUserStore, type User } from "@/store/useUserStore";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export function readAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function readRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function persistAuthTokens(accessToken?: string, refreshToken?: string) {
  if (typeof window === "undefined") return;

  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function markAuthResolved() {
  useUserStore.getState().setLoaded(true);
}

export function setAuthenticatedUser(user: User) {
  useUserStore.getState().setUser(user);
}

export function clearAuthSession(options?: { redirectToLogin?: boolean }) {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  useUserStore.getState().clearUser();

  if (
    options?.redirectToLogin &&
    typeof window !== "undefined" &&
    window.location.pathname !== "/login"
  ) {
    window.location.assign("/login");
  }
}
