import type {
  IProductVariantService,
  ProductVariantQueryParams,
  ProductVariantListResponse,
  ProductVariantWithProduct,
  CreateProductVariantRequest,
  UpdateProductVariantRequest,
  UpdateProductVariantStatusRequest,
  ProductVariantStatistics,
  ApiResponse,
  PaginatedApiResponse,
} from "../types";
import { API_PATHS } from "../../../constants/api-path.constants";
import http from "../../../libs/http.libs";

/**
 * Product Variant Service implementation following Single Responsibility Principle
 * Handles all API communications for product variants
 */
export class ProductVariantService implements IProductVariantService {
  /**
   * Get paginated list of product variants
   */
  async getProductVariants(
    params?: ProductVariantQueryParams
  ): Promise<ProductVariantListResponse> {
    try {
      const response = await http.get<
        PaginatedApiResponse<ProductVariantWithProduct[]>
      >(API_PATHS.PRODUCT_VARIANTS, { params });

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
      throw this.handleError(error, "Failed to fetch product variants");
    }
  }

  /**
   * Get single product variant by ID
   */
  async getProductVariantById(id: string): Promise<ProductVariantWithProduct> {
    try {
      const response = await http.get<ApiResponse<ProductVariantWithProduct>>(
        API_PATHS.PRODUCT_VARIANT_BY_ID(id)
      );

      // Handle both wrapped and direct response formats
      const result = (response.data.data ||
        response.data) as ProductVariantWithProduct;

      if (!result || !("id" in result) || !result.id) {
        throw new Error("Product variant not found");
      }

      return result as ProductVariantWithProduct;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch product variant");
    }
  }

  /**
   * Get variants by product ID
   */
  async getProductVariantsByProduct(
    productId: string
  ): Promise<ProductVariantWithProduct[]> {
    try {
      const response = await http.get<ApiResponse<ProductVariantWithProduct[]>>(
        API_PATHS.PRODUCT_VARIANTS_BY_PRODUCT(productId)
      );

      return response.data.data || [];
    } catch (error) {
      throw this.handleError(
        error,
        "Failed to fetch product variants by product"
      );
    }
  }

  /**
   * Create new product variant
   */
  async createProductVariant(
    data: CreateProductVariantRequest
  ): Promise<ProductVariantWithProduct> {
    try {
      const response = await http.post<ApiResponse<ProductVariantWithProduct>>(
        API_PATHS.PRODUCT_VARIANTS,
        data
      );

      // Handle both wrapped and direct response formats
      const result = (response.data.data ||
        response.data) as ProductVariantWithProduct;

      if (!result || !("id" in result) || !result.id) {
        throw new Error("Failed to create product variant");
      }

      return result as ProductVariantWithProduct;
    } catch (error) {
      throw this.handleError(error, "Failed to create product variant");
    }
  }

  /**
   * Update existing product variant
   */
  async updateProductVariant(
    id: string,
    data: UpdateProductVariantRequest
  ): Promise<ProductVariantWithProduct> {
    try {
      const response = await http.patch<ApiResponse<ProductVariantWithProduct>>(
        API_PATHS.PRODUCT_VARIANT_BY_ID(id),
        data
      );

      // Handle both wrapped and direct response formats
      const result = (response.data.data ||
        response.data) as ProductVariantWithProduct;

      if (!result || !("id" in result) || !result.id) {
        throw new Error("Failed to update product variant");
      }

      return result as ProductVariantWithProduct;
    } catch (error) {
      throw this.handleError(error, "Failed to update product variant");
    }
  }

  /**
   * Update product variant status
   */
  async updateProductVariantStatus(
    id: string,
    data: UpdateProductVariantStatusRequest
  ): Promise<ProductVariantWithProduct> {
    try {
      const response = await http.patch<ApiResponse<ProductVariantWithProduct>>(
        API_PATHS.PRODUCT_VARIANT_STATUS(id),
        data
      );

      // Handle both wrapped and direct response formats
      const result = (response.data.data ||
        response.data) as ProductVariantWithProduct;

      if (!result || !("id" in result) || !result.id) {
        throw new Error("Failed to update product variant status");
      }

      return result as ProductVariantWithProduct;
    } catch (error) {
      throw this.handleError(error, "Failed to update product variant status");
    }
  }

  /**
   * Delete product variant
   */
  async deleteProductVariant(id: string): Promise<void> {
    try {
      await http.delete<ApiResponse<void>>(API_PATHS.PRODUCT_VARIANT_BY_ID(id));
    } catch (error) {
      throw this.handleError(error, "Failed to delete product variant");
    }
  }

  /**
   * Duplicate product variant
   */
  async duplicateProductVariant(
    id: string
  ): Promise<ProductVariantWithProduct> {
    try {
      const response = await http.post<ApiResponse<ProductVariantWithProduct>>(
        API_PATHS.PRODUCT_VARIANT_DUPLICATE(id)
      );

      // Handle both wrapped and direct response formats
      const result = (response.data.data ||
        response.data) as ProductVariantWithProduct;

      if (!result || !("id" in result) || !result.id) {
        throw new Error("Failed to duplicate product variant");
      }

      return result as ProductVariantWithProduct;
    } catch (error) {
      throw this.handleError(error, "Failed to duplicate product variant");
    }
  }

  /**
   * Get product variant statistics
   */
  async getStatistics(productId?: string): Promise<ProductVariantStatistics> {
    try {
      let url = API_PATHS.PRODUCT_VARIANT_STATISTICS;
      if (productId) {
        url += `?productId=${productId}`;
      }

      const response = await http.get<ApiResponse<ProductVariantStatistics>>(
        url
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
export const productVariantService = new ProductVariantService();
