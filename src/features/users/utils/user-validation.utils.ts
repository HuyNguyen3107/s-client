/**
 * User Validation Utilities
 * Centralized validation logic for both React Hook Form and manual validation
 */
import {
  USER_CONSTANTS,
  USER_VALIDATION,
  USER_ERROR_MESSAGES,
} from "../constants";
import type { UserFormData, UserFormErrors } from "../types";

export class UserValidator {
  /**
   * Validate user name
   */
  static validateName(name: string): string | undefined {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return USER_ERROR_MESSAGES.VALIDATION.NAME_REQUIRED;
    }

    if (trimmedName.length < 2) {
      return "Tên phải có ít nhất 2 ký tự";
    }

    if (trimmedName.length > USER_CONSTANTS.MAX_NAME_LENGTH) {
      return `Tên không được vượt quá ${USER_CONSTANTS.MAX_NAME_LENGTH} ký tự`;
    }

    if (!USER_VALIDATION.NAME_PATTERN.test(trimmedName)) {
      return USER_ERROR_MESSAGES.VALIDATION.NAME_INVALID;
    }

    return undefined;
  }

  /**
   * Validate email
   */
  static validateEmail(email: string): string | undefined {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return USER_ERROR_MESSAGES.VALIDATION.EMAIL_REQUIRED;
    }

    if (trimmedEmail.length > USER_CONSTANTS.MAX_EMAIL_LENGTH) {
      return `Email không được vượt quá ${USER_CONSTANTS.MAX_EMAIL_LENGTH} ký tự`;
    }

    if (!USER_VALIDATION.EMAIL_PATTERN.test(trimmedEmail)) {
      return USER_ERROR_MESSAGES.VALIDATION.EMAIL_INVALID;
    }

    return undefined;
  }

  /**
   * Validate phone number
   */
  static validatePhone(phone: string): string | undefined {
    const trimmedPhone = phone.trim();

    if (!trimmedPhone) {
      return USER_ERROR_MESSAGES.VALIDATION.PHONE_REQUIRED;
    }

    if (trimmedPhone.length > USER_CONSTANTS.MAX_PHONE_LENGTH) {
      return `Số điện thoại không được vượt quá ${USER_CONSTANTS.MAX_PHONE_LENGTH} ký tự`;
    }

    if (!USER_VALIDATION.PHONE_PATTERN.test(trimmedPhone)) {
      return USER_ERROR_MESSAGES.VALIDATION.PHONE_INVALID;
    }

    return undefined;
  }

  /**
   * Validate password
   */
  static validatePassword(
    password: string,
    isRequired: boolean = true
  ): string | undefined {
    if (!password) {
      return isRequired
        ? USER_ERROR_MESSAGES.VALIDATION.PASSWORD_REQUIRED
        : undefined;
    }

    if (password.length < USER_CONSTANTS.MIN_PASSWORD_LENGTH) {
      return USER_ERROR_MESSAGES.VALIDATION.PASSWORD_TOO_SHORT;
    }

    if (password.length > USER_CONSTANTS.MAX_PASSWORD_LENGTH) {
      return USER_ERROR_MESSAGES.VALIDATION.PASSWORD_TOO_LONG;
    }

    if (!USER_VALIDATION.PASSWORD_PATTERN.test(password)) {
      return USER_ERROR_MESSAGES.VALIDATION.PASSWORD_WEAK;
    }

    return undefined;
  }

  /**
   * Validate complete form data
   */
  static validateForm(
    formData: UserFormData,
    isEditMode: boolean = false
  ): UserFormErrors {
    const errors: UserFormErrors = {};

    // Validate name
    const nameError = this.validateName(formData.name);
    if (nameError) errors.name = nameError;

    // Validate email
    const emailError = this.validateEmail(formData.email);
    if (emailError) errors.email = emailError;

    // Validate phone
    const phoneError = this.validatePhone(formData.phone);
    if (phoneError) errors.phone = phoneError;

    // Validate password (not required in edit mode)
    const passwordError = this.validatePassword(formData.password, !isEditMode);
    if (passwordError) errors.password = passwordError;

    return errors;
  }

  /**
   * Check if form is valid
   */
  static isFormValid(
    formData: UserFormData,
    isEditMode: boolean = false
  ): boolean {
    const errors = this.validateForm(formData, isEditMode);
    return Object.keys(errors).length === 0;
  }

  /**
   * Get React Hook Form validation rules
   */
  static getReactHookFormRules() {
    return {
      name: {
        required: USER_ERROR_MESSAGES.VALIDATION.NAME_REQUIRED,
        minLength: {
          value: 2,
          message: "Tên phải có ít nhất 2 ký tự",
        },
        maxLength: {
          value: USER_CONSTANTS.MAX_NAME_LENGTH,
          message: `Tên không được vượt quá ${USER_CONSTANTS.MAX_NAME_LENGTH} ký tự`,
        },
        pattern: {
          value: USER_VALIDATION.NAME_PATTERN,
          message: USER_ERROR_MESSAGES.VALIDATION.NAME_INVALID,
        },
      },
      email: {
        required: USER_ERROR_MESSAGES.VALIDATION.EMAIL_REQUIRED,
        maxLength: {
          value: USER_CONSTANTS.MAX_EMAIL_LENGTH,
          message: `Email không được vượt quá ${USER_CONSTANTS.MAX_EMAIL_LENGTH} ký tự`,
        },
        pattern: {
          value: USER_VALIDATION.EMAIL_PATTERN,
          message: USER_ERROR_MESSAGES.VALIDATION.EMAIL_INVALID,
        },
      },
      phone: {
        required: USER_ERROR_MESSAGES.VALIDATION.PHONE_REQUIRED,
        maxLength: {
          value: USER_CONSTANTS.MAX_PHONE_LENGTH,
          message: `Số điện thoại không được vượt quá ${USER_CONSTANTS.MAX_PHONE_LENGTH} ký tự`,
        },
        pattern: {
          value: USER_VALIDATION.PHONE_PATTERN,
          message: USER_ERROR_MESSAGES.VALIDATION.PHONE_INVALID,
        },
      },
      password: {
        minLength: {
          value: USER_CONSTANTS.MIN_PASSWORD_LENGTH,
          message: USER_ERROR_MESSAGES.VALIDATION.PASSWORD_TOO_SHORT,
        },
        maxLength: {
          value: USER_CONSTANTS.MAX_PASSWORD_LENGTH,
          message: USER_ERROR_MESSAGES.VALIDATION.PASSWORD_TOO_LONG,
        },
        pattern: {
          value: USER_VALIDATION.PASSWORD_PATTERN,
          message: USER_ERROR_MESSAGES.VALIDATION.PASSWORD_WEAK,
        },
      },
    };
  }
}
