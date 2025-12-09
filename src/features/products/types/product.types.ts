export const ProductStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  DRAFT: "draft",
} as const;

export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus];

// Core entities following Single Responsibility Principle
export interface Product {
  id: string;
  name: string;
  collectionId: string;
  status?: ProductStatus;
  hasBg?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  imageUrl: string;
  routeName: string;
  isHot?: boolean;
  status?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  description?: string;
  price: number;
  endow?: any;
  option?: any;
  config?: any;
  status?: string;
}

// Composed entities following Open/Closed Principle
export interface ProductWithCollection extends Product {
  collection: Collection;
}

export interface ProductWithVariants extends Product {
  productVariants: ProductVariant[];
}

export interface ProductWithRelations extends ProductWithCollection {
  productVariants: ProductVariant[];
  categories?: Array<{
    id: string;
    name: string;
  }>;
  backgrounds?: Array<{
    id: string;
    name?: string;
    description?: string;
    imageUrl: string;
    config?: any;
  }>;
}

// Request/Response DTOs
export interface CreateProductRequest {
  name: string;
  collectionId: string;
  status?: ProductStatus;
  hasBg?: boolean;
}

export interface UpdateProductRequest {
  name?: string;
  collectionId?: string;
  status?: ProductStatus;
  hasBg?: boolean;
}

export interface ProductQueryParams {
  search?: string;
  collectionId?: string;
  status?: ProductStatus;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "name";
  sortOrder?: "asc" | "desc";
}

export interface ProductListResponse {
  data: ProductWithRelations[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Form interfaces following Interface Segregation Principle
export interface IProductFormData {
  name: string;
  collectionId: string;
  status: ProductStatus;
  hasBg?: boolean;
}

export interface IProductValidator {
  validateProductForm(data: IProductFormData): ValidationResult;
  validateProductName(name: string): boolean;
  validateCollectionId(collectionId: string): boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// API Response interfaces
export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data?: T;
}

export interface PaginatedApiResponse<T = any> extends ApiResponse<T> {
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Statistics interfaces
export interface ProductStatistics {
  totalProducts: number;
  totalProductVariants: number;
  productsByStatus: { status: string; count: number }[];
  productsByCollection: { collectionName: string; count: number }[];
}

// Filter and sort options
export interface ProductFilterOptions {
  collections: { id: string; name: string }[];
  statuses: { value: ProductStatus; label: string }[];
}

export interface ProductSortOption {
  value: string;
  label: string;
  field: keyof Product;
  direction: "asc" | "desc";
}

// UI State interfaces
export interface ProductListUIState {
  viewMode: "grid" | "table";
  selectedProducts: string[];
  isMultiSelectMode: boolean;
  searchValue: string;
  filters: {
    status?: ProductStatus;
    collectionId?: string;
  };
}
