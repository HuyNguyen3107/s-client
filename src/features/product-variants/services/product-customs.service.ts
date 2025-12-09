import httpClient from "../../../libs/http.libs";

export interface Inventory {
  id: string;
  productCustomId: string;
  currentStock?: number;
  reservedStock?: number;
  minStockAlert?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  status: string;
  collectionId?: string;
  imageUrl?: string;
  hasBg?: boolean; // Background customization capability
  has_bg?: boolean; // Alternative naming
  createdAt?: string;
  updatedAt?: string;
  collection?: {
    id: string;
    name: string;
    imageUrl?: string;
    hasBg?: boolean;
    has_bg?: boolean;
  };
  productVariants?: Array<{
    id: string;
    name: string;
    price: string;
    hasBg?: boolean;
    has_bg?: boolean;
  }>;
}

export interface ProductCustom {
  id: string;
  productCategoryId?: string;
  name: string;
  price: string; // API trả về string
  imageUrl?: string;
  description?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  productCategory?: {
    id: string;
    name: string;
    product?: {
      id: string;
      name: string;
      collection?: {
        id: string;
        name: string;
        imageUrl?: string;
      };
    };
  };
  inventories?: Inventory[];
}

export interface ProductCustomQueryParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: "name" | "price" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export interface ProductCustomListResponse {
  data: ProductCustom[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

class ProductService {
  private readonly baseUrl = "/products";

  async getProductById(id: string): Promise<Product> {
    try {
      const response = await httpClient.get<Product>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }

  // Check if product has background customization capability
  hasBackgroundCustomization(product: Product): boolean {
    // Check multiple possible fields for background capability
    return Boolean(
      product.hasBg ||
        product.has_bg ||
        product.collection?.hasBg ||
        product.collection?.has_bg ||
        product.productVariants?.some(
          (variant) => variant.hasBg || variant.has_bg
        )
    );
  }
}

class ProductCustomsService {
  private readonly baseUrl = "/product-customs";

  async getProductCustoms(
    params?: ProductCustomQueryParams
  ): Promise<ProductCustomListResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.search) queryParams.append("search", params.search);
      if (params?.status) queryParams.append("status", params.status);
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const url = `${this.baseUrl}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await httpClient.get<ProductCustomListResponse>(url);

      return response.data;
    } catch (error) {
      console.error("Error fetching product customs:", error);
      throw error;
    }
  }

  async getProductCustomById(id: string): Promise<ProductCustom> {
    try {
      const response = await httpClient.get<ProductCustom>(
        `${this.baseUrl}/${id}`
      );

      return response.data;
    } catch (error) {
      console.error(`Error fetching product custom ${id}:`, error);
      throw error;
    }
  }

  async searchProductCustoms(query: string): Promise<ProductCustom[]> {
    try {
      const response = await this.getProductCustoms({
        search: query,
        status: "active",
        limit: 20,
      });

      // response đã là ProductCustomListResponse, có data và meta
      return response.data || [];
    } catch (error) {
      console.error("Error searching product customs:", error);
      return [];
    }
  }
}

export const productService = new ProductService();
export const productCustomsService = new ProductCustomsService();

// Helper function to check background capability by product ID
export async function checkProductHasBackground(
  productId: string
): Promise<boolean> {
  try {
    const product = await productService.getProductById(productId);
    return productService.hasBackgroundCustomization(product);
  } catch (error) {
    console.error("Error checking background capability:", error);
    return false; // Fallback to false if API call fails
  }
}
