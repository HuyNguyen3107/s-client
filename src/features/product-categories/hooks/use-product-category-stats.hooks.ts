import { useCallback, useMemo } from "react";
import type { IProductCategoryStatsHook } from "../types";
import { useProductCategoryStatisticsQuery } from "../queries";

/**
 * Custom hook for managing product category statistics
 * Following Single Responsibility Principle
 */
export const useProductCategoryStats = (
  enabled: boolean = true
): IProductCategoryStatsHook => {
  // Fetch statistics using React Query
  const {
    data: statistics,
    isLoading,
    error,
    refetch,
  } = useProductCategoryStatisticsQuery(enabled);

  // Refresh function
  const refresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Memoized return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      statistics,
      isLoading,
      error,
      refresh,
    }),
    [statistics, isLoading, error, refresh]
  );
};
