import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type {
  RoleWithRelations,
  Permission,
  RoleQueryParams,
  PermissionQueryParams,
  RoleListResponse,
  PermissionListResponse,
} from "../types";
import {
  roleService,
  permissionService,
  rolePermissionService,
} from "../services";
import { QUERY_KEYS } from "../../../constants/query-key.constants";

/**
 * Role Queries - following Single Responsibility Principle
 * Each query has a single responsibility
 */

/**
 * Get paginated list of roles
 */
export const useRoles = (
  params?: RoleQueryParams,
  options?: Partial<UseQueryOptions<RoleListResponse, Error>>
) => {
  return useQuery<RoleListResponse, Error>({
    queryKey: [QUERY_KEYS.ROLES, params],
    queryFn: () => roleService.getRoles(params),
    staleTime: 0, // Always consider data stale - refetch on mount
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    refetchOnMount: true, // Refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on window focus to avoid unnecessary requests
    ...options,
  });
};

/**
 * Get role by ID with all relations
 */
export const useRoleById = (
  id: string,
  options?: Partial<UseQueryOptions<RoleWithRelations, Error>>
) => {
  return useQuery<RoleWithRelations, Error>({
    queryKey: [QUERY_KEYS.ROLES, "detail", id],
    queryFn: () => roleService.getRoleById(id),
    enabled: Boolean(id),
    staleTime: 0, // Always refetch to get latest data
    gcTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Get paginated list of permissions
 */
export const usePermissions = (
  params?: PermissionQueryParams,
  options?: Partial<UseQueryOptions<PermissionListResponse, Error>>
) => {
  return useQuery<PermissionListResponse, Error>({
    queryKey: [QUERY_KEYS.PERMISSIONS, params],
    queryFn: () => permissionService.getPermissions(params),
    staleTime: 15 * 60 * 1000, // 15 minutes - permissions don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
    ...options,
  });
};

/**
 * Get all permissions without pagination
 */
export const useAllPermissions = (
  options?: Partial<UseQueryOptions<Permission[], Error>>
) => {
  return useQuery<Permission[], Error>({
    queryKey: [QUERY_KEYS.PERMISSIONS, "all"],
    queryFn: async () => {
      // Fetch all permissions by setting a high limit
      const response = await permissionService.getPermissions({ limit: 1000 });
      return response.data; // This should already contain the permissions array from service
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
};

/**
 * Get permissions assigned to a specific role
 */
export const useRolePermissions = (
  roleId: string,
  options?: Partial<UseQueryOptions<Permission[], Error>>
) => {
  return useQuery<Permission[], Error>({
    queryKey: [QUERY_KEYS.ROLE_PERMISSIONS, roleId],
    queryFn: () => rolePermissionService.getRolePermissions(roleId),
    enabled: Boolean(roleId),
    staleTime: 0, // Always refetch to get latest data
    gcTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Get permission by ID
 */
export const usePermissionById = (
  id: string,
  options?: Partial<UseQueryOptions<Permission, Error>>
) => {
  return useQuery<Permission, Error>({
    queryKey: [QUERY_KEYS.PERMISSIONS, "detail", id],
    queryFn: () => permissionService.getPermissionById(id),
    enabled: Boolean(id),
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
};
