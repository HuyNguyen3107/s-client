import { EMAIL_REGEX } from "../../../constants/regex.constants";
export const LOGIN_RULES = {
  email: {
    required: "Email is required",
    pattern: { value: EMAIL_REGEX, message: "Invalid email address" },
  },
  password: {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters",
    },
  },
};
