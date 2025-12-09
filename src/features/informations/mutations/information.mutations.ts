import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "../../../store/toast.store";
import { INFORMATION_CONSTANTS } from "../constants/information.constants";
import { MUTATION_KEYS } from "../../../constants/mutation-key.constants";
import {
  createInformation,
  updateInformation,
  deleteInformation,
} from "../services/information.services";
import type {
  CreateInformationRequest,
  UpdateInformationRequest,
} from "../types/information.types";

// Mutation Repository - Single Responsibility Principle (SRP)
const informationMutationRepository = {
  createInformation,
  updateInformation,
  deleteInformation,
};

// Custom Hook for Create Information - Open/Closed Principle (OCP)
export const useCreateInformationMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationKey: [MUTATION_KEYS.CREATE_INFORMATION],
    mutationFn: (data: CreateInformationRequest) =>
      informationMutationRepository.createInformation(data),

    onSuccess: () => {
      // Invalidate informations cache
      queryClient.invalidateQueries({
        queryKey: [INFORMATION_CONSTANTS.CACHE_KEYS.INFORMATIONS],
      });

      // Show success message
      showToast(
        INFORMATION_CONSTANTS.SUCCESS_MESSAGES.CREATE_SUCCESS,
        "success"
      );
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        INFORMATION_CONSTANTS.ERROR_MESSAGES.CREATE_FAILED;
      showToast(message, "error");
    },
  });
};

// Custom Hook for Update Information
export const useUpdateInformationMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationKey: [MUTATION_KEYS.UPDATE_INFORMATION],
    mutationFn: (data: UpdateInformationRequest) =>
      informationMutationRepository.updateInformation(data),

    onSuccess: (data) => {
      // Update specific information in cache
      queryClient.setQueryData(
        [INFORMATION_CONSTANTS.CACHE_KEYS.INFORMATION_DETAIL, data.id],
        data
      );

      // Invalidate informations list cache
      queryClient.invalidateQueries({
        queryKey: [INFORMATION_CONSTANTS.CACHE_KEYS.INFORMATIONS],
      });

      showToast(
        INFORMATION_CONSTANTS.SUCCESS_MESSAGES.UPDATE_SUCCESS,
        "success"
      );
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        INFORMATION_CONSTANTS.ERROR_MESSAGES.UPDATE_FAILED;
      showToast(message, "error");
    },
  });
};

// Custom Hook for Delete Information
export const useDeleteInformationMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationKey: [MUTATION_KEYS.DELETE_INFORMATION],
    mutationFn: (id: string) =>
      informationMutationRepository.deleteInformation(id),

    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: [
          INFORMATION_CONSTANTS.CACHE_KEYS.INFORMATION_DETAIL,
          deletedId,
        ],
      });

      // Invalidate informations list
      queryClient.invalidateQueries({
        queryKey: [INFORMATION_CONSTANTS.CACHE_KEYS.INFORMATIONS],
      });

      showToast(
        INFORMATION_CONSTANTS.SUCCESS_MESSAGES.DELETE_SUCCESS,
        "success"
      );
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        INFORMATION_CONSTANTS.ERROR_MESSAGES.DELETE_FAILED;
      showToast(message, "error");
    },
  });
};

// Legacy exports for backward compatibility
export const useCreateInformation = useCreateInformationMutation;
export const useUpdateInformation = useUpdateInformationMutation;
export const useDeleteInformation = useDeleteInformationMutation;
