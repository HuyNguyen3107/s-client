// Collection Constants - Single Responsibility Principle (SRP)
export const COLLECTION_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 12,
    PAGE_SIZE_OPTIONS: [12, 24, 48, 96],
    MAX_PAGE_SIZE: 100,
  },

  VALIDATION: {
    NAME: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 100,
    },
    SLUG: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 150,
      PATTERN: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },
    SORT_ORDER: {
      MIN: 0,
      MAX: 9999,
    },
  },

  SORT_OPTIONS: [
    { value: "name", label: "Tên bộ sưu tập" },
    { value: "createdAt", label: "Ngày tạo" },
    { value: "sortOrder", label: "Thứ tự sắp xếp" },
    { value: "productCount", label: "Số sản phẩm" },
  ],

  SORT_ORDER_OPTIONS: [
    { value: "asc", label: "Tăng dần" },
    { value: "desc", label: "Giảm dần" },
  ],

  VIEW_MODES: {
    GRID: "grid" as const,
    TABLE: "table" as const,
    LIST: "list" as const,
  },

  CACHE_KEYS: {
    COLLECTIONS: "collections",
    COLLECTION_DETAIL: "collection-detail",
    HOT_COLLECTIONS: "hot-collections",
  },

  DEBOUNCE_DELAY: 500,

  DEFAULT_COLLECTION_IMAGE: "/images/default-collection.png",

  ERROR_MESSAGES: {
    LOAD_FAILED: "Không thể tải danh sách bộ sưu tập",
    CREATE_FAILED: "Không thể tạo bộ sưu tập mới",
    UPDATE_FAILED: "Không thể cập nhật bộ sưu tập",
    DELETE_FAILED: "Không thể xóa bộ sưu tập",
    TOGGLE_STATUS_FAILED: "Không thể thay đổi trạng thái",
    DUPLICATE_SLUG: "Tên đường dẫn đã tồn tại",
    INVALID_FORMAT: "Định dạng không hợp lệ",
  },

  SUCCESS_MESSAGES: {
    CREATE_SUCCESS: "Tạo bộ sưu tập thành công",
    UPDATE_SUCCESS: "Cập nhật bộ sưu tập thành công",
    DELETE_SUCCESS: "Xóa bộ sưu tập thành công",
    STATUS_CHANGED: "Thay đổi trạng thái thành công",
  },
} as const;
