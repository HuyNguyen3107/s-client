import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import type {
  ProductVariantListResponse,
  ProductVariantWithProduct,
  ProductVariantQueryParams,
  ProductVariantStatistics,
} from "../types";
import { productVariantService } from "../services";
import { PRODUCT_VARIANT_CONSTANTS } from "../constants";

/**
 * Hook for fetching paginated product variants list
 * Following Single Responsibility Principle
 */
export const useProductVariantsQuery = (
  params?: ProductVariantQueryParams
): UseQueryResult<ProductVariantListResponse, Error> => {
  return useQuery({
    queryKey: PRODUCT_VARIANT_CONSTANTS.QUERY_KEYS.LIST(params),
    queryFn: () => productVariantService.getProductVariants(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
  });
};

/**
 * Hook for fetching single product variant by ID
 */
export const useProductVariantQuery = (
  id: string,
  enabled: boolean = true
): UseQueryResult<ProductVariantWithProduct, Error> => {
  return useQuery({
    queryKey: PRODUCT_VARIANT_CONSTANTS.QUERY_KEYS.DETAIL(id),
    queryFn: () => productVariantService.getProductVariantById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook for fetching variants by product ID
 */
export const useProductVariantsByProductQuery = (
  productId: string,
  enabled: boolean = true
): UseQueryResult<ProductVariantWithProduct[], Error> => {
  return useQuery({
    queryKey: PRODUCT_VARIANT_CONSTANTS.QUERY_KEYS.BY_PRODUCT(productId),
    queryFn: () => productVariantService.getProductVariantsByProduct(productId),
    enabled: enabled && !!productId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook for fetching product variant statistics
 */
export const useProductVariantStatisticsQuery = (
  productId?: string
): UseQueryResult<ProductVariantStatistics, Error> => {
  return useQuery({
    queryKey: productId
      ? PRODUCT_VARIANT_CONSTANTS.QUERY_KEYS.STATISTICS_BY_PRODUCT(productId)
      : PRODUCT_VARIANT_CONSTANTS.QUERY_KEYS.STATISTICS,
    queryFn: () => productVariantService.getStatistics(productId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Convenience exports for common usage patterns
export const useProductVariants = useProductVariantsQuery;
export const useProductVariantById = useProductVariantQuery;
export const useProductVariantsByProduct = useProductVariantsByProductQuery;
export const useProductVariantStatistics = useProductVariantStatisticsQuery;
