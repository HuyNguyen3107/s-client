import { useCallback, useMemo } from "react";
import type {
  IProductCategoryFormHook,
  IProductCategoryFormData,
} from "../types";
import {
  useCreateProductCategoryMutation,
  useUpdateProductCategoryMutation,
  useDeleteProductCategoryMutation,
} from "../mutations";
import { ProductCategoryValidator } from "../utils";
import { PRODUCT_CATEGORY_CONSTANTS } from "../constants";
import { useToastStore } from "../../../store/toast.store";

/**
 * Custom hook for managing product category form operations
 * Following Single Responsibility Principle and Interface Segregation Principle
 */
export const useProductCategoryForm = (): IProductCategoryFormHook => {
  const { showToast } = useToastStore();

  // Mutations
  const createMutation = useCreateProductCategoryMutation();
  const updateMutation = useUpdateProductCategoryMutation();
  const deleteMutation = useDeleteProductCategoryMutation();

  // Submit new category
  const submitCategory = useCallback(
    async (data: IProductCategoryFormData): Promise<void> => {
      try {
        // Validate form data
        const validation =
          ProductCategoryValidator.validateProductCategoryForm(data);
        if (!validation.isValid) {
          const errorMessage = Object.values(validation.errors)[0];
          showToast(errorMessage, "error");
          throw new Error(errorMessage);
        }

        // Create category
        await createMutation.mutateAsync({
          name: data.name.trim(),
          productId: data.productId,
        });

        showToast(
          PRODUCT_CATEGORY_CONSTANTS.SUCCESS_MESSAGES.CREATE_SUCCESS,
          "success"
        );
      } catch (error: any) {
        const errorMessage =
          error?.message ||
          PRODUCT_CATEGORY_CONSTANTS.ERROR_MESSAGES.CREATE_FAILED;
        showToast(errorMessage, "error");
        throw error;
      }
    },
    [createMutation, showToast]
  );

  // Update existing category
  const updateCategory = useCallback(
    async (
      id: string,
      data: Partial<IProductCategoryFormData>
    ): Promise<void> => {
      try {
        // Validate form data if name is provided
        if (data.name) {
          const nameValid = ProductCategoryValidator.validateCategoryName(
            data.name
          );
          if (!nameValid) {
            const errorMessage =
              PRODUCT_CATEGORY_CONSTANTS.ERROR_MESSAGES.NAME_TOO_SHORT;
            showToast(errorMessage, "error");
            throw new Error(errorMessage);
          }
        }

        // Update category
        const updateData: any = {};
        if (data.name) updateData.name = data.name.trim();
        if (data.productId) updateData.productId = data.productId;

        await updateMutation.mutateAsync({ id, data: updateData });

        showToast(
          PRODUCT_CATEGORY_CONSTANTS.SUCCESS_MESSAGES.UPDATE_SUCCESS,
          "success"
        );
      } catch (error: any) {
        const errorMessage =
          error?.message ||
          PRODUCT_CATEGORY_CONSTANTS.ERROR_MESSAGES.UPDATE_FAILED;
        showToast(errorMessage, "error");
        throw error;
      }
    },
    [updateMutation, showToast]
  );

  // Delete category
  const deleteCategory = useCallback(
    async (id: string, productId?: string): Promise<void> => {
      try {
        await deleteMutation.mutateAsync({ id, productId });

        showToast(
          PRODUCT_CATEGORY_CONSTANTS.SUCCESS_MESSAGES.DELETE_SUCCESS,
          "success"
        );
      } catch (error: any) {
        const errorMessage =
          error?.message ||
          PRODUCT_CATEGORY_CONSTANTS.ERROR_MESSAGES.DELETE_FAILED;
        showToast(errorMessage, "error");
        throw error;
      }
    },
    [deleteMutation, showToast]
  );

  // Combined loading state
  const isLoading = useMemo(
    () =>
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    [
      createMutation.isPending,
      updateMutation.isPending,
      deleteMutation.isPending,
    ]
  );

  // Combined error state
  const error = useMemo(
    () => createMutation.error || updateMutation.error || deleteMutation.error,
    [createMutation.error, updateMutation.error, deleteMutation.error]
  );

  return useMemo(
    () => ({
      isLoading,
      error,
      submitCategory,
      updateCategory,
      deleteCategory,
    }),
    [isLoading, error, submitCategory, updateCategory, deleteCategory]
  );
};
