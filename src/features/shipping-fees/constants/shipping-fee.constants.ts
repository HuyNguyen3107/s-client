/**
 * Constants for shipping fees feature
 * Following Single Responsibility Principle - each constant has a specific purpose
 */

// API endpoints constants
export const SHIPPING_FEE_API_PATHS = {
  SHIPPING_FEES: "/shipping-fees",
  SHIPPING_FEE_BY_ID: (id: string) => `/shipping-fees/${id}`,
  SHIPPING_FEE_AREAS: "/shipping-fees/areas",
  SHIPPING_FEE_TYPES: "/shipping-fees/shipping-types",
  SHIPPING_FEE_STATISTICS: "/shipping-fees/statistics",
  SHIPPING_FEE_BY_AREA: (area: string) => `/shipping-fees/by-area/${area}`,
  SHIPPING_FEE_SEARCH: "/shipping-fees/search",
} as const;

// Route paths constants
export const SHIPPING_FEE_ROUTES = {
  MAIN: "/dashboard/shipping-fees",
  LIST: "/dashboard/shipping-fees",
  CREATE: "/dashboard/shipping-fees/create",
  EDIT: (id: string) => `/dashboard/shipping-fees/edit/${id}`,
  DETAIL: (id: string) => `/dashboard/shipping-fees/${id}`,
} as const;

// Query keys for React Query (following consistent naming)
export const SHIPPING_FEE_QUERY_KEYS = {
  ALL: ["shipping-fees"] as const,
  LIST: (params?: any) => ["shipping-fees", "list", params] as const,
  DETAIL: (id: string) => ["shipping-fees", "detail", id] as const,
  AREAS: ["shipping-fees", "areas"] as const,
  TYPES: ["shipping-fees", "types"] as const,
  STATISTICS: ["shipping-fees", "statistics"] as const,
  BY_AREA: (area: string) => ["shipping-fees", "by-area", area] as const,
  SEARCH: (params: any) => ["shipping-fees", "search", params] as const,
} as const;

// Mutation keys for React Query
export const SHIPPING_FEE_MUTATION_KEYS = {
  CREATE: "create-shipping-fee",
  UPDATE: "update-shipping-fee",
  DELETE: "delete-shipping-fee",
} as const;

// Default pagination values
export const SHIPPING_FEE_PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  SORT_ORDER: "desc" as const,
  SORT_BY: "createdAt" as const,
} as const;

// Form validation constants
export const SHIPPING_FEE_VALIDATION = {
  MIN_SHIPPING_FEE: 0,
  MAX_SHIPPING_FEE: 1000000,
  MIN_SHIPPING_TYPE_LENGTH: 2,
  MAX_SHIPPING_TYPE_LENGTH: 100,
  MIN_AREA_LENGTH: 2,
  MAX_AREA_LENGTH: 100,
  MIN_DELIVERY_TIME_LENGTH: 2,
  MAX_DELIVERY_TIME_LENGTH: 50,
  MAX_NOTES_LENGTH: 500,
} as const;

// Common shipping types (can be extended)
export const COMMON_SHIPPING_TYPES = [
  "Giao hàng tiêu chuẩn",
  "Giao hàng nhanh",
  "Giao hàng hỏa tốc",
  "Giao hàng COD",
  "Giao hàng miễn phí",
] as const;

// Common areas in Vietnam (can be extended)
export const COMMON_AREAS = [
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "Nha Trang",
  "Hải Dương",
  "Bắc Ninh",
  "Hưng Yên",
  "Nghệ An",
  "Thanh Hóa",
  "Quảng Ninh",
  "Lào Cai",
  "Điện Biên",
  "Cao Bằng",
] as const;

// Table columns configuration
export const SHIPPING_FEE_TABLE_COLUMNS = [
  {
    key: "shippingType",
    label: "Loại vận chuyển",
    sortable: false,
  },
  {
    key: "area",
    label: "Khu vực",
    sortable: true,
  },
  {
    key: "estimatedDeliveryTime",
    label: "Thời gian giao hàng",
    sortable: false,
  },
  {
    key: "shippingFee",
    label: "Phí vận chuyển",
    sortable: true,
  },
  {
    key: "notesOrRemarks",
    label: "Ghi chú",
    sortable: false,
  },
  {
    key: "createdAt",
    label: "Ngày tạo",
    sortable: true,
  },
  {
    key: "actions",
    label: "Thao tác",
    sortable: false,
  },
] as const;

