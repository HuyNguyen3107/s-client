import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "../../../store/toast.store";
import { COLLECTION_CONSTANTS } from "../constants/collection.constants";
import { MUTATION_KEYS } from "../../../constants/mutation-key.constants";
import {
  createCollection,
  updateCollection,
  deleteCollection,
  toggleCollectionStatus,
} from "../services/collection.services";
import type {
  Collection,
  CreateCollectionRequest,
  UpdateCollectionRequest,
} from "../types/collection.types";

// Mutation Repository - Single Responsibility Principle (SRP)
// Using service layer instead of direct HTTP calls
const collectionMutationRepository = {
  createCollection,
  updateCollection,
  deleteCollection,
  toggleCollectionStatus,
};

// Custom Hook for Create Collection - Open/Closed Principle (OCP)
export const useCreateCollectionMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationKey: [MUTATION_KEYS.CREATE_COLLECTION],
    mutationFn: (data: CreateCollectionRequest) =>
      collectionMutationRepository.createCollection(data),

    onSuccess: () => {
      // Invalidate collections cache
      queryClient.invalidateQueries({
        queryKey: [COLLECTION_CONSTANTS.CACHE_KEYS.COLLECTIONS],
      });

      // Show success message
      showToast(
        COLLECTION_CONSTANTS.SUCCESS_MESSAGES.CREATE_SUCCESS,
        "success"
      );
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        COLLECTION_CONSTANTS.ERROR_MESSAGES.CREATE_FAILED;
      showToast(message, "error");
    },
  });
};

// Custom Hook for Update Collection
export const useUpdateCollectionMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationKey: [MUTATION_KEYS.UPDATE_COLLECTION],
    mutationFn: (data: UpdateCollectionRequest) =>
      collectionMutationRepository.updateCollection(data),

    onSuccess: (data) => {
      // Update specific collection in cache
      queryClient.setQueryData(
        [COLLECTION_CONSTANTS.CACHE_KEYS.COLLECTION_DETAIL, data.id],
        data
      );

      // Invalidate collections list cache
      queryClient.invalidateQueries({
        queryKey: [COLLECTION_CONSTANTS.CACHE_KEYS.COLLECTIONS],
      });

      // Invalidate hot collections if isHot changed
      queryClient.invalidateQueries({
        queryKey: [COLLECTION_CONSTANTS.CACHE_KEYS.HOT_COLLECTIONS],
      });

      showToast(
        COLLECTION_CONSTANTS.SUCCESS_MESSAGES.UPDATE_SUCCESS,
        "success"
      );
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        COLLECTION_CONSTANTS.ERROR_MESSAGES.UPDATE_FAILED;
      showToast(message, "error");
    },
  });
};

// Custom Hook for Delete Collection
export const useDeleteCollectionMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationKey: [MUTATION_KEYS.DELETE_COLLECTION],
    mutationFn: (id: string) =>
      collectionMutationRepository.deleteCollection(id),

    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: [
          COLLECTION_CONSTANTS.CACHE_KEYS.COLLECTION_DETAIL,
          deletedId,
        ],
      });

      // Invalidate collections list
      queryClient.invalidateQueries({
        queryKey: [COLLECTION_CONSTANTS.CACHE_KEYS.COLLECTIONS],
      });

      // Invalidate hot collections
      queryClient.invalidateQueries({
        queryKey: [COLLECTION_CONSTANTS.CACHE_KEYS.HOT_COLLECTIONS],
      });

      showToast(
        COLLECTION_CONSTANTS.SUCCESS_MESSAGES.DELETE_SUCCESS,
        "success"
      );
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        COLLECTION_CONSTANTS.ERROR_MESSAGES.DELETE_FAILED;
      showToast(message, "error");
    },
  });
};

// Custom Hook for Toggle Collection Status
export const useToggleCollectionStatusMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationKey: [MUTATION_KEYS.TOGGLE_COLLECTION_STATUS],
    mutationFn: (id: string) =>
      collectionMutationRepository.toggleCollectionStatus(id),

    onSuccess: (data) => {
      // Update specific collection in cache
      queryClient.setQueryData(
        [COLLECTION_CONSTANTS.CACHE_KEYS.COLLECTION_DETAIL, data.id],
        data
      );

      // Invalidate collections list
      queryClient.invalidateQueries({
        queryKey: [COLLECTION_CONSTANTS.CACHE_KEYS.COLLECTIONS],
      });

      // Invalidate hot collections if affected
      if (data.isHot) {
        queryClient.invalidateQueries({
          queryKey: [COLLECTION_CONSTANTS.CACHE_KEYS.HOT_COLLECTIONS],
        });
      }

      showToast(
        COLLECTION_CONSTANTS.SUCCESS_MESSAGES.STATUS_CHANGED,
        "success"
      );
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        COLLECTION_CONSTANTS.ERROR_MESSAGES.TOGGLE_STATUS_FAILED;
      showToast(message, "error");
    },
  });
};
