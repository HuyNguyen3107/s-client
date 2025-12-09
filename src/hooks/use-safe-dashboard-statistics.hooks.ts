import { useAuthStore } from "../store/auth.store";
import { usePublicStatistics } from "./use-public-statistics.hooks";
import {
  useUsersStatistics,
  useProductsStatistics,
  usePromotionsStatistics,
  useFeedbacksStatistics,
} from "./use-dashboard-statistics.hooks";

// Safe dashboard hook that handles authentication properly
export const useSafeDashboardStatistics = () => {
  const { token } = useAuthStore();
  const isAuthenticated = !!token;

  // Always fetch public stats (no auth required)
  const publicStatsQuery = usePublicStatistics();

  // Only fetch private stats if authenticated
  const privateStatsEnabled = isAuthenticated && typeof window !== "undefined";

  const usersQuery = useUsersStatistics(privateStatsEnabled);
  const productsQuery = useProductsStatistics(privateStatsEnabled);
  const promotionsQuery = usePromotionsStatistics(privateStatsEnabled);
  const feedbacksQuery = useFeedbacksStatistics(privateStatsEnabled);

  // Determine what data to return
  const data = isAuthenticated
    ? {
        // Use private data if authenticated and available
        users: usersQuery.data || { pagination: { totalItems: 0 } },
        products: productsQuery.data || {
          totalProducts: publicStatsQuery.data?.products?.total || 0,
          totalProductVariants: 0,
          productsByStatus: [],
          productsByCollection: [],
        },
        promotions: promotionsQuery.data || {
          totalPromotions: publicStatsQuery.data?.promotions?.total || 0,
          activePromotions: 0,
          expiredPromotions: 0,
          totalUsage: 0,
          averageDiscount: 0,
        },
        feedbacks: feedbacksQuery.data || {
          totalFeedbacks: publicStatsQuery.data?.feedbacks?.total || 0,
          averageRating: publicStatsQuery.data?.feedbacks?.averageRating || 0,
          ratingDistribution: [],
        },
      }
    : {
        // Use public data if not authenticated
        users: { pagination: { totalItems: 0 } }, // Hide user count for security
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

  const isLoading =
    publicStatsQuery.isLoading ||
    (isAuthenticated &&
      (usersQuery.isLoading ||
        productsQuery.isLoading ||
        promotionsQuery.isLoading ||
        feedbacksQuery.isLoading));

  const isError =
    publicStatsQuery.isError ||
    (isAuthenticated &&
      (usersQuery.isError ||
        productsQuery.isError ||
        promotionsQuery.isError ||
        feedbacksQuery.isError));

  return {
    data,
    isLoading,
    isError,
    isAuthenticated,
    error:
      publicStatsQuery.error ||
      (isAuthenticated &&
        (usersQuery.error ||
          productsQuery.error ||
          promotionsQuery.error ||
          feedbacksQuery.error)),
    refetch: () => {
      publicStatsQuery.refetch();
      if (isAuthenticated) {
        usersQuery.refetch();
        productsQuery.refetch();
        promotionsQuery.refetch();
        feedbacksQuery.refetch();
      }
    },
  };
};
