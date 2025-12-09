/**
 * Profile Management Constants
 * Following Single Responsibility Principle
 */

// Default values
export const PROFILE_CONSTANTS = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 100,
  MAX_NAME_LENGTH: 100,
  MAX_EMAIL_LENGTH: 255,
  MAX_PHONE_LENGTH: 20,

  // Default form data
  DEFAULT_PROFILE_FORM: {
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  },
};

// Validation messages
export const PROFILE_VALIDATION_MESSAGES = {
  NAME: {
    REQUIRED: "Tên không được để trống",
    MAX_LENGTH: `Tên không được vượt quá ${PROFILE_CONSTANTS.MAX_NAME_LENGTH} ký tự`,
  },
  EMAIL: {
    REQUIRED: "Email không được để trống",
    INVALID: "Email không hợp lệ",
    MAX_LENGTH: `Email không được vượt quá ${PROFILE_CONSTANTS.MAX_EMAIL_LENGTH} ký tự`,
  },
  PHONE: {
    REQUIRED: "Số điện thoại không được để trống",
    INVALID: "Số điện thoại không hợp lệ",
    MAX_LENGTH: `Số điện thoại không được vượt quá ${PROFILE_CONSTANTS.MAX_PHONE_LENGTH} ký tự`,
  },
  PASSWORD: {
    MIN_LENGTH: `Mật khẩu phải có ít nhất ${PROFILE_CONSTANTS.MIN_PASSWORD_LENGTH} ký tự`,
    MAX_LENGTH: `Mật khẩu không được vượt quá ${PROFILE_CONSTANTS.MAX_PASSWORD_LENGTH} ký tự`,
    MISMATCH: "Mật khẩu xác nhận không khớp",
    CURRENT_REQUIRED: "Vui lòng nhập mật khẩu hiện tại để thay đổi mật khẩu",
  },
  FORM: {
    VALIDATION_ERROR: "Vui lòng kiểm tra lại thông tin",
    UPDATE_ERROR: "Có lỗi xảy ra khi cập nhật thông tin",
    SERVER_ERROR: "Lỗi máy chủ, vui lòng thử lại sau",
  },
};

// Success messages
export const PROFILE_SUCCESS_MESSAGES = {
  PROFILE_UPDATED: "Cập nhật thông tin thành công!",
  PASSWORD_UPDATED: "Đổi mật khẩu thành công!",
};
