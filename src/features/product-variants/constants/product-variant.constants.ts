import type { ProductVariantSortOption } from "../types";

// Constants following Single Responsibility Principle
export const PRODUCT_VARIANT_CONSTANTS = {
  // Pagination
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,

  // Sorting options
  SORT_OPTIONS: [
    {
      value: "createdAt_desc",
      label: "Mới nhất",
      field: "createdAt" as const,
      direction: "desc" as const,
    },
    {
      value: "createdAt_asc",
      label: "Cũ nhất",
      field: "createdAt" as const,
      direction: "asc" as const,
    },
    {
      value: "name_asc",
      label: "Tên A-Z",
      field: "name" as const,
      direction: "asc" as const,
    },
    {
      value: "name_desc",
      label: "Tên Z-A",
      field: "name" as const,
      direction: "desc" as const,
    },
    {
      value: "price_asc",
      label: "Giá thấp đến cao",
      field: "price" as const,
      direction: "asc" as const,
    },
    {
      value: "price_desc",
      label: "Giá cao đến thấp",
      field: "price" as const,
      direction: "desc" as const,
    },
    {
      value: "updatedAt_desc",
      label: "Cập nhật mới nhất",
      field: "updatedAt" as const,
      direction: "desc" as const,
    },
  ] as ProductVariantSortOption[],

  // Status options
  STATUS_OPTIONS: [
    { value: "active", label: "Hoạt động", color: "success" },
    { value: "inactive", label: "Không hoạt động", color: "default" },
    { value: "draft", label: "Bản nháp", color: "warning" },
  ] as const,

  // Validation
  VALIDATION: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 255,
    PRICE_MIN: 0,
    PRICE_MAX: 999999999,
    REQUIRED_FIELDS: ["name", "productId", "price"],
  },

  // UI
  VIEW_MODES: ["grid", "table"] as const,
  ITEMS_PER_PAGE_OPTIONS: [10, 25, 50, 100],
  PRICE_FORMAT: "vi-VN",
  CURRENCY: "VNĐ",

  // Query keys for React Query
  QUERY_KEYS: {
    ALL: ["product-variants"] as const,
    LIST: (params?: any) => ["product-variants", "list", params] as const,
    DETAIL: (id: string) => ["product-variants", "detail", id] as const,
    BY_PRODUCT: (productId: string) =>
      ["product-variants", "by-product", productId] as const,
    STATISTICS: ["product-variants", "statistics"] as const,
    STATISTICS_BY_PRODUCT: (productId: string) =>
      ["product-variants", "statistics", "by-product", productId] as const,
  },

  // Mutation keys
  MUTATION_KEYS: {
    CREATE: "create-product-variant",
    UPDATE: "update-product-variant",
    DELETE: "delete-product-variant",
    UPDATE_STATUS: "update-product-variant-status",
    DUPLICATE: "duplicate-product-variant",
  },

  // Error messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: "Lỗi kết nối mạng",
    SERVER_ERROR: "Lỗi máy chủ",
    NOT_FOUND: "Không tìm thấy biến thể sản phẩm",
    VALIDATION_FAILED: "Dữ liệu không hợp lệ",
    NAME_REQUIRED: "Tên biến thể là bắt buộc",
    NAME_TOO_SHORT: "Tên biến thể phải có ít nhất 2 ký tự",
    NAME_TOO_LONG: "Tên biến thể không được vượt quá 255 ký tự",
    PRODUCT_ID_REQUIRED: "Sản phẩm là bắt buộc",
    PRICE_REQUIRED: "Giá là bắt buộc",
    PRICE_INVALID: "Giá phải là số dương",
    PRICE_TOO_LOW: "Giá không thể âm",
    PRICE_TOO_HIGH: "Giá quá cao",
    JSON_INVALID: "Định dạng JSON không hợp lệ",
    DUPLICATE_NAME: "Tên biến thể đã tồn tại trong sản phẩm này",
    DELETE_FAILED: "Không thể xóa biến thể",
    CREATE_FAILED: "Không thể tạo biến thể",
    UPDATE_FAILED: "Không thể cập nhật biến thể",
    DUPLICATE_FAILED: "Không thể sao chép biến thể",
  },

  // Success messages
  SUCCESS_MESSAGES: {
    CREATE_SUCCESS: "Tạo biến thể sản phẩm thành công",
    UPDATE_SUCCESS: "Cập nhật biến thể sản phẩm thành công",
    DELETE_SUCCESS: "Xóa biến thể sản phẩm thành công",
    DUPLICATE_SUCCESS: "Sao chép biến thể sản phẩm thành công",
    STATUS_UPDATE_SUCCESS: "Cập nhật trạng thái thành công",
  },

  // Form labels
  FORM_LABELS: {
    NAME: "Tên biến thể",
    DESCRIPTION: "Mô tả",
    PRICE: "Giá (VNĐ)",
    PRODUCT: "Sản phẩm",
    STATUS: "Trạng thái",
    ENDOW: "Ưu đãi/Quyền lợi (JSON)",
    OPTION: "Tùy chọn (JSON)",
    CONFIG: "Cấu hình (JSON)",
  },

  // Placeholders
  PLACEHOLDERS: {
    NAME: "Nhập tên biến thể sản phẩm",
    DESCRIPTION: "Nhập mô tả biến thể (tùy chọn)",
    PRICE: "Nhập giá sản phẩm",
    SEARCH: "Tìm kiếm biến thể sản phẩm...",
    JSON_ENDOW: '{"discount": 10, "gift": "Free shipping"}',
    JSON_OPTION: '{"color": "red", "size": "L"}',
    JSON_CONFIG: '{"minQuantity": 1, "maxQuantity": 100}',
  },
} as const;

// Default values
export const DEFAULT_PRODUCT_VARIANT_PARAMS = {
  page: PRODUCT_VARIANT_CONSTANTS.DEFAULT_PAGE,
  limit: PRODUCT_VARIANT_CONSTANTS.DEFAULT_LIMIT,
  sortBy: "createdAt" as const,
  sortOrder: "desc" as const,
};

// Form validation schemas
export const PRODUCT_VARIANT_VALIDATION_RULES = {
  name: {
    required: true,
    minLength: PRODUCT_VARIANT_CONSTANTS.VALIDATION.NAME_MIN_LENGTH,
    maxLength: PRODUCT_VARIANT_CONSTANTS.VALIDATION.NAME_MAX_LENGTH,
  },
  productId: {
    required: true,
  },
  price: {
    required: true,
    min: PRODUCT_VARIANT_CONSTANTS.VALIDATION.PRICE_MIN,
    max: PRODUCT_VARIANT_CONSTANTS.VALIDATION.PRICE_MAX,
  },
} as const;

// JSON field templates
export const JSON_TEMPLATES = {
  ENDOW: {
    discount: 0,
    gift: "",
    freeShipping: false,
  },
  OPTION: {
    color: "",
    size: "",
    material: "",
  },
  CONFIG: {
    minQuantity: 1,
    maxQuantity: 100,
    isCustomizable: false,
  },
} as const;
