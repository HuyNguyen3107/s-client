import { useState, useCallback } from "react";
import type {
  ShippingFee,
  CreateShippingFeeRequest,
  UpdateShippingFeeRequest,
  IShippingFeeFormData,
} from "../types";
import {
  useCreateShippingFee,
  useUpdateShippingFee,
  useDeleteShippingFee,
} from "../mutations";
import {
  useShippingFeeForm,
  useShippingFeeValidation,
} from "./use-shipping-fee-form.hooks";

/**
 * Comprehensive hook for shipping fee CRUD operations
 * Similar to promotion form hook pattern
 */
export const useShippingFeeCrud = (initialData?: ShippingFee | null) => {
  const isEditing = !!initialData;

  // Initialize form data
  const initialFormData: Partial<IShippingFeeFormData> = initialData
    ? {
        shippingType: initialData.shippingType,
        area: initialData.area,
        estimatedDeliveryTime: initialData.estimatedDeliveryTime,
        shippingFee: initialData.shippingFee.toString(),
        notesOrRemarks: initialData.notesOrRemarks || "",
      }
    : {};

  // Form management
  const { formData, isDirty, updateField, resetForm, getSubmitData } =
    useShippingFeeForm(initialFormData);

  const { errors, isValid, validateForm, validateField, clearErrors } =
    useShippingFeeValidation();

  // Mutations
  const createMutation = useCreateShippingFee();
  const updateMutation = useUpdateShippingFee();
  const deleteMutation = useDeleteShippingFee();

  // Loading states
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;
  const isLoading = isSubmitting || isDeleting;

  // Handle field changes with validation
  const handleFieldChange = useCallback(
    (field: keyof IShippingFeeFormData, value: any) => {
      updateField(field, value);
      validateField(field, value);
    },
    [updateField, validateField]
  );

  // Submit form
  const submitForm = useCallback(
    async (onSuccess?: () => void): Promise<boolean> => {
      const submitData = getSubmitData();
      const validation = validateForm(submitData);

      if (!validation.isValid) {
        return false;
      }

      try {
        const requestData = {
          shippingType: submitData.shippingType,
          area: submitData.area,
          estimatedDeliveryTime: submitData.estimatedDeliveryTime,
          shippingFee: parseFloat(submitData.shippingFee.toString()),
          notesOrRemarks: submitData.notesOrRemarks || undefined,
        };

        if (isEditing && initialData?.id) {
          await updateMutation.mutateAsync({
            id: initialData.id,
            data: requestData as UpdateShippingFeeRequest,
          });
        } else {
          await createMutation.mutateAsync(
            requestData as CreateShippingFeeRequest
          );
        }

        // Reset form on successful create (but not update)
        if (!isEditing) {
          resetForm();
          clearErrors();
        }

        onSuccess?.();
        return true;
      } catch (error) {
        // Error handling is done in mutations
        console.error("Error submitting shipping fee:", error);
        return false;
      }
    },
    [
      getSubmitData,
      validateForm,
      isEditing,
      initialData?.id,
      updateMutation,
      createMutation,
      resetForm,
      clearErrors,
    ]
  );

  // Delete shipping fee
  const deleteShippingFee = useCallback(
    async (onSuccess?: () => void): Promise<boolean> => {
      if (!initialData?.id) return false;

      try {
        await deleteMutation.mutateAsync(initialData.id);
        onSuccess?.();
        return true;
      } catch (error) {
        console.error("Error deleting shipping fee:", error);
        return false;
      }
    },
    [deleteMutation, initialData?.id]
  );

  // Reset form to initial state
  const handleReset = useCallback(() => {
    resetForm(initialFormData);
    clearErrors();
  }, [resetForm, clearErrors, initialFormData]);

  return {
    // Form state
    formData,
    errors,
    isValid,
    isDirty,
    isEditing,

    // Loading states
    isLoading,
    isSubmitting,
    isDeleting,

    // Success states
    isCreateSuccess: createMutation.isSuccess,
    isUpdateSuccess: updateMutation.isSuccess,
    isDeleteSuccess: deleteMutation.isSuccess,

    // Actions
    handleFieldChange,
    submitForm,
    deleteShippingFee,
    handleReset,
    validateForm,
    clearErrors,

    // Raw mutations (for advanced usage)
    createMutation,
    updateMutation,
    deleteMutation,

    // Data
    initialData,
  };
};

/**
 * Hook for simple create operation
 */
export const useCreateShippingFeeForm = () => {
  return useShippingFeeCrud();
};

/**
 * Hook for edit operation
 */
export const useEditShippingFeeForm = (shippingFee: ShippingFee) => {
  return useShippingFeeCrud(shippingFee);
};

/**
 * Hook for managing modal state with CRUD operations
 */
export const useShippingFeeModalCrud = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedShippingFee, setSelectedShippingFee] =
    useState<ShippingFee | null>(null);

  const createCrud = useShippingFeeCrud();
  const editCrud = useShippingFeeCrud(selectedShippingFee);

  const openCreateModal = useCallback(() => {
    setSelectedShippingFee(null);
    setIsCreateModalOpen(true);
  }, []);

  const openEditModal = useCallback((shippingFee: ShippingFee) => {
    setSelectedShippingFee(shippingFee);
    setIsEditModalOpen(true);
  }, []);

  const openDeleteModal = useCallback((shippingFee: ShippingFee) => {
    setSelectedShippingFee(shippingFee);
    setIsDeleteModalOpen(true);
  }, []);

  const closeAllModals = useCallback(() => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedShippingFee(null);
  }, []);

  const handleCreateSuccess = useCallback(() => {
    closeAllModals();
  }, [closeAllModals]);

  const handleEditSuccess = useCallback(() => {
    closeAllModals();
  }, [closeAllModals]);

  const handleDeleteSuccess = useCallback(() => {
    closeAllModals();
  }, [closeAllModals]);

  return {
    // Modal state
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    selectedShippingFee,

    // Modal actions
    openCreateModal,
    openEditModal,
    openDeleteModal,
    closeAllModals,

    // CRUD operations with success handlers
    createCrud,
    editCrud,
    handleCreateSuccess,
    handleEditSuccess,
    handleDeleteSuccess,
  };
};
