import { INVENTORY_CONSTANTS } from "../constants";
import type {
  InventoryWithRelations,
  IInventoryFormData,
  IStockAdjustmentFormData,
  IReserveStockFormData,
  ValidationResult,
  InventoryStatus,
} from "../types";

// Utility class following Single Responsibility Principle
export class InventoryValidator {
  static validateInventoryForm(data: IInventoryFormData): ValidationResult {
    const errors: Record<string, string> = {};

    // Validate product custom selection
    if (!data.productCustomId) {
      errors.productCustomId = "Vui lòng chọn sản phẩm";
    }

    // Validate current stock
    if (data.currentStock < INVENTORY_CONSTANTS.VALIDATION.CURRENT_STOCK_MIN) {
      errors.currentStock = `Tồn kho hiện tại không thể nhỏ hơn ${INVENTORY_CONSTANTS.VALIDATION.CURRENT_STOCK_MIN}`;
    }

    if (data.currentStock > INVENTORY_CONSTANTS.VALIDATION.CURRENT_STOCK_MAX) {
      errors.currentStock = `Tồn kho hiện tại không thể lớn hơn ${INVENTORY_CONSTANTS.VALIDATION.CURRENT_STOCK_MAX}`;
    }

    // Validate reserved stock
    if (
      data.reservedStock < INVENTORY_CONSTANTS.VALIDATION.RESERVED_STOCK_MIN
    ) {
      errors.reservedStock = `Tồn kho đã đặt không thể nhỏ hơn ${INVENTORY_CONSTANTS.VALIDATION.RESERVED_STOCK_MIN}`;
    }

    if (data.reservedStock > data.currentStock) {
      errors.reservedStock =
        "Tồn kho đã đặt không thể lớn hơn tồn kho hiện tại";
    }

    // Validate min stock alert
    if (data.minStockAlert < INVENTORY_CONSTANTS.VALIDATION.MIN_STOCK_MIN) {
      errors.minStockAlert = `Ngưỡng cảnh báo không thể nhỏ hơn ${INVENTORY_CONSTANTS.VALIDATION.MIN_STOCK_MIN}`;
    }

    if (data.minStockAlert > INVENTORY_CONSTANTS.VALIDATION.MIN_STOCK_MAX) {
      errors.minStockAlert = `Ngưỡng cảnh báo không thể lớn hơn ${INVENTORY_CONSTANTS.VALIDATION.MIN_STOCK_MAX}`;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static validateStockAdjustment(
    data: IStockAdjustmentFormData,
    currentStock: number = 0
  ): ValidationResult {
    const errors: Record<string, string> = {};

    // Validate quantity
    if (!data.quantity || data.quantity === 0) {
      errors.quantity = "Vui lòng nhập số lượng điều chỉnh";
    }

    if (Math.abs(data.quantity) > INVENTORY_CONSTANTS.VALIDATION.QUANTITY_MAX) {
      errors.quantity = `Số lượng điều chỉnh không thể vượt quá ${INVENTORY_CONSTANTS.VALIDATION.QUANTITY_MAX}`;
    }

    // Check if adjustment would result in negative stock
    if (currentStock + data.quantity < 0) {
      errors.quantity = `Không thể điều chỉnh. Số lượng còn lại sẽ âm: ${
        currentStock + data.quantity
      }`;
    }

    // Validate reason if provided
    if (
      data.reason &&
      data.reason.length > INVENTORY_CONSTANTS.VALIDATION.REASON_MAX_LENGTH
    ) {
      errors.reason = `Lý do không thể vượt quá ${INVENTORY_CONSTANTS.VALIDATION.REASON_MAX_LENGTH} ký tự`;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static validateReserveStock(
    data: IReserveStockFormData,
    availableStock: number = 0
  ): ValidationResult {
    const errors: Record<string, string> = {};

    // Validate quantity
    if (!data.quantity || data.quantity <= 0) {
      errors.quantity = "Số lượng đặt chỗ phải lớn hơn 0";
    }

    if (data.quantity > INVENTORY_CONSTANTS.VALIDATION.QUANTITY_MAX) {
      errors.quantity = `Số lượng đặt chỗ không thể vượt quá ${INVENTORY_CONSTANTS.VALIDATION.QUANTITY_MAX}`;
    }

    // Check if there's enough available stock
    if (data.quantity > availableStock) {
      errors.quantity = `Không đủ tồn kho có sẵn. Chỉ còn ${availableStock} sản phẩm`;
    }

    // Validate reason if provided
    if (
      data.reason &&
      data.reason.length > INVENTORY_CONSTANTS.VALIDATION.REASON_MAX_LENGTH
    ) {
      errors.reason = `Lý do không thể vượt quá ${INVENTORY_CONSTANTS.VALIDATION.REASON_MAX_LENGTH} ký tự`;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

// Stock level utilities
export class StockLevelUtils {
  static getStockLevel(inventory: InventoryWithRelations): {
    level: "healthy" | "low" | "critical" | "out";
    color: string;
    label: string;
  } {
    const { currentStock, minStockAlert } = inventory;
    const threshold =
      minStockAlert || INVENTORY_CONSTANTS.STOCK_LEVELS.LOW_STOCK_THRESHOLD;

    if (currentStock === 0) {
      return {
        level: "out",
        color: INVENTORY_CONSTANTS.COLORS.OUT_OF_STOCK,
        label: "Hết hàng",
      };
    }

    if (currentStock <= INVENTORY_CONSTANTS.STOCK_LEVELS.CRITICAL_LEVEL) {
      return {
        level: "critical",
        color: INVENTORY_CONSTANTS.COLORS.CRITICAL_STOCK,
        label: "Rất thấp",
      };
    }

    if (currentStock <= threshold) {
      return {
        level: "low",
        color: INVENTORY_CONSTANTS.COLORS.LOW_STOCK,
        label: "Thấp",
      };
    }

    return {
      level: "healthy",
      color: INVENTORY_CONSTANTS.COLORS.HEALTHY_STOCK,
      label: "Tốt",
    };
  }

  static getAvailableStock(inventory: InventoryWithRelations): number {
    return Math.max(0, inventory.currentStock - inventory.reservedStock);
  }

  static isLowStock(inventory: InventoryWithRelations): boolean {
    const threshold =
      inventory.minStockAlert ||
      INVENTORY_CONSTANTS.STOCK_LEVELS.LOW_STOCK_THRESHOLD;
    return inventory.currentStock <= threshold && inventory.currentStock > 0;
  }

  static isOutOfStock(inventory: InventoryWithRelations): boolean {
    return inventory.currentStock === 0;
  }

  static isCriticalStock(inventory: InventoryWithRelations): boolean {
    return (
      inventory.currentStock <=
        INVENTORY_CONSTANTS.STOCK_LEVELS.CRITICAL_LEVEL &&
      inventory.currentStock > 0
    );
  }
}

// Status utilities
export class StatusUtils {
  static getStatusColor(status: InventoryStatus): string {
    const statusOption = INVENTORY_CONSTANTS.STATUS_OPTIONS.find(
      (option) => option.value === status
    );
    return statusOption?.color || "default";
  }

  static getStatusLabel(status: InventoryStatus): string {
    const statusOption = INVENTORY_CONSTANTS.STATUS_OPTIONS.find(
      (option) => option.value === status
    );
    return statusOption?.label || status;
  }

  static isActive(status: InventoryStatus): boolean {
    return status === "active";
  }
}

// Formatting utilities
export class FormatUtils {
  static formatStockNumber(stock: number): string {
    return new Intl.NumberFormat("vi-VN").format(stock);
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }

  static formatStockValue(inventory: InventoryWithRelations): string {
    const value =
      inventory.currentStock * (inventory.productCustom?.price || 0);
    return FormatUtils.formatCurrency(value);
  }

  static formatPercentage(value: number, total: number): string {
    if (total === 0) return "0%";
    const percentage = (value / total) * 100;
    return `${percentage.toFixed(1)}%`;
  }
}

// Search and filter utilities
export class FilterUtils {
  static filterInventories(
    inventories: InventoryWithRelations[],
    filters: {
      search?: string;
      status?: InventoryStatus;
      stockLevel?: "low" | "out" | "critical" | "healthy";
    }
  ): InventoryWithRelations[] {
    return inventories.filter((inventory) => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const productName = inventory.productCustom?.name?.toLowerCase() || "";
        const productDescription =
          inventory.productCustom?.description?.toLowerCase() || "";

        if (
          !productName.includes(searchTerm) &&
          !productDescription.includes(searchTerm)
        ) {
          return false;
        }
      }

      // Status filter
      if (filters.status && inventory.status !== filters.status) {
        return false;
      }

      // Stock level filter
      if (filters.stockLevel) {
        const stockLevel = StockLevelUtils.getStockLevel(inventory);
        if (stockLevel.level !== filters.stockLevel) {
          return false;
        }
      }

      return true;
    });
  }

  static sortInventories(
    inventories: InventoryWithRelations[],
    sortBy: string,
    sortOrder: "asc" | "desc"
  ): InventoryWithRelations[] {
    return [...inventories].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case "productCustom.name":
          aValue = a.productCustom?.name || "";
          bValue = b.productCustom?.name || "";
          break;
        case "currentStock":
          aValue = a.currentStock;
          bValue = b.currentStock;
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
          aValue = a[sortBy as keyof InventoryWithRelations];
          bValue = b[sortBy as keyof InventoryWithRelations];
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }
}
