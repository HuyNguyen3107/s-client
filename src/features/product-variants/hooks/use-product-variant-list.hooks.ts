import { useState, useCallback, useMemo } from "react";
import type {
  IProductVariantListHook,
  ProductVariantQueryParams,
} from "../types";
import { useProductVariantsQuery } from "../queries";
import { DEFAULT_PRODUCT_VARIANT_PARAMS } from "../constants";

/**
 * Custom hook for managing product variant list
 * Following Single Responsibility Principle and Open/Closed Principle
 */
export const useProductVariantList = (
  initialParams?: Partial<ProductVariantQueryParams>
): IProductVariantListHook => {
  // Merge initial params with defaults - only set once
  const [params, setParams] = useState<ProductVariantQueryParams>(() => ({
    ...DEFAULT_PRODUCT_VARIANT_PARAMS,
    ...initialParams,
  }));

  // Fetch data using React Query
  const { data, isLoading, error, refetch } = useProductVariantsQuery(params);

  // Update params function
  const updateParams = useCallback(
    (newParams: Partial<ProductVariantQueryParams>) => {
      setParams((current) => ({
        ...current,
        ...newParams,
        // Reset page to 1 when changing filters
        page: newParams.page !== undefined ? newParams.page : 1,
      }));
    },
    []
  );

  // Memoized return values for performance
  const memoizedResult = useMemo(
    () => ({
      variants: data?.data || [],
      meta: data?.meta || {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      },
      isLoading,
      error,
      refetch,
      updateParams,
    }),
    [data, isLoading, error, refetch, updateParams]
  );

  return memoizedResult;
};
