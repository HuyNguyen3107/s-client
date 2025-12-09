// Information Constants
export const INFORMATION_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
    MAX_PAGE_SIZE: 100,
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },

  VALIDATION: {
    CONFIG: {
      MAX_SIZE: 1000000, // 1MB for config JSON
    },
  },

  VIEW_MODES: {
    GRID: "grid" as const,
    TABLE: "table" as const,
  },

  CACHE_KEYS: {
    INFORMATIONS: "informations",
    INFORMATION_DETAIL: "information-detail",
  },

  DEBOUNCE_DELAY: 500,

  ERROR_MESSAGES: {
    LOAD_FAILED: "Không thể tải danh sách thông tin cấu hình",
    CREATE_FAILED: "Không thể tạo thông tin cấu hình mới",
    UPDATE_FAILED: "Không thể cập nhật thông tin cấu hình",
    DELETE_FAILED: "Không thể xóa thông tin cấu hình",
    NOT_FOUND: "Không tìm thấy thông tin cấu hình",
    INVALID_FORMAT: "Định dạng không hợp lệ",
    CONFIG_TOO_LARGE: "Cấu hình quá lớn",
  },

  SUCCESS_MESSAGES: {
    CREATE_SUCCESS: "Tạo thông tin cấu hình thành công",
    UPDATE_SUCCESS: "Cập nhật thông tin cấu hình thành công",
    DELETE_SUCCESS: "Xóa thông tin cấu hình thành công",
  },

  MESSAGES: {
    SUCCESS: {
      CREATE: "Tạo thông tin cấu hình thành công",
      UPDATE: "Cập nhật thông tin cấu hình thành công",
      DELETE: "Xóa thông tin cấu hình thành công",
    },
    ERROR: {
      CREATE_FAILED: "Tạo thông tin cấu hình thất bại",
      UPDATE_FAILED: "Cập nhật thông tin cấu hình thất bại",
      DELETE_FAILED: "Xóa thông tin cấu hình thất bại",
      NOT_FOUND: "Không tìm thấy thông tin cấu hình",
      CONFIG_TOO_LARGE: "Cấu hình quá lớn",
    },
  },
} as const;

export const INFORMATION_FORM_FIELDS = {
  CONFIG: "config",
} as const;
