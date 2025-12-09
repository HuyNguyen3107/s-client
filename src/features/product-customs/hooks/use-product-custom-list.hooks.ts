import { useState, useMemo, useCallback } from "react";
import { useProductCustomsQuery } from "../queries";
import type {
  ProductCustomQueryParams,
  IProductCustomListHook,
} from "../types";
import { PRODUCT_CUSTOM_CONSTANTS } from "../constants";

/**
 * Hook for managing product customs list with filtering, sorting, and pagination
 * Following Single Responsibility Principle - handles list state management
 */
export const useProductCustomList = (
  initialParams?: ProductCustomQueryParams
): IProductCustomListHook => {
  // State for query parameters
  const [params, setParams] = useState<ProductCustomQueryParams>({
    page: PRODUCT_CUSTOM_CONSTANTS.DEFAULT_PAGE,
    limit: PRODUCT_CUSTOM_CONSTANTS.DEFAULT_LIMIT,
    sortBy: PRODUCT_CUSTOM_CONSTANTS.DEFAULTS.SORT_BY as
      | "name"
      | "price"
      | "createdAt"
      | "updatedAt",
    sortOrder: PRODUCT_CUSTOM_CONSTANTS.DEFAULTS.SORT_ORDER as "asc" | "desc",
    ...initialParams,
  });

  // Fetch data using React Query
  const { data, isLoading, error, refetch } = useProductCustomsQuery(params);

  // Memoized update function to prevent unnecessary re-renders
  const updateParams = useCallback(
    (newParams: Partial<ProductCustomQueryParams>) => {
      setParams((prev) => ({
        ...prev,
        ...newParams,
        // Reset to page 1 when filtering/searching (except when explicitly setting page)
        ...(newParams.search !== undefined ||
        newParams.status !== undefined ||
        newParams.productCategoryId !== undefined
          ? { page: 1, ...newParams }
          : newParams),
      }));
    },
    []
  );

  // Refresh function
  const refresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Memoized return object
  const result = useMemo(
    () => ({
      data: data || {
        data: [],
        meta: {
          total: 0,
          page: params.page || 1,
          limit: params.limit || PRODUCT_CUSTOM_CONSTANTS.DEFAULT_LIMIT,
          totalPages: 0,
        },
      },
      isLoading,
      error,
      params,
      updateParams,
      refresh,
    }),
    [data, isLoading, error, params, updateParams, refresh]
  );

  return result;
};

/**
 * Hook for search functionality
 * @param onSearch - Callback when search is performed
 * @returns Search state and handlers
 */
export const useProductCustomSearch = (
  onSearch: (searchTerm: string) => void
) => {
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(
    async (value: string) => {
      setIsSearching(true);
      try {
        setSearchValue(value);
        onSearch(value);
      } finally {
        setIsSearching(false);
      }
    },
    [onSearch]
  );

  const handleClearSearch = useCallback(() => {
    handleSearch("");
  }, [handleSearch]);

  return {
    searchValue,
    isSearching,
    handleSearch,
    handleClearSearch,
    setSearchValue,
  };
};

/**
 * Hook for managing filter state
 * @param onFilterChange - Callback when filters change
 * @returns Filter state and handlers
 */
export const useProductCustomFilters = (
  onFilterChange: (filters: {
    status?: string;
    productCategoryId?: string;
  }) => void
) => {
  const [filters, setFilters] = useState<{
    status?: string;
    productCategoryId?: string;
  }>({});

  const updateFilter = useCallback(
    (key: "status" | "productCategoryId", value?: string) => {
      const newFilters = {
        ...filters,
        [key]: value || undefined,
      };

      // Remove undefined values
      Object.keys(newFilters).forEach((k) => {
        if (newFilters[k as keyof typeof newFilters] === undefined) {
          delete newFilters[k as keyof typeof newFilters];
        }
      });

      setFilters(newFilters);
      onFilterChange(newFilters);
    },
    [filters, onFilterChange]
  );

  const clearFilters = useCallback(() => {
    setFilters({});
    onFilterChange({});
  }, [onFilterChange]);

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some((value) => value !== undefined);
  }, [filters]);

  return {
    filters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
  };
};

/**
 * Hook for managing sort state
 * @param onSortChange - Callback when sort changes
 * @returns Sort state and handlers
 */
