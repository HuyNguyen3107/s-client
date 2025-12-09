import type {
  IProductValidator,
  IProductFormData,
  ValidationResult,
} from "../types";
import { PRODUCT_CONSTANTS } from "../constants";

// Product validator following Single Responsibility Principle
export class ProductValidator implements IProductValidator {
  validateProductForm(data: IProductFormData): ValidationResult {
    const errors: Record<string, string> = {};

    // Validate name
    if (!this.validateProductName(data.name)) {
      if (!data.name || !data.name.trim()) {
        errors.name = "Tên sản phẩm là bắt buộc";
      } else if (
        data.name.trim().length < PRODUCT_CONSTANTS.VALIDATION.NAME_MIN_LENGTH
      ) {
        errors.name = `Tên sản phẩm phải có ít nhất ${PRODUCT_CONSTANTS.VALIDATION.NAME_MIN_LENGTH} ký tự`;
      } else if (
        data.name.trim().length > PRODUCT_CONSTANTS.VALIDATION.NAME_MAX_LENGTH
      ) {
        errors.name = `Tên sản phẩm không được vượt quá ${PRODUCT_CONSTANTS.VALIDATION.NAME_MAX_LENGTH} ký tự`;
      }
    }

    // Validate collection ID
    if (!this.validateCollectionId(data.collectionId)) {
      errors.collectionId = "Bộ sưu tập là bắt buộc";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  validateProductName(name: string): boolean {
    if (!name || !name.trim()) return false;
    const trimmedName = name.trim();
    return (
      trimmedName.length >= PRODUCT_CONSTANTS.VALIDATION.NAME_MIN_LENGTH &&
      trimmedName.length <= PRODUCT_CONSTANTS.VALIDATION.NAME_MAX_LENGTH
    );
  }

  validateCollectionId(collectionId: string): boolean {
    return !!collectionId && collectionId.trim().length > 0;
  }
}

// Export singleton instance
export const productValidator = new ProductValidator();

// Utility functions following DRY principle
export const formatProductStatus = (status?: string) => {
  const statusOption = PRODUCT_CONSTANTS.STATUS_OPTIONS.find(
    (option) => option.value === status
  );
  return statusOption || PRODUCT_CONSTANTS.STATUS_OPTIONS[0];
};

export const getProductDisplayName = (name: string, maxLength = 50) => {
  if (name.length <= maxLength) return name;
  return `${name.substring(0, maxLength)}...`;
};

export const calculateProductMetrics = (products: any[]) => {
  return {
    total: products.length,
    active: products.filter((p) => p.status === "active").length,
    inactive: products.filter((p) => p.status === "inactive").length,
    draft: products.filter((p) => p.status === "draft").length,
    withVariants: products.filter(
      (p) => p.productVariants && p.productVariants.length > 0
    ).length,
  };
};
