import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import type {
  ProductCategoryWithRelations,
  CreateProductCategoryRequest,
  UpdateProductCategoryRequest,
} from "../types";
import { productCategoryService } from "../services";
import { PRODUCT_CATEGORY_CONSTANTS } from "../constants";
import { useToastStore } from "../../../store/toast.store";
import { ErrorUtils } from "../../../utils/error-handler.utils";

/**
 * Hook for creating product category
 * Following Single Responsibility Principle
 */
export const useCreateProductCategoryMutation = (): UseMutationResult<
  ProductCategoryWithRelations,
  Error,
  CreateProductCategoryRequest
> => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationKey: [PRODUCT_CATEGORY_CONSTANTS.MUTATION_KEYS.CREATE],
    mutationFn: (data: CreateProductCategoryRequest) =>
      productCategoryService.createProductCategory(data),
    onSuccess: (newCategory) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({
        queryKey: PRODUCT_CATEGORY_CONSTANTS.QUERY_KEYS.ALL,
      });

      // Invalidate statistics
      queryClient.invalidateQueries({
        queryKey: PRODUCT_CATEGORY_CONSTANTS.QUERY_KEYS.STATISTICS,
      });

      // Invalidate product-specific categories if available
      if (newCategory.productId) {
        queryClient.invalidateQueries({
          queryKey: PRODUCT_CATEGORY_CONSTANTS.QUERY_KEYS.BY_PRODUCT(
            newCategory.productId
          ),
        });
      }

      // Show success message
      showToast(
        PRODUCT_CATEGORY_CONSTANTS.SUCCESS_MESSAGES.CREATE_SUCCESS,
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
 * Hook for updating product category
 */
export const useUpdateProductCategoryMutation = (): UseMutationResult<
  ProductCategoryWithRelations,
  Error,
  { id: string; data: UpdateProductCategoryRequest }
> => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationKey: [PRODUCT_CATEGORY_CONSTANTS.MUTATION_KEYS.UPDATE],
    mutationFn: ({ id, data }) =>
      productCategoryService.updateProductCategory(id, data),
    onSuccess: (updatedCategory, { id }) => {
      // Update the specific item in cache
      queryClient.setQueryData(
        PRODUCT_CATEGORY_CONSTANTS.QUERY_KEYS.DETAIL(id),
        updatedCategory
      );

      // Invalidate list queries
      queryClient.invalidateQueries({
        queryKey: PRODUCT_CATEGORY_CONSTANTS.QUERY_KEYS.ALL,
      });

      // Invalidate statistics
      queryClient.invalidateQueries({
        queryKey: PRODUCT_CATEGORY_CONSTANTS.QUERY_KEYS.STATISTICS,
      });

      // Invalidate product-specific categories
      if (updatedCategory.productId) {
        queryClient.invalidateQueries({
          queryKey: PRODUCT_CATEGORY_CONSTANTS.QUERY_KEYS.BY_PRODUCT(
            updatedCategory.productId
          ),
        });
      }

      // Show success message
      showToast(
        PRODUCT_CATEGORY_CONSTANTS.SUCCESS_MESSAGES.UPDATE_SUCCESS,
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
 * Hook for deleting product category
 */
export const useDeleteProductCategoryMutation = (): UseMutationResult<
  void,
  Error,
  { id: string; productId?: string }
> => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationKey: [PRODUCT_CATEGORY_CONSTANTS.MUTATION_KEYS.DELETE],
    mutationFn: ({ id }) => productCategoryService.deleteProductCategory(id),
    onSuccess: (_, { id, productId }) => {
      // Remove the specific item from cache
      queryClient.removeQueries({
        queryKey: PRODUCT_CATEGORY_CONSTANTS.QUERY_KEYS.DETAIL(id),
      });

      // Invalidate list queries
      queryClient.invalidateQueries({
        queryKey: PRODUCT_CATEGORY_CONSTANTS.QUERY_KEYS.ALL,
      });

      // Invalidate statistics
      queryClient.invalidateQueries({
        queryKey: PRODUCT_CATEGORY_CONSTANTS.QUERY_KEYS.STATISTICS,
      });

      // Invalidate product-specific categories if available
      if (productId) {
        queryClient.invalidateQueries({
          queryKey: PRODUCT_CATEGORY_CONSTANTS.QUERY_KEYS.BY_PRODUCT(productId),
        });
      }

      // Show success message
      showToast(
        PRODUCT_CATEGORY_CONSTANTS.SUCCESS_MESSAGES.DELETE_SUCCESS,
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
