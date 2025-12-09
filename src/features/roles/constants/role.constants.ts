/**
 * Role Constants - following Single Responsibility Principle
 * Contains all constants related to roles management
 */

export const ROLE_CONSTANTS = {
  // Validation rules
  VALIDATION: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
    DESCRIPTION_MAX_LENGTH: 500,
  },

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
    MAX_PAGE_SIZE: 100,
  },

  // Sort options
  SORT_OPTIONS: [
    { value: "name", label: "Tên vai trò" },
    { value: "createdAt", label: "Ngày tạo" },
    { value: "userCount", label: "Số người dùng" },
    { value: "permissionCount", label: "Số quyền hạn" },
  ],

  SORT_ORDER: [
    { value: "asc", label: "Tăng dần" },
    { value: "desc", label: "Giảm dần" },
  ],

  // Permission categories for display
  PERMISSION_CATEGORIES: {
    USER: "USERS",
    ROLE: "ROLES",
    PRODUCT: "PRODUCTS",
    ORDER: "ORDERS",
    FEEDBACK: "FEEDBACKS",
    PROMOTION: "PROMOTIONS",
    INVENTORY: "INVENTORY",
    COLLECTION: "COLLECTIONS",
    SHIPPING: "SHIPPING_FEES",
    REPORT: "REPORTS",
    SETTING: "SETTINGS",
  },

  // Status colors
  STATUS_COLORS: {
    active: "success",
    inactive: "error",
    pending: "warning",
  },

  // Cache times (in milliseconds)
  CACHE_TIMES: {
    ROLES: 5 * 60 * 1000, // 5 minutes
    PERMISSIONS: 15 * 60 * 1000, // 15 minutes
    ROLE_PERMISSIONS: 5 * 60 * 1000, // 5 minutes
  },

  // Error messages
  ERROR_MESSAGES: {
    ROLE_NOT_FOUND: "Không tìm thấy vai trò",
    PERMISSION_NOT_FOUND: "Không tìm thấy quyền hạn",
    ROLE_NAME_REQUIRED: "Tên vai trò là bắt buộc",
    ROLE_NAME_TOO_SHORT: "Tên vai trò phải có ít nhất 2 ký tự",
    ROLE_NAME_TOO_LONG: "Tên vai trò không được quá 50 ký tự",
    ROLE_NAME_INVALID_CHARS:
      "Tên vai trò chỉ được chứa chữ cái, số và khoảng trắng",
    ROLE_ALREADY_EXISTS: "Vai trò với tên này đã tồn tại",
    ROLE_IN_USE: "Không thể xóa vai trò đang được sử dụng",
    ASSIGN_PERMISSIONS_FAILED: "Không thể gán quyền hạn cho vai trò",
    REMOVE_PERMISSION_FAILED: "Không thể xóa quyền hạn khỏi vai trò",
    NETWORK_ERROR: "Lỗi mạng, vui lòng thử lại",
    UNAUTHORIZED: "Bạn không có quyền thực hiện hành động này",
    SERVER_ERROR: "Lỗi máy chủ, vui lòng thử lại sau",
  },

  // Success messages
  SUCCESS_MESSAGES: {
    ROLE_CREATED: "Tạo vai trò thành công!",
    ROLE_UPDATED: "Cập nhật vai trò thành công!",
    ROLE_DELETED: "Xóa vai trò thành công!",
    PERMISSIONS_ASSIGNED: "Gán quyền hạn thành công!",
    PERMISSION_REMOVED: "Xóa quyền hạn thành công!",
  },

  // Default role permissions for common roles
  DEFAULT_ROLE_PERMISSIONS: {
    ADMIN: [
      "USERS.VIEW",
      "USERS.CREATE",
      "USERS.UPDATE",
      "USERS.DELETE",
      "ROLES.VIEW",
      "ROLES.CREATE",
      "ROLES.UPDATE",
      "ROLES.DELETE",
      "PRODUCTS.VIEW",
      "PRODUCTS.CREATE",
      "PRODUCTS.UPDATE",
      "PRODUCTS.DELETE",
      "ORDERS.VIEW",
      "ORDERS.CREATE",
      "ORDERS.UPDATE",
      "ORDERS.DELETE",
    ],
    MANAGER: [
      "USERS.VIEW",
      "USERS.UPDATE",
      "PRODUCTS.VIEW",
      "PRODUCTS.CREATE",
      "PRODUCTS.UPDATE",
      "ORDERS.VIEW",
      "ORDERS.UPDATE",
    ],
    STAFF: ["PRODUCTS.VIEW", "ORDERS.VIEW", "ORDERS.UPDATE"],
    CUSTOMER: ["PRODUCTS.VIEW", "ORDERS.VIEW"],
  },
} as const;

// Type exports
export type RoleSortBy = "name" | "createdAt" | "userCount" | "permissionCount";
export type SortOrder = "asc" | "desc";
export type PermissionCategory =
  keyof typeof ROLE_CONSTANTS.PERMISSION_CATEGORIES;
