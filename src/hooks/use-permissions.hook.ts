import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth.store";
import { userService } from "../features/users/services/user.service";
import type { Permission } from "../constants/permissions.constants";

/**
 * Hook to get user permissions
 */
export const usePermissions = () => {
  const { user } = useAuthStore();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["user-permissions", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return { permissions: [], permissionCount: 0 };
      }
      const response = await userService.getUserPermissions(user.id);
      return response.data;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1,
  });

  const permissions = data?.permissions || [];
  const permissionCount = data?.permissionCount || 0;

  /**
   * Check if user has a specific permission
   */
  const hasPermission = (permission: Permission | null): boolean => {
    if (!permission) return true; // No permission required
    if (!user?.id) return false;
    return permissions.includes(permission);
  };

  /**
   * Check if user has any of the given permissions
   */
  const hasAnyPermission = (
    requiredPermissions: (Permission | null)[]
  ): boolean => {
    if (requiredPermissions.length === 0) return true;
    if (!user?.id) return false;
    return requiredPermissions.some(
      (perm) => perm === null || permissions.includes(perm)
    );
  };

  /**
   * Check if user has all of the given permissions
   */
  const hasAllPermissions = (
    requiredPermissions: (Permission | null)[]
  ): boolean => {
    if (requiredPermissions.length === 0) return true;
    if (!user?.id) return false;
    return requiredPermissions.every(
      (perm) => perm === null || permissions.includes(perm)
    );
  };

  return {
    permissions,
    permissionCount,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook to check a specific permission
 */
export const useHasPermission = (permission: Permission | null): boolean => {
  const { hasPermission } = usePermissions();
  return hasPermission(permission);
};

/**
 * Hook to check multiple permissions (any)
 */
export const useHasAnyPermission = (
  permissions: (Permission | null)[]
): boolean => {
  const { hasAnyPermission } = usePermissions();
  return hasAnyPermission(permissions);
};

/**
 * Hook to check multiple permissions (all)
 */
export const useHasAllPermissions = (
  permissions: (Permission | null)[]
): boolean => {
  const { hasAllPermissions } = usePermissions();
  return hasAllPermissions(permissions);
};
