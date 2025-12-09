import type { AxiosRequestConfig } from "axios";
import http from "../libs/http.libs";

/**
 * HTTP utility wrapper that adds mutation headers to prevent duplicate error toasts
 */
export class HttpUtils {
  /**
   * Make a mutation request (POST/PUT/PATCH/DELETE) with mutation header
   * This prevents global error handler from showing duplicate toasts
   */
  static mutationRequest = {
    post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
      return http.post<T>(url, data, {
        ...config,
        headers: {
          ...config?.headers,
          "X-Mutation-Request": "true",
        },
      });
    },

    put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
      return http.put<T>(url, data, {
        ...config,
        headers: {
          ...config?.headers,
          "X-Mutation-Request": "true",
        },
      });
    },

    patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
      return http.patch<T>(url, data, {
        ...config,
        headers: {
          ...config?.headers,
          "X-Mutation-Request": "true",
        },
      });
    },

    delete: <T>(url: string, config?: AxiosRequestConfig) => {
      return http.delete<T>(url, {
        ...config,
        headers: {
          ...config?.headers,
          "X-Mutation-Request": "true",
        },
      });
    },
  };

  /**
   * Make a regular query request (GET) without mutation header
   * This allows global error handler to show error toasts for failed queries
   */
  static queryRequest = {
    get: <T>(url: string, config?: AxiosRequestConfig) => {
      return http.get<T>(url, config);
    },
  };
}

/**
 * Convenient exports for direct use
 */
export const mutationHttp = HttpUtils.mutationRequest;
export const queryHttp = HttpUtils.queryRequest;
