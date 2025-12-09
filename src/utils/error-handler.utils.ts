import { AxiosError } from "axios";
import {
  GLOBAL_MESSAGES,
  HTTP_STATUS_MESSAGES,
} from "../constants/global-messages.constants";

/**
 * Error handling utilities for consistent error message processing
 */
export class ErrorUtils {
  /**
   * Extract error message from API response
   */
  static extractErrorMessage(error: any): string {
    // Handle AxiosError
    if (error?.response?.data?.message) {
      return Array.isArray(error.response.data.message)
        ? error.response.data.message[0]
        : error.response.data.message;
    }

    // Handle direct error message
    if (error?.message) {
      return error.message;
    }

    // Handle error string
    if (typeof error === "string") {
      return error;
    }

    return GLOBAL_MESSAGES.ERROR.UNKNOWN_ERROR;
  }

  /**
   * Get user-friendly error message based on HTTP status code
   */
  static getStatusCodeMessage(statusCode: number): string {
    return (
      HTTP_STATUS_MESSAGES[statusCode as keyof typeof HTTP_STATUS_MESSAGES] ||
      GLOBAL_MESSAGES.ERROR.UNKNOWN_ERROR
    );
  }

  /**
   * Get comprehensive error message from API error
   */
  static getApiErrorMessage(error: any, defaultMessage?: string): string {
    // Handle AxiosError with response
    if (error?.response) {
      const { status, data } = error.response;

      // Try to get message from response data
      if (data?.message) {
        return Array.isArray(data.message) ? data.message[0] : data.message;
      }

      // Fallback to status code message
      return this.getStatusCodeMessage(status);
    }

    // Handle network errors
    if (
      error?.code === "NETWORK_ERROR" ||
      error?.message?.includes("Network Error")
    ) {
      return GLOBAL_MESSAGES.ERROR.NETWORK_ERROR;
    }

    // Handle timeout errors
    if (error?.code === "ECONNABORTED" || error?.message?.includes("timeout")) {
      return GLOBAL_MESSAGES.ERROR.TIMEOUT;
    }

    // Handle generic errors
    return (
      this.extractErrorMessage(error) ||
      defaultMessage ||
      GLOBAL_MESSAGES.ERROR.UNKNOWN_ERROR
    );
  }

  /**
   * Format error message for display
   */
  static formatErrorForDisplay(error: any, context?: string): string {
    const message = this.getApiErrorMessage(error);
    return context ? `${context}: ${message}` : message;
  }

  /**
   * Check if error is authentication related
   */
  static isAuthError(error: any): boolean {
    const status = error?.response?.status;
    return status === 401 || status === 403;
  }

  /**
   * Check if error is validation related
   */
  static isValidationError(error: any): boolean {
    const status = error?.response?.status;
    return status === 400 || status === 422;
  }

  /**
   * Check if error is network related
   */
  static isNetworkError(error: any): boolean {
    return (
      error?.code === "NETWORK_ERROR" ||
      error?.message?.includes("Network Error") ||
      !error?.response
    );
  }

  /**
   * Get appropriate error message based on operation type
   */
  static getOperationErrorMessage(
    operation: "create" | "update" | "delete" | "fetch",
    error: any
  ): string {
    const apiMessage = this.getApiErrorMessage(error);

    // If API returned a specific message, use it
    if (error?.response?.data?.message) {
      return apiMessage;
    }

    // Otherwise, use operation-specific fallback
    switch (operation) {
      case "create":
        return GLOBAL_MESSAGES.ERROR.CREATE_FAILED;
      case "update":
        return GLOBAL_MESSAGES.ERROR.UPDATE_FAILED;
      case "delete":
        return GLOBAL_MESSAGES.ERROR.DELETE_FAILED;
      case "fetch":
        return GLOBAL_MESSAGES.ERROR.FETCH_FAILED;
      default:
        return apiMessage;
    }
  }

  /**
   * Log error for debugging (only in development)
   */
  static logError(error: any, context?: string): void {
    if (process.env.NODE_ENV === "development") {
      const prefix = context ? `[${context}]` : "[Error]";
      console.error(prefix, error);
    }
  }
}

/**
 * Toast notification utilities
 */
export class ToastUtils {
  /**
   * Show success message for CRUD operations
   */
  static getSuccessMessage(
    operation: "create" | "update" | "delete" | "save",
    entity?: string
  ): string {
    const entityText = entity ? ` ${entity}` : "";

    switch (operation) {
      case "create":
        return `Tạo${entityText} thành công!`;
      case "update":
        return `Cập nhật${entityText} thành công!`;
      case "delete":
        return `Xóa${entityText} thành công!`;
      case "save":
        return `Lưu${entityText} thành công!`;
      default:
        return GLOBAL_MESSAGES.SUCCESS.OPERATION_COMPLETED;
    }
  }

  /**
   * Show error message with proper formatting
   */
  static getErrorMessage(
    error: any,
    operation?: "create" | "update" | "delete" | "fetch"
  ): string {
    if (operation) {
      return ErrorUtils.getOperationErrorMessage(operation, error);
    }
    return ErrorUtils.getApiErrorMessage(error);
  }
}

/**
 * Validation utilities
 */
export class ValidationUtils {
  /**
   * Format validation error messages
   */
  static formatValidationErrors(errors: string[] | string): string {
    if (Array.isArray(errors)) {
      return errors.join(", ");
    }
    return errors;
  }

  /**
   * Check if error contains validation messages
   */
  static hasValidationErrors(error: any): boolean {
    return (
      ErrorUtils.isValidationError(error) &&
      error?.response?.data?.message &&
      Array.isArray(error.response.data.message)
    );
  }

  /**
   * Get formatted validation error message
   */
  static getValidationErrorMessage(error: any): string {
    if (this.hasValidationErrors(error)) {
      return this.formatValidationErrors(error.response.data.message);
    }
    return GLOBAL_MESSAGES.ERROR.VALIDATION_FAILED;
  }
}
