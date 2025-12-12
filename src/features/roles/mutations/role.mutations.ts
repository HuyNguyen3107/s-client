import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type {
  Role,
  RoleWithRelations,
  CreateRoleRequest,
  UpdateRoleRequest,
  AssignPermissionsRequest,
} from "../types";
import { roleService, rolePermissionService } from "../services";
import { QUERY_KEYS } from "../../../constants/query-key.constants";
import { useToastStore } from "../../../store/toast.store";
import { ROLE_CONSTANTS } from "../constants";

/**
 * Role Mutations - following Single Responsibility Principle
 * Each mutation has a single responsibility
 */

/**
 * Create new role with permissions
 */
export const useCreateRoleWithPermissionsMutation = (
  options?: UseMutationOptions<
    Role,
    Error,
    { roleData: CreateRoleRequest; permissionIds?: string[] }
  >
) => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation<
    Role,
    Error,
    { roleData: CreateRoleRequest; permissionIds?: string[] }
  >({
    mutationFn: async ({ roleData, permissionIds }) => {
      // First create the role
      const newRole = await roleService.createRole(roleData);

      // Then assign permissions if provided
      if (permissionIds && permissionIds.length > 0) {
        await rolePermissionService.assignPermissionsToRole(newRole.id, {
          permissionIds,
        });
      }

      return newRole;
    },
    onSuccess: async (data, variables, context) => {
      // Show success notification first
      showToast("Tạo vai trò thành công!", "success");

      // Invalidate and refetch roles
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ROLES],
      });

      // Wait for refetch to complete
      await queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.ROLES],
        type: "active",
      });

      // Call original onSuccess if provided
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      // Show error notification
      const errorMessage = error.message || "Có lỗi xảy ra khi tạo vai trò";
      showToast(errorMessage, "error");

      // Call original onError if provided
      options?.onError?.(error, variables, context);
    },
  });
};

/**
 * Create new role
 */
export const useCreateRoleMutation = (
  options?: UseMutationOptions<Role, Error, CreateRoleRequest>
) => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation<Role, Error, CreateRoleRequest>({
    mutationFn: (data) => roleService.createRole(data),
    onSuccess: async (data, variables, context) => {
      // Show success notification first
      showToast("Tạo vai trò thành công!", "success");

      // Invalidate and refetch roles
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ROLES],
      });

      // Wait for refetch to complete
      await queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.ROLES],
        type: "active",
      });

      // Call original onSuccess if provided
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      // Show error notification
      const errorMessage = error.message || "Có lỗi xảy ra khi tạo vai trò";
      showToast(errorMessage, "error");

      // Call original onError if provided
      options?.onError?.(error, variables, context);
    },
  });
};

/**
 * Update existing role
 */
export const useUpdateRoleMutation = (
  options?: UseMutationOptions<
    Role,
    Error,
    { id: string; data: UpdateRoleRequest }
  >
) => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation<Role, Error, { id: string; data: UpdateRoleRequest }>({
    mutationFn: ({ id, data }) => roleService.updateRole(id, data),
    onSuccess: async (data, variables, context) => {
      // Show success notification first
      showToast(ROLE_CONSTANTS.SUCCESS_MESSAGES.ROLE_UPDATED, "success");

      // Invalidate roles list and specific role detail
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ROLES],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ROLES, "detail", variables.id],
        }),
      ]);

      // Wait for refetch to complete
      await queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.ROLES],
        type: "active",
      });

      // Call original onSuccess if provided
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      // Show error notification
      const errorMessage =
        error.message || ROLE_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR;
      showToast(errorMessage, "error");

      // Call original onError if provided
      options?.onError?.(error, variables, context);
    },
  });
};

/**
 * Update role with permissions
 */
