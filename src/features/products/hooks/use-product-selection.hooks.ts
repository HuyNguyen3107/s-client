import { useState, useCallback } from "react";
import type { ProductWithRelations, ProductListUIState } from "../types";

export const useProductSelection = () => {
  const [uiState, setUIState] = useState<ProductListUIState>({
    viewMode: "grid",
    selectedProducts: [],
    isMultiSelectMode: false,
    searchValue: "",
    filters: {},
  });

  // Selection actions with useCallback to prevent unnecessary re-renders
  const toggleProductSelection = useCallback((productId: string) => {
    setUIState((prev) => ({
      ...prev,
      selectedProducts: prev.selectedProducts.includes(productId)
        ? prev.selectedProducts.filter((id) => id !== productId)
        : [...prev.selectedProducts, productId],
    }));
  }, []);

  const selectAllProducts = useCallback((products: ProductWithRelations[]) => {
    setUIState((prev) => ({
      ...prev,
      selectedProducts: products.map((p) => p.id),
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setUIState((prev) => ({
      ...prev,
      selectedProducts: [],
    }));
  }, []);

  const toggleMultiSelectMode = useCallback(() => {
    setUIState((prev) => ({
      ...prev,
      isMultiSelectMode: !prev.isMultiSelectMode,
      selectedProducts: prev.isMultiSelectMode ? [] : prev.selectedProducts,
    }));
  }, []);

  // View mode actions
  const setViewMode = useCallback((mode: "grid" | "table") => {
    setUIState((prev) => ({
      ...prev,
      viewMode: mode,
    }));
  }, []);

  // Search actions
  const setSearchValue = useCallback((value: string) => {
    setUIState((prev) => ({
      ...prev,
      searchValue: value,
    }));
  }, []);

  // Filter actions
  const setFilters = useCallback(
    (filters: Partial<ProductListUIState["filters"]>) => {
      setUIState((prev) => ({
        ...prev,
        filters: { ...prev.filters, ...filters },
      }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setUIState((prev) => ({
      ...prev,
      filters: {},
      searchValue: "",
    }));
  }, []);

  // Computed values
  const hasSelection = uiState.selectedProducts.length > 0;
  const isAllSelected = useCallback(
    (products: ProductWithRelations[]) =>
      products.length > 0 &&
      products.every((p) => uiState.selectedProducts.includes(p.id)),
    [uiState.selectedProducts]
  );

  return {
    // State
    uiState,
    hasSelection,

    // Actions
    toggleProductSelection,
    selectAllProducts,
    clearSelection,
    toggleMultiSelectMode,
    setViewMode,
    setSearchValue,
    setFilters,
    clearFilters,

    // Computed
    isAllSelected,
  };
};
