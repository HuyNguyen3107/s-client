import { useState, useCallback } from "react";
import {
  useCreateBackgroundMutation,
  useUpdateBackgroundMutation,
} from "../mutations/background.mutations";
import { useUploadBackgroundImage } from "../mutations/upload.mutations";
import type {
  Background,
  CreateBackgroundRequest,
  BackgroundFormState,
} from "../types/background.types";
import { BACKGROUND_CONSTANTS } from "../constants/background.constants";

// Background Form Hook - Single Responsibility Principle (SRP)
export const useBackgroundForm = (initialBackground?: Background | null) => {
  const [formState, setFormState] = useState<BackgroundFormState>({
    isLoading: false,
    errors: {},
    touched: {},
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    initialBackground?.imageUrl || ""
  );

  // Mutations
  const createMutation = useCreateBackgroundMutation();
  const updateMutation = useUpdateBackgroundMutation();
  const uploadImageMutation = useUploadBackgroundImage();

  const isEditing = !!initialBackground;

  // Validation function
  const validateForm = useCallback(
    (data: CreateBackgroundRequest) => {
      const errors: Record<string, string> = {};

      if (!data.productId) {
        errors.productId = "Sản phẩm là bắt buộc";
      }

      if (!data.imageUrl && !imageFile) {
        errors.imageUrl = "Hình ảnh là bắt buộc";
      }

      if (
        data.name &&
        data.name.length > BACKGROUND_CONSTANTS.VALIDATION.NAME.MAX_LENGTH
      ) {
        errors.name = "Tên quá dài";
      }

      if (
        data.description &&
        data.description.length >
          BACKGROUND_CONSTANTS.VALIDATION.DESCRIPTION.MAX_LENGTH
      ) {
        errors.description = "Mô tả quá dài";
      }

      return errors;
    },
    [imageFile]
  );

  // Submit handler
  const handleSubmit = useCallback(
    async (
      data: CreateBackgroundRequest,
      onSuccess?: () => void
    ): Promise<boolean> => {
      const validationErrors = validateForm(data);

      if (Object.keys(validationErrors).length > 0) {
        setFormState((prev) => ({
          ...prev,
          errors: validationErrors,
        }));
        return false;
      }

      setFormState((prev) => ({ ...prev, isLoading: true, errors: {} }));

      try {
        let finalImageUrl = data.imageUrl;

        // Upload new image if selected
        if (imageFile) {
          const uploadResult = await uploadImageMutation.mutateAsync(imageFile);
          finalImageUrl = uploadResult.data?.url || "";
        }

        const submitData = {
          ...data,
          imageUrl: finalImageUrl,
        };

        if (isEditing && initialBackground) {
          await updateMutation.mutateAsync({
            id: initialBackground.id,
            ...submitData,
          });
        } else {
          await createMutation.mutateAsync(submitData);
        }

        onSuccess?.();
        return true;
      } catch (error) {
        console.error("Error submitting form:", error);
        return false;
      } finally {
        setFormState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [
      validateForm,
      imageFile,
      uploadImageMutation,
      isEditing,
      initialBackground,
      updateMutation,
      createMutation,
    ]
  );

  // Image handling
  const handleImageUpload = useCallback((file: File) => {
    // Validate file type and size
    if (
      !(
        BACKGROUND_CONSTANTS.VALIDATION.IMAGE.ALLOWED_TYPES as readonly string[]
      ).includes(file.type)
    ) {
      setFormState((prev) => ({
        ...prev,
        errors: {
          ...prev.errors,
          imageUrl: BACKGROUND_CONSTANTS.ERROR_MESSAGES.INVALID_IMAGE,
        },
      }));
      return false;
    }

    if (file.size > BACKGROUND_CONSTANTS.VALIDATION.IMAGE.MAX_SIZE) {
      setFormState((prev) => ({
        ...prev,
        errors: {
          ...prev.errors,
          imageUrl: BACKGROUND_CONSTANTS.ERROR_MESSAGES.IMAGE_TOO_LARGE,
        },
      }));
      return false;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
    };
    reader.readAsDataURL(file);

    // Clear image error
    setFormState((prev) => {
      const newErrors = { ...prev.errors };
      delete newErrors.imageUrl;
      return {
        ...prev,
        errors: newErrors,
      };
    });

    return true;
  }, []);

  const handleRemoveImage = useCallback(() => {
    setImageFile(null);
    setImagePreview("");
  }, []);

  // Clear form errors
  const clearError = useCallback((field: string) => {
    setFormState((prev) => {
      const newErrors = { ...prev.errors };
      delete newErrors[field];
      return {
        ...prev,
        errors: newErrors,
      };
    });
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setFormState({
      isLoading: false,
      errors: {},
      touched: {},
    });
    setImageFile(null);
    setImagePreview(initialBackground?.imageUrl || "");
  }, [initialBackground]);

  const isSubmitting =
    formState.isLoading ||
    createMutation.isPending ||
    updateMutation.isPending ||
    uploadImageMutation.isPending;

  return {
    // Form state
    formState,
    isEditing,
    isSubmitting,
    imageFile,
    imagePreview,

    // Actions
    handleSubmit,
    handleImageUpload,
    handleRemoveImage,
    clearError,
    resetForm,
    validateForm,

    // Mutation states
    createError: createMutation.error,
    updateError: updateMutation.error,
    uploadError: uploadImageMutation.error,
  };
};
