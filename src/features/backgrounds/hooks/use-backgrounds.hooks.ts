import { useState, useCallback, useMemo } from "react";
import { useBackgrounds } from "../queries/background.queries";
import { useDeleteBackgroundMutation } from "../mutations/background.mutations";
import type {
  BackgroundQueryParams,
  BackgroundViewMode,
} from "../types/background.types";
import { BACKGROUND_CONSTANTS } from "../constants/background.constants";

// Custom Hook for Background List Management - Single Responsibility Principle (SRP)
export const useBackgroundList = () => {
  const [params, setParams] = useState<BackgroundQueryParams>({
    page: 1,
    limit: BACKGROUND_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
  });

  const [viewMode, setViewMode] = useState<BackgroundViewMode>(
    BACKGROUND_CONSTANTS.VIEW_MODES.GRID
  );

  // Query data
  const { data, isLoading, error, refetch } = useBackgrounds(params);

  // Mutations
  const deleteMutation = useDeleteBackgroundMutation();

  // Actions - Strategy Pattern implementation
  const updateParams = useCallback(
    (newParams: Partial<BackgroundQueryParams>) => {
      setParams((prev) => ({ ...prev, ...newParams }));
    },
    []
  );

  const resetParams = useCallback(() => {
    setParams({
      page: 1,
      limit: BACKGROUND_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
    });
  }, []);

  const changeViewMode = useCallback((mode: BackgroundViewMode) => {
    setViewMode(mode);
  }, []);

  const goToPage = useCallback(
    (page: number) => {
      updateParams({ page });
    },
    [updateParams]
  );

  const changePageSize = useCallback(
    (limit: number) => {
      updateParams({ page: 1, limit });
    },
    [updateParams]
  );

  const applyFilters = useCallback(
    (filters: Partial<BackgroundQueryParams>) => {
      updateParams({ ...filters, page: 1 });
    },
    [updateParams]
  );

  const clearFilters = useCallback(() => {
    updateParams({
      page: 1,
      search: undefined,
      productId: undefined,
    });
  }, [updateParams]);

  // Mutation actions
  const deleteBackground = useCallback(
    async (id: string) => {
      await deleteMutation.mutateAsync(id);
    },
    [deleteMutation]
  );

  // Computed values
  const backgrounds = useMemo(() => data?.data || [], [data]);
  const totalCount = useMemo(() => data?.total || 0, [data]);
  const totalPages = useMemo(() => data?.totalPages || 0, [data]);

  const isOperating = useMemo(
    () => deleteMutation.isPending,
    [deleteMutation.isPending]
  );

  return {
    // Data
    backgrounds,
    data,
    totalCount,
    totalPages,
    isLoading,
    error,
    viewMode,
    params,

    // States
    isOperating,
    isDeleting: deleteMutation.isPending,

    // Actions
    updateParams,
    resetParams,
    changeViewMode,
    goToPage,
    changePageSize,
    applyFilters,
    clearFilters,
    deleteBackground,
    refetch,
  };
};

// Legacy exports for backward compatibility
export const useBackgroundsList = useBackgrounds;
