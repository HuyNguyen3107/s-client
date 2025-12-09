import type { IProductVariantStatsHook } from "../types";
import { useProductVariantStatistics } from "../queries";

/**
 * Custom hook for managing product variant statistics
 * Following Single Responsibility Principle
 */
export const useProductVariantStats = (
  productId?: string
): IProductVariantStatsHook => {
  const { data, isLoading, error, refetch } =
    useProductVariantStatistics(productId);

  return {
    statistics: data || null,
    isLoading,
    error,
    refetch,
  };
};
