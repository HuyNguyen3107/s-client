/**
 * Profile Mutations
 * Following Single Responsibility Principle
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../services/profile.service";
import { QUERY_KEYS } from "../../../constants/query-key.constants";
import { MUTATION_KEYS } from "../../../constants/mutation-key.constants";
import { useToastStore } from "../../../store/toast.store";
import { ErrorUtils } from "../../../utils/error-handler.utils";
import { PROFILE_SUCCESS_MESSAGES } from "../constants/profile.constants";
import type { UpdateProfileRequest } from "../types";

/**
 * Mutation hook to update user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationKey: [MUTATION_KEYS.UPDATE_USER],
    mutationFn: (data: UpdateProfileRequest) =>
      profileService.updateProfile(data),
    onSuccess: () => {
      // Invalidate profile query to refetch
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER_PROFILE],
      });

      // Show success message
      showToast(PROFILE_SUCCESS_MESSAGES.PROFILE_UPDATED, "success");
    },
    onError: (error) => {
      // Show error message
      const errorMessage = ErrorUtils.getOperationErrorMessage("update", error);
      showToast(errorMessage, "error");
    },
  });
};
