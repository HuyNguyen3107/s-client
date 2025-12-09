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
    onSuccess: async () => {
      // Invalidate all role-related queries to refresh data
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ROLES],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PERMISSIONS],
        }),
      ]);

      // Force refetch all queries (both active and inactive)
      await queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.ROLES],
      });

      // Show success notification
      showToast("Tạo vai trò thành công!", "success");
    },
    onError: (error) => {
      // Show error notification
      const errorMessage = error.message || "Có lỗi xảy ra khi tạo vai trò";
      showToast(errorMessage, "error");
    },
    ...options,
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
    onSuccess: async () => {
      // Invalidate roles list to refetch
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ROLES],
      });

      // Force refetch all queries (both active and inactive)
      await queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.ROLES],
      });

      // Show success notification
      showToast("Tạo vai trò thành công!", "success");
    },
    onError: (error) => {
      // Show error notification
      const errorMessage = error.message || "Có lỗi xảy ra khi tạo vai trò";
      showToast(errorMessage, "error");
    },
    ...options,
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
    onSuccess: async (_, variables) => {
      // Invalidate roles list and specific role detail
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ROLES],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ROLES, "detail", variables.id],
        }),
      ]);

      // Force refetch all queries (both active and inactive)
      await queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.ROLES],
      });

      // Show success notification
      showToast(ROLE_CONSTANTS.SUCCESS_MESSAGES.ROLE_UPDATED, "success");
    },
    onError: (error) => {
      // Show error notification
      const errorMessage =
        error.message || ROLE_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR;
      showToast(errorMessage, "error");
    },
    ...options,
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
    onSuccess: async (_, variables) => {
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
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PERMISSIONS],
        }),
      ]);

      // Force refetch all queries (both active and inactive)
      await queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.ROLES],
      });

      // Show success notification
      showToast(ROLE_CONSTANTS.SUCCESS_MESSAGES.ROLE_UPDATED, "success");
    },
    onError: (error) => {
      // Show error notification
      const errorMessage =
        error.message || ROLE_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR;
      showToast(errorMessage, "error");
    },
    ...options,
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
    onSuccess: async (_, id) => {
      // Invalidate roles list and remove specific role from cache
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ROLES],
      });
      queryClient.removeQueries({
        queryKey: [QUERY_KEYS.ROLES, "detail", id],
      });

      // Force refetch all queries (both active and inactive)
      await queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.ROLES],
      });

      // Show success notification
      showToast(ROLE_CONSTANTS.SUCCESS_MESSAGES.ROLE_DELETED, "success");
    },
    onError: (error) => {
      // Show error notification
      const errorMessage =
        error.message || ROLE_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR;
      showToast(errorMessage, "error");
    },
    ...options,
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
    onSuccess: async (_, variables) => {
      // Invalidate and refetch all related queries immediately
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ROLES],
          refetchType: "active",
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ROLES, "detail", variables.roleId],
          refetchType: "active",
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ROLE_PERMISSIONS, variables.roleId],
          refetchType: "active",
        }),
      ]);

      // Show success notification
      showToast(
        ROLE_CONSTANTS.SUCCESS_MESSAGES.PERMISSIONS_ASSIGNED,
        "success"
      );
    },
    onError: (error) => {
      // Show error notification
      const errorMessage =
        error.message ||
        ROLE_CONSTANTS.ERROR_MESSAGES.ASSIGN_PERMISSIONS_FAILED;
      showToast(errorMessage, "error");
    },
    ...options,
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
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROLES] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ROLES, "detail", variables.roleId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ROLE_PERMISSIONS, variables.roleId],
      });
      // Show success notification
      showToast(ROLE_CONSTANTS.SUCCESS_MESSAGES.PERMISSION_REMOVED, "success");
    },
    onError: (error) => {
      // Show error notification
      const errorMessage =
        error.message || ROLE_CONSTANTS.ERROR_MESSAGES.REMOVE_PERMISSION_FAILED;
      showToast(errorMessage, "error");
    },
    ...options,
  });
};
