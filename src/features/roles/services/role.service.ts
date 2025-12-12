import type {
  RoleWithRelations,
  Role,
  Permission,
  CreateRoleRequest,
  UpdateRoleRequest,
  AssignPermissionsRequest,
  RoleQueryParams,
  PermissionQueryParams,
  RoleListResponse,
  PermissionListResponse,
  ApiResponse,
} from "../types";
import { API_PATHS } from "../../../constants/api-path.constants";
import http from "../../../libs/http.libs";

/**
 * Role Service Interface - following Interface Segregation Principle
 */
export interface IRoleService {
  getRoles(params?: RoleQueryParams): Promise<RoleListResponse>;
  getRoleById(id: string): Promise<RoleWithRelations>;
  createRole(data: CreateRoleRequest): Promise<Role>;
  updateRole(id: string, data: UpdateRoleRequest): Promise<Role>;
  deleteRole(id: string): Promise<void>;
}

/**
 * Permission Service Interface
 */
export interface IPermissionService {
  getPermissions(
    params?: PermissionQueryParams
  ): Promise<PermissionListResponse>;
  getPermissionById(id: string): Promise<Permission>;
}

/**
 * Role Permission Service Interface
 */
export interface IRolePermissionService {
  getRolePermissions(roleId: string): Promise<Permission[]>;
  assignPermissionsToRole(
    roleId: string,
    data: AssignPermissionsRequest
  ): Promise<RoleWithRelations>;
  removePermissionFromRole(roleId: string, permissionId: string): Promise<void>;
}

/**
 * Role Service implementation following Single Responsibility Principle
 * Handles all API communications for roles
 */
export class RoleService implements IRoleService {
  /**
   * Get paginated list of roles
   */
  async getRoles(params?: RoleQueryParams): Promise<RoleListResponse> {
    try {
      const response = await http.get<ApiResponse<RoleWithRelations[]>>(
        API_PATHS.ROLES,
        { params }
      );

      // Handle different API response formats
      const data = response.data.data;
      if (Array.isArray(data)) {
        return {
          data: data,
          meta: {
            total: data.length,
            page: params?.page || 1,
            limit: params?.limit || 10,
            totalPages: Math.ceil(data.length / (params?.limit || 10)),
          },
        };
      }

      return {
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        },
      };
    } catch (error) {
      throw this.handleError(error, "Failed to fetch roles");
    }
  }

  /**
   * Get single role by ID
   */
  async getRoleById(id: string): Promise<RoleWithRelations> {
    try {
      const response = await http.get<ApiResponse<RoleWithRelations>>(
        API_PATHS.ROLE_BY_ID(id)
      );

      if (!response.data.data) {
        throw new Error("Role not found");
      }

      return response.data.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch role");
    }
  }

  /**
   * Create new role
   */
  async createRole(data: CreateRoleRequest): Promise<Role> {
    try {
      const response = await http.post<ApiResponse<Role>>(
        API_PATHS.ROLES,
        data
      );

      if (!response.data.data) {
        throw new Error("Failed to create role");
      }

      return response.data.data;
    } catch (error) {
      throw this.handleError(error, "Failed to create role");
    }
  }

  /**
   * Update existing role
   */
  async updateRole(id: string, data: UpdateRoleRequest): Promise<Role> {
    try {
      const response = await http.patch<ApiResponse<Role>>(
        API_PATHS.ROLE_BY_ID(id),
        data
      );

      if (!response.data.data) {
        throw new Error("Failed to update role");
      }

      return response.data.data;
    } catch (error) {
      throw this.handleError(error, "Failed to update role");
    }
  }

  /**
   * Delete role
   */
  async deleteRole(id: string): Promise<void> {
    try {
      const response = await http.delete<ApiResponse<void>>(
        API_PATHS.ROLE_BY_ID(id)
      );

      // Check if deletion was successful
      if (response.data && response.data.success === false) {
        throw new Error(response.data.message || "Failed to delete role");
      }
    } catch (error) {
      throw this.handleError(error, "Failed to delete role");
    }
  }

  /**
   * Handle API errors consistently
   * @private
   */
  private handleError(error: any, defaultMessage: string): Error {
    if (error?.response?.data?.message) {
      return new Error(error.response.data.message);
    }

    if (error?.message) {
      return new Error(error.message);
    }

    return new Error(defaultMessage);
  }
}