export const useUpdateRoleWithPermissionsMutation = (
  options?: UseMutationOptions<
    Role,
    Error,
    { id: string; roleData: UpdateRoleRequest; permissionIds?: string[] }
  >
) => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation<
    Role,
    Error,
    { id: string; roleData: UpdateRoleRequest; permissionIds?: string[] }
  >({
    mutationFn: async ({ id, roleData, permissionIds }) => {
      // First update the role
      const updatedRole = await roleService.updateRole(id, roleData);

      // Then update permissions if provided
      if (permissionIds !== undefined) {
        await rolePermissionService.assignPermissionsToRole(id, {
          permissionIds,
        });
      }

      return updatedRole;
    },
    onSuccess: async (data, variables, context) => {
      // Show success notification first
      showToast(ROLE_CONSTANTS.SUCCESS_MESSAGES.ROLE_UPDATED, "success");

      // Invalidate all role-related queries to refresh data
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ROLES],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ROLES, "detail", variables.id],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ROLE_PERMISSIONS, variables.id],
        }),
      ]);

      // Wait for refetch to complete
      await queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.ROLES],
        type: "active",
      });

      // Call original onSuccess if provided
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      // Show error notification
      const errorMessage =
        error.message || ROLE_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR;
      showToast(errorMessage, "error");

      // Call original onError if provided
      options?.onError?.(error, variables, context);
    },
  });
};

/**
 * Delete role
 */
export const useDeleteRoleMutation = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation<void, Error, string>({
    mutationFn: (id) => roleService.deleteRole(id),
    onSuccess: async (data, id, context) => {
      // Show success notification first
      showToast(ROLE_CONSTANTS.SUCCESS_MESSAGES.ROLE_DELETED, "success");

      // Remove specific role from cache
      queryClient.removeQueries({
        queryKey: [QUERY_KEYS.ROLES, "detail", id],
      });

      // Invalidate roles list
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ROLES],
      });

      // Wait for refetch to complete
      await queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.ROLES],
        type: "active",
      });

      // Call original onSuccess if provided
      options?.onSuccess?.(data, id, context);
    },
    onError: (error, variables, context) => {
      // Show error notification
      const errorMessage =
        error.message || ROLE_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR;
      showToast(errorMessage, "error");

      // Call original onError if provided
      options?.onError?.(error, variables, context);
    },
  });
};

/**
 * Assign permissions to role
 */
export const useAssignPermissionsToRoleMutation = (
  options?: UseMutationOptions<
    RoleWithRelations,
    Error,
    { roleId: string; data: AssignPermissionsRequest }
  >
) => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation<
    RoleWithRelations,
    Error,
    { roleId: string; data: AssignPermissionsRequest }
  >({
    mutationFn: ({ roleId, data }) =>
      rolePermissionService.assignPermissionsToRole(roleId, data),
    onSuccess: async (data, variables, context) => {
      // Show success notification first
      showToast(
        ROLE_CONSTANTS.SUCCESS_MESSAGES.PERMISSIONS_ASSIGNED,
        "success"
      );

      // Invalidate and refetch all related queries
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ROLES],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ROLES, "detail", variables.roleId],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ROLE_PERMISSIONS, variables.roleId],
        }),
      ]);

      // Wait for refetch to complete
      await queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.ROLES],
        type: "active",
      });

      // Call original onSuccess if provided
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      // Show error notification
      const errorMessage =
        error.message ||
        ROLE_CONSTANTS.ERROR_MESSAGES.ASSIGN_PERMISSIONS_FAILED;
      showToast(errorMessage, "error");

      // Call original onError if provided
      options?.onError?.(error, variables, context);
    },
  });
};

/**
 * Remove permission from role
 */
export const useRemovePermissionFromRoleMutation = (
  options?: UseMutationOptions<
    void,
    Error,
    { roleId: string; permissionId: string }
  >
) => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation<void, Error, { roleId: string; permissionId: string }>({
    mutationFn: ({ roleId, permissionId }) =>
      rolePermissionService.removePermissionFromRole(roleId, permissionId),
    onSuccess: async (data, variables, context) => {
      // Show success notification first
      showToast(ROLE_CONSTANTS.SUCCESS_MESSAGES.PERMISSION_REMOVED, "success");

      // Invalidate related queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROLES] }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ROLES, "detail", variables.roleId],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ROLE_PERMISSIONS, variables.roleId],
        }),
      ]);

      // Wait for refetch to complete
      await queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.ROLES],
        type: "active",
      });

      // Call original onSuccess if provided
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      // Show error notification
      const errorMessage =
        error.message || ROLE_CONSTANTS.ERROR_MESSAGES.REMOVE_PERMISSION_FAILED;
      showToast(errorMessage, "error");

      // Call original onError if provided
      options?.onError?.(error, variables, context);
    },
  });
};
