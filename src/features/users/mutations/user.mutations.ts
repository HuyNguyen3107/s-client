import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services";
import { QUERY_KEYS } from "../../../constants/query-key.constants";
import { MUTATION_KEYS } from "../../../constants/mutation-key.constants";
import { useToastStore } from "../../../store/toast.store";
import { ErrorUtils } from "../../../utils/error-handler.utils";
import { USER_SUCCESS_MESSAGES } from "../constants/user.constants";
import type {
  CreateUserRequest,
  UpdateUserRequest,
  AssignRolesToUserRequest,
  RemoveRolesFromUserRequest,
} from "../types";

/**
 * Mutation hook to create a new user
 * Following Single Responsibility Principle
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationKey: [MUTATION_KEYS.CREATE_USER],
    mutationFn: (data: CreateUserRequest) => userService.createUser(data),
    onSuccess: () => {
      // Invalidate users list to refetch
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USERS],
      });

      // Show success message
      showToast(USER_SUCCESS_MESSAGES.USER_CREATED, "success");
    },
    onError: (error) => {
      // Show error message
      const errorMessage = ErrorUtils.getOperationErrorMessage("create", error);
      showToast(errorMessage, "error");
    },
  });
};

/**
 * Mutation hook to update an existing user
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationKey: [MUTATION_KEYS.UPDATE_USER],
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      userService.updateUser(id, data),
    onSuccess: (updatedUser, { id }) => {
      // Update the user cache
      queryClient.setQueryData([QUERY_KEYS.USER_BY_ID, id], updatedUser);

      // Invalidate users list to refetch
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USERS],
      });

      // Show success message
      showToast(USER_SUCCESS_MESSAGES.USER_UPDATED, "success");
    },
    onError: (error) => {
      // Show error message
      const errorMessage = ErrorUtils.getOperationErrorMessage("update", error);
      showToast(errorMessage, "error");
    },
  });
};

/**
 * Mutation hook to delete a user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationKey: [MUTATION_KEYS.DELETE_USER],
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: [QUERY_KEYS.USER_BY_ID, deletedId],
      });

      // Invalidate users list to refetch
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USERS],
      });

      // Invalidate user roles and permissions
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER_ROLES, deletedId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER_PERMISSIONS, deletedId],
      });

      // Show success message
      showToast(USER_SUCCESS_MESSAGES.USER_DELETED, "success");
    },
    onError: (error) => {
      // Show error message
      const errorMessage = ErrorUtils.getOperationErrorMessage("delete", error);
      showToast(errorMessage, "error");
    },
  });
};

/**
 * Mutation hook to toggle user status
 */
export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationKey: [MUTATION_KEYS.TOGGLE_USER_STATUS],
    mutationFn: (id: string) => userService.toggleUserStatus(id),
    onSuccess: (updatedUser, id) => {
      // Update the user cache
      queryClient.setQueryData([QUERY_KEYS.USER_BY_ID, id], updatedUser);

      // Invalidate users list to refetch
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USERS],
      });

      // Show success message
      showToast(USER_SUCCESS_MESSAGES.STATUS_UPDATED, "success");
    },
    onError: (error) => {
      // Show error message
      const errorMessage = ErrorUtils.getApiErrorMessage(error);
      showToast(errorMessage, "error");
    },
  });
};

/**
 * Mutation hook to assign roles to user
 */
export const useAssignRolesToUser = () => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationKey: [MUTATION_KEYS.ASSIGN_ROLES_TO_USER],
    mutationFn: (data: AssignRolesToUserRequest) =>
      userService.assignRolesToUser(data),
    onSuccess: async (_, { userId }) => {
      // Force refetch user data immediately
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.USER_BY_ID, userId],
          refetchType: "active",
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.USER_ROLES, userId],
          refetchType: "active",
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.USER_PERMISSIONS, userId],
          refetchType: "active",
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.USERS],
          refetchType: "active",
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.USERS_BY_ROLE],
          refetchType: "active",
        }),
      ]);

      // Show success message
      showToast(USER_SUCCESS_MESSAGES.ROLES_ASSIGNED, "success");
    },
    onError: (error) => {
      // Show error message
      const errorMessage = ErrorUtils.getApiErrorMessage(error);
      showToast(errorMessage, "error");
    },
  });
};

/**
 * Mutation hook to remove roles from user
 */
export const useRemoveRolesFromUser = () => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationKey: [MUTATION_KEYS.REMOVE_ROLES_FROM_USER],
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: RemoveRolesFromUserRequest;
    }) => userService.removeRolesFromUser(userId, data),
    onSuccess: async (_, { userId }) => {
      // Force refetch user data immediately
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.USER_BY_ID, userId],
          refetchType: "active",
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.USER_ROLES, userId],
          refetchType: "active",
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.USER_PERMISSIONS, userId],
          refetchType: "active",
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.USERS],
          refetchType: "active",
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.USERS_BY_ROLE],
          refetchType: "active",
        }),
      ]);

      // Show success message
      showToast(USER_SUCCESS_MESSAGES.ROLES_REMOVED, "success");
    },
    onError: (error) => {
      // Show error message
      const errorMessage = ErrorUtils.getApiErrorMessage(error);
      showToast(errorMessage, "error");
    },
  });
};

/**
 * Batch operations hook - for performing multiple user operations
 */
export const useBatchUserOperations = () => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationKey: [MUTATION_KEYS.BATCH_USER_OPERATIONS],
    mutationFn: async (operations: Array<() => Promise<any>>) => {
      const results = await Promise.allSettled(operations.map((op) => op()));
      return results;
    },
    onSuccess: (results) => {
      // Invalidate all user-related queries after batch operations
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER_ROLES],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER_PERMISSIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USERS_BY_ROLE],
      });

      // Show success message
      const successCount = results.filter(
        (result) => result.status === "fulfilled"
      ).length;
      const failedCount = results.filter(
        (result) => result.status === "rejected"
      ).length;

      if (failedCount === 0) {
        showToast(`Hoàn thành ${successCount} thao tác thành công!`, "success");
      } else {
        showToast(
          `${successCount} thao tác thành công, ${failedCount} thao tác thất bại!`,
          "warning"
        );
      }
    },
    onError: (error) => {
      // Show error message
      const errorMessage = ErrorUtils.getApiErrorMessage(
        error,
        "Thao tác hàng loạt thất bại"
      );
      showToast(errorMessage, "error");
    },
  });
};
