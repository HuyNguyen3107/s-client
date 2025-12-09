import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MUTATION_KEYS } from "../../../constants/mutation-key.constants";
import { QUERY_KEYS } from "../../../constants/query-key.constants";
import { useToastStore } from "../../../store/toast.store";
import { ErrorUtils, ToastUtils } from "../../../utils/error-handler.utils";
import {
  createProductCustom,
  updateProductCustom,
  updateProductCustomStatus,
  deleteProductCustom,
} from "../services";
import type {
  CreateProductCustomRequest,
  UpdateProductCustomRequest,
  ProductCustomWithRelations,
} from "../types";

/**
 * React Query mutations for product customs following Single Responsibility Principle
 */

/**
 * Mutation to create new product custom
 * @returns Mutation object with create function
 */
export const useCreateProductCustomMutation = () => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation<
    ProductCustomWithRelations,
    Error,
    CreateProductCustomRequest
  >({
    mutationKey: [MUTATION_KEYS.CREATE_PRODUCT_CUSTOM],
    mutationFn: createProductCustom,
    onSuccess: (newCustom) => {
      // Invalidate and refetch product customs list
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PRODUCT_CUSTOMS],
      });

      // Invalidate customs by category
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.PRODUCT_CUSTOMS_BY_CATEGORY,
          newCustom.productCategoryId,
        ],
      });

      // Invalidate statistics
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PRODUCT_CUSTOM_STATISTICS],
      });

      // Add to cache for immediate access
      queryClient.setQueryData(
        [QUERY_KEYS.PRODUCT_CUSTOM_BY_ID, newCustom.id],
        newCustom
      );

      // Show success message
      showToast(
        ToastUtils.getSuccessMessage("create", "sản phẩm tùy chỉnh"),
        "success"
      );
    },
    onError: (error) => {
      // Show error message
      const errorMessage = ErrorUtils.getOperationErrorMessage("create", error);
      showToast(errorMessage, "error");
    },
  });
};

/**
 * Mutation to update existing product custom
 * @returns Mutation object with update function
 */
export const useUpdateProductCustomMutation = () => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation<
    ProductCustomWithRelations,
    Error,
    { id: string; data: UpdateProductCustomRequest }
  >({
    mutationKey: [MUTATION_KEYS.UPDATE_PRODUCT_CUSTOM],
    mutationFn: ({ id, data }) => updateProductCustom(id, data),
    onSuccess: (updatedCustom) => {
      // Update cached item
      queryClient.setQueryData(
        [QUERY_KEYS.PRODUCT_CUSTOM_BY_ID, updatedCustom.id],
        updatedCustom
      );

      // Invalidate lists that might include this custom
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PRODUCT_CUSTOMS],
      });

      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.PRODUCT_CUSTOMS_BY_CATEGORY,
          updatedCustom.productCategoryId,
        ],
      });

      // Invalidate statistics if needed
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PRODUCT_CUSTOM_STATISTICS],
      });

      // Show success message
      showToast(
        ToastUtils.getSuccessMessage("update", "sản phẩm tùy chỉnh"),
        "success"
      );
    },
    onError: (error) => {
      // Show error message
      const errorMessage = ErrorUtils.getOperationErrorMessage("update", error);
      showToast(errorMessage, "error");
    },
  });
};

/**
 * Mutation to update product custom status only
 * @returns Mutation object with status update function
 */
export const useUpdateProductCustomStatusMutation = () => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation<
    ProductCustomWithRelations,
    Error,
    { id: string; status: string }
  >({
    mutationKey: [MUTATION_KEYS.UPDATE_PRODUCT_CUSTOM_STATUS],
    mutationFn: ({ id, status }) => updateProductCustomStatus(id, status),
    onSuccess: (updatedCustom) => {
      // Update cached item
      queryClient.setQueryData(
        [QUERY_KEYS.PRODUCT_CUSTOM_BY_ID, updatedCustom.id],
        updatedCustom
      );

      // Invalidate lists
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PRODUCT_CUSTOMS],
      });

      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.PRODUCT_CUSTOMS_BY_CATEGORY,
          updatedCustom.productCategoryId,
        ],
      });

      // Update statistics
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PRODUCT_CUSTOM_STATISTICS],
      });

      // Show success message
      showToast(
        "Cập nhật trạng thái sản phẩm tùy chỉnh thành công!",
        "success"
      );
    },
    onError: (error) => {
      // Show error message
      const errorMessage = ErrorUtils.getApiErrorMessage(
        error,
        "Cập nhật trạng thái thất bại!"
      );
      showToast(errorMessage, "error");
    },
  });
};

/**
 * Mutation to delete product custom
 * @returns Mutation object with delete function
 */
export const useDeleteProductCustomMutation = () => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation<void, Error, { id: string; categoryId?: string }>({
    mutationKey: [MUTATION_KEYS.DELETE_PRODUCT_CUSTOM],
    mutationFn: ({ id }) => deleteProductCustom(id),
    onSuccess: (_, { id, categoryId }) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: [QUERY_KEYS.PRODUCT_CUSTOM_BY_ID, id],
      });

      // Invalidate lists
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PRODUCT_CUSTOMS],
      });

      if (categoryId) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PRODUCT_CUSTOMS_BY_CATEGORY, categoryId],
        });
      }

      // Update statistics
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PRODUCT_CUSTOM_STATISTICS],
      });

      // Show success message
      showToast(
        ToastUtils.getSuccessMessage("delete", "sản phẩm tùy chỉnh"),
        "success"
      );
    },
    onError: (error) => {
      // Show error message
      const errorMessage = ErrorUtils.getOperationErrorMessage("delete", error);
      showToast(errorMessage, "error");
    },
  });
};

/**
 * Optimistic update mutation for better UX
 * @returns Mutation object with optimistic update
 */
export const useOptimisticUpdateProductCustomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ProductCustomWithRelations,
    Error,
    {
      id: string;
      data: UpdateProductCustomRequest;
      optimisticData: ProductCustomWithRelations;
    }
  >({
    mutationKey: [MUTATION_KEYS.UPDATE_PRODUCT_CUSTOM],
    mutationFn: ({ id, data }) => updateProductCustom(id, data),
    onMutate: async ({ id, optimisticData }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.PRODUCT_CUSTOM_BY_ID, id],
      });

      // Snapshot previous value
      const previousCustom =
        queryClient.getQueryData<ProductCustomWithRelations>([
          QUERY_KEYS.PRODUCT_CUSTOM_BY_ID,
          id,
        ]);

      // Optimistically update to new value
      queryClient.setQueryData(
        [QUERY_KEYS.PRODUCT_CUSTOM_BY_ID, id],
        optimisticData
      );

      // Return context with snapshotted value
      return { previousCustom };
    },
    onError: (error, { id }, context) => {
      // Rollback on error
      const contextData = context as
        | { previousCustom?: ProductCustomWithRelations }
        | undefined;
      if (contextData?.previousCustom) {
        queryClient.setQueryData(
          [QUERY_KEYS.PRODUCT_CUSTOM_BY_ID, id],
          contextData.previousCustom
        );
      }
      console.error("Error in optimistic update:", error);
    },
    onSettled: (_, __, { id }) => {
      // Always refetch to ensure consistency
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PRODUCT_CUSTOM_BY_ID, id],
      });
    },
  });
};
