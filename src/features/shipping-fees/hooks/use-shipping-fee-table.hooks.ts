import { useState, useCallback, useEffect } from "react";
import type {
  ShippingFeeQueryParams,
  ShippingFee,
  SortBy,
  SortOrder,
} from "../types";
import { SHIPPING_FEE_PAGINATION_DEFAULTS } from "../constants";

/**
 * Custom hook for managing table state
 * Following Single Responsibility Principle - only handles table state management
 */
export const useShippingFeeTable = () => {
  const [filters, setFilters] = useState<ShippingFeeQueryParams>({
    page: SHIPPING_FEE_PAGINATION_DEFAULTS.PAGE,
    limit: SHIPPING_FEE_PAGINATION_DEFAULTS.LIMIT,
    sortBy: SHIPPING_FEE_PAGINATION_DEFAULTS.SORT_BY,
    sortOrder: SHIPPING_FEE_PAGINATION_DEFAULTS.SORT_ORDER,
  });

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const updateFilters = useCallback(
    (newFilters: Partial<ShippingFeeQueryParams>) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
      }));
    },
    []
  );

  const updatePagination = useCallback((page: number, limit: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
      limit,
    }));
  }, []);

  const updateSort = useCallback((sortBy: SortBy, sortOrder: SortOrder) => {
    setFilters((prev) => ({
      ...prev,
      sortBy,
      sortOrder,
      page: 1, // Reset to first page when sorting
    }));
  }, []);

  const updateSearch = useCallback((term: string) => {
    setSearchTerm(term);
    // Reset to first page when searching
    setFilters((prev) => ({
      ...prev,
      page: 1,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      page: SHIPPING_FEE_PAGINATION_DEFAULTS.PAGE,
      limit: SHIPPING_FEE_PAGINATION_DEFAULTS.LIMIT,
      sortBy: SHIPPING_FEE_PAGINATION_DEFAULTS.SORT_BY,
      sortOrder: SHIPPING_FEE_PAGINATION_DEFAULTS.SORT_ORDER,
    });
    setSearchTerm("");
    setSelectedRows([]);
  }, []);

  const selectRow = useCallback((id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  }, []);

  const selectAllRows = useCallback((ids: string[]) => {
    setSelectedRows((prev) => (prev.length === ids.length ? [] : ids));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedRows([]);
  }, []);

  return {
    filters,
    selectedRows,
    searchTerm,
    updateFilters,
    updatePagination,
    updateSort,
    updateSearch,
    resetFilters,
    selectRow,
    selectAllRows,
    clearSelection,
  };
};

/**
 * Custom hook for managing modal/dialog state
 * Following Single Responsibility Principle - only handles modal state
 */
export const useShippingFeeModal = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedShippingFee, setSelectedShippingFee] =
    useState<ShippingFee | null>(null);

  const openCreateModal = useCallback(() => {
    setSelectedShippingFee(null);
    setIsCreateModalOpen(true);
  }, []);

  const openEditModal = useCallback((shippingFee: ShippingFee) => {
    setSelectedShippingFee(shippingFee);
    setIsEditModalOpen(true);
  }, []);

  const openDeleteModal = useCallback((shippingFee: ShippingFee) => {
    setSelectedShippingFee(shippingFee);
    setIsDeleteModalOpen(true);
  }, []);

  const openDetailModal = useCallback((shippingFee: ShippingFee) => {
    setSelectedShippingFee(shippingFee);
    setIsDetailModalOpen(true);
  }, []);

  const closeAllModals = useCallback(() => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsDetailModalOpen(false);
    setSelectedShippingFee(null);
  }, []);

  const closeCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
    setSelectedShippingFee(null);
  }, []);

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedShippingFee(null);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setSelectedShippingFee(null);
  }, []);

  const closeDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setSelectedShippingFee(null);
  }, []);

  return {
    // State
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    isDetailModalOpen,
    selectedShippingFee,

    // Actions
    openCreateModal,
    openEditModal,
    openDeleteModal,
    openDetailModal,
    closeAllModals,
    closeCreateModal,
    closeEditModal,
    closeDeleteModal,
    closeDetailModal,
  };
};

/**
 * Custom hook for managing local state with persistence
 * Following Single Responsibility Principle - only handles local state persistence
 */
export const useShippingFeeLocalState = (key: string) => {
  const [state, setState] = useState<any>(() => {
    try {
      const saved = localStorage.getItem(`shipping-fee-${key}`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const updateState = useCallback(
    (newState: any) => {
      setState(newState);
      try {
        localStorage.setItem(`shipping-fee-${key}`, JSON.stringify(newState));
      } catch (error) {
        console.warn("Failed to save to localStorage:", error);
      }
    },
    [key]
  );

  const clearState = useCallback(() => {
    setState(null);
    try {
      localStorage.removeItem(`shipping-fee-${key}`);
    } catch (error) {
      console.warn("Failed to remove from localStorage:", error);
    }
  }, [key]);

  return {
    state,
    updateState,
    clearState,
  };
};

/**
 * Custom hook for debouncing values
 * Useful for search inputs and API calls
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook for managing loading states
 * Following Single Responsibility Principle - only handles loading state
 */
export const useShippingFeeLoading = () => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: loading,
    }));
  }, []);

  const isLoading = useCallback(
    (key: string) => {
      return loadingStates[key] || false;
    },
    [loadingStates]
  );

  const clearLoading = useCallback(() => {
    setLoadingStates({});
  }, []);

  return {
    setLoading,
    isLoading,
    clearLoading,
  };
};
