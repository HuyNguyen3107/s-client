import type {
  UserWithRelations,
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserQueryParams,
  UserListResponse,
  UserResponse,
  UsersListResponse,
  UserRoleResponse,
  UserPermissionsResponse,
  AssignRolesToUserRequest,
  RemoveRolesFromUserRequest,
  ApiResponse,
} from "../types";
import { API_PATHS } from "../../../constants/api-path.constants";
import http from "../../../libs/http.libs";

/**
 * User Service Interface - following Interface Segregation Principle
 * Separates read and write operations
 */
export interface IUserReadService {
  getUsers(params?: UserQueryParams): Promise<UserListResponse>;
  getUserById(id: string): Promise<UserWithRelations>;
  getUserRoles(userId: string): Promise<UserRoleResponse>;
  getUserPermissions(userId: string): Promise<UserPermissionsResponse>;
  checkUserPermission(userId: string, permission: string): Promise<boolean>;
  checkUserRole(userId: string, role: string): Promise<boolean>;
}

export interface IUserWriteService {
  createUser(data: CreateUserRequest): Promise<User>;
  updateUser(id: string, data: UpdateUserRequest): Promise<User>;
  deleteUser(id: string): Promise<void>;
  toggleUserStatus(id: string): Promise<User>;
}

/**
 * User Role Service Interface
 */
export interface IUserRoleService {
  assignRolesToUser(data: AssignRolesToUserRequest): Promise<void>;
  removeRolesFromUser(
    userId: string,
    data: RemoveRolesFromUserRequest
  ): Promise<void>;
  getUsersByRole(
    roleId: string,
    page?: number,
    limit?: number
  ): Promise<UserListResponse>;
}

/**
 * User Read Service - Handles all read operations
 * Following Single Responsibility Principle
 */
export class UserReadService implements IUserReadService {
  /**
   * Get paginated list of users
   */
  async getUsers(params?: UserQueryParams): Promise<UserListResponse> {
    try {
      const response = await http.get<UsersListResponse>(API_PATHS.USERS, {
        params,
      });

      return {
        data: response.data.data.users,
        meta: {
          total: response.data.data.pagination.totalItems,
          page: response.data.data.pagination.currentPage,
          limit: response.data.data.pagination.itemsPerPage,
          totalPages: response.data.data.pagination.totalPages,
        },
      };
    } catch (error) {
      throw this.handleError(error, "Failed to fetch users");
    }
  }

  /**
   * Get single user by ID
   */
  async getUserById(id: string): Promise<UserWithRelations> {
    try {
      const response = await http.get<UserResponse>(API_PATHS.USER_BY_ID(id));

      if (!response.data.data) {
        throw new Error("User not found");
      }

      return response.data.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch user");
    }
  }

