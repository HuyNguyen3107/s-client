// Background Constants - Single Responsibility Principle (SRP)
export const BACKGROUND_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
    MAX_PAGE_SIZE: 100,
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },

  VALIDATION: {
    NAME: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 255,
    },
    DESCRIPTION: {
      MAX_LENGTH: 1000,
    },
    IMAGE: {
      ALLOWED_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
      MAX_SIZE: 5 * 1024 * 1024, // 5MB
    },
    MAX_NAME_LENGTH: 255,
    MAX_DESCRIPTION_LENGTH: 1000,
    ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  },

  VIEW_MODES: {
    GRID: "grid" as const,
    TABLE: "table" as const,
    LIST: "list" as const,
  },

  CACHE_KEYS: {
    BACKGROUNDS: "backgrounds",
    BACKGROUND_DETAIL: "background-detail",
    BACKGROUNDS_BY_PRODUCT: "backgrounds-by-product",
  },

  DEBOUNCE_DELAY: 500,

  DEFAULT_BACKGROUND_IMAGE: "/images/default-background.png",

  ERROR_MESSAGES: {
    LOAD_FAILED: "Không thể tải danh sách background",
    CREATE_FAILED: "Không thể tạo background mới",
    UPDATE_FAILED: "Không thể cập nhật background",
    DELETE_FAILED: "Không thể xóa background",
    NOT_FOUND: "Không tìm thấy background",
    INVALID_IMAGE: "Định dạng hình ảnh không hợp lệ",
    IMAGE_TOO_LARGE: "Kích thước hình ảnh quá lớn",
    INVALID_FORMAT: "Định dạng không hợp lệ",
  },

  SUCCESS_MESSAGES: {
    CREATE_SUCCESS: "Tạo background thành công",
    UPDATE_SUCCESS: "Cập nhật background thành công",
    DELETE_SUCCESS: "Xóa background thành công",
  },

  // Legacy support for existing code
  MESSAGES: {
    SUCCESS: {
      CREATE: "Tạo background thành công",
      UPDATE: "Cập nhật background thành công",
      DELETE: "Xóa background thành công",
    },
    ERROR: {
      CREATE_FAILED: "Tạo background thất bại",
      UPDATE_FAILED: "Cập nhật background thất bại",
      DELETE_FAILED: "Xóa background thất bại",
      NOT_FOUND: "Không tìm thấy background",
      INVALID_IMAGE: "Định dạng hình ảnh không hợp lệ",
      IMAGE_TOO_LARGE: "Kích thước hình ảnh quá lớn",
    },
  },
} as const;

export const BACKGROUND_ACTION_TYPES = {
  CREATE: "create",
  EDIT: "edit",
  DELETE: "delete",
  VIEW: "view",
  DUPLICATE: "duplicate",
} as const;

export const BACKGROUND_FORM_FIELDS = {
  PRODUCT_ID: "productId",
  NAME: "name",
  DESCRIPTION: "description",
  IMAGE_URL: "imageUrl",
  CONFIG: "config",
} as const;
