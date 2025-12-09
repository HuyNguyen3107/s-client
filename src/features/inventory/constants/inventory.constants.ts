import { InventoryStatus, type InventorySortOption } from "../types";

export const INVENTORY_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
  },
  VALIDATION: {
    MIN_STOCK_MIN: 0,
    MIN_STOCK_MAX: 9999,
    CURRENT_STOCK_MIN: 0,
    CURRENT_STOCK_MAX: 999999,
    RESERVED_STOCK_MIN: 0,
    QUANTITY_MIN: 1,
    QUANTITY_MAX: 999999,
    REASON_MAX_LENGTH: 255,
  },
  STATUS_OPTIONS: [
    {
      value: InventoryStatus.ACTIVE,
      label: "Hoạt động",
      color: "success" as const,
    },
    {
      value: InventoryStatus.INACTIVE,
      label: "Tạm dừng",
      color: "warning" as const,
    },
  ],
  SORT_OPTIONS: [
    {
      value: "createdAt_desc",
      label: "Mới nhất",
      field: "createdAt",
      direction: "desc",
    },
    {
      value: "createdAt_asc",
      label: "Cũ nhất",
      field: "createdAt",
      direction: "asc",
    },
    {
      value: "productCustom.name_asc",
      label: "Tên sản phẩm A-Z",
      field: "productCustom.name",
      direction: "asc",
    },
    {
      value: "productCustom.name_desc",
      label: "Tên sản phẩm Z-A",
      field: "productCustom.name",
      direction: "desc",
    },
    {
      value: "currentStock_asc",
      label: "Tồn kho thấp nhất",
      field: "currentStock",
      direction: "asc",
    },
    {
      value: "currentStock_desc",
      label: "Tồn kho cao nhất",
      field: "currentStock",
      direction: "desc",
    },
    {
      value: "updatedAt_desc",
      label: "Cập nhật mới nhất",
      field: "updatedAt",
      direction: "desc",
    },
  ] as InventorySortOption[],
  DEFAULT_SORT: {
    sortBy: "createdAt" as const,
    sortOrder: "desc" as const,
  },
  VIEW_MODES: {
    GRID: "grid" as const,
    TABLE: "table" as const,
  },
  STOCK_LEVELS: {
    LOW_STOCK_THRESHOLD: 10,
    OUT_OF_STOCK: 0,
    CRITICAL_LEVEL: 5,
  },
  COLORS: {
    LOW_STOCK: "#ff9800", // orange
    OUT_OF_STOCK: "#f44336", // red
    HEALTHY_STOCK: "#4caf50", // green
    RESERVED_STOCK: "#2196f3", // blue
    CRITICAL_STOCK: "#e91e63", // pink
  },
  MESSAGES: {
    DELETE_CONFIRM: "Bạn có chắc chắn muốn xóa inventory này?",
    DELETE_SUCCESS: "Xóa inventory thành công!",
    CREATE_SUCCESS: "Tạo inventory thành công!",
    UPDATE_SUCCESS: "Cập nhật inventory thành công!",
    STOCK_ADJUST_SUCCESS: "Điều chỉnh tồn kho thành công!",
    STOCK_RESERVE_SUCCESS: "Đặt chỗ tồn kho thành công!",
    STOCK_RELEASE_SUCCESS: "Giải phóng tồn kho thành công!",
    NETWORK_ERROR: "Có lỗi kết nối. Vui lòng thử lại!",
    NOT_FOUND: "Không tìm thấy inventory!",
    VALIDATION_ERROR: "Dữ liệu không hợp lệ!",
    INSUFFICIENT_STOCK: "Không đủ tồn kho!",
    INVALID_QUANTITY: "Số lượng không hợp lệ!",
    STOCK_ADJUSTMENT_NEGATIVE: "Số lượng tồn kho không thể âm!",
    RESERVE_EXCEED_AVAILABLE: "Số lượng đặt chỗ vượt quá tồn kho có sẵn!",
    RELEASE_EXCEED_RESERVED: "Số lượng giải phóng vượt quá đã đặt chỗ!",
  },
  OPERATIONS: {
    ADJUSTMENT: "adjustment",
    RESERVATION: "reservation",
    RELEASE: "release",
  },
  ALERT_TYPES: {
    LOW_STOCK: "low_stock",
    OUT_OF_STOCK: "out_of_stock",
    CRITICAL_STOCK: "critical_stock",
  },
} as const;
