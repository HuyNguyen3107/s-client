import { useState, useCallback, useMemo } from "react";
import { useInventories } from "../queries";
import {
  useDeleteInventoryMutation,
  useAdjustStockMutation,
  useReserveStockMutation,
  useReleaseReservedStockMutation,
} from "../mutations";
import { FilterUtils, StockLevelUtils } from "../utils";
import { INVENTORY_CONSTANTS } from "../constants";
import type {
  InventoryQueryParams,
  InventoryWithRelations,
  InventoryStatus,
  InventoryListUIState,
} from "../types";

// Custom hook for inventory list management following Single Responsibility Principle
export const useInventoryList = () => {
  const [params, setParams] = useState<InventoryQueryParams>({
    page: 1,
    limit: INVENTORY_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [uiState, setUIState] = useState<InventoryListUIState>({
    viewMode: "table",
    selectedInventory: [],
    isMultiSelectMode: false,
    searchValue: "",
    filters: {},
    sort: {
      field: "createdAt",
      direction: "desc",
    },
  });

  // Fetch data using the query
  const {
    data: inventoryData,
    isLoading,
    error,
    refetch,
  } = useInventories(params);

  // Mutations
  const deleteInventoryMutation = useDeleteInventoryMutation();
  const adjustStockMutation = useAdjustStockMutation();
  const reserveStockMutation = useReserveStockMutation();
  const releaseReservedStockMutation = useReleaseReservedStockMutation();

  // Update query parameters
  const updateParams = useCallback(
    (newParams: Partial<InventoryQueryParams>) => {
      setParams((prev) => ({ ...prev, ...newParams }));
    },
    []
  );

  // Update UI state
  const updateUIState = useCallback(
    (newState: Partial<InventoryListUIState>) => {
      setUIState((prev) => ({ ...prev, ...newState }));
    },
    []
  );

  // Search functionality
  const search = useCallback(
    (searchValue: string) => {
      updateParams({ search: searchValue, page: 1 });
      updateUIState({ searchValue });
    },
    [updateParams, updateUIState]
  );

  // Filter functionality
  const filterByStatus = useCallback(
    (status?: InventoryStatus) => {
      updateParams({ status, page: 1 });
      updateUIState({
        filters: { ...uiState.filters, status },
      });
    },
    [updateParams, updateUIState, uiState.filters]
  );

  // Sort functionality
  const sortBy = useCallback(
    (field: string, direction: "asc" | "desc") => {
      updateParams({
        sortBy: field as any,
        sortOrder: direction,
        page: 1,
      });
      updateUIState({
        sort: { field, direction },
      });
    },
    [updateParams, updateUIState]
  );

  // Pagination
  const changePage = useCallback(
    (page: number) => {
      updateParams({ page });
    },
    [updateParams]
  );

  const changeLimit = useCallback(
    (limit: number) => {
      updateParams({ limit, page: 1 });
    },
    [updateParams]
  );

  // Selection management
  const selectInventory = useCallback(
    (id: string) => {
      updateUIState({
        selectedInventory: [...uiState.selectedInventory, id],
      });
    },
    [updateUIState, uiState.selectedInventory]
  );

  const deselectInventory = useCallback(
    (id: string) => {
      updateUIState({
        selectedInventory: uiState.selectedInventory.filter(
          (item) => item !== id
        ),
      });
    },
    [updateUIState, uiState.selectedInventory]
  );

  const toggleSelectInventory = useCallback(
    (id: string) => {
      if (uiState.selectedInventory.includes(id)) {
        deselectInventory(id);
      } else {
        selectInventory(id);
      }
    },
    [uiState.selectedInventory, selectInventory, deselectInventory]
  );

  const selectAllInventory = useCallback(() => {
    const allIds = inventoryData?.data.map((item) => item.id) || [];
    updateUIState({ selectedInventory: allIds });
  }, [updateUIState, inventoryData?.data]);

  const deselectAllInventory = useCallback(() => {
    updateUIState({ selectedInventory: [] });
  }, [updateUIState]);

  // Delete operations
  const deleteInventory = useCallback(
    async (id: string) => {
      await deleteInventoryMutation.mutateAsync(id);
      deselectInventory(id);
    },
    [deleteInventoryMutation, deselectInventory]
  );

  const deleteSelectedInventory = useCallback(async () => {
    for (const id of uiState.selectedInventory) {
      await deleteInventoryMutation.mutateAsync(id);
    }
    deselectAllInventory();
  }, [
    uiState.selectedInventory,
    deleteInventoryMutation,
    deselectAllInventory,
  ]);

  // Stock operations
  const adjustStock = useCallback(
    async (id: string, quantity: number, reason?: string) => {
      await adjustStockMutation.mutateAsync({ id, data: { quantity, reason } });
    },
    [adjustStockMutation]
  );

  const reserveStock = useCallback(
    async (id: string, quantity: number, reason?: string) => {
      await reserveStockMutation.mutateAsync({
        id,
        data: { quantity, reason },
      });
    },
    [reserveStockMutation]
  );

  const releaseReservedStock = useCallback(
    async (id: string, quantity: number) => {
      await releaseReservedStockMutation.mutateAsync({
        id,
        data: { quantity },
      });
    },
    [releaseReservedStockMutation]
  );

  // Computed values
  const filteredData = useMemo(() => {
    if (!inventoryData?.data) return [];

    return FilterUtils.filterInventories(inventoryData.data, {
      search: uiState.searchValue,
      status: uiState.filters.status,
    });
  }, [inventoryData?.data, uiState.searchValue, uiState.filters.status]);

  const sortedData = useMemo(() => {
    return FilterUtils.sortInventories(
      filteredData,
      uiState.sort.field,
      uiState.sort.direction
    );
  }, [filteredData, uiState.sort.field, uiState.sort.direction]);

  const stats = useMemo(() => {
    const data = inventoryData?.data || [];
    return {
      total: data.length,
      lowStock: data.filter((item) => StockLevelUtils.isLowStock(item)).length,
      outOfStock: data.filter((item) => StockLevelUtils.isOutOfStock(item))
        .length,
      selected: uiState.selectedInventory.length,
    };
  }, [inventoryData?.data, uiState.selectedInventory.length]);

  return {
    // Data
    data: inventoryData,
    filteredData,
    sortedData,
    isLoading,
    error,
    stats,

    // UI State
    uiState,
    updateUIState,

    // Parameters
    params,
    updateParams,

    // Operations
    search,
    filterByStatus,
    sortBy,
    changePage,
    changeLimit,
    refetch,

    // Selection
    selectInventory,
    deselectInventory,
    toggleSelectInventory,
    selectAllInventory,
    deselectAllInventory,

    // Mutations
    deleteInventory,
    deleteSelectedInventory,
    adjustStock,
    reserveStock,
    releaseReservedStock,

    // Loading states
    deleting: deleteInventoryMutation.isPending,
    adjustingStock: adjustStockMutation.isPending,
    reservingStock: reserveStockMutation.isPending,
    releasingStock: releaseReservedStockMutation.isPending,
  };
};

// Hook for inventory form management
export const useInventoryForm = (initialData?: InventoryWithRelations) => {
  const [formData, setFormData] = useState({
    productCustomId: initialData?.productCustomId || "",
    currentStock: initialData?.currentStock || 0,
    reservedStock: initialData?.reservedStock || 0,
    minStockAlert: initialData?.minStockAlert || 10,
    status: (initialData?.status || "active") as InventoryStatus,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const updateField = useCallback(
    (field: string, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

  const markFieldAsTouched = useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const validateForm = useCallback(() => {
    const { InventoryValidator } = require("../utils");
    const validation = InventoryValidator.validateInventoryForm(formData);
    setErrors(validation.errors);
    return validation.isValid;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData({
      productCustomId: initialData?.productCustomId || "",
      currentStock: initialData?.currentStock || 0,
      reservedStock: initialData?.reservedStock || 0,
      minStockAlert: initialData?.minStockAlert || 10,
      status: (initialData?.status || "active") as InventoryStatus,
    });
    setErrors({});
    setTouched({});
  }, [initialData]);

  return {
    formData,
    errors,
    touched,
    updateField,
    markFieldAsTouched,
    validateForm,
    resetForm,
    isValid: Object.keys(errors).length === 0,
    isDirty: Object.keys(touched).length > 0,
  };
};

// Hook for validator utilities
export const useInventoryValidator = () => {
  return useMemo(
    () => ({
      validateStockQuantity: (quantity: number) => quantity > 0,
      validateMinStockAlert: (minStock: number) =>
        minStock >= INVENTORY_CONSTANTS.VALIDATION.MIN_STOCK_MIN &&
        minStock <= INVENTORY_CONSTANTS.VALIDATION.MIN_STOCK_MAX,
    }),
    []
  );
};
