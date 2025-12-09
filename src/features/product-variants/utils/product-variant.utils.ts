import type {
  ProductVariantWithProduct,
  IProductVariantFormData,
  ValidationResult,
} from "../types";
import { PRODUCT_VARIANT_CONSTANTS } from "../constants";

/**
 * Product Variant Formatter utilities following Single Responsibility Principle
 */
export class ProductVariantFormatter {
  /**
   * Format price with Vietnamese currency
   */
  static formatPrice(price: number | null | undefined): string {
    // Handle null, undefined, or NaN values
    if (price == null || isNaN(price)) {
      return "0 ₫";
    }

    return new Intl.NumberFormat(PRODUCT_VARIANT_CONSTANTS.PRICE_FORMAT, {
      style: "currency",
      currency: "VND",
    }).format(price);
  }

  /**
   * Format price as number string for display
   */
  static formatPriceNumber(price: number | null | undefined): string {
    // Handle null, undefined, or NaN values
    if (price == null || isNaN(price)) {
      return "0";
    }

    return price.toLocaleString(PRODUCT_VARIANT_CONSTANTS.PRICE_FORMAT);
  }

  /**
   * Format date for display
   */
  static formatDate(date: string | Date): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  /**
   * Format datetime for display
   */
  static formatDateTime(date: string | Date): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /**
   * Get status label
   */
  static getStatusLabel(status?: string): string {
    const statusOption = PRODUCT_VARIANT_CONSTANTS.STATUS_OPTIONS.find(
      (option) => option.value === status
    );
    return statusOption?.label || "Không xác định";
  }

  /**
   * Get status color
   */
  static getStatusColor(status?: string): string {
    const statusOption = PRODUCT_VARIANT_CONSTANTS.STATUS_OPTIONS.find(
      (option) => option.value === status
    );
    return statusOption?.color || "default";
  }

  /**
   * Truncate text with ellipsis
   */
  static truncateText(text: string, maxLength: number = 100): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  }

  /**
   * Format JSON for display
   */
  static formatJSON(json: any): string {
    if (!json) return "";
    try {
      return JSON.stringify(json, null, 2);
    } catch {
      return String(json);
    }
  }

  /**
   * Parse JSON safely
   */
  static parseJSON(jsonString: string): any {
    if (!jsonString || jsonString.trim() === "") {
      return null;
    }
    try {
      return JSON.parse(jsonString);
    } catch {
      return null;
    }
  }

  /**
   * Generate variant full name with product
   */
  static getVariantFullName(variant: ProductVariantWithProduct): string {
    return `${variant.product.name} - ${variant.name}`;
  }

  /**
   * Calculate price range text
   */
  static formatPriceRange(
    min: number | null | undefined,
    max: number | null | undefined
  ): string {
    // Handle invalid values
    if (min == null || max == null || isNaN(min) || isNaN(max)) {
      return "Chưa có thông tin giá";
    }

    if (min === max) {
      return this.formatPrice(min);
    }
    return `${this.formatPrice(min)} - ${this.formatPrice(max)}`;
  }
}

/**
 * Product Variant Validator following Single Responsibility Principle
 */
