import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductCustomMutation,
  useUpdateProductCustomMutation,
  useUpdateProductCustomStatusMutation,
  useDeleteProductCustomMutation,
} from "../mutations";
import { productCustomValidator } from "../utils";
import type {
  IProductCustomFormData,
  IProductCustomFormHook,
  ValidationResult,
} from "../types";
import { ROUTE_PATH } from "../../../constants/route-path.constants";

/**
 * Hook for managing product custom form operations
 * Following Single Responsibility Principle - handles form state and operations
 */
export const useProductCustomForm = (): IProductCustomFormHook => {
  const navigate = useNavigate();

  // Mutations
  const createMutation = useCreateProductCustomMutation();
  const updateMutation = useUpdateProductCustomMutation();
  const updateStatusMutation = useUpdateProductCustomStatusMutation();
  const deleteMutation = useDeleteProductCustomMutation();

  // Determine loading state from any active mutation
  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    updateStatusMutation.isPending ||
    deleteMutation.isPending;

  // Determine error state from any failed mutation
  const error =
    createMutation.error ||
    updateMutation.error ||
    updateStatusMutation.error ||
    deleteMutation.error;

  /**
   * Validate form data
   * @param data - Form data to validate
   * @returns Validation result
   */
  const validateForm = useCallback(
    (data: IProductCustomFormData): ValidationResult => {
      const result = productCustomValidator.validateProductCustomForm(data);
      return result;
    },
    []
  );

  /**
   * Submit new product custom
   * @param data - Product custom data
   */
  const submitCustom = useCallback(
    async (data: IProductCustomFormData): Promise<void> => {
      try {
        // Validate form data
        const validation = validateForm(data);
        if (!validation.isValid) {
          throw new Error("Form validation failed");
        }

        // Submit data
        await createMutation.mutateAsync(data);

        // Navigate to custom detail or back to list
        navigate(ROUTE_PATH.PRODUCT_CUSTOMS);

        return Promise.resolve();
      } catch (error) {
        console.error("Error creating product custom:", error);
        throw error;
      }
    },
    [createMutation, navigate, validateForm]
  );

  /**
   * Update existing product custom
   * @param id - Product custom ID
   * @param data - Updated product custom data
   */
  const updateCustom = useCallback(
    async (
      id: string,
      data: Partial<IProductCustomFormData>
    ): Promise<void> => {
      try {
        // If updating with complete data, validate
        if (Object.keys(data).length > 1) {
          const validation = validateForm(data as IProductCustomFormData);
          if (!validation.isValid) {
            throw new Error("Form validation failed");
          }
        }

        // Submit update
        await updateMutation.mutateAsync({ id, data });

        return Promise.resolve();
      } catch (error) {
        console.error("Error updating product custom:", error);
        throw error;
      }
    },
    [updateMutation, validateForm]
  );

  /**
   * Update product custom status only
   * @param id - Product custom ID
   * @param status - New status
   */
  const updateCustomStatus = useCallback(
    async (id: string, status: string): Promise<void> => {
      try {
        await updateStatusMutation.mutateAsync({ id, status });
        return Promise.resolve();
      } catch (error) {
        console.error("Error updating product custom status:", error);
        throw error;
      }
    },
    [updateStatusMutation]
  );

  /**
   * Delete product custom
   * @param id - Product custom ID
   * @param categoryId - Optional category ID for cache invalidation
   */
  const deleteCustom = useCallback(
    async (id: string, categoryId?: string): Promise<void> => {
      try {
        await deleteMutation.mutateAsync({ id, categoryId });
        return Promise.resolve();
      } catch (error) {
        console.error("Error deleting product custom:", error);
        throw error;
      }
    },
    [deleteMutation]
  );

  return {
    isLoading,
    error,
    submitCustom,
    updateCustom,
    updateCustomStatus,
    deleteCustom,
  };
};

/**
 * Hook for managing bulk operations on product customs
 * @returns Bulk operation handlers
 */
export const useProductCustomBulkOperations = () => {
  const updateStatusMutation = useUpdateProductCustomStatusMutation();
  const deleteMutation = useDeleteProductCustomMutation();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Bulk update status for multiple product customs
   * @param ids - Array of product custom IDs
   * @param status - New status
   */
  const bulkUpdateStatus = useCallback(
    async (ids: string[], status: string): Promise<void> => {
      if (ids.length === 0) return;

      setIsLoading(true);
      setError(null);

      try {
        // Execute all status updates in parallel
        await Promise.all(
          ids.map((id) => updateStatusMutation.mutateAsync({ id, status }))
        );
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Bulk update failed");
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [updateStatusMutation]
  );

  /**
   * Bulk delete multiple product customs
   * @param customs - Array of customs with id and optional categoryId
   */
  const bulkDelete = useCallback(
    async (customs: { id: string; categoryId?: string }[]): Promise<void> => {
      if (customs.length === 0) return;

      setIsLoading(true);
      setError(null);

      try {
        // Execute all deletions in parallel
        await Promise.all(
          customs.map((custom) =>
            deleteMutation.mutateAsync({
              id: custom.id,
              categoryId: custom.categoryId,
            })
          )
        );
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Bulk delete failed");
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [deleteMutation]
  );

  return {
    isLoading,
    error,
    bulkUpdateStatus,
    bulkDelete,
  };
};

/**
 * Hook for form field validation
 * @param initialData - Initial form data
 * @returns Field validation utilities
 */
export const useProductCustomFormValidation = (
  initialData?: Partial<IProductCustomFormData>
) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  /**
   * Validate single field
   * @param fieldName - Field name
   * @param value - Field value
   */
  const validateField = useCallback(
    (fieldName: string, value: any) => {
      const errors: Record<string, string> = {};

      // Create temporary form data for validation
      const formData: IProductCustomFormData = {
        productCategoryId: initialData?.productCategoryId || "",
        name: initialData?.name || "",
        imageUrl: initialData?.imageUrl || "",
        price: initialData?.price,
        description: initialData?.description,
        status: initialData?.status,
        [fieldName]: value,
      };

      const validation =
        productCustomValidator.validateProductCustomForm(formData);

      if (!validation.isValid && validation.errors[fieldName]) {
        errors[fieldName] = validation.errors[fieldName];
      }

      setFieldErrors((prev) => {
        const updated = { ...prev, ...errors };
        if (validation.isValid && prev[fieldName]) {
          delete updated[fieldName];
        }
        return updated;
      });
    },
    [initialData]
  );

  /**
   * Mark field as touched
   * @param fieldName - Field name
   */
  const touchField = useCallback((fieldName: string) => {
    setTouchedFields((prev) => new Set([...prev, fieldName]));
  }, []);

  /**
   * Get field error if field is touched
   * @param fieldName - Field name
   * @returns Error message or undefined
   */
  const getFieldError = useCallback(
    (fieldName: string): string | undefined => {
      return touchedFields.has(fieldName) ? fieldErrors[fieldName] : undefined;
    },
    [fieldErrors, touchedFields]
  );

  /**
   * Clear all validation errors
   */
  const clearErrors = useCallback(() => {
    setFieldErrors({});
    setTouchedFields(new Set());
  }, []);

  return {
    fieldErrors,
    touchedFields,
    validateField,
    touchField,
    getFieldError,
    clearErrors,
  };
};
