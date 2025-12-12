import { EMAIL_REGEX } from "../../../constants/regex.constants";

export const LOGIN_RULES = {
  email: {
    required: "Email là bắt buộc",
    pattern: {
      value: EMAIL_REGEX,
      message: "Email không hợp lệ. Vui lòng nhập đúng định dạng email",
    },
    validate: (value: string) => {
      if (!value.trim()) {
        return "Email không được để trống";
      }
      if (value.length > 255) {
        return "Email không được vượt quá 255 ký tự";
      }
      return true;
    },
  },
  password: {
    required: "Mật khẩu là bắt buộc",
    minLength: {
      value: 6,
      message: "Mật khẩu phải có ít nhất 6 ký tự",
    },
    validate: (value: string) => {
      if (!value.trim()) {
        return "Mật khẩu không được để trống";
      }
      if (value.length > 100) {
        return "Mật khẩu không được vượt quá 100 ký tự";
      }
      return true;
    },
  },
};
