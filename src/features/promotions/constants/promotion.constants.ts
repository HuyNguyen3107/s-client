import { PromotionType } from "../types/promotion.types";

export const PROMOTION_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },
  VALIDATION: {
    MIN_TITLE_LENGTH: 3,
    MAX_TITLE_LENGTH: 100,
    MIN_DESCRIPTION_LENGTH: 10,
    MAX_DESCRIPTION_LENGTH: 500,
    MIN_PROMO_CODE_LENGTH: 3,
    MAX_PROMO_CODE_LENGTH: 20,
    MIN_VALUE: 0,
    MAX_PERCENTAGE_VALUE: 100,
    MIN_ORDER_VALUE: 0,
  },
  FORM: {
    DEFAULT_VALUES: {
      title: "",
      description: "",
      type: PromotionType.PERCENTAGE,
      value: 0,
      minOrderValue: 0,
      maxDiscountAmount: "",
      startDate: "",
      endDate: "",
      usageLimit: undefined,
      promoCode: "",
      isActive: true,
    },
  },
  STATUS: {
    ACTIVE: "active",
    INACTIVE: "inactive",
    EXPIRED: "expired",
    UPCOMING: "upcoming",
  },
  SORT_OPTIONS: [
    { value: "createdAt_desc", label: "Mới nhất" },
    { value: "createdAt_asc", label: "Cũ nhất" },
    { value: "title_asc", label: "Tên A-Z" },
    { value: "title_desc", label: "Tên Z-A" },
    { value: "value_desc", label: "Giá trị cao nhất" },
    { value: "value_asc", label: "Giá trị thấp nhất" },
  ],
  PROMOTION_TYPES: [
    { value: "PERCENTAGE", label: "Phần trăm (%)" },
    { value: "FIXED_AMOUNT", label: "Số tiền cố định (VND)" },
  ],
} as const;

export const PROMOTION_MESSAGES = {
  SUCCESS: {
    CREATE: "Tạo mã giảm giá thành công!",
    UPDATE: "Cập nhật mã giảm giá thành công!",
    DELETE: "Xóa mã giảm giá thành công!",
    VALIDATE: "Mã giảm giá hợp lệ!",
    APPLY: "Áp dụng mã giảm giá thành công!",
  },
  ERROR: {
    CREATE: "Có lỗi xảy ra khi tạo mã giảm giá",
    UPDATE: "Có lỗi xảy ra khi cập nhật mã giảm giá",
    DELETE: "Có lỗi xảy ra khi xóa mã giảm giá",
    FETCH: "Có lỗi xảy ra khi tải danh sách mã giảm giá",
    VALIDATE: "Mã giảm giá không hợp lệ",
    NETWORK: "Lỗi kết nối mạng",
    PERMISSION: "Bạn không có quyền thực hiện thao tác này",
  },
  VALIDATION: {
    REQUIRED_TITLE: "Tiêu đề là bắt buộc",
    TITLE_LENGTH: `Tiêu đề phải từ ${PROMOTION_CONSTANTS.VALIDATION.MIN_TITLE_LENGTH} đến ${PROMOTION_CONSTANTS.VALIDATION.MAX_TITLE_LENGTH} ký tự`,
    REQUIRED_DESCRIPTION: "Mô tả là bắt buộc",
    DESCRIPTION_LENGTH: `Mô tả phải từ ${PROMOTION_CONSTANTS.VALIDATION.MIN_DESCRIPTION_LENGTH} đến ${PROMOTION_CONSTANTS.VALIDATION.MAX_DESCRIPTION_LENGTH} ký tự`,
    REQUIRED_PROMO_CODE: "Mã giảm giá là bắt buộc",
    PROMO_CODE_LENGTH: `Mã giảm giá phải từ ${PROMOTION_CONSTANTS.VALIDATION.MIN_PROMO_CODE_LENGTH} đến ${PROMOTION_CONSTANTS.VALIDATION.MAX_PROMO_CODE_LENGTH} ký tự`,
    PROMO_CODE_FORMAT: "Mã giảm giá chỉ được chứa chữ cái, số và dấu gạch dưới",
    INVALID_VALUE: "Giá trị giảm không hợp lệ",
    PERCENTAGE_RANGE: `Giá trị phần trăm phải từ ${PROMOTION_CONSTANTS.VALIDATION.MIN_VALUE} đến ${PROMOTION_CONSTANTS.VALIDATION.MAX_PERCENTAGE_VALUE}%`,
    INVALID_MIN_ORDER: "Giá trị đơn hàng tối thiểu không hợp lệ",
    INVALID_MAX_DISCOUNT: "Giá trị giảm tối đa không hợp lệ",
    INVALID_DATE_RANGE: "Ngày kết thúc phải sau ngày bắt đầu",
    INVALID_USAGE_LIMIT: "Số lần sử dụng phải lớn hơn 0",
  },
} as const;

export const PROMOTION_STATUS_COLORS = {
  [PROMOTION_CONSTANTS.STATUS.ACTIVE]: "success",
  [PROMOTION_CONSTANTS.STATUS.INACTIVE]: "warning",
  [PROMOTION_CONSTANTS.STATUS.EXPIRED]: "error",
  [PROMOTION_CONSTANTS.STATUS.UPCOMING]: "info",
} as const;
