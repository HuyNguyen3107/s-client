import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "../../../store/toast.store";
import http from "../../../libs/http.libs";
import { API_PATHS } from "../../../constants/api-path.constants";
import {
  SHIPPING_FEE_QUERY_KEYS,
  SHIPPING_FEE_MUTATION_KEYS,
  SHIPPING_FEE_SUCCESS_MESSAGES,
  SHIPPING_FEE_ERROR_MESSAGES,
} from "../constants";
import type {
  CreateShippingFeeRequest,
  UpdateShippingFeeRequest,
} from "../types";

/**
 * Custom hook for creating shipping fee
 * Following Single Responsibility Principle - only handles creation
 */
export const useCreateShippingFee = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationKey: [SHIPPING_FEE_MUTATION_KEYS.CREATE],
    mutationFn: async (data: CreateShippingFeeRequest) => {
      const response = await http.post(API_PATHS.SHIPPING_FEES, data);
      return response.data;
    },
    onSuccess: (response) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({
        queryKey: SHIPPING_FEE_QUERY_KEYS.ALL,
      });
      queryClient.invalidateQueries({
        queryKey: SHIPPING_FEE_QUERY_KEYS.STATISTICS,
      });
      queryClient.invalidateQueries({
        queryKey: SHIPPING_FEE_QUERY_KEYS.AREAS,
      });
      queryClient.invalidateQueries({
        queryKey: SHIPPING_FEE_QUERY_KEYS.TYPES,
      });

      // Use message from backend response
      const successMessage =
        response?.message || SHIPPING_FEE_SUCCESS_MESSAGES.CREATE_SUCCESS;
      showToast(successMessage, "success");
    },
    onError: (error: any) => {
      // Handle error and show error message
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        SHIPPING_FEE_ERROR_MESSAGES.CREATE_ERROR;

      showToast(errorMessage, "error");
    },
  });
};

/**
 * Custom hook for updating shipping fee
 */
export const useUpdateShippingFee = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationKey: [SHIPPING_FEE_MUTATION_KEYS.UPDATE],
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateShippingFeeRequest;
    }) => {
      const response = await http.patch(API_PATHS.SHIPPING_FEE_BY_ID(id), data);
      return { ...response.data, id };
    },
    onSuccess: (response, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({
        queryKey: SHIPPING_FEE_QUERY_KEYS.ALL,
      });
      queryClient.invalidateQueries({
        queryKey: SHIPPING_FEE_QUERY_KEYS.DETAIL(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: SHIPPING_FEE_QUERY_KEYS.STATISTICS,
      });

      // Update the cache with new data if available
      if (response.data) {
        queryClient.setQueryData(
          SHIPPING_FEE_QUERY_KEYS.DETAIL(variables.id),
          response.data
        );
      }

      // Use message from backend response
      const successMessage =
        response?.message || SHIPPING_FEE_SUCCESS_MESSAGES.UPDATE_SUCCESS;
      showToast(successMessage, "success");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        SHIPPING_FEE_ERROR_MESSAGES.UPDATE_ERROR;

      showToast(errorMessage, "error");
    },
  });
};

/**
 * Custom hook for deleting shipping fee
 */
export const useDeleteShippingFee = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationKey: [SHIPPING_FEE_MUTATION_KEYS.DELETE],
    mutationFn: async (id: string) => {
      const response = await http.delete(API_PATHS.SHIPPING_FEE_BY_ID(id));
      return response.data;
    },
    onSuccess: (response, variables) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: SHIPPING_FEE_QUERY_KEYS.DETAIL(variables),
      });

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: SHIPPING_FEE_QUERY_KEYS.ALL,
      });
      queryClient.invalidateQueries({
        queryKey: SHIPPING_FEE_QUERY_KEYS.STATISTICS,
      });

      // Use message from backend response
      const successMessage =
        response?.message || SHIPPING_FEE_SUCCESS_MESSAGES.DELETE_SUCCESS;
      showToast(successMessage, "success");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        SHIPPING_FEE_ERROR_MESSAGES.DELETE_ERROR;

      showToast(errorMessage, "error");
    },
  });
};

/**
 * Utility hook for optimistic updates
 * This can be used when we want to show immediate feedback to user
 */
export const useOptimisticShippingFeeUpdate = () => {
  const queryClient = useQueryClient();

  const updateOptimistically = (id: string, updater: (oldData: any) => any) => {
    queryClient.setQueryData(SHIPPING_FEE_QUERY_KEYS.DETAIL(id), updater);
  };

  const revertOptimisticUpdate = (id: string) => {
    queryClient.invalidateQueries({
      queryKey: SHIPPING_FEE_QUERY_KEYS.DETAIL(id),
    });
  };

  return {
    updateOptimistically,
    revertOptimisticUpdate,
  };
};
