/**
 * Role Types - Defines all types related to roles management
 * Following Interface Segregation Principle (ISP)
 */

// Base role structure
export interface Role {
  id: string;
  name: string;
  isDeletable: boolean;
  createdAt: string;
}

// Role with relations
export interface RoleWithRelations extends Role {
  permissions: Permission[];
  users: RoleUser[];
  userCount: number;
  permissionCount: number;
}

// Permission structure
export interface Permission {
  id: string;
  name: string;
  createdAt: string;
}

// User structure for role assignments
export interface RoleUser {
  id: string;
  name: string;
  email: string;
}

// API Request types
export interface CreateRoleRequest {
  name: string;
}

export interface UpdateRoleRequest {
  name?: string;
}

export interface AssignPermissionsRequest {
  permissionIds: string[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T> {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Query parameters
export interface RoleQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "name" | "createdAt" | "userCount" | "permissionCount";
  sortOrder?: "asc" | "desc";
}

export interface PermissionQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
}

// Service response types
export interface RoleListResponse {
  data: RoleWithRelations[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PermissionListResponse {
  data: Permission[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Form types
export interface RoleFormData {
  name: string;
  permissionIds: string[];
}

export interface RoleFormErrors {
  name?: string;
  permissionIds?: string;
  general?: string;
}

// Statistics types
export interface RoleStatistics {
  totalRoles: number;
  totalPermissions: number;
  totalAssignments: number;
  mostUsedRoles: Array<{
    roleId: string;
    roleName: string;
    userCount: number;
  }>;
  rolePermissionDistribution: Array<{
    roleId: string;
    roleName: string;
    permissionCount: number;
  }>;
}
