export const PromotionType = {
  PERCENTAGE: "PERCENTAGE",
  FIXED_AMOUNT: "FIXED_AMOUNT",
} as const;

export type PromotionType = (typeof PromotionType)[keyof typeof PromotionType];

export interface Promotion {
  id: string;
  title: string;
  description: string;
  type: PromotionType;
  value: number;
  minOrderValue: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate?: string;
  usageLimit?: number;
  usageCount: number;
  promoCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromotionRequest {
  title: string;
  description: string;
  type: PromotionType;
  value: number;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate?: string;
  usageLimit?: number;
  promoCode: string;
  isActive?: boolean;
}

export interface UpdatePromotionRequest {
  title?: string;
  description?: string;
  type?: PromotionType;
  value?: number;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  promoCode?: string;
  isActive?: boolean;
}

export interface PromotionListResponse {
  data: Promotion[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PromotionQueryParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export interface ValidatePromotionRequest {
  promoCode: string;
  orderValue: number;
}

export interface PromotionValidationResult {
  isValid: boolean;
  promotion?: Promotion;
  discountAmount?: number;
  error?: string;
}

export interface PromotionStatistics {
  totalPromotions: number;
  activePromotions: number;
  expiredPromotions: number;
  totalUsage: number;
  averageDiscount: number;
}

// Form validation interfaces following Interface Segregation Principle
export interface IPromotionFormData {
  title: string;
  description: string;
  type: PromotionType;
  value: number | string;
  minOrderValue: number | string;
  maxDiscountAmount: number | string;
  startDate: string;
  endDate?: string;
  usageLimit?: number;
  promoCode: string;
  isActive: boolean;
}

export interface IPromotionValidator {
  validatePromotionForm(data: IPromotionFormData): ValidationResult;
  validatePromoCode(promoCode: string): boolean;
  validateDateRange(startDate: string, endDate?: string): boolean;
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
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
