import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  updateProduct,
  updateProductStatus,
  deleteProduct,
} from "../services";
import { PRODUCT_QUERY_KEYS } from "../queries";
import { useToastStore } from "../../../store/toast.store";
import { PRODUCT_CONSTANTS } from "../constants";
import type { UpdateProductRequest } from "../types";

// Create product mutation
export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // Invalidate products list queries
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.LISTS() });
      showToast(PRODUCT_CONSTANTS.MESSAGES.CREATE_SUCCESS, "success");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        PRODUCT_CONSTANTS.MESSAGES.NETWORK_ERROR;
      showToast(message, "error");
    },
  });
};

// Update product mutation
export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) =>
      updateProduct(id, data),
    onSuccess: (_, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.LISTS() });
      queryClient.invalidateQueries({
        queryKey: PRODUCT_QUERY_KEYS.DETAIL(variables.id),
      });
      showToast(PRODUCT_CONSTANTS.MESSAGES.UPDATE_SUCCESS, "success");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        PRODUCT_CONSTANTS.MESSAGES.NETWORK_ERROR;
      showToast(message, "error");
    },
  });
};

// Update product status mutation
export const useUpdateProductStatusMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateProductStatus(id, status),
    onSuccess: (_, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.LISTS() });
      queryClient.invalidateQueries({
        queryKey: PRODUCT_QUERY_KEYS.DETAIL(variables.id),
      });
      showToast("Cập nhật trạng thái thành công!", "success");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        PRODUCT_CONSTANTS.MESSAGES.NETWORK_ERROR;
      showToast(message, "error");
    },
  });
};

// Delete product mutation
export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      // Invalidate products list queries
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.LISTS() });
      showToast(PRODUCT_CONSTANTS.MESSAGES.DELETE_SUCCESS, "success");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        PRODUCT_CONSTANTS.MESSAGES.NETWORK_ERROR;
      showToast(message, "error");
    },
  });
};
