/**
 * User Types - Defines all types related to user management
 * Following Interface Segregation Principle (ISP)
 */

import type { Role } from "../../roles/types";

// Base user structure
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  isDeletable: boolean;
  createdAt: string;
  updatedAt: string;
}

// User with relations
export interface UserWithRelations extends User {
  userRoles: UserRole[];
  roles?: Role[];
}

// User role relationship
export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  role: Role;
}

// Permission structure for user
export interface UserPermission {
  id: string;
  name: string;
  createdAt: string;
}

// API Request types
export interface CreateUserRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  isActive?: boolean;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  isActive?: boolean;
}

export interface AssignRolesToUserRequest {
  userId: string;
  roleIds: string[];
}

export interface RemoveRolesFromUserRequest {
  roleIds: string[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T> {
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Special response types for users
export interface UserResponse {
  message: string;
  data: UserWithRelations;
}

export interface UsersListResponse {
  message: string;
  data: {
    users: UserWithRelations[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export interface UserRoleResponse {
  message: string;
  data: {
    userId: string;
    userName: string;
    roles: Role[];
  };
}

export interface UserPermissionsResponse {
  message: string;
  data: {
    userId: string;
    permissions: string[];
    permissionCount: number;
  };
}

// Query parameters
export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  roleId?: string;
}

export interface UserRoleQueryParams {
  page?: number;
  limit?: number;
  userId?: string;
  roleId?: string;
}

// Service response types
export interface UserListResponse {
  data: UserWithRelations[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UserRoleListResponse {
  data: UserRole[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Form types
export interface UserFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  isActive: boolean;
}

export interface UserFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  isActive?: string;
}

export interface UserRoleFormData {
  userId: string;
  roleIds: string[];
}

export interface UserRoleFormErrors {
  userId?: string;
  roleIds?: string;
}

// Table column types
export interface UserTableColumn {
  key: keyof UserWithRelations | "roles" | "actions";
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
}

// Filter types
export interface UserFilters {
  search: string;
  isActive: boolean | null;
  roleId: string | null;
  page: number;
  limit: number;
}

// Modal types
export type UserModalMode =
  | "create"
  | "edit"
  | "view"
  | "delete"
  | "assign-roles";

export interface UserModalState {
  isOpen: boolean;
  mode: UserModalMode;
  user?: UserWithRelations;
}

// Statistics types
export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  usersByRole: {
    roleId: string;
    roleName: string;
    userCount: number;
  }[];
}
