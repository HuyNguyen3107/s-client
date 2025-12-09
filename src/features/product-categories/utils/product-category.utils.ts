import type {
  IProductCategoryFormData,
  ValidationResult,
  ProductCategoryQueryParams,
} from "../types";
import { PRODUCT_CATEGORY_CONSTANTS } from "../constants";

/**
 * Validation utilities following Single Responsibility Principle
 */
export class ProductCategoryValidator {
  /**
   * Validate complete product category form data
   */
  static validateProductCategoryForm(
    data: IProductCategoryFormData
  ): ValidationResult {
    const errors: Record<string, string> = {};

    // Validate name
    if (!this.validateCategoryName(data.name)) {
      if (!data.name?.trim()) {
        errors.name = PRODUCT_CATEGORY_CONSTANTS.ERROR_MESSAGES.NAME_REQUIRED;
      } else if (
        data.name.length < PRODUCT_CATEGORY_CONSTANTS.VALIDATION.NAME_MIN_LENGTH
      ) {
        errors.name = PRODUCT_CATEGORY_CONSTANTS.ERROR_MESSAGES.NAME_TOO_SHORT;
      } else if (
        data.name.length > PRODUCT_CATEGORY_CONSTANTS.VALIDATION.NAME_MAX_LENGTH
      ) {
        errors.name = PRODUCT_CATEGORY_CONSTANTS.ERROR_MESSAGES.NAME_TOO_LONG;
      }
    }

    // Validate product ID
    if (!this.validateProductId(data.productId)) {
      errors.productId =
        PRODUCT_CATEGORY_CONSTANTS.ERROR_MESSAGES.PRODUCT_ID_REQUIRED;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Validate category name
   */
  static validateCategoryName(name: string): boolean {
    if (!name) return false;
    const trimmedName = name.trim();
    return (
      trimmedName.length >=
        PRODUCT_CATEGORY_CONSTANTS.VALIDATION.NAME_MIN_LENGTH &&
      trimmedName.length <=
        PRODUCT_CATEGORY_CONSTANTS.VALIDATION.NAME_MAX_LENGTH
    );
  }

  /**
   * Validate product ID
   */
  static validateProductId(productId: string): boolean {
    return !!productId && productId.trim().length > 0;
  }
}

/**
 * URL and query parameter utilities
 */
export class ProductCategoryUrlUtils {
  /**
   * Build query string from parameters
   */
  static buildQueryString(params: ProductCategoryQueryParams): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });

    return searchParams.toString();
  }

  /**
   * Parse query string to parameters
   */
  static parseQueryString(queryString: string): ProductCategoryQueryParams {
    const searchParams = new URLSearchParams(queryString);
    const params: ProductCategoryQueryParams = {};

    if (searchParams.has("search")) {
      params.search = searchParams.get("search") || undefined;
    }
    if (searchParams.has("productId")) {
      params.productId = searchParams.get("productId") || undefined;
    }
    if (searchParams.has("page")) {
      params.page = parseInt(searchParams.get("page") || "1", 10);
    }
    if (searchParams.has("limit")) {
      params.limit = parseInt(searchParams.get("limit") || "10", 10);
    }
    if (searchParams.has("sortBy")) {
      params.sortBy = searchParams.get("sortBy") as any;
    }
    if (searchParams.has("sortOrder")) {
      params.sortOrder = searchParams.get("sortOrder") as "asc" | "desc";
    }

    return params;
  }
}

/**
 * Data formatting utilities
 */
export class ProductCategoryFormatter {
  /**
   * Format date for display
   */
  static formatDate(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(dateObj);
  }

  /**
   * Format price for display
   */
  static formatPrice(price: number | null): string {
    if (price === null) return "Chưa có giá";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }

  /**
   * Truncate text with ellipsis
   */
  static truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  }
}

/**
 * Search and filter utilities
 */
export class ProductCategorySearchUtils {
  /**
   * Highlight search terms in text
   */
  static highlightSearchTerm(text: string, searchTerm: string): string {
    if (!searchTerm) return text;

    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  }

  /**
   * Check if category matches search criteria
   */
  static matchesSearch(categoryName: string, searchTerm: string): boolean {
    if (!searchTerm) return true;
    return categoryName.toLowerCase().includes(searchTerm.toLowerCase());
  }
}

/**
 * Error handling utilities
 */
export class ProductCategoryErrorUtils {
  /**
   * Parse API error response
   */
  static parseErrorMessage(error: any): string {
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }

    if (error?.message) {
      return error.message;
    }

    if (error?.name === "NetworkError") {
      return PRODUCT_CATEGORY_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR;
    }

    return PRODUCT_CATEGORY_CONSTANTS.ERROR_MESSAGES.SERVER_ERROR;
  }

  /**
   * Get user-friendly error message
   */
  static getUserFriendlyError(error: any): string {
    const message = this.parseErrorMessage(error);

    // Map common error messages to user-friendly ones
    const errorMap: Record<string, string> = {
      "Not Found": PRODUCT_CATEGORY_CONSTANTS.ERROR_MESSAGES.NOT_FOUND,
      "Validation failed":
        PRODUCT_CATEGORY_CONSTANTS.ERROR_MESSAGES.VALIDATION_FAILED,
      "Network Error": PRODUCT_CATEGORY_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR,
    };

    return errorMap[message] || message;
  }
}

/**
 * Statistics calculation utilities
 */
export class ProductCategoryStatsUtils {
  /**
   * Calculate category distribution percentage
   */
  static calculateCategoryDistribution(
    categories: { productName: string; count: number }[]
  ): { productName: string; count: number; percentage: number }[] {
    const total = categories.reduce((sum, cat) => sum + cat.count, 0);

    return categories.map((cat) => ({
      ...cat,
      percentage: total > 0 ? Math.round((cat.count / total) * 100) : 0,
    }));
  }

  /**
   * Get top categories by custom count
   */
  static getTopCategories(
    categories: { categoryName: string; count: number }[],
    limit: number = 5
  ): { categoryName: string; count: number }[] {
    return categories.sort((a, b) => b.count - a.count).slice(0, limit);
  }
}
