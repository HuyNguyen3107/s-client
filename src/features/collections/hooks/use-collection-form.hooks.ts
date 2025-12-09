import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
} from "../mutations/collection.mutations";
import { useUploadCollectionImageMutation } from "../mutations/upload.mutations";
import type {
  Collection,
  CreateCollectionRequest,
} from "../types/collection.types";
import { COLLECTION_CONSTANTS } from "../constants/collection.constants";

interface UseCollectionFormProps {
  collection?: Collection;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface CollectionFormData extends CreateCollectionRequest {}

// Custom Hook for Collection Form Management - Single Responsibility Principle (SRP)
export const useCollectionForm = ({
  collection,
  onSuccess,
  onCancel,
}: UseCollectionFormProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const isEditMode = !!collection;

  // Form management with react-hook-form
  const form = useForm<CollectionFormData>({
    defaultValues: {
      name: "",
      slug: "",
      imageUrl: "",
      isActive: true,
      isHot: false,
    },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid, isDirty },
  } = form;

  // Mutations
  const createMutation = useCreateCollectionMutation();
  const updateMutation = useUpdateCollectionMutation();
  const uploadImageMutation = useUploadCollectionImageMutation();

  // Form state
  const watchedName = watch("name");
  const watchedSlug = watch("slug");

  // Auto-generate slug from name
  const generateSlug = useCallback((name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
  }, []);

  // Auto-generate slug when name changes (only in create mode)
  useEffect(() => {
    if (!isEditMode && watchedName && !isDirty) {
      const slug = generateSlug(watchedName);
      setValue("slug", slug, { shouldValidate: true });
    }
  }, [watchedName, isEditMode, isDirty, generateSlug, setValue]);

  // Initialize form with collection data in edit mode
  useEffect(() => {
    if (isEditMode && collection) {
      reset({
        name: collection.name,
        slug: collection.slug,
        imageUrl: collection.imageUrl || "",
        isActive: collection.isActive,
        isHot: collection.isHot,
      });
    }
  }, [collection, isEditMode, reset]);

  // Validation rules
  const validationRules = {
    name: {
      required: "Tên bộ sưu tập là bắt buộc",
      minLength: {
        value: COLLECTION_CONSTANTS.VALIDATION.NAME.MIN_LENGTH,
        message: `Tên phải có ít nhất ${COLLECTION_CONSTANTS.VALIDATION.NAME.MIN_LENGTH} ký tự`,
      },
      maxLength: {
        value: COLLECTION_CONSTANTS.VALIDATION.NAME.MAX_LENGTH,
        message: `Tên không được vượt quá ${COLLECTION_CONSTANTS.VALIDATION.NAME.MAX_LENGTH} ký tự`,
      },
    },
    slug: {
      required: "Đường dẫn là bắt buộc",
      pattern: {
        value: COLLECTION_CONSTANTS.VALIDATION.SLUG.PATTERN,
        message: "Đường dẫn chỉ được chứa chữ thường, số và dấu gạch ngang",
      },
      minLength: {
        value: COLLECTION_CONSTANTS.VALIDATION.SLUG.MIN_LENGTH,
        message: `Đường dẫn phải có ít nhất ${COLLECTION_CONSTANTS.VALIDATION.SLUG.MIN_LENGTH} ký tự`,
      },
      maxLength: {
        value: COLLECTION_CONSTANTS.VALIDATION.SLUG.MAX_LENGTH,
        message: `Đường dẫn không được vượt quá ${COLLECTION_CONSTANTS.VALIDATION.SLUG.MAX_LENGTH} ký tự`,
      },
    },
  };

  // Form submission
  const onSubmit = useCallback(
    async (data: CollectionFormData) => {
      try {
        if (isEditMode && collection) {
          await updateMutation.mutateAsync({
            id: collection.id,
            ...data,
          });
        } else {
          await createMutation.mutateAsync(data);
        }

        onSuccess?.();
      } catch (error) {
        // Error handling is done in mutations
        console.error("Form submission error:", error);
      }
    },
    [isEditMode, collection, updateMutation, createMutation, onSuccess]
  );

  // Image upload handler
  const handleImageUpload = useCallback(
    async (file: File, field: "imageUrl") => {
      setIsUploading(true);
      setUploadProgress(0);

      try {
        // Use the actual upload service
        const result = await uploadImageMutation.mutateAsync(file);

        if (result.success && result.data?.url) {
          setValue(field, result.data.url, { shouldValidate: true });
          setUploadProgress(100);
        }
      } catch (error) {
        console.error("Upload failed:", error);
        // Error is already handled in the mutation
      } finally {
        setIsUploading(false);
        setTimeout(() => setUploadProgress(0), 1000);
      }
    },
    [setValue, uploadImageMutation]
  );

  // Form actions
  const handleCancel = useCallback(() => {
    reset();
    onCancel?.();
  }, [reset, onCancel]);

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  // Computed states
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const canSubmit = isValid && isDirty && !isSubmitting && !isUploading;

  return {
    // Form
    form,
    register,
    handleSubmit: handleSubmit(onSubmit),
    watch,
    setValue,
    reset,
    errors,

    // States
    isEditMode,
    isValid,
    isDirty,
    isSubmitting,
    isUploading,
    uploadProgress,
    canSubmit,

    // Validation
    validationRules,

    // Actions
    handleCancel,
    handleReset,
    handleImageUpload,
    generateSlug,

    // Values
    watchedName,
    watchedSlug,
  };
};
