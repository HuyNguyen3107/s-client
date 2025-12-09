import { useState, useCallback, useMemo } from "react";
import type {
  IProductCategoryListHook,
  ProductCategoryQueryParams,
} from "../types";
import { useProductCategoriesQuery } from "../queries";
import { DEFAULT_PRODUCT_CATEGORY_PARAMS } from "../constants";

/**
 * Custom hook for managing product category list
 * Following Single Responsibility Principle and Open/Closed Principle
 */
export const useProductCategoryList = (
  initialParams?: Partial<ProductCategoryQueryParams>
): IProductCategoryListHook => {
  // Merge initial params with defaults
  const [params, setParams] = useState<ProductCategoryQueryParams>({
    ...DEFAULT_PRODUCT_CATEGORY_PARAMS,
    ...initialParams,
  });

  // Fetch data using React Query
  const { data, isLoading, error, refetch } = useProductCategoriesQuery(params);

  // Update params function
  const updateParams = useCallback(
    (newParams: Partial<ProductCategoryQueryParams>) => {
      setParams((current) => ({
        ...current,
        ...newParams,
        // Reset page to 1 when changing filters
        ...(newParams.search !== undefined || newParams.productId !== undefined
          ? { page: 1 }
          : {}),
      }));
    },
    []
  );

  // Refresh function
  const refresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Memoized return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      data,
      isLoading,
      error,
      params,
      updateParams,
      refresh,
    }),
    [data, isLoading, error, params, updateParams, refresh]
  );
};
