/**
 * Profile Validator
 * Following Single Responsibility Principle
 */

import { PROFILE_CONSTANTS, PROFILE_VALIDATION_MESSAGES } from "../constants";
import type { UpdateProfileFormData, ProfileFormErrors } from "../types";

export class ProfileValidator {
  /**
   * Validate name
   */
  static validateName(name: string): string | undefined {
    if (!name || name.trim().length === 0) {
      return PROFILE_VALIDATION_MESSAGES.NAME.REQUIRED;
    }

    if (name.length > PROFILE_CONSTANTS.MAX_NAME_LENGTH) {
      return PROFILE_VALIDATION_MESSAGES.NAME.MAX_LENGTH;
    }

    return undefined;
  }

  /**
   * Validate email
   */
  static validateEmail(email: string): string | undefined {
    if (!email || email.trim().length === 0) {
      return PROFILE_VALIDATION_MESSAGES.EMAIL.REQUIRED;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return PROFILE_VALIDATION_MESSAGES.EMAIL.INVALID;
    }

    if (email.length > PROFILE_CONSTANTS.MAX_EMAIL_LENGTH) {
      return PROFILE_VALIDATION_MESSAGES.EMAIL.MAX_LENGTH;
    }

    return undefined;
  }

  /**
   * Validate phone
   */
  static validatePhone(phone: string): string | undefined {
    if (!phone || phone.trim().length === 0) {
      return PROFILE_VALIDATION_MESSAGES.PHONE.REQUIRED;
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone.replace(/[\s-]/g, ""))) {
      return PROFILE_VALIDATION_MESSAGES.PHONE.INVALID;
    }

    if (phone.length > PROFILE_CONSTANTS.MAX_PHONE_LENGTH) {
      return PROFILE_VALIDATION_MESSAGES.PHONE.MAX_LENGTH;
    }

    return undefined;
  }

  /**
   * Validate password
   */
  static validatePassword(password: string): string | undefined {
    if (!password || password.length === 0) {
      return undefined; // Password is optional
    }

    if (password.length < PROFILE_CONSTANTS.MIN_PASSWORD_LENGTH) {
      return PROFILE_VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH;
    }

    if (password.length > PROFILE_CONSTANTS.MAX_PASSWORD_LENGTH) {
      return PROFILE_VALIDATION_MESSAGES.PASSWORD.MAX_LENGTH;
    }

    return undefined;
  }

  /**
   * Validate confirm password
   */
  static validateConfirmPassword(
    password: string,
    confirmPassword: string
  ): string | undefined {
    if (password && confirmPassword !== password) {
      return PROFILE_VALIDATION_MESSAGES.PASSWORD.MISMATCH;
    }

    return undefined;
  }

  /**
   * Validate entire form
   */
  static validateForm(data: UpdateProfileFormData): ProfileFormErrors {
    const errors: ProfileFormErrors = {};

    // Validate name
    const nameError = this.validateName(data.name);
    if (nameError) errors.name = nameError;

    // Skip email validation since it's read-only
    // Email is displayed but not editable

    // Validate phone
    const phoneError = this.validatePhone(data.phone);
    if (phoneError) errors.phone = phoneError;

    // Validate password if provided
    if (data.newPassword) {
      const passwordError = this.validatePassword(data.newPassword);
      if (passwordError) errors.newPassword = passwordError;

      // Require current password when changing password
      if (!data.currentPassword) {
        errors.currentPassword =
          PROFILE_VALIDATION_MESSAGES.PASSWORD.CURRENT_REQUIRED;
      }

      // Validate confirm password
      const confirmPasswordError = this.validateConfirmPassword(
        data.newPassword,
        data.confirmPassword || ""
      );
      if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
    }

    return errors;
  }

  /**
   * Check if form has errors
   */
  static hasErrors(errors: ProfileFormErrors): boolean {
    return Object.keys(errors).length > 0;
  }

  /**
   * Get validation rules for React Hook Form
   */
  static getReactHookFormRules() {
    return {
      name: {
        required: PROFILE_VALIDATION_MESSAGES.NAME.REQUIRED,
        maxLength: {
          value: PROFILE_CONSTANTS.MAX_NAME_LENGTH,
          message: PROFILE_VALIDATION_MESSAGES.NAME.MAX_LENGTH,
        },
      },
      // Email rules removed since email is read-only
      phone: {
        required: PROFILE_VALIDATION_MESSAGES.PHONE.REQUIRED,
        pattern: {
          value: /^[0-9]{10,11}$/,
          message: PROFILE_VALIDATION_MESSAGES.PHONE.INVALID,
        },
        maxLength: {
          value: PROFILE_CONSTANTS.MAX_PHONE_LENGTH,
          message: PROFILE_VALIDATION_MESSAGES.PHONE.MAX_LENGTH,
        },
      },
      newPassword: {
        minLength: {
          value: PROFILE_CONSTANTS.MIN_PASSWORD_LENGTH,
          message: PROFILE_VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH,
        },
        maxLength: {
          value: PROFILE_CONSTANTS.MAX_PASSWORD_LENGTH,
          message: PROFILE_VALIDATION_MESSAGES.PASSWORD.MAX_LENGTH,
        },
      },
    };
  }
}