export const useProductCustomSort = (
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void
) => {
  const [sortBy, setSortBy] = useState<string>(
    PRODUCT_CUSTOM_CONSTANTS.DEFAULTS.SORT_BY
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    PRODUCT_CUSTOM_CONSTANTS.DEFAULTS.SORT_ORDER as "asc" | "desc"
  );

  const updateSort = useCallback(
    (newSortBy: string, newSortOrder?: "asc" | "desc") => {
      let finalSortOrder = newSortOrder;

      // If same field is clicked, toggle sort order
      if (newSortBy === sortBy && !newSortOrder) {
        finalSortOrder = sortOrder === "asc" ? "desc" : "asc";
      } else if (!newSortOrder) {
        finalSortOrder = "desc"; // Default to desc for new fields
      }

      setSortBy(newSortBy);
      setSortOrder(finalSortOrder!);
      onSortChange(newSortBy, finalSortOrder!);
    },
    [sortBy, sortOrder, onSortChange]
  );

  return {
    sortBy,
    sortOrder,
    updateSort,
    sortOptions: PRODUCT_CUSTOM_CONSTANTS.SORT_OPTIONS,
  };
};

/**
 * Hook for managing pagination state
 * @param onPageChange - Callback when page changes
 * @returns Pagination state and handlers
 */
export const useProductCustomPagination = (
  onPageChange: (page: number, limit?: number) => void
) => {
  const [page, setPage] = useState<number>(
    PRODUCT_CUSTOM_CONSTANTS.DEFAULT_PAGE
  );
  const [limit, setLimit] = useState<number>(
    PRODUCT_CUSTOM_CONSTANTS.DEFAULT_LIMIT
  );

  const updatePage = useCallback(
    (newPage: number) => {
      setPage(newPage);
      onPageChange(newPage, limit);
    },
    [limit, onPageChange]
  );

  const updateLimit = useCallback(
    (newLimit: number) => {
      setLimit(newLimit);
      setPage(1); // Reset to first page when changing limit
      onPageChange(1, newLimit);
    },
    [onPageChange]
  );

  const goToFirstPage = useCallback(() => updatePage(1), [updatePage]);
  const goToLastPage = useCallback(
    (totalPages: number) => updatePage(totalPages),
    [updatePage]
  );

  return {
    page,
    limit,
    updatePage,
    updateLimit,
    goToFirstPage,
    goToLastPage,
  };
};

/**
 * Combined hook that integrates all list functionality
 * @param initialParams - Initial query parameters
 * @returns Complete list management interface
 */
export const useProductCustomListManager = (
  initialParams?: ProductCustomQueryParams
) => {
  const listHook = useProductCustomList(initialParams);

  const searchHook = useProductCustomSearch((searchTerm) => {
    listHook.updateParams({ search: searchTerm || undefined });
  });

  const filterHook = useProductCustomFilters((filters) => {
    listHook.updateParams(filters);
  });

  const sortHook = useProductCustomSort((sortBy, sortOrder) => {
    listHook.updateParams({ sortBy: sortBy as any, sortOrder });
  });

  const paginationHook = useProductCustomPagination((page, limit) => {
    listHook.updateParams({ page, limit });
  });

  return {
    // List data and state
    data: listHook.data,
    isLoading: listHook.isLoading,
    error: listHook.error,
    refresh: listHook.refresh,

    // Search
    searchValue: searchHook.searchValue,
    isSearching: searchHook.isSearching,
    handleSearch: searchHook.handleSearch,
    handleClearSearch: searchHook.handleClearSearch,
    setSearchValue: searchHook.setSearchValue,

    // Filters
    filters: filterHook.filters,
    updateFilter: filterHook.updateFilter,
    clearFilters: filterHook.clearFilters,
    hasActiveFilters: filterHook.hasActiveFilters,

    // Sort
    sortBy: sortHook.sortBy,
    sortOrder: sortHook.sortOrder,
    updateSort: sortHook.updateSort,
    sortOptions: sortHook.sortOptions,

    // Pagination
    page: paginationHook.page,
    limit: paginationHook.limit,
    updatePage: paginationHook.updatePage,
    updateLimit: paginationHook.updateLimit,
    goToFirstPage: paginationHook.goToFirstPage,
    goToLastPage: paginationHook.goToLastPage,

    // Raw update function for advanced usage
    updateParams: listHook.updateParams,
    params: listHook.params,
  };
};
