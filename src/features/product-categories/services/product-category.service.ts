import type {
  IProductCategoryService,
  ProductCategoryQueryParams,
  ProductCategoryListResponse,
  ProductCategoryWithRelations,
  CreateProductCategoryRequest,
  UpdateProductCategoryRequest,
  ProductCategoryStatistics,
  ApiResponse,
  PaginatedApiResponse,
} from "../types";
import { API_PATHS } from "../../../constants/api-path.constants";
import http from "../../../libs/http.libs";

/**
 * Product Category Service implementation following Single Responsibility Principle
 * Handles all API communications for product categories
 */
export class ProductCategoryService implements IProductCategoryService {
  /**
   * Get paginated list of product categories
   */
  async getProductCategories(
    params?: ProductCategoryQueryParams
  ): Promise<ProductCategoryListResponse> {
    try {
      const response = await http.get<
        PaginatedApiResponse<ProductCategoryWithRelations[]>
      >(API_PATHS.PRODUCT_CATEGORIES, { params });

      return {
        data: response.data.data || [],
        meta: response.data.meta || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        },
      };
    } catch (error) {
      throw this.handleError(error, "Failed to fetch product categories");
    }
  }

  /**
   * Get single product category by ID
   */
  async getProductCategoryById(
    id: string
  ): Promise<ProductCategoryWithRelations> {
    try {
      const response = await http.get<
        ApiResponse<ProductCategoryWithRelations>
      >(API_PATHS.PRODUCT_CATEGORY_BY_ID(id));

      if (!response.data.data) {
        throw new Error("Product category not found");
      }

      return response.data.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch product category");
    }
  }

  /**
   * Get categories by product ID
   */
  async getProductCategoriesByProduct(
    productId: string
  ): Promise<ProductCategoryWithRelations[]> {
    try {
      const response = await http.get<
        ApiResponse<ProductCategoryWithRelations[]>
      >(API_PATHS.PRODUCT_CATEGORIES_BY_PRODUCT(productId));

      return response.data.data || [];
    } catch (error) {
      throw this.handleError(
        error,
        "Failed to fetch product categories by product"
      );
    }
  }

  /**
   * Create new product category
   */
  async createProductCategory(
    data: CreateProductCategoryRequest
  ): Promise<ProductCategoryWithRelations> {
    try {
      const response = await http.post<
        ApiResponse<ProductCategoryWithRelations>
      >(API_PATHS.PRODUCT_CATEGORIES, data);

      if (!response.data.data) {
        throw new Error("Failed to create product category");
      }

      return response.data.data;
    } catch (error) {
      throw this.handleError(error, "Failed to create product category");
    }
  }

  /**
   * Update existing product category
   */
  async updateProductCategory(
    id: string,
    data: UpdateProductCategoryRequest
  ): Promise<ProductCategoryWithRelations> {
    try {
      const response = await http.patch<
        ApiResponse<ProductCategoryWithRelations>
      >(API_PATHS.PRODUCT_CATEGORY_BY_ID(id), data);

      if (!response.data.data) {
        throw new Error("Failed to update product category");
      }

      return response.data.data;
    } catch (error) {
      throw this.handleError(error, "Failed to update product category");
    }
  }

  /**
   * Delete product category
   */
  async deleteProductCategory(id: string): Promise<void> {
    try {
      await http.delete<ApiResponse<void>>(
        API_PATHS.PRODUCT_CATEGORY_BY_ID(id)
      );
    } catch (error) {
      throw this.handleError(error, "Failed to delete product category");
    }
  }

  /**
   * Get product category statistics
   */
  async getStatistics(): Promise<ProductCategoryStatistics> {
    try {
      const response = await http.get<ApiResponse<ProductCategoryStatistics>>(
        API_PATHS.PRODUCT_CATEGORY_STATISTICS
      );

      if (!response.data.data) {
        throw new Error("Failed to fetch statistics");
      }

      return response.data.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch statistics");
    }
  }

  /**
   * Handle API errors consistently
   * @private
   */
  private handleError(error: any, defaultMessage: string): Error {
    if (error?.response?.data?.message) {
      return new Error(error.response.data.message);
    }

    if (error?.message) {
      return new Error(error.message);
    }

    return new Error(defaultMessage);
  }
}

// Singleton instance following Dependency Injection pattern
export const productCategoryService = new ProductCategoryService();
