import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "../mutations";
import { productValidator } from "../utils";
import type { ProductWithRelations, IProductFormData } from "../types";

interface UseProductFormProps {
  product?: ProductWithRelations;
  onSuccess?: () => void;
}

export const useProductForm = ({
  product,
  onSuccess,
}: UseProductFormProps = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!product;

  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();

  const form = useForm<IProductFormData>({
    defaultValues: {
      name: "",
      collectionId: "",
      status: "active" as const,
      hasBg: false,
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        collectionId: product.collectionId,
        status: (product.status as any) || "active",
        hasBg: product.hasBg || false,
      });
    } else {
      reset({
        name: "",
        collectionId: "",
        status: "active",
        hasBg: false,
      });
    }
  }, [product, reset]);

  // Form validation using validator utility
  const validateForm = (data: IProductFormData): boolean => {
    const result = productValidator.validateProductForm(data);
    return result.isValid;
  };

  // Submit handler
  const onSubmit = async (data: IProductFormData) => {
    if (!validateForm(data)) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && product) {
        await updateMutation.mutateAsync({
          id: product.id,
          data: {
            name: data.name.trim(),
            collectionId: data.collectionId,
            status: data.status,
            hasBg: data.hasBg,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: data.name.trim(),
          collectionId: data.collectionId,
          status: data.status,
          hasBg: data.hasBg,
        });
      }

      // Reset form after successful creation
      if (!isEditing) {
        reset();
      }

      onSuccess?.();
    } catch (error) {
      // Error is handled by mutations
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel handler
  const onCancel = () => {
    if (product) {
      reset({
        name: product.name,
        collectionId: product.collectionId,
        status: (product.status as any) || "active",
        hasBg: product.hasBg || false,
      });
    } else {
      reset();
    }
  };

  return {
    // Form state
    form,
    errors,
    isEditing,
    isSubmitting:
      isSubmitting || createMutation.isPending || updateMutation.isPending,

    // Actions
    onSubmit: handleSubmit(onSubmit),
    onCancel,
    reset,

    // Utilities
    validateForm,
  };
};
