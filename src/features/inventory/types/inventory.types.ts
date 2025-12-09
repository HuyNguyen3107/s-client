export const InventoryStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type InventoryStatus =
  (typeof InventoryStatus)[keyof typeof InventoryStatus];

// Core entities following Single Responsibility Principle
export interface ProductCustom {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  productCategoryId: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  productId: string;
  product?: Product;
}

export interface Product {
  id: string;
  name: string;
  collectionId: string;
  status?: string;
  collection?: Collection;
}

export interface Collection {
  id: string;
  name: string;
  imageUrl: string;
  routeName: string;
  isHot?: boolean;
  status?: string;
}

// Core Inventory entity
export interface Inventory {
  id: string;
  productCustomId: string;
  currentStock: number;
  reservedStock: number;
  minStockAlert: number;
  status: InventoryStatus;
  createdAt: string;
  updatedAt: string;
}

// Composed entities following Open/Closed Principle
export interface InventoryWithProductCustom extends Inventory {
  productCustom: ProductCustom;
}

export interface InventoryWithRelations extends Inventory {
  productCustom: ProductCustom & {
    productCategory?: ProductCategory & {
      product?: Product & {
        collection?: Collection;
      };
    };
  };
}

// Request/Response DTOs
export interface CreateInventoryRequest {
  productCustomId: string;
  currentStock?: number;
  reservedStock?: number;
  minStockAlert?: number;
  status?: InventoryStatus;
}

export interface UpdateInventoryRequest {
  currentStock?: number;
  reservedStock?: number;
  minStockAlert?: number;
  status?: InventoryStatus;
}

export interface StockAdjustmentRequest {
  quantity: number;
  reason?: string;
}

export interface ReserveStockRequest {
  quantity: number;
  reason?: string;
}

export interface ReleaseReservedStockRequest {
  quantity: number;
}

export interface InventoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: InventoryStatus;
  sortBy?: "createdAt" | "updatedAt" | "currentStock" | "productCustom.name";
  sortOrder?: "asc" | "desc";
}

export interface InventoryListResponse {
  data: InventoryWithRelations[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form interfaces following Interface Segregation Principle
export interface IInventoryFormData {
  productCustomId: string;
  currentStock: number;
  reservedStock: number;
  minStockAlert: number;
  status: InventoryStatus;
}

export interface IStockAdjustmentFormData {
  quantity: number;
  reason?: string;
}

export interface IReserveStockFormData {
  quantity: number;
  reason?: string;
}

export interface IInventoryValidator {
  validateInventoryForm(data: IInventoryFormData): ValidationResult;
  validateStockQuantity(quantity: number): boolean;
  validateMinStockAlert(minStock: number): boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// API Response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedApiResponse<T = any> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Statistics interfaces
export interface InventoryStatistics {
  totalItems: number;
  lowStockCount: number;
  outOfStockCount: number;
  healthyStockCount: number;
  totalValue: number;
}

// Low stock item interface
export interface LowStockItem extends InventoryWithRelations {
  isLowStock: boolean;
  isOutOfStock: boolean;
  availableStock: number;
}

// Filter and sort options
export interface InventoryFilterOptions {
  statuses: { value: InventoryStatus; label: string; color: string }[];
}

export interface InventorySortOption {
  value: string;
  label: string;
  field: keyof Inventory | "productCustom.name";
  direction: "asc" | "desc";
}

// UI State interfaces
export interface InventoryListUIState {
  viewMode: "grid" | "table";
  selectedInventory: string[];
  isMultiSelectMode: boolean;
  searchValue: string;
  filters: {
    status?: InventoryStatus;
  };
  sort: {
    field: string;
    direction: "asc" | "desc";
  };
}

// Stock operations interfaces
export interface StockOperation {
  type: "adjustment" | "reservation" | "release";
  quantity: number;
  reason?: string;
  timestamp: string;
}

// Inventory alert interfaces
export interface InventoryAlert {
  id: string;
  type: "low_stock" | "out_of_stock";
  inventoryId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
