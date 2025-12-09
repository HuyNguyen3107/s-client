import type {
  ProductCustomWithRelations,
  IProductCustomFormData,
  ValidationResult,
  IProductCustomValidator,
} from "../types";
import { PRODUCT_CUSTOM_CONSTANTS } from "../constants";

/**
 * Product Custom Validator implementation following Single Responsibility Principle
 */
export class ProductCustomValidator implements IProductCustomValidator {
  validateProductCustomForm(data: IProductCustomFormData): ValidationResult {
    const errors: Record<string, string> = {};

    // Validate category ID
    if (!this.validateProductCategoryId(data.productCategoryId)) {
      errors.productCategoryId =
        PRODUCT_CUSTOM_CONSTANTS.VALIDATION_MESSAGES.INVALID_CATEGORY;
    }

    // Validate name
    if (!this.validateCustomName(data.name)) {
      if (!data.name?.trim()) {
        errors.name = PRODUCT_CUSTOM_CONSTANTS.VALIDATION_MESSAGES.REQUIRED;
      } else if (data.name.length < PRODUCT_CUSTOM_CONSTANTS.MIN_NAME_LENGTH) {
        errors.name =
          PRODUCT_CUSTOM_CONSTANTS.VALIDATION_MESSAGES.NAME_TOO_SHORT;
      } else if (data.name.length > PRODUCT_CUSTOM_CONSTANTS.MAX_NAME_LENGTH) {
        errors.name =
          PRODUCT_CUSTOM_CONSTANTS.VALIDATION_MESSAGES.NAME_TOO_LONG;
      }
    }

    // Validate image URL
    if (!this.validateImageUrl(data.imageUrl)) {
      if (!data.imageUrl?.trim()) {
        errors.imageUrl = PRODUCT_CUSTOM_CONSTANTS.VALIDATION_MESSAGES.REQUIRED;
      } else {
        errors.imageUrl =
          PRODUCT_CUSTOM_CONSTANTS.VALIDATION_MESSAGES.INVALID_IMAGE_URL;
      }
    }

    // Validate price (optional)
    if (
      data.price !== undefined &&
      data.price !== null &&
      !this.validatePrice(data.price)
    ) {
      if (data.price < 0) {
        errors.price =
          PRODUCT_CUSTOM_CONSTANTS.VALIDATION_MESSAGES.INVALID_PRICE;
      } else if (data.price > PRODUCT_CUSTOM_CONSTANTS.MAX_PRICE) {
        errors.price =
          PRODUCT_CUSTOM_CONSTANTS.VALIDATION_MESSAGES.PRICE_TOO_HIGH;
      }
    }

    // Validate description (optional)
    if (
      data.description &&
      data.description.length > PRODUCT_CUSTOM_CONSTANTS.MAX_DESCRIPTION_LENGTH
    ) {
      errors.description =
        PRODUCT_CUSTOM_CONSTANTS.VALIDATION_MESSAGES.DESCRIPTION_TOO_LONG;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  validateCustomName(name: string): boolean {
    return (
      Boolean(name?.trim()) &&
      name.length >= PRODUCT_CUSTOM_CONSTANTS.MIN_NAME_LENGTH &&
      name.length <= PRODUCT_CUSTOM_CONSTANTS.MAX_NAME_LENGTH
    );
  }

  validateProductCategoryId(categoryId: string): boolean {
    return Boolean(categoryId?.trim());
  }

  validateImageUrl(imageUrl: string): boolean {
    if (!imageUrl?.trim()) return false;

    try {
      new URL(imageUrl);
      return true;
    } catch {
      return false;
    }
  }

  validatePrice(price?: number): boolean {
    if (price === undefined || price === null) return true;
    return (
      price >= PRODUCT_CUSTOM_CONSTANTS.MIN_PRICE &&
      price <= PRODUCT_CUSTOM_CONSTANTS.MAX_PRICE
    );
  }
}

/**
 * Product Custom Formatter utility class
 * Following Single Responsibility Principle for formatting operations
 */
export class ProductCustomFormatter {
  /**
   * Format price with currency symbol
   * @param price - Price to format
   * @returns Formatted price string
   */
  static formatPrice(price?: number | null): string {
    if (price === null || price === undefined) return "Chưa có giá";

    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }

  /**
   * Format status for display
   * @param status - Status value
   * @returns Formatted status string
   */
  static formatStatus(status?: string | null): string {
    if (!status)
      return PRODUCT_CUSTOM_CONSTANTS.STATUS_LABELS[
        "active" as keyof typeof PRODUCT_CUSTOM_CONSTANTS.STATUS_LABELS
      ];

    const statusKey =
      status as keyof typeof PRODUCT_CUSTOM_CONSTANTS.STATUS_LABELS;
    return PRODUCT_CUSTOM_CONSTANTS.STATUS_LABELS[statusKey] || status;
  }

  /**
   * Get status color
   * @param status - Status value
   * @returns Status color
   */
  static getStatusColor(status?: string | null): string {
    if (!status)
      return PRODUCT_CUSTOM_CONSTANTS.STATUS_COLORS[
        "active" as keyof typeof PRODUCT_CUSTOM_CONSTANTS.STATUS_COLORS
      ];

    const statusKey =
      status as keyof typeof PRODUCT_CUSTOM_CONSTANTS.STATUS_COLORS;
    return PRODUCT_CUSTOM_CONSTANTS.STATUS_COLORS[statusKey] || "#757575";
  }

  /**
   * Format category display name
   * @param productCustom - Product custom with relations
   * @returns Formatted category string
   */
  static formatCategoryName(productCustom: ProductCustomWithRelations): string {
    const { productCategory } = productCustom;
    return `${productCategory.product.name} - ${productCategory.name}`;
  }

  /**
   * Format full product path
   * @param productCustom - Product custom with relations
   * @returns Formatted full path string
   */
  static formatFullPath(productCustom: ProductCustomWithRelations): string {
    const { productCategory } = productCustom;
    return `${productCategory.product.collection.name} > ${productCategory.product.name} > ${productCategory.name} > ${productCustom.name}`;
  }

  /**
   * Get inventory status
   * @param productCustom - Product custom with relations
   * @returns Inventory status info
   */
  static getInventoryStatus(productCustom: ProductCustomWithRelations): {
    totalStock: number;
    reservedStock: number;
    availableStock: number;
    isLowStock: boolean;
  } {
    const inventories = productCustom.inventories || [];
    const totalStock = inventories.reduce(
      (sum, inv) => sum + (inv.currentStock || 0),
      0
    );
    const reservedStock = inventories.reduce(
      (sum, inv) => sum + (inv.reservedStock || 0),
      0
    );
    const availableStock = totalStock - reservedStock;
    const minStockAlert = inventories.reduce(
      (min, inv) => Math.min(min, inv.minStockAlert || 0),
      Infinity
    );

    return {
      totalStock,
      reservedStock,
      availableStock,
      isLowStock:
        availableStock <= (minStockAlert !== Infinity ? minStockAlert : 0),
    };
  }

  /**
   * Truncate text with ellipsis
   * @param text - Text to truncate
   * @param maxLength - Maximum length
   * @returns Truncated text
   */
  static truncateText(text?: string | null, maxLength: number = 50): string {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + "...";
  }

  /**
   * Generate search keywords for a product custom
   * @param productCustom - Product custom with relations
   * @returns Array of search keywords
   */
  static generateSearchKeywords(
    productCustom: ProductCustomWithRelations
  ): string[] {
    const keywords = [
      productCustom.name,
      productCustom.description,
      productCustom.productCategory.name,
      productCustom.productCategory.product.name,
      productCustom.productCategory.product.collection.name,
    ].filter(Boolean) as string[];

    return keywords.map((keyword) => keyword.toLowerCase().trim());
  }
}

/**
 * Product Custom Search utility class
 * Following Single Responsibility Principle for search operations
 */
export class ProductCustomSearchHelper {
  /**
   * Filter product customs by search term
   * @param customs - Array of product customs
   * @param searchTerm - Search term
   * @returns Filtered array
   */
  static filterBySearchTerm(
    customs: ProductCustomWithRelations[],
    searchTerm: string
  ): ProductCustomWithRelations[] {
    if (!searchTerm.trim()) return customs;

    const term = searchTerm.toLowerCase().trim();

    return customs.filter((custom) => {
      const keywords = ProductCustomFormatter.generateSearchKeywords(custom);
      return keywords.some((keyword) => keyword.includes(term));
    });
  }

  /**
   * Filter product customs by status
   * @param customs - Array of product customs
   * @param status - Status filter
   * @returns Filtered array
   */
  static filterByStatus(
    customs: ProductCustomWithRelations[],
    status?: string
  ): ProductCustomWithRelations[] {
    if (!status) return customs;
    return customs.filter((custom) => custom.status === status);
  }

  /**
   * Filter product customs by category
   * @param customs - Array of product customs
   * @param categoryId - Category ID filter
   * @returns Filtered array
   */
  static filterByCategory(
    customs: ProductCustomWithRelations[],
    categoryId?: string
  ): ProductCustomWithRelations[] {
    if (!categoryId) return customs;
    return customs.filter((custom) => custom.productCategoryId === categoryId);
  }

  /**
   * Sort product customs
   * @param customs - Array of product customs
   * @param sortBy - Field to sort by
   * @param sortOrder - Sort direction
   * @returns Sorted array
   */
  static sortCustoms(
    customs: ProductCustomWithRelations[],
    sortBy: "name" | "price" | "createdAt" | "updatedAt" = "createdAt",
    sortOrder: "asc" | "desc" = "desc"
  ): ProductCustomWithRelations[] {
    return [...customs].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "price":
          aValue = a.price || 0;
          bValue = b.price || 0;
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
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }
}

// Export singleton instances
export const productCustomValidator = new ProductCustomValidator();
