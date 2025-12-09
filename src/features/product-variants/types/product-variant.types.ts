export const ProductVariantStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  DRAFT: "draft",
} as const;

export type ProductVariantStatus =
  (typeof ProductVariantStatus)[keyof typeof ProductVariantStatus];

// Core entities following Single Responsibility Principle
export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  description?: string;
  price: number;
  endow?: any; // JSON object for endowments/benefits
  option?: any; // JSON object for options
  config?: any; // JSON object for configurations
  status?: ProductVariantStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  collectionId: string;
  status?: string;
  hasBg?: boolean;
}

// Composed entities following Open/Closed Principle
export interface ProductVariantWithProduct extends ProductVariant {
  product: Product;
}

// Request/Response DTOs
export interface CreateProductVariantRequest {
  productId: string;
  name: string;
  description?: string;
  price: number;
  endow?: any;
  option?: any;
  config?: any;
  status?: ProductVariantStatus;
}

export interface UpdateProductVariantRequest {
  name?: string;
  description?: string;
  price?: number;
  endow?: any;
  option?: any;
  config?: any;
  status?: ProductVariantStatus;
}

export interface UpdateProductVariantStatusRequest {
  status: ProductVariantStatus;
}

export interface ProductVariantQueryParams {
  search?: string;
  productId?: string;
  status?: ProductVariantStatus;
  page?: number;
  limit?: number;
  sortBy?: "name" | "price" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductVariantListResponse {
  data: ProductVariantWithProduct[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Form interfaces following Interface Segregation Principle
export interface IProductVariantFormData {
  productId: string;
  name: string;
  description?: string;
  price: number;
  endow?: string; // JSON string for form
  option?: string; // JSON string for form
  config?: string; // JSON string for form
  status: ProductVariantStatus;
}

export interface IProductVariantValidator {
  validateName(name: string): ValidationResult;
  validatePrice(price: number): ValidationResult;
  validateProductId(productId: string): ValidationResult;
  validateJSON(json: string): ValidationResult;
  validateForm(data: IProductVariantFormData): ValidationResult;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// API Response interfaces
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface PaginatedApiResponse<T> {
  data: T;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Statistics interfaces
export interface ProductVariantStatistics {
  totalVariants: number;
  variantsByStatus: { status: string; count: number }[];
  variantsByProduct: {
    productId: string;
    productName: string;
    count: number;
    minPrice?: number;
    maxPrice?: number;
  }[];
  averagePrice: number;
  priceRange: { min: number; max: number };
}

// Filter and sort options
export interface ProductVariantFilterOptions {
  products: { id: string; name: string }[];
  statuses: { value: ProductVariantStatus; label: string }[];
}

export interface ProductVariantSortOption {
  value: string;
  label: string;
  field: keyof ProductVariant;
  direction: "asc" | "desc";
}

// UI State interfaces
export interface ProductVariantListUIState {
  viewMode: "grid" | "table";
  selectedVariants: string[];
  isMultiSelectMode: boolean;
  searchValue: string;
  filters: {
    status?: ProductVariantStatus;
    productId?: string;
    minPrice?: number;
    maxPrice?: number;
  };
}

// Service interfaces following Dependency Inversion Principle
export interface IProductVariantService {
  getProductVariants(
    params?: ProductVariantQueryParams
  ): Promise<ProductVariantListResponse>;
  getProductVariantById(id: string): Promise<ProductVariantWithProduct>;
  getProductVariantsByProduct(
    productId: string
  ): Promise<ProductVariantWithProduct[]>;
  createProductVariant(
    data: CreateProductVariantRequest
  ): Promise<ProductVariantWithProduct>;
  updateProductVariant(
    id: string,
    data: UpdateProductVariantRequest
  ): Promise<ProductVariantWithProduct>;
  updateProductVariantStatus(
    id: string,
    data: UpdateProductVariantStatusRequest
  ): Promise<ProductVariantWithProduct>;
  deleteProductVariant(id: string): Promise<void>;
  duplicateProductVariant(id: string): Promise<ProductVariantWithProduct>;
  getStatistics(): Promise<ProductVariantStatistics>;
}

// Repository interfaces following Dependency Inversion Principle
export interface IProductVariantRepository {
  findAll(
    params?: ProductVariantQueryParams
  ): Promise<ProductVariantListResponse>;
  findById(id: string): Promise<ProductVariantWithProduct>;
  findByProductId(productId: string): Promise<ProductVariantWithProduct[]>;
  create(data: CreateProductVariantRequest): Promise<ProductVariantWithProduct>;
  update(
    id: string,
    data: UpdateProductVariantRequest
  ): Promise<ProductVariantWithProduct>;
  delete(id: string): Promise<void>;
}

// Hook interfaces following Interface Segregation Principle
export interface IProductVariantListHook {
  variants: ProductVariantWithProduct[];
  isLoading: boolean;
  error: Error | null;
  meta: ProductVariantListResponse["meta"];
  refetch: () => void;
  updateParams: (params: Partial<ProductVariantQueryParams>) => void;
}

export interface IProductVariantFormHook {
  form: any; // React Hook Form instance
  isSubmitting: boolean;
  isEditing: boolean;
  onSubmit: (data: IProductVariantFormData) => Promise<void>;
  validateForm: (data: IProductVariantFormData) => ValidationResult;
  reset: () => void;
}

export interface IProductVariantStatsHook {
  statistics: ProductVariantStatistics | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

// Product Custom and Endow System interfaces
export interface ProductCustom {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
  status: string;
  productCategory?: any;
}

export interface EndowCustomProduct {
  id: string;
  productCustomId: string;
  productCustom?: ProductCustom;
  quantity: number;
  isActive: boolean;
  priority: number;
}

export interface PurchaseOption {
  id: string;
  content: string;
  price: number;
  isActive: boolean;
  priority: number;
}

export interface EndowSystem {
  id?: string;
  endows: string[];
  customProducts: EndowCustomProduct[];
  purchaseOptions: PurchaseOption[];
  isActive: boolean;
  priority: number;
}

// Configuration System interfaces
export interface ConfigurationItem {
  id: string;
  name: string; // e.g., "Lego", "Accessory"
  baseQuantity: number; // Số lượng cơ bản
  isRequired: boolean; // Có bắt buộc không
  priceRules: PriceRule[]; // Quy tắc giá theo số lượng
  categoryRules: CategoryRule[]; // Quy tắc thể loại sản phẩm
  isActive: boolean;
  priority: number;
}

export interface PriceRule {
  id: string;
  condition: "greater_than" | "equal_to" | "between";
  minQuantity?: number;
  maxQuantity?: number;
  pricePerUnit: number; // Giá mỗi đơn vị thêm
  description: string;
}

export interface CategoryRule {
  id: string;
  categoryId: string;
  categoryName: string;
  isRequired: boolean; // Bắt buộc hay tùy chọn
  maxSelections?: number; // Tối đa bao nhiêu sản phẩm từ thể loại này
  allowedProducts?: string[]; // Danh sách ID sản phẩm được phép (nếu có)
}

export interface ConfigurationSystem {
  items: ConfigurationItem[];
  globalCategoryRules: CategoryRule[]; // Quy tắc áp dụng cho toàn bộ biến thể
  allowCustomQuantity: boolean; // Cho phép người dùng chọn số lượng tùy ý
}
