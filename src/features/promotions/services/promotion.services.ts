import http from "../../../libs/http.libs";
import { API_PATHS } from "../../../constants/api-path.constants";
import type {
  Promotion,
  CreatePromotionRequest,
  UpdatePromotionRequest,
  PromotionListResponse,
  PromotionQueryParams,
  ValidatePromotionRequest,
  PromotionValidationResult,
  PromotionStatistics,
  ApiResponse,
  PaginatedApiResponse,
} from "../types/promotion.types";

// Abstract service interface for Dependency Inversion Principle
export interface IPromotionService {
  getPromotions(params?: PromotionQueryParams): Promise<PromotionListResponse>;
  getPromotionById(id: string): Promise<Promotion>;
  getPromotionByCode(promoCode: string): Promise<Promotion>;
  createPromotion(data: CreatePromotionRequest): Promise<Promotion>;
  updatePromotion(id: string, data: UpdatePromotionRequest): Promise<Promotion>;
  deletePromotion(id: string): Promise<{ message: string }>;
  validatePromotion(
    data: ValidatePromotionRequest
  ): Promise<PromotionValidationResult>;
  applyPromotion(promoCode: string): Promise<Promotion>;
  getActivePromotions(): Promise<Promotion[]>;
  getPromotionStatistics(): Promise<PromotionStatistics>;
}

// Concrete implementation
class PromotionService implements IPromotionService {
  async getPromotions(
    params?: PromotionQueryParams
  ): Promise<PromotionListResponse> {
    const response = await http.get<PaginatedApiResponse<Promotion[]>>(
      API_PATHS.PROMOTIONS,
      { params }
    );
    return {
      data: response.data.data || [],
      pagination: response.data.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    };
  }

  async getPromotionById(id: string): Promise<Promotion> {
    const response = await http.get<ApiResponse<Promotion>>(
      API_PATHS.PROMOTION_BY_ID(id)
    );
    return response.data.data!;
  }

  async getPromotionByCode(promoCode: string): Promise<Promotion> {
    const response = await http.get<ApiResponse<Promotion>>(
      API_PATHS.PROMOTION_BY_CODE(promoCode)
    );
    return response.data.data!;
  }

  async createPromotion(data: CreatePromotionRequest): Promise<Promotion> {
    const response = await http.post<ApiResponse<Promotion>>(
      API_PATHS.PROMOTIONS,
      data
    );
    return response.data.data!;
  }

  async updatePromotion(
    id: string,
    data: UpdatePromotionRequest
  ): Promise<Promotion> {
    const response = await http.patch<ApiResponse<Promotion>>(
      API_PATHS.PROMOTION_BY_ID(id),
      data
    );
    return response.data.data!;
  }

  async deletePromotion(id: string): Promise<{ message: string }> {
    const response = await http.delete<ApiResponse<{ message: string }>>(
      API_PATHS.PROMOTION_BY_ID(id)
    );
    return response.data.data!;
  }

  async validatePromotion(
    data: ValidatePromotionRequest
  ): Promise<PromotionValidationResult> {
    const response = await http.post<ApiResponse<PromotionValidationResult>>(
      API_PATHS.VALIDATE_PROMOTION,
      data
    );
    return response.data.data!;
  }

  async applyPromotion(promoCode: string): Promise<Promotion> {
    const response = await http.post<ApiResponse<Promotion>>(
      API_PATHS.APPLY_PROMOTION(promoCode)
    );
    return response.data.data!;
  }

  async getActivePromotions(): Promise<Promotion[]> {
    const response = await http.get<ApiResponse<Promotion[]>>(
      API_PATHS.ACTIVE_PROMOTIONS
    );
    return response.data.data || [];
  }

  async getPromotionStatistics(): Promise<PromotionStatistics> {
    const response = await http.get<ApiResponse<PromotionStatistics>>(
      API_PATHS.PROMOTION_STATISTICS
    );
    return response.data.data!;
  }
}

// Export single instance following Singleton pattern
export const promotionService: IPromotionService = new PromotionService();

// Export individual functions for convenience (following existing pattern)
export const getPromotions = (params?: PromotionQueryParams) =>
  promotionService.getPromotions(params);

export const getPromotionById = (id: string) =>
  promotionService.getPromotionById(id);

export const getPromotionByCode = (promoCode: string) =>
  promotionService.getPromotionByCode(promoCode);

export const createPromotion = (data: CreatePromotionRequest) =>
  promotionService.createPromotion(data);

export const updatePromotion = (id: string, data: UpdatePromotionRequest) =>
  promotionService.updatePromotion(id, data);

export const deletePromotion = (id: string) =>
  promotionService.deletePromotion(id);

export const validatePromotion = (data: ValidatePromotionRequest) =>
  promotionService.validatePromotion(data);

export const applyPromotion = (promoCode: string) =>
  promotionService.applyPromotion(promoCode);

export const getActivePromotions = () => promotionService.getActivePromotions();

export const getPromotionStatistics = () =>
  promotionService.getPromotionStatistics();
