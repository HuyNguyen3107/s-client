import { useState, useCallback } from "react";
import {
  useUpdateProductVariantStatusMutation,
  useDeleteProductVariantMutation,
  useDuplicateProductVariantMutation,
} from "../mutations";
import type { ProductVariantWithProduct, ProductVariantStatus } from "../types";

interface UseProductVariantActionsProps {
  onStatusUpdate?: (variant: ProductVariantWithProduct) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (variant: ProductVariantWithProduct) => void;
}

/**
 * Custom hook for product variant actions (status update, delete, duplicate)
 * Following Single Responsibility Principle
 */
export const useProductVariantActions = ({
  onStatusUpdate,
  onDelete,
  onDuplicate,
}: UseProductVariantActionsProps = {}) => {
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});

  const updateStatusMutation = useUpdateProductVariantStatusMutation();
  const deleteMutation = useDeleteProductVariantMutation();
  const duplicateMutation = useDuplicateProductVariantMutation();

  // Set loading state for specific variant and action
  const setLoading = useCallback(
    (id: string, action: string, isLoading: boolean) => {
      setLoadingStates((prev) => ({
        ...prev,
        [`${id}_${action}`]: isLoading,
      }));
    },
    []
  );

  // Get loading state for specific variant and action
  const isLoading = useCallback(
    (id: string, action: string) => {
      return loadingStates[`${id}_${action}`] || false;
    },
    [loadingStates]
  );

  // Update status
  const updateStatus = useCallback(
    async (id: string, status: ProductVariantStatus) => {
      setLoading(id, "status", true);
      try {
        const result = await updateStatusMutation.mutateAsync({
          id,
          data: { status },
        });
        onStatusUpdate?.(result);
        return result;
      } finally {
        setLoading(id, "status", false);
      }
    },
    [updateStatusMutation, onStatusUpdate, setLoading]
  );

  // Delete variant
  const deleteVariant = useCallback(
    async (id: string) => {
      setLoading(id, "delete", true);
      try {
        await deleteMutation.mutateAsync(id);
        onDelete?.(id);
      } finally {
        setLoading(id, "delete", false);
      }
    },
    [deleteMutation, onDelete, setLoading]
  );

  // Duplicate variant
  const duplicateVariant = useCallback(
    async (id: string) => {
      setLoading(id, "duplicate", true);
      try {
        const result = await duplicateMutation.mutateAsync(id);
        onDuplicate?.(result);
        return result;
      } finally {
        setLoading(id, "duplicate", false);
      }
    },
    [duplicateMutation, onDuplicate, setLoading]
  );

  return {
    updateStatus,
    deleteVariant,
    duplicateVariant,
    isLoading,
    // Overall loading states
    isUpdatingStatus: updateStatusMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isDuplicating: duplicateMutation.isPending,
  };
};