/**
 * Permission Service implementation
 */
export class PermissionService implements IPermissionService {
  /**
   * Get paginated list of permissions
   */
  async getPermissions(
    params?: PermissionQueryParams
  ): Promise<PermissionListResponse> {
    try {
      // API response structure: { statusCode, message, data: { data: [], pagination: {} } }
      const response = await http.get<{
        statusCode: number;
        message: string;
        data: {
          data: Permission[];
          pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
          };
        };
      }>(API_PATHS.PERMISSIONS, { params });

      return {
        data: response.data.data.data || [],
        meta: {
          total: response.data.data.pagination?.total || 0,
          page: response.data.data.pagination?.page || 1,
          limit: response.data.data.pagination?.limit || 10,
          totalPages: response.data.data.pagination?.totalPages || 0,
        },
      };
    } catch (error) {
      throw this.handleError(error, "Failed to fetch permissions");
    }
  }

  /**
   * Get single permission by ID
   */
  async getPermissionById(id: string): Promise<Permission> {
    try {
      const response = await http.get<ApiResponse<Permission>>(
        API_PATHS.PERMISSION_BY_ID(id)
      );

      if (!response.data.data) {
        throw new Error("Permission not found");
      }

      return response.data.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch permission");
    }
  }

  /**
   * Handle API errors consistently
   * @private
   */
  private handleError(error: any, defaultMessage: string): Error {
    if (error?.response?.data?.message) {
      return new Error(error.response.data.message);
    }

    if (error?.message) {
      return new Error(error.message);
    }

    return new Error(defaultMessage);
  }
}

/**
 * Role Permission Service implementation
 */
export class RolePermissionService implements IRolePermissionService {
  /**
   * Get permissions for a role
   */
  async getRolePermissions(roleId: string): Promise<Permission[]> {
    try {
      const response = await http.get<
        ApiResponse<{ permissions: Permission[] }>
      >(API_PATHS.ROLE_PERMISSIONS_BY_ROLE(roleId));

      return response.data.data?.permissions || [];
    } catch (error) {
      throw this.handleError(error, "Failed to fetch role permissions");
    }
  }

  /**
   * Assign permissions to role
   */
  async assignPermissionsToRole(
    roleId: string,
    data: AssignPermissionsRequest
  ): Promise<RoleWithRelations> {
    try {
      const response = await http.post<
        ApiResponse<{ role: RoleWithRelations }>
      >(API_PATHS.ASSIGN_PERMISSIONS_TO_ROLE(roleId), data);

      if (!response.data.data?.role) {
        throw new Error("Failed to assign permissions to role");
      }

      return response.data.data.role;
    } catch (error) {
      throw this.handleError(error, "Failed to assign permissions to role");
    }
  }

  /**
   * Remove permission from role
   */
  async removePermissionFromRole(
    roleId: string,
    permissionId: string
  ): Promise<void> {
    try {
      await http.delete<ApiResponse<void>>(
        API_PATHS.REMOVE_PERMISSION_FROM_ROLE(roleId, permissionId)
      );
    } catch (error) {
      throw this.handleError(error, "Failed to remove permission from role");
    }
  }

  /**
   * Handle API errors consistently
   * @private
   */
  private handleError(error: any, defaultMessage: string): Error {
    if (error?.response?.data?.message) {
      return new Error(error.response.data.message);
    }

    if (error?.message) {
      return new Error(error.message);
    }

    return new Error(defaultMessage);
  }
}

// Singleton instances following Dependency Injection pattern
export const roleService = new RoleService();
export const permissionService = new PermissionService();
export const rolePermissionService = new RolePermissionService();
