import { useState } from "react";
import { useProducts } from "../queries";
import { useDeleteProductMutation } from "../mutations";
import type { ProductQueryParams } from "../types";
import { PRODUCT_CONSTANTS } from "../constants";

export const useProductList = () => {
  const [params, setParams] = useState<ProductQueryParams>({
    page: 1,
    limit: PRODUCT_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
    sortBy: PRODUCT_CONSTANTS.DEFAULT_SORT.sortBy,
    sortOrder: PRODUCT_CONSTANTS.DEFAULT_SORT.sortOrder,
  });

  const { data, isLoading, error } = useProducts(params);
  const deleteMutation = useDeleteProductMutation();

  // Update query params
  const updateParams = (newParams: Partial<ProductQueryParams>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  // Reset filters to default
  const resetParams = () => {
    setParams({
      page: 1,
      limit: PRODUCT_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
      sortBy: PRODUCT_CONSTANTS.DEFAULT_SORT.sortBy,
      sortOrder: PRODUCT_CONSTANTS.DEFAULT_SORT.sortOrder,
    });
  };

  // Delete product action
  const deleteProduct = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  // Pagination actions
  const goToPage = (page: number) => {
    updateParams({ page });
  };

  const changePageSize = (limit: number) => {
    updateParams({ page: 1, limit });
  };

  // Search action
  const search = (searchTerm: string) => {
    updateParams({ page: 1, search: searchTerm });
  };

  // Filter actions
  const filterByStatus = (status?: string) => {
    updateParams({ page: 1, status: status as any });
  };

  const filterByCollection = (collectionId?: string) => {
    updateParams({ page: 1, collectionId });
  };

  // Sort action
  const setSorting = (sortBy: string, sortOrder: "asc" | "desc") => {
    updateParams({ sortBy: sortBy as any, sortOrder });
  };

  return {
    // Data
    data,
    isLoading,
    error,
    params,

    // Actions
    updateParams,
    resetParams,
    deleteProduct,
    goToPage,
    changePageSize,
    search,
    filterByStatus,
    filterByCollection,
    setSorting,

    // States
    deleting: deleteMutation.isPending,
  };
};
