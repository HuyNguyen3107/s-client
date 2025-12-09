import { useState, useCallback, useMemo } from "react";
import { useCollections } from "../queries/collection.queries";
import {
  useDeleteCollectionMutation,
  useToggleCollectionStatusMutation,
} from "../mutations/collection.mutations";
import type {
  CollectionQueryParams,
  CollectionViewMode,
} from "../types/collection.types";
import { COLLECTION_CONSTANTS } from "../constants/collection.constants";

// Custom Hook for Collection List Management - Single Responsibility Principle (SRP)
export const useCollectionList = () => {
  const [params, setParams] = useState<CollectionQueryParams>({
    page: 1,
    limit: COLLECTION_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [viewMode, setViewMode] = useState<CollectionViewMode>(
    COLLECTION_CONSTANTS.VIEW_MODES.GRID
  );

  // Query data
  const { data, isLoading, error, refetch } = useCollections(params);

  // Mutations
  const deleteMutation = useDeleteCollectionMutation();
  const toggleStatusMutation = useToggleCollectionStatusMutation();

  // Actions - Strategy Pattern implementation
  const updateParams = useCallback(
    (newParams: Partial<CollectionQueryParams>) => {
      setParams((prev) => ({ ...prev, ...newParams }));
    },
    []
  );

  const resetParams = useCallback(() => {
    setParams({
      page: 1,
      limit: COLLECTION_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  }, []);

  const changeViewMode = useCallback((mode: CollectionViewMode) => {
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
    (filters: Partial<CollectionQueryParams>) => {
      updateParams({ ...filters, page: 1 });
    },
    [updateParams]
  );

  const clearFilters = useCallback(() => {
    updateParams({
      page: 1,
      isActive: undefined,
      isHot: undefined,
      search: undefined,
    });
  }, [updateParams]);

  // Mutation actions
  const deleteCollection = useCallback(
    async (id: string) => {
      await deleteMutation.mutateAsync(id);
    },
    [deleteMutation]
  );

  const toggleCollectionStatus = useCallback(
    async (id: string) => {
      await toggleStatusMutation.mutateAsync(id);
    },
    [toggleStatusMutation]
  );

  // Computed values
  const collections = useMemo(() => data?.data || [], [data]);
  const pagination = useMemo(() => data?.pagination, [data]);

  const isOperating = useMemo(
    () => deleteMutation.isPending || toggleStatusMutation.isPending,
    [deleteMutation.isPending, toggleStatusMutation.isPending]
  );

  return {
    // Data
    collections,
    pagination,
    isLoading,
    error,
    viewMode,
    params,

    // States
    isOperating,
    isDeleting: deleteMutation.isPending,
    isToggling: toggleStatusMutation.isPending,

    // Actions
    updateParams,
    resetParams,
    changeViewMode,
    goToPage,
    changePageSize,
    applyFilters,
    clearFilters,
    deleteCollection,
    toggleCollectionStatus,
    refetch,
  };
};