// Error messages
export const SHIPPING_FEE_ERROR_MESSAGES = {
  SHIPPING_TYPE_REQUIRED: "Loại vận chuyển không được để trống",
  SHIPPING_TYPE_TOO_SHORT: `Loại vận chuyển phải có ít nhất ${SHIPPING_FEE_VALIDATION.MIN_SHIPPING_TYPE_LENGTH} ký tự`,
  SHIPPING_TYPE_TOO_LONG: `Loại vận chuyển không được vượt quá ${SHIPPING_FEE_VALIDATION.MAX_SHIPPING_TYPE_LENGTH} ký tự`,

  AREA_REQUIRED: "Khu vực không được để trống",
  AREA_TOO_SHORT: `Khu vực phải có ít nhất ${SHIPPING_FEE_VALIDATION.MIN_AREA_LENGTH} ký tự`,
  AREA_TOO_LONG: `Khu vực không được vượt quá ${SHIPPING_FEE_VALIDATION.MAX_AREA_LENGTH} ký tự`,

  ESTIMATED_DELIVERY_TIME_REQUIRED:
    "Thời gian giao hàng dự kiến không được để trống",
  ESTIMATED_DELIVERY_TIME_TOO_SHORT: `Thời gian giao hàng phải có ít nhất ${SHIPPING_FEE_VALIDATION.MIN_DELIVERY_TIME_LENGTH} ký tự`,
  ESTIMATED_DELIVERY_TIME_TOO_LONG: `Thời gian giao hàng không được vượt quá ${SHIPPING_FEE_VALIDATION.MAX_DELIVERY_TIME_LENGTH} ký tự`,

  SHIPPING_FEE_REQUIRED: "Phí vận chuyển không được để trống",
  SHIPPING_FEE_INVALID: "Phí vận chuyển phải là số hợp lệ",
  SHIPPING_FEE_TOO_LOW: `Phí vận chuyển phải lớn hơn hoặc bằng ${SHIPPING_FEE_VALIDATION.MIN_SHIPPING_FEE}`,
  SHIPPING_FEE_TOO_HIGH: `Phí vận chuyển không được vượt quá ${SHIPPING_FEE_VALIDATION.MAX_SHIPPING_FEE.toLocaleString(
    "vi-VN"
  )} VNĐ`,

  NOTES_TOO_LONG: `Ghi chú không được vượt quá ${SHIPPING_FEE_VALIDATION.MAX_NOTES_LENGTH} ký tự`,

  FETCH_ERROR: "Có lỗi xảy ra khi tải dữ liệu phí vận chuyển",
  CREATE_ERROR: "Có lỗi xảy ra khi tạo phí vận chuyển",
  UPDATE_ERROR: "Có lỗi xảy ra khi cập nhật phí vận chuyển",
  DELETE_ERROR: "Có lỗi xảy ra khi xóa phí vận chuyển",

  NETWORK_ERROR: "Lỗi kết nối mạng. Vui lòng thử lại sau.",
  UNAUTHORIZED: "Bạn không có quyền thực hiện thao tác này",
  FORBIDDEN: "Thao tác bị cấm",
  NOT_FOUND: "Không tìm thấy dữ liệu phí vận chuyển",
  INTERNAL_SERVER_ERROR: "Lỗi máy chủ nội bộ. Vui lòng thử lại sau.",
} as const;

// Success messages
export const SHIPPING_FEE_SUCCESS_MESSAGES = {
  CREATE_SUCCESS: "Tạo phí vận chuyển thành công",
  UPDATE_SUCCESS: "Cập nhật phí vận chuyển thành công",
  DELETE_SUCCESS: "Xóa phí vận chuyển thành công",
} as const;

// Loading messages
export const SHIPPING_FEE_LOADING_MESSAGES = {
  LOADING: "Đang tải...",
  CREATING: "Đang tạo phí vận chuyển...",
  UPDATING: "Đang cập nhật phí vận chuyển...",
  DELETING: "Đang xóa phí vận chuyển...",
} as const;
