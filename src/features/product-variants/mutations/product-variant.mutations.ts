import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  CreateProductVariantRequest,
  UpdateProductVariantRequest,
  UpdateProductVariantStatusRequest,
} from "../types";
import { productVariantService } from "../services";
import { PRODUCT_VARIANT_CONSTANTS } from "../constants";
import { useToastStore } from "../../../store/toast.store";

/**
 * Hook for creating a new product variant
 * Following Single Responsibility Principle
 */
export const useCreateProductVariantMutation = () => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationKey: [PRODUCT_VARIANT_CONSTANTS.MUTATION_KEYS.CREATE],
    mutationFn: (data: CreateProductVariantRequest) =>
      productVariantService.createProductVariant(data),
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: PRODUCT_VARIANT_CONSTANTS.QUERY_KEYS.ALL,
      });
      queryClient.invalidateQueries({
        queryKey: PRODUCT_VARIANT_CONSTANTS.QUERY_KEYS.BY_PRODUCT(
          data.productId
        ),
      });
      queryClient.invalidateQueries({
        queryKey: PRODUCT_VARIANT_CONSTANTS.QUERY_KEYS.STATISTICS,
      });

      showToast(
        PRODUCT_VARIANT_CONSTANTS.SUCCESS_MESSAGES.CREATE_SUCCESS,
        "success"
      );
    },
    onError: (error: Error) => {
      showToast(
        error.message || PRODUCT_VARIANT_CONSTANTS.ERROR_MESSAGES.CREATE_FAILED,
        "error"
      );
    },
  });
};

/**
 * Hook for updating an existing product variant
 */
export const useUpdateProductVariantMutation = () => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationKey: [PRODUCT_VARIANT_CONSTANTS.MUTATION_KEYS.UPDATE],
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProductVariantRequest;
    }) => productVariantService.updateProductVariant(id, data),
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: PRODUCT_VARIANT_CONSTANTS.QUERY_KEYS.ALL,
      });
      queryClient.invalidateQueries({
        queryKey: PRODUCT_VARIANT_CONSTANTS.QUERY_KEYS.DETAIL(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: PRODUCT_VARIANT_CONSTANTS.QUERY_KEYS.BY_PRODUCT(
          data.productId
        ),
      });

      showToast(
        PRODUCT_VARIANT_CONSTANTS.SUCCESS_MESSAGES.UPDATE_SUCCESS,
        "success"
      );
    },
    onError: (error: Error) => {
      showToast(
        error.message || PRODUCT_VARIANT_CONSTANTS.ERROR_MESSAGES.UPDATE_FAILED,
        "error"
      );
    },
  });
};

/**
 * Hook for updating product variant status
 */
export const useUpdateProductVariantStatusMutation = () => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationKey: [PRODUCT_VARIANT_CONSTANTS.MUTATION_KEYS.UPDATE_STATUS],
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProductVariantStatusRequest;
    }) => productVariantService.updateProductVariantStatus(id, data),
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: PRODUCT_VARIANT_CONSTANTS.QUERY_KEYS.ALL,
      });
      queryClient.invalidateQueries({
        queryKey: PRODUCT_VARIANT_CONSTANTS.QUERY_KEYS.DETAIL(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: PRODUCT_VARIANT_CONSTANTS.QUERY_KEYS.BY_PRODUCT(
          data.productId
        ),
      });

      showToast(
        PRODUCT_VARIANT_CONSTANTS.SUCCESS_MESSAGES.STATUS_UPDATE_SUCCESS,
        "success"
      );
    },
    onError: (error: Error) => {
      showToast(
        error.message || PRODUCT_VARIANT_CONSTANTS.ERROR_MESSAGES.UPDATE_FAILED,
        "error"
      );
    },
  });
};

/**
 * Hook for deleting a product variant
 */
export const useDeleteProductVariantMutation = () => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationKey: [PRODUCT_VARIANT_CONSTANTS.MUTATION_KEYS.DELETE],
    mutationFn: (id: string) => productVariantService.deleteProductVariant(id),
    onSuccess: (_, id) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: PRODUCT_VARIANT_CONSTANTS.QUERY_KEYS.ALL,
      });
      queryClient.invalidateQueries({
        queryKey: PRODUCT_VARIANT_CONSTANTS.QUERY_KEYS.STATISTICS,
      });

      // Remove the deleted variant from cache
      queryClient.removeQueries({
        queryKey: PRODUCT_VARIANT_CONSTANTS.QUERY_KEYS.DETAIL(id),
      });

      showToast(
        PRODUCT_VARIANT_CONSTANTS.SUCCESS_MESSAGES.DELETE_SUCCESS,
        "success"
      );
    },
    onError: (error: Error) => {
      showToast(
        error.message || PRODUCT_VARIANT_CONSTANTS.ERROR_MESSAGES.DELETE_FAILED,
        "error"
      );
    },
  });
};

/**
 * Hook for duplicating a product variant
 */
export const useDuplicateProductVariantMutation = () => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationKey: [PRODUCT_VARIANT_CONSTANTS.MUTATION_KEYS.DUPLICATE],
    mutationFn: (id: string) =>
      productVariantService.duplicateProductVariant(id),
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: PRODUCT_VARIANT_CONSTANTS.QUERY_KEYS.ALL,
      });
      queryClient.invalidateQueries({
        queryKey: PRODUCT_VARIANT_CONSTANTS.QUERY_KEYS.BY_PRODUCT(
          data.productId
        ),
      });
      queryClient.invalidateQueries({
        queryKey: PRODUCT_VARIANT_CONSTANTS.QUERY_KEYS.STATISTICS,
      });

      showToast(
        PRODUCT_VARIANT_CONSTANTS.SUCCESS_MESSAGES.DUPLICATE_SUCCESS,
        "success"
      );
    },
    onError: (error: Error) => {
      showToast(
        error.message ||
          PRODUCT_VARIANT_CONSTANTS.ERROR_MESSAGES.DUPLICATE_FAILED,
        "error"
      );
    },
  });
};
