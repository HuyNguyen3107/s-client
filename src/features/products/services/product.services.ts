import http from "../../../libs/http.libs";
import { API_PATHS } from "../../../constants/api-path.constants";
import type {
  ProductWithRelations,
  CreateProductRequest,
  UpdateProductRequest,
  ProductListResponse,
  ProductQueryParams,
  ApiResponse,
  PaginatedApiResponse,
  ProductStatistics,
} from "../types";

// Abstract service interface for Dependency Inversion Principle
export interface IProductService {
  getProducts(params?: ProductQueryParams): Promise<ProductListResponse>;
  getProductById(id: string): Promise<ProductWithRelations>;
  getProductsByCollection(
    collectionId: string
  ): Promise<ProductWithRelations[]>;
  createProduct(data: CreateProductRequest): Promise<ProductWithRelations>;
  updateProduct(
    id: string,
    data: UpdateProductRequest
  ): Promise<ProductWithRelations>;
  updateProductStatus(
    id: string,
    status: string
  ): Promise<ProductWithRelations>;
  deleteProduct(id: string): Promise<{ message: string }>;
  getProductStatistics(): Promise<ProductStatistics>;
}

// Concrete implementation following Single Responsibility Principle
class ProductService implements IProductService {
  async getProducts(params?: ProductQueryParams): Promise<ProductListResponse> {
    const response = await http.get<
      PaginatedApiResponse<ProductWithRelations[]>
    >(API_PATHS.PRODUCTS, { params });

    return {
      data: response.data.data || [],
      meta: response.data.meta || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    };
  }

  async getProductById(id: string): Promise<ProductWithRelations> {
    const response = await http.get(API_PATHS.PRODUCT_BY_ID(id));

    // Some backends return an ApiResponse wrapper: { statusCode, message, data }
    // while others return the product object directly. Handle both shapes.
    const respData = response?.data;

    // If wrapper shape
    if (respData && typeof respData === "object" && "data" in respData) {
      if (respData.data === undefined) {
        throw new Error("Product not found or invalid response from server");
      }
      return respData.data as ProductWithRelations;
    }

    // If API returned product directly
    if (respData && typeof respData === "object" && "id" in respData) {
      return respData as ProductWithRelations;
    }

    throw new Error("Product not found or invalid response from server");
  }

  async getProductsByCollection(
    collectionId: string
  ): Promise<ProductWithRelations[]> {
    const response = await http.get<ApiResponse<ProductWithRelations[]>>(
      API_PATHS.PRODUCTS_BY_COLLECTION(collectionId)
    );
    const respData = response?.data as any;
    if (Array.isArray(respData)) {
      return respData as ProductWithRelations[];
    }
    return (respData?.data as ProductWithRelations[]) || [];
  }

  async createProduct(
    data: CreateProductRequest
  ): Promise<ProductWithRelations> {
    const response = await http.post<ApiResponse<ProductWithRelations>>(
      API_PATHS.PRODUCTS,
      data
    );
    return response.data.data!;
  }

  async updateProduct(
    id: string,
    data: UpdateProductRequest
  ): Promise<ProductWithRelations> {
    const response = await http.patch<ApiResponse<ProductWithRelations>>(
      API_PATHS.PRODUCT_BY_ID(id),
      data
    );
    return response.data.data!;
  }

  async updateProductStatus(
    id: string,
    status: string
  ): Promise<ProductWithRelations> {
    const response = await http.patch<ApiResponse<ProductWithRelations>>(
      API_PATHS.PRODUCT_STATUS(id),
      { status }
    );
    return response.data.data!;
  }

  async deleteProduct(id: string): Promise<{ message: string }> {
    const response = await http.delete<ApiResponse<{ message: string }>>(
      API_PATHS.PRODUCT_BY_ID(id)
    );
    return response.data.data!;
  }

  async getProductStatistics(): Promise<ProductStatistics> {
    try {
      const response = await http.get<ApiResponse<ProductStatistics>>(
        API_PATHS.PRODUCT_STATISTICS
      );

      // Ensure we have valid data structure
      if (!response.data || !response.data.data) {
        throw new Error("Invalid response structure from statistics API");
      }

      const stats = response.data.data;

      // Validate required fields
      if (
        typeof stats.totalProducts !== "number" ||
        typeof stats.totalProductVariants !== "number" ||
        !Array.isArray(stats.productsByStatus) ||
        !Array.isArray(stats.productsByCollection)
      ) {
        throw new Error("Invalid statistics data structure");
      }

      return stats;
    } catch (error) {
      // Re-throw error to let query handle it properly
      throw error;
    }
  }
}

// Export single instance following Singleton pattern
export const productService: IProductService = new ProductService();

// Export individual functions for convenience (following existing pattern)
export const getProducts = (params?: ProductQueryParams) =>
  productService.getProducts(params);

export const getProductById = (id: string) => productService.getProductById(id);

export const getProductsByCollection = (collectionId: string) =>
  productService.getProductsByCollection(collectionId);

export const createProduct = (data: CreateProductRequest) =>
  productService.createProduct(data);

export const updateProduct = (id: string, data: UpdateProductRequest) =>
  productService.updateProduct(id, data);

export const updateProductStatus = (id: string, status: string) =>
  productService.updateProductStatus(id, status);

export const deleteProduct = (id: string) => productService.deleteProduct(id);

export const getProductStatistics = () => productService.getProductStatistics();
