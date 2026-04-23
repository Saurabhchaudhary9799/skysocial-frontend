import API from "@/lib/axios";
import { persistAuthTokens, setAuthenticatedUser } from "@/lib/auth-state";
import type { User } from "@/store/useUserStore";

type AuthResponse = {
  accessToken?: string;
  refreshToken?: string;
  user?: User;
};

export async function fetchCurrentUser() {
  const res = await API.get("/users/me");
  return res.data.user as User;
}

export async function initializeSession(authResponse: AuthResponse) {
  persistAuthTokens(authResponse.accessToken, authResponse.refreshToken);

  const user = authResponse.user ?? (await fetchCurrentUser());
  setAuthenticatedUser(user);

  return user;
}
