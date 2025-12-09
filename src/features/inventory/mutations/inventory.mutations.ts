import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createInventory,
  updateInventory,
  deleteInventory,
  adjustStock,
  reserveStock,
  releaseReservedStock,
} from "../services";
import { INVENTORY_QUERY_KEYS } from "../queries";
import { useToastStore } from "../../../store/toast.store";
import { INVENTORY_CONSTANTS } from "../constants";
import type {
  UpdateInventoryRequest,
  StockAdjustmentRequest,
  ReserveStockRequest,
  ReleaseReservedStockRequest,
} from "../types";

// Create inventory mutation
export const useCreateInventoryMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationFn: createInventory,
    onSuccess: () => {
      // Invalidate inventory list queries
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEYS.LISTS() });
      queryClient.invalidateQueries({
        queryKey: INVENTORY_QUERY_KEYS.STATISTICS(),
      });
      showToast(INVENTORY_CONSTANTS.MESSAGES.CREATE_SUCCESS, "success");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        INVENTORY_CONSTANTS.MESSAGES.NETWORK_ERROR;
      showToast(message, "error");
    },
  });
};

// Update inventory mutation
export const useUpdateInventoryMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInventoryRequest }) =>
      updateInventory(id, data),
    onSuccess: (_, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEYS.LISTS() });
      queryClient.invalidateQueries({
        queryKey: INVENTORY_QUERY_KEYS.DETAIL(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: INVENTORY_QUERY_KEYS.STATISTICS(),
      });
      showToast(INVENTORY_CONSTANTS.MESSAGES.UPDATE_SUCCESS, "success");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        INVENTORY_CONSTANTS.MESSAGES.NETWORK_ERROR;
      showToast(message, "error");
    },
  });
};

// Delete inventory mutation
export const useDeleteInventoryMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationFn: deleteInventory,
    onSuccess: () => {
      // Invalidate inventory list queries
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEYS.LISTS() });
      queryClient.invalidateQueries({
        queryKey: INVENTORY_QUERY_KEYS.STATISTICS(),
      });
      showToast(INVENTORY_CONSTANTS.MESSAGES.DELETE_SUCCESS, "success");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        INVENTORY_CONSTANTS.MESSAGES.NETWORK_ERROR;
      showToast(message, "error");
    },
  });
};

// Adjust stock mutation
export const useAdjustStockMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: StockAdjustmentRequest }) =>
      adjustStock(id, data),
    onSuccess: (_, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEYS.LISTS() });
      queryClient.invalidateQueries({
        queryKey: INVENTORY_QUERY_KEYS.DETAIL(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: INVENTORY_QUERY_KEYS.STATISTICS(),
      });
      queryClient.invalidateQueries({
        queryKey: INVENTORY_QUERY_KEYS.LOW_STOCK(),
      });
      showToast(INVENTORY_CONSTANTS.MESSAGES.STOCK_ADJUST_SUCCESS, "success");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        INVENTORY_CONSTANTS.MESSAGES.NETWORK_ERROR;
      showToast(message, "error");
    },
  });
};

// Reserve stock mutation
export const useReserveStockMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReserveStockRequest }) =>
      reserveStock(id, data),
    onSuccess: (_, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEYS.LISTS() });
      queryClient.invalidateQueries({
        queryKey: INVENTORY_QUERY_KEYS.DETAIL(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: INVENTORY_QUERY_KEYS.STATISTICS(),
      });
      showToast(INVENTORY_CONSTANTS.MESSAGES.STOCK_RESERVE_SUCCESS, "success");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        INVENTORY_CONSTANTS.MESSAGES.NETWORK_ERROR;
      showToast(message, "error");
    },
  });
};

// Release reserved stock mutation
export const useReleaseReservedStockMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ReleaseReservedStockRequest;
    }) => releaseReservedStock(id, data),
    onSuccess: (_, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEYS.LISTS() });
      queryClient.invalidateQueries({
        queryKey: INVENTORY_QUERY_KEYS.DETAIL(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: INVENTORY_QUERY_KEYS.STATISTICS(),
      });
      showToast(INVENTORY_CONSTANTS.MESSAGES.STOCK_RELEASE_SUCCESS, "success");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        INVENTORY_CONSTANTS.MESSAGES.NETWORK_ERROR;
      showToast(message, "error");
    },
  });
};
