import type { ProductCategorySortOption } from "../types";

// Constants following Single Responsibility Principle
export const PRODUCT_CATEGORY_CONSTANTS = {
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
      value: "updatedAt_desc",
      label: "Cập nhật mới nhất",
      field: "updatedAt" as const,
      direction: "desc" as const,
    },
  ] as ProductCategorySortOption[],

  // Validation
  VALIDATION: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 255,
    REQUIRED_FIELDS: ["name", "productId"],
  },

  // UI
  VIEW_MODES: ["grid", "table"] as const,
  ITEMS_PER_PAGE_OPTIONS: [10, 25, 50, 100],

  // Query keys for React Query
  QUERY_KEYS: {
    ALL: ["product-categories"] as const,
    LIST: (params?: any) => ["product-categories", "list", params] as const,
    DETAIL: (id: string) => ["product-categories", "detail", id] as const,
    BY_PRODUCT: (productId: string) =>
      ["product-categories", "by-product", productId] as const,
    STATISTICS: ["product-categories", "statistics"] as const,
  },

  // Mutation keys
  MUTATION_KEYS: {
    CREATE: "create-product-category",
    UPDATE: "update-product-category",
    DELETE: "delete-product-category",
  },

  // Error messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: "Lỗi kết nối mạng",
    SERVER_ERROR: "Lỗi máy chủ",
    NOT_FOUND: "Không tìm thấy thể loại sản phẩm",
    VALIDATION_FAILED: "Dữ liệu không hợp lệ",
    NAME_REQUIRED: "Tên thể loại là bắt buộc",
    NAME_TOO_SHORT: "Tên thể loại phải có ít nhất 2 ký tự",
    NAME_TOO_LONG: "Tên thể loại không được vượt quá 255 ký tự",
    PRODUCT_ID_REQUIRED: "Sản phẩm là bắt buộc",
    DUPLICATE_NAME: "Tên thể loại đã tồn tại trong sản phẩm này",
    DELETE_FAILED: "Không thể xóa thể loại",
    CREATE_FAILED: "Không thể tạo thể loại",
    UPDATE_FAILED: "Không thể cập nhật thể loại",
  },

  // Success messages
  SUCCESS_MESSAGES: {
    CREATE_SUCCESS: "Tạo thể loại sản phẩm thành công",
    UPDATE_SUCCESS: "Cập nhật thể loại sản phẩm thành công",
    DELETE_SUCCESS: "Xóa thể loại sản phẩm thành công",
  },
} as const;

// Default values
export const DEFAULT_PRODUCT_CATEGORY_PARAMS = {
  page: PRODUCT_CATEGORY_CONSTANTS.DEFAULT_PAGE,
  limit: PRODUCT_CATEGORY_CONSTANTS.DEFAULT_LIMIT,
  sortBy: "createdAt" as const,
  sortOrder: "desc" as const,
};

// Form validation schemas
export const PRODUCT_CATEGORY_VALIDATION_RULES = {
  name: {
    required: true,
    minLength: PRODUCT_CATEGORY_CONSTANTS.VALIDATION.NAME_MIN_LENGTH,
    maxLength: PRODUCT_CATEGORY_CONSTANTS.VALIDATION.NAME_MAX_LENGTH,
  },
  productId: {
    required: true,
  },
} as const;
