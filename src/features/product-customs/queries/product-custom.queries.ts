import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../constants/query-key.constants";
import {
  getProductCustoms,
  getProductCustomById,
  getProductCustomsByCategory,
  getProductCustomStatistics,
} from "../services";
import type {
  ProductCustomQueryParams,
  ProductCustomListResponse,
  ProductCustomWithRelations,
  ProductCustomStatistics,
} from "../types";

/**
 * React Query hooks for product customs following Single Responsibility Principle
 */

/**
 * Hook to fetch paginated product customs with optional filtering
 * @param params - Query parameters
 * @returns Query result with product customs data
 */
export const useProductCustomsQuery = (params?: ProductCustomQueryParams) => {
  return useQuery<ProductCustomListResponse, Error>({
    queryKey: [QUERY_KEYS.PRODUCT_CUSTOMS, params],
    queryFn: () => getProductCustoms(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

/**
 * Hook to fetch single product custom by ID
 * @param id - Product custom ID
 * @param enabled - Whether query should be enabled
 * @returns Query result with product custom data
 */
export const useProductCustomQuery = (id: string, enabled: boolean = true) => {
  return useQuery<ProductCustomWithRelations, Error>({
    queryKey: [QUERY_KEYS.PRODUCT_CUSTOM_BY_ID, id],
    queryFn: () => getProductCustomById(id),
    enabled: Boolean(id) && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

/**
 * Hook to fetch product customs by category ID
 * @param categoryId - Product category ID
 * @param enabled - Whether query should be enabled
 * @returns Query result with product customs data
 */
export const useProductCustomsByCategoryQuery = (
  categoryId: string,
  enabled: boolean = true
) => {
  return useQuery<ProductCustomWithRelations[], Error>({
    queryKey: [QUERY_KEYS.PRODUCT_CUSTOMS_BY_CATEGORY, categoryId],
    queryFn: () => getProductCustomsByCategory(categoryId),
    enabled: Boolean(categoryId) && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

/**
 * Hook to fetch product customs statistics
 * @param enabled - Whether query should be enabled
 * @returns Query result with statistics data
 */
export const useProductCustomStatisticsQuery = (enabled: boolean = true) => {
  return useQuery<ProductCustomStatistics, Error>({
    queryKey: [QUERY_KEYS.PRODUCT_CUSTOM_STATISTICS],
    queryFn: getProductCustomStatistics,
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

/**
 * Hook to prefetch product custom by ID for better UX
 * @param id - Product custom ID to prefetch
 */
export const usePrefetchProductCustom = () => {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.PRODUCT_CUSTOM_BY_ID, id],
      queryFn: () => getProductCustomById(id),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };
};
