import { ProductStatus, type ProductSortOption } from "../types";

export const PRODUCT_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
  },
  VALIDATION: {
    NAME_MIN_LENGTH: 3,
    NAME_MAX_LENGTH: 255,
    DESCRIPTION_MAX_LENGTH: 1000,
  },
  STATUS_OPTIONS: [
    {
      value: ProductStatus.ACTIVE,
      label: "Hoạt động",
      color: "success" as const,
    },
    {
      value: ProductStatus.INACTIVE,
      label: "Tạm dừng",
      color: "warning" as const,
    },
    { value: ProductStatus.DRAFT, label: "Nháp", color: "default" as const },
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
      value: "name_asc",
      label: "Tên A-Z",
      field: "name",
      direction: "asc",
    },
    {
      value: "name_desc",
      label: "Tên Z-A",
      field: "name",
      direction: "desc",
    },
    {
      value: "updatedAt_desc",
      label: "Cập nhật mới nhất",
      field: "updatedAt",
      direction: "desc",
    },
  ] as ProductSortOption[],
  DEFAULT_SORT: {
    sortBy: "createdAt" as const,
    sortOrder: "desc" as const,
  },
  VIEW_MODES: {
    GRID: "grid" as const,
    TABLE: "table" as const,
  },
  MESSAGES: {
    DELETE_CONFIRM: "Bạn có chắc chắn muốn xóa sản phẩm này?",
    DELETE_SUCCESS: "Xóa sản phẩm thành công!",
    CREATE_SUCCESS: "Tạo sản phẩm thành công!",
    UPDATE_SUCCESS: "Cập nhật sản phẩm thành công!",
    NETWORK_ERROR: "Có lỗi kết nối. Vui lòng thử lại!",
    NOT_FOUND: "Không tìm thấy sản phẩm!",
    VALIDATION_ERROR: "Dữ liệu không hợp lệ!",
  },
} as const;