export class ProductVariantValidator {
  /**
   * Validate variant name
   */
  static validateName(name: string): ValidationResult {
    const errors: string[] = [];

    if (!name || name.trim() === "") {
      errors.push(PRODUCT_VARIANT_CONSTANTS.ERROR_MESSAGES.NAME_REQUIRED);
    } else {
      if (name.length < PRODUCT_VARIANT_CONSTANTS.VALIDATION.NAME_MIN_LENGTH) {
        errors.push(PRODUCT_VARIANT_CONSTANTS.ERROR_MESSAGES.NAME_TOO_SHORT);
      }
      if (name.length > PRODUCT_VARIANT_CONSTANTS.VALIDATION.NAME_MAX_LENGTH) {
        errors.push(PRODUCT_VARIANT_CONSTANTS.ERROR_MESSAGES.NAME_TOO_LONG);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate price
   */
  static validatePrice(price: number): ValidationResult {
    const errors: string[] = [];

    if (price === undefined || price === null) {
      errors.push(PRODUCT_VARIANT_CONSTANTS.ERROR_MESSAGES.PRICE_REQUIRED);
    } else {
      if (isNaN(price)) {
        errors.push(PRODUCT_VARIANT_CONSTANTS.ERROR_MESSAGES.PRICE_INVALID);
      } else if (price < PRODUCT_VARIANT_CONSTANTS.VALIDATION.PRICE_MIN) {
        errors.push(PRODUCT_VARIANT_CONSTANTS.ERROR_MESSAGES.PRICE_TOO_LOW);
      } else if (price > PRODUCT_VARIANT_CONSTANTS.VALIDATION.PRICE_MAX) {
        errors.push(PRODUCT_VARIANT_CONSTANTS.ERROR_MESSAGES.PRICE_TOO_HIGH);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate product ID
   */
  static validateProductId(productId: string): ValidationResult {
    const errors: string[] = [];

    if (!productId || productId.trim() === "") {
      errors.push(PRODUCT_VARIANT_CONSTANTS.ERROR_MESSAGES.PRODUCT_ID_REQUIRED);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate JSON string
   */
  static validateJSON(jsonString: string): ValidationResult {
    const errors: string[] = [];

    if (jsonString && jsonString.trim() !== "") {
      try {
        JSON.parse(jsonString);
      } catch {
        errors.push(PRODUCT_VARIANT_CONSTANTS.ERROR_MESSAGES.JSON_INVALID);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate complete form data
   */
  static validateForm(data: IProductVariantFormData): ValidationResult {
    const allErrors: string[] = [];

    // Validate name
    const nameValidation = this.validateName(data.name);
    allErrors.push(...nameValidation.errors);

    // Validate price
    const priceValidation = this.validatePrice(data.price);
    allErrors.push(...priceValidation.errors);

    // Validate product ID
    const productIdValidation = this.validateProductId(data.productId);
    allErrors.push(...productIdValidation.errors);

    // Validate JSON fields
    if (data.endow) {
      const endowValidation = this.validateJSON(data.endow);
      allErrors.push(...endowValidation.errors);
    }

    if (data.option) {
      const optionValidation = this.validateJSON(data.option);
      allErrors.push(...optionValidation.errors);
    }

    if (data.config) {
      const configValidation = this.validateJSON(data.config);
      allErrors.push(...configValidation.errors);
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
    };
  }
}

/**
 * Product Variant Helper utilities
 */
export class ProductVariantHelper {
  /**
   * Generate search params string
   */
  static generateSearchParams(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });

    return searchParams.toString();
  }

  /**
   * Filter variants by search term
   */
  static filterVariants(
    variants: ProductVariantWithProduct[],
    searchTerm: string
  ): ProductVariantWithProduct[] {
    if (!searchTerm) return variants;

    const term = searchTerm.toLowerCase();
    return variants.filter(
      (variant) =>
        variant.name.toLowerCase().includes(term) ||
        variant.description?.toLowerCase().includes(term) ||
        variant.product.name.toLowerCase().includes(term)
    );
  }

  /**
   * Sort variants
   */
  static sortVariants(
    variants: ProductVariantWithProduct[],
    sortBy: string,
    sortOrder: "asc" | "desc"
  ): ProductVariantWithProduct[] {
    return [...variants].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case "updatedAt":
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }

  /**
   * Get unique product options for filtering
   */
  static getUniqueProducts(
    variants: ProductVariantWithProduct[]
  ): { id: string; name: string }[] {
    const products = new Map<string, string>();
    variants.forEach((variant) => {
      products.set(variant.product.id, variant.product.name);
    });

    return Array.from(products.entries()).map(([id, name]) => ({ id, name }));
  }

  /**
   * Calculate statistics from variants list
   */
  static calculateBasicStats(variants: ProductVariantWithProduct[]) {
    if (variants.length === 0) {
      return {
        total: 0,
        averagePrice: 0,
        minPrice: 0,
        maxPrice: 0,
      };
    }

    const prices = variants.map((v) => v.price);
    const total = variants.length;
    const averagePrice = prices.reduce((sum, price) => sum + price, 0) / total;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return {
      total,
      averagePrice: Math.round(averagePrice),
      minPrice,
      maxPrice,
    };
  }
}
