import type { ProductCustomSortOption } from "../types";
import { ProductCustomStatus } from "../types";

// Constants following Single Responsibility Principle
export const PRODUCT_CUSTOM_CONSTANTS = {
  // Pagination
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,

  // Search
  MIN_SEARCH_LENGTH: 2,
  SEARCH_DEBOUNCE_MS: 300,

  // Validation
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_PRICE: 0,
  MAX_PRICE: 999999999,
  PRICE_DECIMAL_PLACES: 2,

  // UI
  CARD_ASPECT_RATIO: 1.2,
  IMAGE_PLACEHOLDER: "/images/placeholder-product.png",
  LOADING_SKELETON_COUNT: 8,

  // Status colors
  STATUS_COLORS: {
    [ProductCustomStatus.ACTIVE]: "#4caf50",
    [ProductCustomStatus.INACTIVE]: "#757575",
    [ProductCustomStatus.OUT_OF_STOCK]: "#ff9800",
    [ProductCustomStatus.DISCONTINUED]: "#f44336",
  },

  // Status labels
  STATUS_LABELS: {
    [ProductCustomStatus.ACTIVE]: "Đang hoạt động",
    [ProductCustomStatus.INACTIVE]: "Không hoạt động",
    [ProductCustomStatus.OUT_OF_STOCK]: "Hết hàng",
    [ProductCustomStatus.DISCONTINUED]: "Ngừng kinh doanh",
  },

  // Sort options
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
      label: "Giá thấp nhất",
      field: "price" as const,
      direction: "asc" as const,
    },
    {
      value: "price_desc",
      label: "Giá cao nhất",
      field: "price" as const,
      direction: "desc" as const,
    },
  ] as ProductCustomSortOption[],

  // Default values
  DEFAULTS: {
    STATUS: ProductCustomStatus.ACTIVE,
    SORT_BY: "createdAt",
    SORT_ORDER: "desc",
    VIEW_MODE: "grid",
  },

  // Form validation messages
  VALIDATION_MESSAGES: {
    REQUIRED: "Trường này là bắt buộc",
    INVALID_CATEGORY: "Vui lòng chọn danh mục sản phẩm",
    NAME_TOO_SHORT: `Tên phải có ít nhất ${2} ký tự`,
    NAME_TOO_LONG: `Tên không được vượt quá ${100} ký tự`,
    DESCRIPTION_TOO_LONG: `Mô tả không được vượt quá ${500} ký tự`,
    INVALID_PRICE: "Giá phải là số dương",
    PRICE_TOO_HIGH: `Giá không được vượt quá ${999999999}`,
    INVALID_IMAGE_URL: "URL hình ảnh không hợp lệ",
  },

  // Action types for form operations
  FORM_ACTIONS: {
    CREATE: "create",
    UPDATE: "update",
    DELETE: "delete",
  } as const,
} as const;

// Export individual constants for convenience
export const {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
  MIN_LIMIT,
  MIN_SEARCH_LENGTH,
  SEARCH_DEBOUNCE_MS,
  MIN_NAME_LENGTH,
  MAX_NAME_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MIN_PRICE,
  MAX_PRICE,
  PRICE_DECIMAL_PLACES,
  CARD_ASPECT_RATIO,
  IMAGE_PLACEHOLDER,
  LOADING_SKELETON_COUNT,
  STATUS_COLORS,
  STATUS_LABELS,
  SORT_OPTIONS,
  DEFAULTS,
  VALIDATION_MESSAGES,
  FORM_ACTIONS,
} = PRODUCT_CUSTOM_CONSTANTS;