  /**
   * Get user roles
   */
  async getUserRoles(userId: string): Promise<UserRoleResponse> {
    try {
      const response = await http.get<UserRoleResponse>(
        API_PATHS.USER_ROLES_BY_USER(userId)
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch user roles");
    }
  }

  /**
   * Get user permissions
   */
  async getUserPermissions(userId: string): Promise<UserPermissionsResponse> {
    try {
      const response = await http.get<UserPermissionsResponse>(
        API_PATHS.USER_PERMISSIONS(userId)
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch user permissions");
    }
  }

  /**
   * Check if user has specific permission
   */
  async checkUserPermission(
    userId: string,
    permission: string
  ): Promise<boolean> {
    try {
      const response = await http.get<ApiResponse<{ hasPermission: boolean }>>(
        API_PATHS.CHECK_USER_PERMISSION(userId, permission)
      );

      return response.data.data?.hasPermission || false;
    } catch (error) {
      throw this.handleError(error, "Failed to check user permission");
    }
  }

  /**
   * Check if user has specific role
   */
  async checkUserRole(userId: string, role: string): Promise<boolean> {
    try {
      const response = await http.get<ApiResponse<{ hasRole: boolean }>>(
        API_PATHS.CHECK_USER_ROLE(userId, role)
      );

      return response.data.data?.hasRole || false;
    } catch (error) {
      throw this.handleError(error, "Failed to check user role");
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
 * User Write Service - Handles all write operations
 * Following Single Responsibility Principle
 */
export class UserWriteService implements IUserWriteService {
  /**
   * Create new user
   */
  async createUser(data: CreateUserRequest): Promise<User> {
    try {
      const response = await http.post<ApiResponse<User>>(
        API_PATHS.USERS,
        data
      );

      if (!response.data.data) {
        throw new Error("Failed to create user");
      }

      return response.data.data;
    } catch (error) {
      throw this.handleError(error, "Failed to create user");
    }
  }

  /**
   * Update existing user
   */
  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    try {
      const response = await http.patch<ApiResponse<User>>(
        API_PATHS.USER_BY_ID(id),
        data
      );

      if (!response.data.data) {
        throw new Error("Failed to update user");
      }

      return response.data.data;
    } catch (error) {
      throw this.handleError(error, "Failed to update user");
    }
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<void> {
    try {
      await http.delete<ApiResponse<void>>(API_PATHS.USER_BY_ID(id));
    } catch (error) {
      throw this.handleError(error, "Failed to delete user");
    }
  }

  /**
   * Toggle user active status
   */
  async toggleUserStatus(id: string): Promise<User> {
    try {
      // Get current user to toggle status
      const currentUser = await http.get<UserResponse>(
        API_PATHS.USER_BY_ID(id)
      );
      const isActive = currentUser.data.data.isActive;

      const response = await http.patch<ApiResponse<User>>(
        API_PATHS.USER_BY_ID(id),
        { isActive: !isActive }
      );

      if (!response.data.data) {
        throw new Error("Failed to toggle user status");
      }

      return response.data.data;
    } catch (error) {
      throw this.handleError(error, "Failed to toggle user status");
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
 * User Role Service - Handles user-role relationships
 * Following Single Responsibility Principle
 */
export class UserRoleService implements IUserRoleService {
  /**
   * Assign roles to user
   */
  async assignRolesToUser(data: AssignRolesToUserRequest): Promise<void> {
    try {
      await http.post<ApiResponse<void>>(API_PATHS.ASSIGN_ROLES_TO_USER, data);
    } catch (error) {
      throw this.handleError(error, "Failed to assign roles to user");
    }
  }

  /**
   * Remove roles from user
   */
  async removeRolesFromUser(
    userId: string,
    data: RemoveRolesFromUserRequest
  ): Promise<void> {
    try {
      await http.delete<ApiResponse<void>>(
        API_PATHS.REMOVE_ROLES_FROM_USER(userId),
        { data }
      );
    } catch (error) {
      throw this.handleError(error, "Failed to remove roles from user");
    }
  }

  /**
   * Get users by role
   */
  async getUsersByRole(
    roleId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<UserListResponse> {
    try {
      const response = await http.get<UsersListResponse>(
        API_PATHS.USERS_BY_ROLE(roleId),
        {
          params: { page, limit },
        }
      );

      return {
        data: response.data.data.users,
        meta: {
          total: response.data.data.pagination.totalItems,
          page: response.data.data.pagination.currentPage,
          limit: response.data.data.pagination.itemsPerPage,
          totalPages: response.data.data.pagination.totalPages,
        },
      };
    } catch (error) {
      throw this.handleError(error, "Failed to fetch users by role");
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
export const userReadService = new UserReadService();
export const userWriteService = new UserWriteService();
export const userRoleService = new UserRoleService();

// Composite service combining all operations
export class UserService {
  private readService: IUserReadService;
  private writeService: IUserWriteService;
  private roleService: IUserRoleService;

  constructor(
    readService: IUserReadService,
    writeService: IUserWriteService,
    roleService: IUserRoleService
  ) {
    this.readService = readService;
    this.writeService = writeService;
    this.roleService = roleService;
  }

  // Delegate read operations
  async getUsers(params?: UserQueryParams) {
    return this.readService.getUsers(params);
  }

  async getUserById(id: string) {
    return this.readService.getUserById(id);
  }

  async getUserRoles(userId: string) {
    return this.readService.getUserRoles(userId);
  }

  async getUserPermissions(userId: string) {
    return this.readService.getUserPermissions(userId);
  }

  async checkUserPermission(userId: string, permission: string) {
    return this.readService.checkUserPermission(userId, permission);
  }

  async checkUserRole(userId: string, role: string) {
    return this.readService.checkUserRole(userId, role);
  }

  // Delegate write operations
  async createUser(data: CreateUserRequest) {
    return this.writeService.createUser(data);
  }

  async updateUser(id: string, data: UpdateUserRequest) {
    return this.writeService.updateUser(id, data);
  }

  async deleteUser(id: string) {
    return this.writeService.deleteUser(id);
  }

  async toggleUserStatus(id: string) {
    return this.writeService.toggleUserStatus(id);
  }

  // Delegate role operations
  async assignRolesToUser(data: AssignRolesToUserRequest) {
    return this.roleService.assignRolesToUser(data);
  }

  async removeRolesFromUser(userId: string, data: RemoveRolesFromUserRequest) {
    return this.roleService.removeRolesFromUser(userId, data);
  }

  async getUsersByRole(roleId: string, page?: number, limit?: number) {
    return this.roleService.getUsersByRole(roleId, page, limit);
  }
}

// Main service instance
export const userService = new UserService(
  userReadService,
  userWriteService,
  userRoleService
);
