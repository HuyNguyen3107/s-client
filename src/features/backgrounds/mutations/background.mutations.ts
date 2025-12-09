import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "../../../store/toast.store";
import { BACKGROUND_CONSTANTS } from "../constants/background.constants";
import { MUTATION_KEYS } from "../../../constants/mutation-key.constants";
import {
  createBackground,
  updateBackground,
  deleteBackground,
  uploadBackgroundImage,
  deleteBackgroundImage,
} from "../services/background.services";
import type {
  CreateBackgroundRequest,
  UpdateBackgroundRequest,
} from "../types/background.types";

// Mutation Repository - Single Responsibility Principle (SRP)
// Using service layer instead of direct HTTP calls
const backgroundMutationRepository = {
  createBackground,
  updateBackground,
  deleteBackground,
  uploadBackgroundImage,
  deleteBackgroundImage,
};

// Custom Hook for Create Background - Open/Closed Principle (OCP)
export const useCreateBackgroundMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationKey: [MUTATION_KEYS.CREATE_BACKGROUND],
    mutationFn: (data: CreateBackgroundRequest) =>
      backgroundMutationRepository.createBackground(data),

    onSuccess: () => {
      // Invalidate backgrounds cache
      queryClient.invalidateQueries({
        queryKey: [BACKGROUND_CONSTANTS.CACHE_KEYS.BACKGROUNDS],
      });

      // Show success message
      showToast(
        BACKGROUND_CONSTANTS.SUCCESS_MESSAGES.CREATE_SUCCESS,
        "success"
      );
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        BACKGROUND_CONSTANTS.ERROR_MESSAGES.CREATE_FAILED;
      showToast(message, "error");
    },
  });
};

// Custom Hook for Update Background
export const useUpdateBackgroundMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationKey: [MUTATION_KEYS.UPDATE_BACKGROUND],
    mutationFn: (data: UpdateBackgroundRequest) =>
      backgroundMutationRepository.updateBackground(data),

    onSuccess: (data) => {
      // Update specific background in cache
      queryClient.setQueryData(
        [BACKGROUND_CONSTANTS.CACHE_KEYS.BACKGROUND_DETAIL, data.id],
        data
      );

      // Invalidate backgrounds list cache
      queryClient.invalidateQueries({
        queryKey: [BACKGROUND_CONSTANTS.CACHE_KEYS.BACKGROUNDS],
      });

      // Invalidate backgrounds by product
      queryClient.invalidateQueries({
        queryKey: [
          BACKGROUND_CONSTANTS.CACHE_KEYS.BACKGROUNDS_BY_PRODUCT,
          data.productId,
        ],
      });

      showToast(
        BACKGROUND_CONSTANTS.SUCCESS_MESSAGES.UPDATE_SUCCESS,
        "success"
      );
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        BACKGROUND_CONSTANTS.ERROR_MESSAGES.UPDATE_FAILED;
      showToast(message, "error");
    },
  });
};

// Custom Hook for Delete Background
export const useDeleteBackgroundMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationKey: [MUTATION_KEYS.DELETE_BACKGROUND],
    mutationFn: (id: string) =>
      backgroundMutationRepository.deleteBackground(id),

    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: [
          BACKGROUND_CONSTANTS.CACHE_KEYS.BACKGROUND_DETAIL,
          deletedId,
        ],
      });

      // Invalidate backgrounds list
      queryClient.invalidateQueries({
        queryKey: [BACKGROUND_CONSTANTS.CACHE_KEYS.BACKGROUNDS],
      });

      // Invalidate all backgrounds by product
      queryClient.invalidateQueries({
        queryKey: [BACKGROUND_CONSTANTS.CACHE_KEYS.BACKGROUNDS_BY_PRODUCT],
      });

      showToast(
        BACKGROUND_CONSTANTS.SUCCESS_MESSAGES.DELETE_SUCCESS,
        "success"
      );
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        BACKGROUND_CONSTANTS.ERROR_MESSAGES.DELETE_FAILED;
      showToast(message, "error");
    },
  });
};

// Custom Hook for Upload Background Image
export const useUploadBackgroundImageMutation = () => {
  const { showToast } = useToastStore();

  return useMutation({
    mutationKey: [MUTATION_KEYS.UPLOAD_BACKGROUND_IMAGE],
    mutationFn: (file: File) =>
      backgroundMutationRepository.uploadBackgroundImage(file),

    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Không thể tải lên hình ảnh";
      showToast(message, "error");
    },
  });
};

// Custom Hook for Delete Background Image
export const useDeleteBackgroundImageMutation = () => {
  const { showToast } = useToastStore();

  return useMutation({
    mutationKey: [MUTATION_KEYS.DELETE_BACKGROUND_IMAGE],
    mutationFn: (publicId: string) =>
      backgroundMutationRepository.deleteBackgroundImage(publicId),

    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Không thể xóa hình ảnh";
      showToast(message, "error");
    },
  });
};

// Legacy exports for backward compatibility
export const useCreateBackground = useCreateBackgroundMutation;
export const useUpdateBackground = useUpdateBackgroundMutation;
export const useDeleteBackground = useDeleteBackgroundMutation;
export const useUploadBackgroundImage = useUploadBackgroundImageMutation;
export const useDeleteBackgroundImage = useDeleteBackgroundImageMutation;
