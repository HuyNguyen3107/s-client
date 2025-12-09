export const FEEDBACK_CONSTANTS = {
  RATING_OPTIONS: [
    { value: 5, label: "5 sao - Xuất sắc", color: "success" },
    { value: 4, label: "4 sao - Tốt", color: "info" },
    { value: 3, label: "3 sao - Trung bình", color: "warning" },
    { value: 2, label: "2 sao - Kém", color: "error" },
    { value: 1, label: "1 sao - Rất kém", color: "error" },
  ],
  SORT_OPTIONS: [
    { value: "createdAt", label: "Ngày tạo" },
    { value: "rating", label: "Đánh giá" },
    { value: "customerName", label: "Tên khách hàng" },
  ],
  ORDER_OPTIONS: [
    { value: "desc", label: "Giảm dần" },
    { value: "asc", label: "Tăng dần" },
  ],
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
  },
  IMAGE: {
    MAX_SIZE_MB: 5,
    ALLOWED_TYPES: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ],
  },
  VALIDATION: {
    CUSTOMER_NAME_MAX_LENGTH: 100,
    CONTENT_MAX_LENGTH: 1000,
    MIN_RATING: 1,
    MAX_RATING: 5,
  },
} as const;

export type RatingValue = 1 | 2 | 3 | 4 | 5;
export type SortBy = "createdAt" | "rating" | "customerName";
export type SortOrder = "asc" | "desc";
