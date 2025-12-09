// Base interface following Single Responsibility Principle
export interface ProductCategory {
  id: string;
  productId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Extended interface for detailed views
export interface ProductCategoryWithRelations extends ProductCategory {
  product: {
    id: string;
    name: string;
    status: string | null;
    collection: {
      id: string;
      name: string;
    } | null;
  };
  productCustoms: {
    id: string;
    name: string;
    imageUrl: string;
    price: number | null;
    description: string | null;
    status: string | null;
  }[];
}

// Request/Response DTOs following Interface Segregation Principle
export interface CreateProductCategoryRequest {
  productId: string;
  name: string;
}

export interface UpdateProductCategoryRequest {
  name?: string;
  productId?: string;
}

export interface ProductCategoryQueryParams {
  search?: string;
  productId?: string;
  page?: number;
  limit?: number;
  sortBy?: "name" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

// Response interfaces
export interface ProductCategoryListResponse {
  data: ProductCategoryWithRelations[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Form interfaces following Interface Segregation Principle
export interface IProductCategoryFormData {
  name: string;
  productId: string;
}

export interface IProductCategoryValidator {
  validateProductCategoryForm(data: IProductCategoryFormData): ValidationResult;
  validateCategoryName(name: string): boolean;
  validateProductId(productId: string): boolean;
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
export interface ProductCategoryStatistics {
  totalCategories: number;
  totalProductCustoms: number;
  categoriesByProduct: { productName: string; count: number }[];
  customsByCategory: { categoryName: string; count: number }[];
}

// Filter and sort options
export interface ProductCategoryFilterOptions {
  products: { id: string; name: string }[];
}

export interface ProductCategorySortOption {
  value: string;
  label: string;
  field: keyof ProductCategory;
  direction: "asc" | "desc";
}

// UI State interfaces
export interface ProductCategoryListUIState {
  viewMode: "grid" | "table";
  selectedCategories: string[];
  isMultiSelectMode: boolean;
  searchValue: string;
  filters: {
    productId?: string;
  };
}

// Service interfaces following Dependency Inversion Principle
export interface IProductCategoryService {
  getProductCategories(
    params?: ProductCategoryQueryParams
  ): Promise<ProductCategoryListResponse>;
  getProductCategoryById(id: string): Promise<ProductCategoryWithRelations>;
  getProductCategoriesByProduct(
    productId: string
  ): Promise<ProductCategoryWithRelations[]>;
  createProductCategory(
    data: CreateProductCategoryRequest
  ): Promise<ProductCategoryWithRelations>;
  updateProductCategory(
    id: string,
    data: UpdateProductCategoryRequest
  ): Promise<ProductCategoryWithRelations>;
  deleteProductCategory(id: string): Promise<void>;
  getStatistics(): Promise<ProductCategoryStatistics>;
}

// Repository interfaces following Dependency Inversion Principle
export interface IProductCategoryRepository {
  findMany(
    params?: ProductCategoryQueryParams
  ): Promise<ProductCategoryListResponse>;
  findById(id: string): Promise<ProductCategoryWithRelations>;
  findByProductId(productId: string): Promise<ProductCategoryWithRelations[]>;
  create(
    data: CreateProductCategoryRequest
  ): Promise<ProductCategoryWithRelations>;
  update(
    id: string,
    data: UpdateProductCategoryRequest
  ): Promise<ProductCategoryWithRelations>;
  delete(id: string): Promise<void>;
  getStatistics(): Promise<ProductCategoryStatistics>;
}

// Hook interfaces following Interface Segregation Principle
export interface IProductCategoryListHook {
  data: ProductCategoryListResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  params: ProductCategoryQueryParams;
  updateParams: (newParams: Partial<ProductCategoryQueryParams>) => void;
  refresh: () => void;
}

export interface IProductCategoryFormHook {
  isLoading: boolean;
  error: Error | null;
  submitCategory: (data: IProductCategoryFormData) => Promise<void>;
  updateCategory: (
    id: string,
    data: Partial<IProductCategoryFormData>
  ) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export interface IProductCategoryStatsHook {
  statistics: ProductCategoryStatistics | undefined;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
}
