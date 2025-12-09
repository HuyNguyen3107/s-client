import { FEEDBACK_CONSTANTS } from "../constants/feedback.constants";

export const FEEDBACK_VALIDATION_RULES = {
  customerName: {
    required: "Tên khách hàng là bắt buộc",
    maxLength: {
      value: FEEDBACK_CONSTANTS.VALIDATION.CUSTOMER_NAME_MAX_LENGTH,
      message: `Tên khách hàng không được vượt quá ${FEEDBACK_CONSTANTS.VALIDATION.CUSTOMER_NAME_MAX_LENGTH} ký tự`,
    },
  },
  content: {
    required: "Nội dung feedback là bắt buộc",
    maxLength: {
      value: FEEDBACK_CONSTANTS.VALIDATION.CONTENT_MAX_LENGTH,
      message: `Nội dung không được vượt quá ${FEEDBACK_CONSTANTS.VALIDATION.CONTENT_MAX_LENGTH} ký tự`,
    },
  },
  rating: {
    required: "Đánh giá là bắt buộc",
    min: {
      value: FEEDBACK_CONSTANTS.VALIDATION.MIN_RATING,
      message: `Đánh giá tối thiểu là ${FEEDBACK_CONSTANTS.VALIDATION.MIN_RATING} sao`,
    },
    max: {
      value: FEEDBACK_CONSTANTS.VALIDATION.MAX_RATING,
      message: `Đánh giá tối đa là ${FEEDBACK_CONSTANTS.VALIDATION.MAX_RATING} sao`,
    },
  },
  imageUrl: {
    required: false,
  },
} as const;
