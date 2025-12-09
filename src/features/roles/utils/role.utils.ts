import type { Permission, RoleWithRelations } from "../types";
import { ROLE_CONSTANTS } from "../constants";

/**
 * Role Utilities - following Single Responsibility Principle
 * Contains utility functions for role-related operations
 */

/**
 * Format role name for display
 */
export const formatRoleName = (name: string): string => {
  return name.trim().replace(/\s+/g, " ");
};

/**
 * Generate role display name with user count
 */
export const getRoleDisplayName = (role: RoleWithRelations): string => {
  const userCountText =
    role.userCount === 1 ? "1 người dùng" : `${role.userCount} người dùng`;
  return `${role.name} (${userCountText})`;
};

/**
 * Check if role name is valid
 */
export const isValidRoleName = (name: string): boolean => {
  const trimmed = name.trim();

  if (trimmed.length < ROLE_CONSTANTS.VALIDATION.NAME_MIN_LENGTH) return false;
  if (trimmed.length > ROLE_CONSTANTS.VALIDATION.NAME_MAX_LENGTH) return false;
  if (!/^[a-zA-Z0-9\s\u00C0-\u024F\u1E00-\u1EFF]+$/.test(trimmed)) return false;

  return true;
};

/**
 * Group permissions by category
 */
export const groupPermissionsByCategory = (
  permissions: Permission[]
): Record<string, Permission[]> => {
  const groups: Record<string, Permission[]> = {};

  // Add null check to prevent forEach error
  if (!permissions || !Array.isArray(permissions)) {
    return groups;
  }

  permissions.forEach((permission) => {
    // Split by dot for permissions like users.view, products.create
    const parts = permission.name.split(".");
    const category = parts.length > 1 ? parts[0] : "system";

    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(permission);
  });

  // Sort permissions within each category
  Object.keys(groups).forEach((category) => {
    groups[category].sort((a, b) => a.name.localeCompare(b.name));
  });

  return groups;
};

/**
 * Get permission category display name
 */
export const getPermissionCategoryName = (category: string): string => {
  const categoryMap: Record<string, string> = {
    users: "Quản lý Người dùng",
    roles: "Quản lý Vai trò",
    permissions: "Quản lý Quyền hạn",
    "user-roles": "Gán Vai trò cho Người dùng",
    "role-permissions": "Gán Quyền cho Vai trò",
    "user-permissions": "Gán Quyền cho Người dùng",
    products: "Quản lý Sản phẩm",
    "product-categories": "Danh mục Sản phẩm",
    "product-variants": "Biến thể Sản phẩm",
    "product-customs": "Sản phẩm Tùy chỉnh",
    collections: "Quản lý Bộ sưu tập",
    orders: "Quản lý Đơn hàng",
    inventory: "Quản lý Kho hàng",
    promotions: "Quản lý Khuyến mãi",
    feedbacks: "Quản lý Phản hồi",
    "shipping-fees": "Phí Vận chuyển",
    reports: "Báo cáo & Thống kê",
    settings: "Cài đặt Hệ thống",
    backgrounds: "Quản lý Background",
    consultations: "Quản lý Tư vấn",
    notifications: "Quản lý Thông báo",
    informations: "Quản lý Thông tin",
    upload: "Quản lý Upload",
    system: "Hệ thống",
  };

  return categoryMap[category.toLowerCase()] || category;
};

/**
 * Format permission name for display
 */
export const formatPermissionName = (name: string): string => {
  // Split by dot for permissions like users.view, products.create
  const parts = name.split(".");
  if (parts.length < 2) return name;

  const [module, action] = parts;

  const actionMap: Record<string, string> = {
    view: "Xem",
    create: "Tạo mới",
    update: "Chỉnh sửa",
    delete: "Xóa",
    list: "Danh sách",
    manage: "Quản lý toàn bộ",
    admin: "Quản trị",
    config: "Cấu hình",
    files: "Files",
    assign: "Gán",
    revoke: "Thu hồi",
    "update-status": "Cập nhật trạng thái",
    transfer: "Chuyển giao",
    export: "Xuất dữ liệu",
    adjust: "Điều chỉnh",
    reserve: "Đặt trước",
    report: "Báo cáo",
    validate: "Kiểm tra",
    respond: "Phản hồi",
    send: "Gửi",
    backup: "Sao lưu",
    restore: "Khôi phục",
    logs: "Xem logs",
    orders: "Đơn hàng",
    inventory: "Kho hàng",
    revenue: "Doanh thu",
    users: "Người dùng",
  };

  const moduleMap: Record<string, string> = {
    users: "Người dùng",
    roles: "Vai trò",
    permissions: "Quyền hạn",
    "user-roles": "Vai trò người dùng",
    "role-permissions": "Quyền vai trò",
    "user-permissions": "Quyền người dùng",
    products: "Sản phẩm",
    "product-categories": "Danh mục sản phẩm",
    "product-variants": "Biến thể sản phẩm",
    "product-customs": "Sản phẩm tùy chỉnh",
    collections: "Bộ sưu tập",
    orders: "Đơn hàng",
    inventory: "Kho hàng",
    promotions: "Khuyến mãi",
    feedbacks: "Phản hồi",
    "shipping-fees": "Phí vận chuyển",
    reports: "Báo cáo",
    settings: "Cài đặt",
    backgrounds: "Background",
    consultations: "Tư vấn",
    notifications: "Thông báo",
    informations: "Thông tin",
    upload: "Upload",
    system: "Hệ thống",
  };

  const actionText = actionMap[action?.toLowerCase()] || action;
  const moduleText = moduleMap[module?.toLowerCase()] || module;

  return `${actionText} ${moduleText}`;
};

