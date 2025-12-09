import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import type {
  ProductCategoryListResponse,
  ProductCategoryWithRelations,
  ProductCategoryQueryParams,
  ProductCategoryStatistics,
} from "../types";
import { productCategoryService } from "../services";
import { PRODUCT_CATEGORY_CONSTANTS } from "../constants";

/**
 * Hook for fetching paginated product categories list
 * Following Single Responsibility Principle
 */
export const useProductCategoriesQuery = (
  params?: ProductCategoryQueryParams
): UseQueryResult<ProductCategoryListResponse, Error> => {
  return useQuery({
    queryKey: PRODUCT_CATEGORY_CONSTANTS.QUERY_KEYS.LIST(params),
    queryFn: () => productCategoryService.getProductCategories(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
  });
};

/**
 * Hook for fetching single product category by ID
 */
export const useProductCategoryQuery = (
  id: string,
  enabled: boolean = true
): UseQueryResult<ProductCategoryWithRelations, Error> => {
  return useQuery({
    queryKey: PRODUCT_CATEGORY_CONSTANTS.QUERY_KEYS.DETAIL(id),
    queryFn: () => productCategoryService.getProductCategoryById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook for fetching categories by product ID
 */
export const useProductCategoriesByProductQuery = (
  productId: string,
  enabled: boolean = true
): UseQueryResult<ProductCategoryWithRelations[], Error> => {
  return useQuery({
    queryKey: PRODUCT_CATEGORY_CONSTANTS.QUERY_KEYS.BY_PRODUCT(productId),
    queryFn: () =>
      productCategoryService.getProductCategoriesByProduct(productId),
    enabled: enabled && !!productId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook for fetching product category statistics
 */
export const useProductCategoryStatisticsQuery = (
  enabled: boolean = true
): UseQueryResult<ProductCategoryStatistics, Error> => {
  return useQuery({
    queryKey: PRODUCT_CATEGORY_CONSTANTS.QUERY_KEYS.STATISTICS,
    queryFn: () => productCategoryService.getStatistics(),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes for stats
    gcTime: 5 * 60 * 1000,
  });
};
