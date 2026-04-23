import axios from "axios";
import {
  clearAuthSession,
  persistAuthTokens,
  readAccessToken,
  readRefreshToken,
} from "@/lib/auth-state";

type RetriableRequestConfig = {
  _retry?: boolean;
  headers?: Record<string, string>;
};

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  
});

/* ✅ REQUEST INTERCEPTOR (attach accessToken) */
API.interceptors.request.use((config) => {
  const token = readAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

 
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/users/refresh-token`, {
        refreshToken: readRefreshToken(),
      })
      .then((res) => {
        const nextAccessToken = res.data.accessToken as string | undefined;
        const nextRefreshToken = res.data.refreshToken as string | undefined;

        if (!nextAccessToken) {
          throw new Error("Missing access token in refresh response");
        }

        persistAuthTokens(nextAccessToken, nextRefreshToken);
        return nextAccessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

/* ✅ RESPONSE INTERCEPTOR (refresh token logic) */
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      typeof window !== "undefined"
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        if (!newAccessToken) {
          clearAuthSession({ redirectToLogin: true });
          return Promise.reject(error);
        }

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };
        return API(originalRequest);
      } catch {
        clearAuthSession({ redirectToLogin: true });
      }
    }

    return Promise.reject(error);
  }
);

export default API;