/**
 * Check if role can be deleted
 */
export const canDeleteRole = (role: RoleWithRelations): boolean => {
  return role.userCount === 0;
};

/**
 * Get role status color
 */
export const getRoleStatusColor = (role: RoleWithRelations): string => {
  if (role.userCount === 0) return "text.secondary";
  if (role.userCount > 10) return "success.main";
  if (role.userCount > 5) return "warning.main";
  return "primary.main";
};

/**
 * Filter roles by search term
 */
export const filterRolesBySearch = (
  roles: RoleWithRelations[],
  searchTerm: string
): RoleWithRelations[] => {
  if (!searchTerm.trim()) return roles;

  const term = searchTerm.toLowerCase().trim();
  return roles.filter(
    (role) =>
      role.name.toLowerCase().includes(term) ||
      role.id.toLowerCase().includes(term) ||
      role.users?.some(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      )
  );
};

/**
 * Sort roles by specified criteria
 */
export const sortRoles = (
  roles: RoleWithRelations[],
  sortBy: "name" | "createdAt" | "userCount" | "permissionCount",
  sortOrder: "asc" | "desc"
): RoleWithRelations[] => {
  const sorted = [...roles].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "createdAt":
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case "userCount":
        comparison = a.userCount - b.userCount;
        break;
      case "permissionCount":
        comparison = a.permissionCount - b.permissionCount;
        break;
      default:
        comparison = 0;
    }

    return sortOrder === "desc" ? -comparison : comparison;
  });

  return sorted;
};

/**
 * Get role statistics
 */
export const calculateRoleStatistics = (roles: RoleWithRelations[]) => {
  const totalRoles = roles.length;
  const totalUsers = roles.reduce((sum, role) => sum + role.userCount, 0);
  const totalPermissions = roles.reduce(
    (sum, role) => sum + role.permissionCount,
    0
  );
  const averagePermissionsPerRole =
    totalRoles > 0 ? Math.round(totalPermissions / totalRoles) : 0;

  const mostUsedRoles = roles
    .filter((role) => role.userCount > 0)
    .sort((a, b) => b.userCount - a.userCount)
    .slice(0, 5);

  const rolePermissionDistribution = roles
    .sort((a, b) => b.permissionCount - a.permissionCount)
    .slice(0, 5);

  return {
    totalRoles,
    totalUsers,
    totalPermissions,
    averagePermissionsPerRole,
    mostUsedRoles: mostUsedRoles.map((role) => ({
      roleId: role.id,
      roleName: role.name,
      userCount: role.userCount,
    })),
    rolePermissionDistribution: rolePermissionDistribution.map((role) => ({
      roleId: role.id,
      roleName: role.name,
      permissionCount: role.permissionCount,
    })),
  };
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Generate slug from role name
 */
export const generateRoleSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
};

/**
 * Validate bulk role operations
 */
export const validateBulkOperation = (
  selectedRoleIds: string[],
  roles: RoleWithRelations[]
): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (selectedRoleIds.length === 0) {
    errors.push("Vui lòng chọn ít nhất một vai trò");
    return { valid: false, errors };
  }

  const selectedRoles = roles.filter((role) =>
    selectedRoleIds.includes(role.id)
  );
  const rolesWithUsers = selectedRoles.filter((role) => role.userCount > 0);

  if (rolesWithUsers.length > 0) {
    errors.push(
      `Không thể xóa ${rolesWithUsers.length} vai trò đang được sử dụng`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
