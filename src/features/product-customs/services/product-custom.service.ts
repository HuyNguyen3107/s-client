import type {
  IProductCustomService,
  ProductCustomQueryParams,
  ProductCustomListResponse,
  ProductCustomWithRelations,
  CreateProductCustomRequest,
  UpdateProductCustomRequest,
  ProductCustomStatistics,
  ApiResponse,
  PaginatedApiResponse,
} from "../types";
import { API_PATHS } from "../../../constants/api-path.constants";
import http from "../../../libs/http.libs";

/**
 * Product Custom Service implementation following Single Responsibility Principle
 * Handles all API communications for product customs
 */
export class ProductCustomService implements IProductCustomService {
  /**
   * Get paginated list of product customs with optional filtering
   * @param params - Query parameters for filtering and pagination
   * @returns Promise<ProductCustomListResponse>
   */
  async getProductCustoms(
    params?: ProductCustomQueryParams
  ): Promise<ProductCustomListResponse> {
    try {
      const response = await http.get<
        PaginatedApiResponse<ProductCustomWithRelations[]>
      >(API_PATHS.PRODUCT_CUSTOMS, { params });

      return {
        data: response.data.data || [],
        meta: response.data.meta || {
          total: 0,
          page: params?.page || 1,
          limit: params?.limit || 10,
          totalPages: 0,
        },
      };
    } catch (error) {
      console.error("Error fetching product customs:", error);
      throw error;
    }
  }

  /**
   * Get single product custom by ID
   * @param id - Product custom ID
   * @returns Promise<ProductCustomWithRelations>
   */
  async getProductCustomById(id: string): Promise<ProductCustomWithRelations> {
    try {
      const response = await http.get<any>(API_PATHS.PRODUCT_CUSTOM_BY_ID(id));

      // Handle both response structures:
      // 1. { data: { data: ProductCustom } } - wrapped response
      // 2. { data: ProductCustom } - direct response
      const productCustom = response.data.data || response.data;

      if (!productCustom || !productCustom.id) {
        throw new Error("Product custom not found");
      }

      return productCustom;
    } catch (error: any) {
      // Don't log error if it's just "not found" to reduce console noise
      if (error.response?.status !== 404) {
        console.error(`Error fetching product custom ${id}:`, error);
      }
      throw error;
    }
  }

  /**
   * Get product customs by category ID
   * @param categoryId - Product category ID
   * @returns Promise<ProductCustomWithRelations[]>
   */
  async getProductCustomsByCategory(
    categoryId: string
  ): Promise<ProductCustomWithRelations[]> {
    try {
      const response = await http.get<
        ApiResponse<ProductCustomWithRelations[]>
      >(API_PATHS.PRODUCT_CUSTOMS_BY_CATEGORY(categoryId));

      return response.data.data || [];
    } catch (error) {
      console.error(
        `Error fetching customs for category ${categoryId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Create new product custom
   * @param data - Product custom creation data
   * @returns Promise<ProductCustomWithRelations>
   */
  async createProductCustom(
    data: CreateProductCustomRequest
  ): Promise<ProductCustomWithRelations> {
    try {
      const response = await http.post<ProductCustomWithRelations>(
        API_PATHS.PRODUCT_CUSTOMS,
        data
      );

      return response.data;
    } catch (error) {
      console.error("Error creating product custom:", error);
      throw error;
    }
  }

  /**
   * Update existing product custom
   * @param id - Product custom ID
   * @param data - Product custom update data
   * @returns Promise<ProductCustomWithRelations>
   */
  async updateProductCustom(
    id: string,
    data: UpdateProductCustomRequest
  ): Promise<ProductCustomWithRelations> {
    try {
      const response = await http.patch<ProductCustomWithRelations>(
        API_PATHS.PRODUCT_CUSTOM_BY_ID(id),
        data
      );

      return response.data;
    } catch (error) {
      console.error(`Error updating product custom ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update product custom status only
   * @param id - Product custom ID
   * @param status - New status
   * @returns Promise<ProductCustomWithRelations>
   */
  async updateProductCustomStatus(
    id: string,
    status: string
  ): Promise<ProductCustomWithRelations> {
    try {
      const response = await http.patch<ProductCustomWithRelations>(
        API_PATHS.PRODUCT_CUSTOM_STATUS(id),
        { status }
      );

      return response.data;
    } catch (error) {
      console.error(`Error updating status for product custom ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete product custom
   * @param id - Product custom ID
   * @returns Promise<void>
   */
  async deleteProductCustom(id: string): Promise<void> {
    try {
      await http.delete<ApiResponse<{ message: string }>>(
        API_PATHS.PRODUCT_CUSTOM_BY_ID(id)
      );
    } catch (error) {
      console.error(`Error deleting product custom ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get product custom statistics
   * @returns Promise<ProductCustomStatistics>
   */
  async getStatistics(): Promise<ProductCustomStatistics> {
    try {
      const response = await http.get<ProductCustomStatistics>(
        API_PATHS.PRODUCT_CUSTOM_STATISTICS
      );

      return (
        response.data || {
          totalProductCustoms: 0,
          totalInventories: 0,
          productCustomsByStatus: [],
          productCustomsByCategory: [],
        }
      );
    } catch (error) {
      console.error("Error fetching product custom statistics:", error);
      throw error;
    }
  }
}

// Singleton instance following Dependency Injection pattern
export const productCustomService = new ProductCustomService();

// Export individual functions for convenience (following existing pattern)
export const getProductCustoms = (params?: ProductCustomQueryParams) =>
  productCustomService.getProductCustoms(params);

export const getProductCustomById = (id: string) =>
  productCustomService.getProductCustomById(id);

export const getProductCustomsByCategory = (categoryId: string) =>
  productCustomService.getProductCustomsByCategory(categoryId);

export const createProductCustom = (data: CreateProductCustomRequest) =>
  productCustomService.createProductCustom(data);

export const updateProductCustom = (
  id: string,
  data: UpdateProductCustomRequest
) => productCustomService.updateProductCustom(id, data);

export const updateProductCustomStatus = (id: string, status: string) =>
  productCustomService.updateProductCustomStatus(id, status);

export const deleteProductCustom = (id: string) =>
  productCustomService.deleteProductCustom(id);

export const getProductCustomStatistics = () =>
  productCustomService.getStatistics();
