import { useQuery } from "@tanstack/react-query";
import http from "../libs/http.libs";
import { API_PATHS } from "../constants/api-path.constants";
import { QUERY_KEYS } from "../constants/query-key.constants";
import { useAuthStore } from "../store/auth.store";
import { usePublicStatistics } from "./use-public-statistics.hooks";

interface ProductStatistics {
  totalProducts: number;
  totalProductVariants: number;
  productsByStatus: { status: string; count: number }[];
  productsByCollection: { collectionName: string; count: number }[];
}

interface FeedbackStatistics {
  totalFeedbacks: number;
  averageRating: number;
  ratingDistribution: { rating: number; count: number }[];
}

interface PromotionStatistics {
  totalPromotions: number;
  activePromotions: number;
  expiredPromotions: number;
  totalUsage: number;
  averageDiscount: number;
}

interface UserStatistics {
  users: any[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Fetch users statistics
const fetchUsersStatistics = async (): Promise<UserStatistics> => {
  const response = await http.get(API_PATHS.USERS + "?limit=1&page=1");
  return response.data.data; // User API has format: { message, data: { users, pagination } }
};

// Fetch products statistics
const fetchProductsStatistics = async (): Promise<ProductStatistics> => {
  const response = await http.get(API_PATHS.PRODUCT_STATISTICS);
  return response.data.data || response.data; // Handle both response formats
};

// Fetch promotions statistics
const fetchPromotionsStatistics = async (): Promise<PromotionStatistics> => {
  const response = await http.get(API_PATHS.PROMOTION_STATISTICS);
  return response.data.data || response.data; // Handle both response formats
};

// Fetch feedbacks statistics
const fetchFeedbacksStatistics = async (): Promise<FeedbackStatistics> => {
  const response = await http.get(API_PATHS.FEEDBACK_STATISTICS);
  return response.data.data || response.data; // Handle both response formats
};

export const useUsersStatistics = (enabled: boolean = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS_STATISTICS, { enabled }],
    queryFn: fetchUsersStatistics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: enabled && typeof window !== "undefined", // Ensure client-side and enabled
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useProductsStatistics = (enabled: boolean = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT_STATISTICS, { enabled }],
    queryFn: fetchProductsStatistics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: enabled && typeof window !== "undefined",
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const usePromotionsStatistics = (enabled: boolean = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROMOTION_STATISTICS, { enabled }],
    queryFn: fetchPromotionsStatistics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: enabled && typeof window !== "undefined",
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useFeedbacksStatistics = (enabled: boolean = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.FEEDBACK_STATISTICS, { enabled }],
    queryFn: fetchFeedbacksStatistics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: enabled && typeof window !== "undefined",
    retry: false,
    refetchOnWindowFocus: false,
  });
};

// Combined hook for all dashboard statistics
export const useDashboardStatistics = () => {
  // Check if user is authenticated
  const { token } = useAuthStore();
  const isAuthenticated = !!token;

  // Fetch private stats if authenticated
  const usersQuery = useUsersStatistics(isAuthenticated);
  const productsQuery = useProductsStatistics(isAuthenticated);
  const promotionsQuery = usePromotionsStatistics(isAuthenticated);
  const feedbacksQuery = useFeedbacksStatistics(isAuthenticated);

  // Use public stats when not authenticated
  const publicStatsQuery = usePublicStatistics();

  // Use authenticated data if available, otherwise use public data
  const formattedData = isAuthenticated
    ? {
        users: usersQuery.data,
        products: productsQuery.data,
        promotions: promotionsQuery.data,
        feedbacks: feedbacksQuery.data,
      }
    : {
        users: {
          pagination: { total: publicStatsQuery.data?.users?.total || 0 },
        },
        products: {
          totalProducts: publicStatsQuery.data?.products?.total || 0,
          totalProductVariants: 0,
          productsByStatus: [],
          productsByCollection: [],
        },
        promotions: {
          totalPromotions: publicStatsQuery.data?.promotions?.total || 0,
          activePromotions: 0,
          expiredPromotions: 0,
          totalUsage: 0,
          averageDiscount: 0,
        },
        feedbacks: {
          totalFeedbacks: publicStatsQuery.data?.feedbacks?.total || 0,
          averageRating: publicStatsQuery.data?.feedbacks?.averageRating || 0,
          ratingDistribution: [],
        },
      };

  const isLoading = isAuthenticated
    ? usersQuery.isLoading ||
      productsQuery.isLoading ||
      promotionsQuery.isLoading ||
      feedbacksQuery.isLoading
    : publicStatsQuery.isLoading;

  const isError = isAuthenticated
    ? usersQuery.isError ||
      productsQuery.isError ||
      promotionsQuery.isError ||
      feedbacksQuery.isError
    : publicStatsQuery.isError;

  const error = isAuthenticated
    ? usersQuery.error ||
      productsQuery.error ||
      promotionsQuery.error ||
      feedbacksQuery.error
    : publicStatsQuery.error;

  return {
    data: formattedData,
    isLoading,
    isError,
    error,
    isAuthenticated,
    refetch: () => {
      if (isAuthenticated) {
        usersQuery.refetch();
        productsQuery.refetch();
        promotionsQuery.refetch();
        feedbacksQuery.refetch();
      } else {
        publicStatsQuery.refetch();
      }
    },
  };
};
