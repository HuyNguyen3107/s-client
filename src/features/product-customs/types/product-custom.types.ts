// Base interface following Single Responsibility Principle
export interface ProductCustom {
  id: string;
  productCategoryId: string;
  name: string;
  imageUrl: string;
  price?: number | null;
  description?: string | null;
  status?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Extended interface for detailed views
export interface ProductCustomWithRelations extends ProductCustom {
  productCategory: {
    id: string;
    name: string;
    product: {
      id: string;
      name: string;
      collection: {
        id: string;
        name: string;
        imageUrl: string;
      };
    };
  };
  inventories: {
    id: string;
    currentStock?: number;
    reservedStock?: number;
    minStockAlert?: number;
    status?: string | null;
  }[];
}

// Request/Response DTOs following Interface Segregation Principle
export interface CreateProductCustomRequest {
  productCategoryId: string;
  name: string;
  imageUrl: string;
  price?: number;
  description?: string;
  status?: string;
}

export interface UpdateProductCustomRequest {
  productCategoryId?: string;
  name?: string;
  imageUrl?: string;
  price?: number;
  description?: string;
  status?: string;
}

export interface ProductCustomQueryParams {
  search?: string;
  productCategoryId?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: "name" | "price" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

// Response interfaces
export interface ProductCustomListResponse {
  data: ProductCustomWithRelations[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Form interfaces following Interface Segregation Principle
export interface IProductCustomFormData {
  productCategoryId: string;
  name: string;
  imageUrl: string;
  price?: number;
  description?: string;
  status?: string;
}

export interface IProductCustomValidator {
  validateProductCustomForm(data: IProductCustomFormData): ValidationResult;
  validateCustomName(name: string): boolean;
  validateProductCategoryId(categoryId: string): boolean;
  validateImageUrl(imageUrl: string): boolean;
  validatePrice(price?: number): boolean;
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
export interface ProductCustomStatistics {
  totalProductCustoms: number;
  totalInventories: number;
  productCustomsByStatus: { status: string; count: number }[];
  productCustomsByCategory: { categoryName: string; count: number }[];
}

// Filter and sort options
export interface ProductCustomFilterOptions {
  categories: { id: string; name: string; product: { name: string } }[];
  statuses: string[];
}

export interface ProductCustomSortOption {
  value: string;
  label: string;
  field: keyof ProductCustom;
  direction: "asc" | "desc";
}

// UI State interfaces
export interface ProductCustomListUIState {
  viewMode: "grid" | "table";
  selectedCustoms: string[];
  isMultiSelectMode: boolean;
  searchValue: string;
  filters: {
    productCategoryId?: string;
    status?: string;
  };
}

// Service interfaces following Dependency Inversion Principle
export interface IProductCustomService {
  getProductCustoms(
    params?: ProductCustomQueryParams
  ): Promise<ProductCustomListResponse>;
  getProductCustomById(id: string): Promise<ProductCustomWithRelations>;
  getProductCustomsByCategory(
    categoryId: string
  ): Promise<ProductCustomWithRelations[]>;
  createProductCustom(
    data: CreateProductCustomRequest
  ): Promise<ProductCustomWithRelations>;
  updateProductCustom(
    id: string,
    data: UpdateProductCustomRequest
  ): Promise<ProductCustomWithRelations>;
  updateProductCustomStatus(
    id: string,
    status: string
  ): Promise<ProductCustomWithRelations>;
  deleteProductCustom(id: string): Promise<void>;
  getStatistics(): Promise<ProductCustomStatistics>;
}

// Repository interfaces following Dependency Inversion Principle
export interface IProductCustomRepository {
  findMany(
    params?: ProductCustomQueryParams
  ): Promise<ProductCustomListResponse>;
  findById(id: string): Promise<ProductCustomWithRelations>;
  findByCategoryId(categoryId: string): Promise<ProductCustomWithRelations[]>;
  create(data: CreateProductCustomRequest): Promise<ProductCustomWithRelations>;
  update(
    id: string,
    data: UpdateProductCustomRequest
  ): Promise<ProductCustomWithRelations>;
  updateStatus(id: string, status: string): Promise<ProductCustomWithRelations>;
  delete(id: string): Promise<void>;
  getStatistics(): Promise<ProductCustomStatistics>;
}

// Hook interfaces following Interface Segregation Principle
export interface IProductCustomListHook {
  data: ProductCustomListResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  params: ProductCustomQueryParams;
  updateParams: (newParams: Partial<ProductCustomQueryParams>) => void;
  refresh: () => void;
}

export interface IProductCustomFormHook {
  isLoading: boolean;
  error: Error | null;
  submitCustom: (data: IProductCustomFormData) => Promise<void>;
  updateCustom: (
    id: string,
    data: Partial<IProductCustomFormData>
  ) => Promise<void>;
  updateCustomStatus: (id: string, status: string) => Promise<void>;
  deleteCustom: (id: string) => Promise<void>;
}

export interface IProductCustomStatsHook {
  statistics: ProductCustomStatistics | undefined;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
}

// Status constants
export const ProductCustomStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  OUT_OF_STOCK: "out_of_stock",
  DISCONTINUED: "discontinued",
} as const;

export type ProductCustomStatusType =
  (typeof ProductCustomStatus)[keyof typeof ProductCustomStatus];
