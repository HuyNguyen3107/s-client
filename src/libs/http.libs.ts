import axios from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "../store/auth.store";
import { useToastStore } from "../store/toast.store";
import { ErrorUtils } from "../utils/error-handler.utils";
import { ROUTE_PATH } from "../constants/route-path.constants";
import { API_PATHS } from "../constants/api-path.constants";

const API_URL = import.meta.env.VITE_API_URL;

const http = axios.create({
  baseURL: API_URL || "http://localhost:3000",
});

export const rawHttp: AxiosInstance = axios.create({
  baseURL: API_URL || "http://localhost:3000",
  timeout: 30000,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor - Add token to headers
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { token } = useAuthStore.getState();

    if (token) {
      config.headers = (config.headers || {}) as AxiosRequestHeaders;
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle token refresh and show error notifications
http.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    const statusCode = error?.response?.status;

    // Don't show toast for mutations (they handle their own error messages)
    const isMutationRequest = originalRequest?.headers?.["X-Mutation-Request"];

    // If 401 and not already retrying and not a refresh request
    if (
      statusCode === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== API_PATHS.REFRESH
    ) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const {
        refreshToken,
        setToken,
        setRefreshToken,
        setUser,
        setTokenExpires,
        clearToken,
      } = useAuthStore.getState();

      if (!refreshToken) {
        // No refresh token, clear auth and redirect
        clearToken();

        // Show error message for auth failure
        if (!isMutationRequest) {
          const { showToast } = useToastStore.getState();
          showToast(
            "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!",
            "error"
          );
        }

        return Promise.reject(error);
      }

      try {
        // Call refresh token API directly using rawHttp to avoid circular dependency
        const refreshResponse = await rawHttp.post(API_PATHS.REFRESH, {
          refreshToken: refreshToken,
        });

        const {
          accessToken,
          refreshToken: newRefreshToken,
          expiresAt,
          user,
        } = refreshResponse.data;

        // Update store with new tokens
        setToken(accessToken);
        setRefreshToken(newRefreshToken);
        setTokenExpires(expiresAt);
        setUser(user);

        // Process queued requests with new token
        processQueue(null, accessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear auth and redirect
        processQueue(refreshError, null);
        clearToken();

        // Show error message for refresh failure
        if (!isMutationRequest) {
          const { showToast } = useToastStore.getState();
          showToast(
            "Không thể làm mới phiên đăng nhập. Vui lòng đăng nhập lại!",
            "error"
          );
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Show error notifications for non-mutation requests
    if (!isMutationRequest && statusCode && statusCode >= 400) {
      const { showToast } = useToastStore.getState();

      // Don't show toast for certain status codes that are handled elsewhere
      if (statusCode !== 401 && statusCode !== 403) {
        const errorMessage = ErrorUtils.getApiErrorMessage(error);
        showToast(errorMessage, "error");
      }
    }

    // For other errors, just return the original error
    return Promise.reject(error);
  }
);

export default http;
