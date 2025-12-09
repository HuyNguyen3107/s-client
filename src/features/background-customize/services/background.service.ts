import httpClient from "../../../libs/http.libs";
import type {
  Background,
  BackgroundCategory,
  BackgroundCustomization,
  BackgroundCustomizationRequest,
  BackgroundListResponse,
  BackgroundQueryParams,
} from "../types/background.types";

class BackgroundService {
  private readonly baseUrl = "/backgrounds";
  private readonly categoryUrl = "/background-categories";

  // Get all background categories
  async getBackgroundCategories(): Promise<BackgroundCategory[]> {
    try {
      const response = await httpClient.get<BackgroundCategory[]>(
        this.categoryUrl
      );
      return response.data || [];
    } catch (error) {
      console.error("Error fetching background categories:", error);
      return [];
    }
  }

  // Get backgrounds with filtering
  async getBackgrounds(
    params: BackgroundQueryParams = {}
  ): Promise<BackgroundListResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.category) queryParams.append("category", params.category);
      if (params.search) queryParams.append("search", params.search);
      if (params.tags?.length) {
        params.tags.forEach((tag) => queryParams.append("tags[]", tag));
      }
      if (params.priceMin !== undefined) {
        queryParams.append("priceMin", params.priceMin.toString());
      }
      if (params.priceMax !== undefined) {
        queryParams.append("priceMax", params.priceMax.toString());
      }
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const url = `${this.baseUrl}?${queryParams.toString()}`;
      const response = await httpClient.get<any>(url);

      // Handle different response formats
      const responseData = response.data;

      if (responseData && Array.isArray(responseData.data)) {
        // Standard paginated response format
        return {
          data: responseData.data as Background[],
          meta: {
            total: responseData.total || responseData.data.length,
            page: responseData.page || 1,
            limit: responseData.limit || 50,
            totalPages: responseData.totalPages || 1,
          },
        };
      } else if (Array.isArray(responseData)) {
        // Direct array response format
        return {
          data: responseData as Background[],
          meta: {
            total: responseData.length,
            page: 1,
            limit: 50,
            totalPages: 1,
          },
        };
      } else {
        return {
          data: [],
          meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
        };
      }
    } catch (error) {
      console.error("Error fetching backgrounds:", error);
      return {
        data: [],
        meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
      };
    }
  }

  // Get background by ID
  async getBackgroundById(id: string): Promise<Background | null> {
    try {
      const response = await httpClient.get<Background>(
        `${this.baseUrl}/${id}`
      );
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching background ${id}:`, error);
      return null;
    }
  }

  // Save background customization
  async saveBackgroundCustomization(
    data: BackgroundCustomizationRequest
  ): Promise<BackgroundCustomization | null> {
    try {
      const response = await httpClient.post<BackgroundCustomization>(
        "/background-customizations",
        data
      );
      return response.data || null;
    } catch (error) {
      console.error("Error saving background customization:", error);
      throw error;
    }
  }

  // Get background customization by ID
  async getBackgroundCustomization(
    id: string
  ): Promise<BackgroundCustomization | null> {
    try {
      const response = await httpClient.get<BackgroundCustomization>(
        `/background-customizations/${id}`
      );
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching background customization ${id}:`, error);
      return null;
    }
  }

  // Update background customization
  async updateBackgroundCustomization(
    id: string,
    data: Partial<BackgroundCustomizationRequest>
  ): Promise<BackgroundCustomization | null> {
    try {
      const response = await httpClient.put<BackgroundCustomization>(
        `/background-customizations/${id}`,
        data
      );
      return response.data || null;
    } catch (error) {
      console.error(`Error updating background customization ${id}:`, error);
      throw error;
    }
  }
}

export const backgroundService = new BackgroundService();
export default backgroundService;
