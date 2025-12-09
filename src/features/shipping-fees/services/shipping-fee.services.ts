import http from "../../../libs/http.libs";
import { API_PATHS } from "../../../constants/api-path.constants";
import type {
  ShippingFee,
  CreateShippingFeeRequest,
  UpdateShippingFeeRequest,
  ShippingFeeQueryParams,
  ShippingFeeListResponse,
  ShippingFeeStatistics,
  ShippingFeeSearchParams,
  ApiResponse,
} from "../types";

/**
 * Abstract service interface following Dependency Inversion Principle (DIP)
 * High-level modules should not depend on low-level modules.
 * Both should depend on abstractions.
 */
export interface IShippingFeeService {
  // Basic CRUD operations
  getShippingFees(
    params?: ShippingFeeQueryParams
  ): Promise<ShippingFeeListResponse>;
  getShippingFeeById(id: string): Promise<ShippingFee>;
  createShippingFee(data: CreateShippingFeeRequest): Promise<ShippingFee>;
  updateShippingFee(
    id: string,
    data: UpdateShippingFeeRequest
  ): Promise<ShippingFee>;
  deleteShippingFee(id: string): Promise<{ message: string }>;

  // Specialized queries
  getDistinctAreas(): Promise<string[]>;
  getDistinctShippingTypes(): Promise<string[]>;
  getShippingFeesByArea(area: string): Promise<ShippingFee[]>;
  searchShippingFees(params: ShippingFeeSearchParams): Promise<ShippingFee[]>;
  getShippingFeeStatistics(): Promise<ShippingFeeStatistics>;
}

/**
 * Concrete implementation following Single Responsibility Principle (SRP)
 * This class has only one reason to change: when the API contract changes.
 */
class ShippingFeeService implements IShippingFeeService {
  /**
   * Get paginated list of shipping fees with optional filters
   */
  async getShippingFees(
    params?: ShippingFeeQueryParams
  ): Promise<ShippingFeeListResponse> {
    const response = await http.get<
      ApiResponse<{
        data: ShippingFee[];
        total: number;
        page: number;
        limit: number;
      }>
    >(API_PATHS.SHIPPING_FEES, { params });

    const paginatedData = response.data.data || {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    };

    return {
      data: paginatedData.data || [],
      total: paginatedData.total || 0,
      page: paginatedData.page || 1,
      limit: paginatedData.limit || 10,
    };
  }

  /**
   * Get single shipping fee by ID
   */
  async getShippingFeeById(id: string): Promise<ShippingFee> {
    const response = await http.get<ApiResponse<ShippingFee>>(
      API_PATHS.SHIPPING_FEE_BY_ID(id)
    );

    if (!response.data.data) {
      throw new Error("Shipping fee not found");
    }

    return response.data.data;
  }

  /**
   * Create new shipping fee
   */
  async createShippingFee(
    data: CreateShippingFeeRequest
  ): Promise<ShippingFee> {
    const response = await http.post<ApiResponse<ShippingFee>>(
      API_PATHS.SHIPPING_FEES,
      data
    );

    if (!response.data.data) {
      throw new Error("Failed to create shipping fee");
    }

    return response.data.data;
  }

  /**
   * Update existing shipping fee
   */
  async updateShippingFee(
    id: string,
    data: UpdateShippingFeeRequest
  ): Promise<ShippingFee> {
    const response = await http.patch<ApiResponse<ShippingFee>>(
      API_PATHS.SHIPPING_FEE_BY_ID(id),
      data
    );

    if (!response.data.data) {
      throw new Error("Failed to update shipping fee");
    }

    return response.data.data;
  }

  /**
   * Delete shipping fee by ID
   */
  async deleteShippingFee(id: string): Promise<{ message: string }> {
    const response = await http.delete<ApiResponse<{ message: string }>>(
      API_PATHS.SHIPPING_FEE_BY_ID(id)
    );

    return (
      response.data.data || { message: "Shipping fee deleted successfully" }
    );
  }

  /**
   * Get distinct list of areas
   */
  async getDistinctAreas(): Promise<string[]> {
    const response = await http.get<ApiResponse<string[]>>(
      API_PATHS.SHIPPING_FEE_AREAS
    );

    return response.data.data || [];
  }

  /**
   * Get distinct list of shipping types
   */
  async getDistinctShippingTypes(): Promise<string[]> {
    const response = await http.get<ApiResponse<string[]>>(
      API_PATHS.SHIPPING_FEE_TYPES
    );

    return response.data.data || [];
  }

  /**
   * Get shipping fees by specific area
   */
  async getShippingFeesByArea(area: string): Promise<ShippingFee[]> {
    const response = await http.get<ApiResponse<ShippingFee[]>>(
      API_PATHS.SHIPPING_FEE_BY_AREA(area)
    );

    return response.data.data || [];
  }

  /**
   * Search shipping fees by area and type
   */
  async searchShippingFees(
    params: ShippingFeeSearchParams
  ): Promise<ShippingFee[]> {
    const response = await http.get<ApiResponse<ShippingFee[]>>(
      API_PATHS.SHIPPING_FEE_SEARCH,
      { params }
    );

    return response.data.data || [];
  }

  /**
   * Get shipping fee statistics
   */
  async getShippingFeeStatistics(): Promise<ShippingFeeStatistics> {
    const response = await http.get<ApiResponse<ShippingFeeStatistics>>(
      API_PATHS.SHIPPING_FEE_STATISTICS
    );

    if (!response.data.data) {
      throw new Error("Failed to fetch statistics");
    }

    return response.data.data;
  }
}

/**
 * Export singleton instance following Singleton pattern
 * This ensures we have a single instance throughout the application
 */
export const shippingFeeService: IShippingFeeService = new ShippingFeeService();

/**
 * Export individual functions for convenience
 * This maintains backward compatibility and provides a functional API
 */
export const getShippingFees = (params?: ShippingFeeQueryParams) =>
  shippingFeeService.getShippingFees(params);

export const getShippingFeeById = (id: string) =>
  shippingFeeService.getShippingFeeById(id);

export const createShippingFee = (data: CreateShippingFeeRequest) =>
  shippingFeeService.createShippingFee(data);

export const updateShippingFee = (id: string, data: UpdateShippingFeeRequest) =>
  shippingFeeService.updateShippingFee(id, data);

export const deleteShippingFee = (id: string) =>
  shippingFeeService.deleteShippingFee(id);

export const getDistinctAreas = () => shippingFeeService.getDistinctAreas();

export const getDistinctShippingTypes = () =>
  shippingFeeService.getDistinctShippingTypes();

export const getShippingFeesByArea = (area: string) =>
  shippingFeeService.getShippingFeesByArea(area);

export const searchShippingFees = (params: ShippingFeeSearchParams) =>
  shippingFeeService.searchShippingFees(params);

export const getShippingFeeStatistics = () =>
  shippingFeeService.getShippingFeeStatistics();
