import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { userService } from "../services";
import type { UserQueryParams } from "../types";
import { QUERY_KEYS } from "../../../constants/query-key.constants";

/**
 * Hook to fetch paginated users
 * Following Single Responsibility Principle
 */
export const useUsers = (params?: UserQueryParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS, params],
    queryFn: () => userService.getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch single user by ID
 */
export const useUser = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER_BY_ID, id],
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch user roles
 */
export const useUserRoles = (
  userId: string,
  options?: Partial<UseQueryOptions<any, Error>>
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER_ROLES, userId],
    queryFn: () => userService.getUserRoles(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch user permissions
 */
export const useUserPermissions = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER_PERMISSIONS, userId],
    queryFn: () => userService.getUserPermissions(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to check user permission
 */
export const useUserPermissionCheck = (userId: string, permission: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER_PERMISSION_CHECK, userId, permission],
    queryFn: () => userService.checkUserPermission(userId, permission),
    enabled: !!userId && !!permission,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to check user role
 */
export const useUserRoleCheck = (userId: string, role: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER_ROLE_CHECK, userId, role],
    queryFn: () => userService.checkUserRole(userId, role),
    enabled: !!userId && !!role,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to get users by role
 */
export const useUsersByRole = (
  roleId: string,
  page: number = 1,
  limit: number = 10
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS_BY_ROLE, roleId, page, limit],
    queryFn: () => userService.getUsersByRole(roleId, page, limit),
    enabled: !!roleId,
    staleTime: 5 * 60 * 1000,
  });
};
