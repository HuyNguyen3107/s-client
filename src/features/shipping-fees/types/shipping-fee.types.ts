/**
 * Core shipping fee interfaces and types
 * Following SOLID principles with Interface Segregation Principle (ISP)
 */

// Core domain entity
export interface ShippingFee {
  id: string;
  shippingType: string;
  area: string;
  estimatedDeliveryTime: string;
  shippingFee: number;
  notesOrRemarks?: string;
  createdAt: string;
  updatedAt: string;
}

// Request/Response DTOs following API structure
export interface CreateShippingFeeRequest {
  shippingType: string;
  area: string;
  estimatedDeliveryTime: string;
  shippingFee: number;
  notesOrRemarks?: string;
}

export interface UpdateShippingFeeRequest {
  shippingType?: string;
  area?: string;
  estimatedDeliveryTime?: string;
  shippingFee?: number;
  notesOrRemarks?: string;
}

export interface ShippingFeeQueryParams {
  shippingType?: string;
  area?: string;
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
  sortBy?: "shippingFee" | "createdAt" | "area";
}

export interface ShippingFeeListResponse {
  data: ShippingFee[];
  total: number;
  page: number;
  limit: number;
}

export interface ShippingFeeStatistics {
  totalShippingFees: number;
  totalAreas: number;
  totalShippingTypes: number;
  averageShippingFee: number;
  minShippingFee: number;
  maxShippingFee: number;
}

// Form interfaces following Interface Segregation Principle
export interface IShippingFeeFormData {
  shippingType: string;
  area: string;
  estimatedDeliveryTime: string;
  shippingFee: number | string;
  notesOrRemarks?: string;
}

export interface IShippingFeeFormErrors {
  shippingType?: string;
  area?: string;
  estimatedDeliveryTime?: string;
  shippingFee?: string;
  notesOrRemarks?: string;
}

// Validation interfaces following Interface Segregation Principle
export interface IShippingFeeValidator {
  validateShippingFeeForm(data: IShippingFeeFormData): ValidationResult;
  validateShippingType(shippingType: string): boolean;
  validateArea(area: string): boolean;
  validateShippingFee(fee: number | string): boolean;
  validateEstimatedDeliveryTime(time: string): boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: IShippingFeeFormErrors;
}

// API Response interfaces
export interface ApiResponse<T = any> {
  statusCode?: number;
  message?: string;
  data?: T;
}

export interface PaginatedApiResponse<T = any> extends ApiResponse<T> {
  total?: number;
  page?: number;
  limit?: number;
}

// Common sort and filter enums
export const SortOrder = {
  ASC: "asc",
  DESC: "desc",
} as const;

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

export const SortBy = {
  SHIPPING_FEE: "shippingFee",
  CREATED_AT: "createdAt",
  AREA: "area",
} as const;

export type SortBy = (typeof SortBy)[keyof typeof SortBy];

// Search and filter interfaces
export interface ShippingFeeSearchParams {
  area: string;
  shippingType: string;
}

// Table and UI interfaces
export interface ShippingFeeTableColumn {
  key: keyof ShippingFee | "actions";
  label: string;
  sortable?: boolean;
  render?: (value: any, record: ShippingFee) => React.ReactNode;
}

export interface ShippingFeeTableProps {
  data: ShippingFee[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  onEdit?: (record: ShippingFee) => void;
  onDelete?: (record: ShippingFee) => void;
  onSort?: (sortBy: SortBy, sortOrder: SortOrder) => void;
}

// Store state interfaces following Single Responsibility Principle
export interface ShippingFeeState {
  shippingFees: ShippingFee[];
  currentShippingFee: ShippingFee | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  filters: ShippingFeeQueryParams;
  statistics: ShippingFeeStatistics | null;
  areas: string[];
  shippingTypes: string[];
}

export interface ShippingFeeActions {
  setShippingFees: (fees: ShippingFee[]) => void;
  setCurrentShippingFee: (fee: ShippingFee | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (pagination: {
    page: number;
    limit: number;
    total: number;
  }) => void;
  setFilters: (filters: ShippingFeeQueryParams) => void;
  setStatistics: (statistics: ShippingFeeStatistics) => void;
  setAreas: (areas: string[]) => void;
  setShippingTypes: (types: string[]) => void;
  clearError: () => void;
  reset: () => void;
}
