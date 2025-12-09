/**
 * User Management Constants
 * Following Single Responsibility Principle (SRP)
 */

// Default values
export const USER_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 100,
  MAX_NAME_LENGTH: 100,
  MAX_EMAIL_LENGTH: 255,
  MAX_PHONE_LENGTH: 20,

  // Default user form data
  DEFAULT_USER_FORM: {
    name: "",
    email: "",
    phone: "",
    password: "",
    isActive: true,
  },

  // Status options
  STATUS_OPTIONS: [
    { label: "Tất cả", value: null },
    { label: "Hoạt động", value: true },
    { label: "Tạm khóa", value: false },
  ],

  // Sort options
  SORT_OPTIONS: [
    { label: "Tên A-Z", value: "name_asc" },
    { label: "Tên Z-A", value: "name_desc" },
    { label: "Email A-Z", value: "email_asc" },
    { label: "Email Z-A", value: "email_desc" },
    { label: "Mới nhất", value: "createdAt_desc" },
    { label: "Cũ nhất", value: "createdAt_asc" },
  ],
};

// Validation patterns
export const USER_VALIDATION = {
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_PATTERN: /^(\+84|0)[0-9]{9,10}$/,
  PASSWORD_PATTERN: /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$/,
  NAME_PATTERN: /^[a-zA-ZÀ-ỹ\s]{2,}$/,
};

// Error messages
export const USER_ERROR_MESSAGES = {
  VALIDATION: {
    REQUIRED: "Trường này là bắt buộc",
    NAME_REQUIRED: "Tên là bắt buộc",
    NAME_INVALID: "Tên phải có ít nhất 2 ký tự và chỉ chứa chữ cái",
    EMAIL_REQUIRED: "Email là bắt buộc",
    EMAIL_INVALID: "Định dạng email không hợp lệ",
    EMAIL_EXISTS: "Email này đã được sử dụng",
    PHONE_REQUIRED: "Số điện thoại là bắt buộc",
    PHONE_INVALID: "Số điện thoại không hợp lệ",
    PHONE_EXISTS: "Số điện thoại này đã được sử dụng",
    PASSWORD_REQUIRED: "Mật khẩu là bắt buộc",
    PASSWORD_TOO_SHORT: `Mật khẩu phải có ít nhất ${USER_CONSTANTS.MIN_PASSWORD_LENGTH} ký tự`,
    PASSWORD_TOO_LONG: `Mật khẩu không được vượt quá ${USER_CONSTANTS.MAX_PASSWORD_LENGTH} ký tự`,
    PASSWORD_WEAK: "Mật khẩu phải chứa ít nhất 1 chữ cái và 1 số",
    ROLES_REQUIRED: "Phải chọn ít nhất 1 vai trò",
  },
  API: {
    USER_NOT_FOUND: "Không tìm thấy người dùng",
    CREATE_FAILED: "Không thể tạo người dùng",
    UPDATE_FAILED: "Không thể cập nhật người dùng",
    DELETE_FAILED: "Không thể xóa người dùng",
    FETCH_FAILED: "Không thể tải danh sách người dùng",
    ASSIGN_ROLES_FAILED: "Không thể gán vai trò cho người dùng",
    REMOVE_ROLES_FAILED: "Không thể xóa vai trò khỏi người dùng",
    NETWORK_ERROR: "Lỗi mạng, vui lòng thử lại",
    UNAUTHORIZED: "Bạn không có quyền thực hiện hành động này",
    SERVER_ERROR: "Lỗi máy chủ, vui lòng thử lại sau",
  },
};

// Success messages
export const USER_SUCCESS_MESSAGES = {
  USER_CREATED: "Tạo người dùng thành công!",
  USER_UPDATED: "Cập nhật người dùng thành công!",
  USER_DELETED: "Xóa người dùng thành công!",
  ROLES_ASSIGNED: "Gán vai trò thành công!",
  ROLES_REMOVED: "Xóa vai trò thành công!",
  STATUS_UPDATED: "Cập nhật trạng thái thành công!",
};

// Table columns configuration
export const USER_TABLE_COLUMNS = [
  {
    key: "name" as const,
    label: "Tên người dùng",
    sortable: true,
    filterable: true,
    width: "20%",
  },
  {
    key: "email" as const,
    label: "Email",
    sortable: true,
    filterable: true,
    width: "20%",
  },
  {
    key: "phone" as const,
    label: "Số điện thoại",
    sortable: false,
    filterable: true,
    width: "15%",
  },
  {
    key: "roles" as const,
    label: "Vai trò",
    sortable: false,
    filterable: false,
    width: "20%",
  },
  {
    key: "isActive" as const,
    label: "Trạng thái",
    sortable: true,
    filterable: true,
    width: "10%",
  },
  {
    key: "createdAt" as const,
    label: "Ngày tạo",
    sortable: true,
    filterable: false,
    width: "10%",
  },
  {
    key: "actions" as const,
    label: "Thao tác",
    sortable: false,
    filterable: false,
    width: "5%",
  },
];

// Modal configurations
export const USER_MODAL_CONFIG = {
  CREATE: {
    title: "Thêm người dùng mới",
    confirmText: "Tạo người dùng",
    cancelText: "Hủy bỏ",
    width: "600px",
  },
  EDIT: {
    title: "Cập nhật người dùng",
    confirmText: "Cập nhật",
    cancelText: "Hủy bỏ",
    width: "600px",
  },
  VIEW: {
    title: "Thông tin chi tiết",
    confirmText: "Đóng",
    cancelText: "",
    width: "700px",
  },
  DELETE: {
    title: "Xác nhận xóa",
    confirmText: "Xóa",
    cancelText: "Hủy bỏ",
    width: "400px",
  },
  ASSIGN_ROLES: {
    title: "Gán vai trò",
    confirmText: "Gán vai trò",
    cancelText: "Hủy bỏ",
    width: "500px",
  },
};

// Permission requirements
export const USER_PERMISSIONS = {
  VIEW: "USER_READ",
  CREATE: "USER_CREATE",
  UPDATE: "USER_UPDATE",
  DELETE: "USER_DELETE",
  ASSIGN_ROLES: "USER_UPDATE", // Using same permission for role assignment
  MANAGE_STATUS: "USER_UPDATE",
};

// Role-related constants
export const USER_ROLE_CONSTANTS = {
  MAX_ROLES_PER_USER: 10,
  DEFAULT_ROLE_COLORS: [
    "#1890ff", // blue
    "#52c41a", // green
    "#faad14", // orange
    "#f5222d", // red
    "#722ed1", // purple
    "#13c2c2", // cyan
    "#eb2f96", // magenta
    "#fa8c16", // volcano
  ],
};

// Export default configuration
export const USER_FEATURE_CONFIG = {
  FEATURE_NAME: "users",
  ROUTE_PREFIX: "/dashboard/users",
  API_PREFIX: "/user",
  PERMISSIONS: USER_PERMISSIONS,
  TABLE_CONFIG: {
    DEFAULT_PAGE_SIZE: USER_CONSTANTS.DEFAULT_PAGE_SIZE,
    COLUMNS: USER_TABLE_COLUMNS,
  },
};
