import { useQuery } from "@tanstack/react-query";
import http from "../../../libs/http.libs";
import { API_PATHS } from "../../../constants/api-path.constants";
import { COLLECTION_CONSTANTS } from "../constants/collection.constants";
import type {
  Collection,
  CollectionListResponse,
  CollectionQueryParams,
  ApiResponse,
} from "../types/collection.types";

// Repository Pattern - Dependency Inversion Principle (DIP)
class CollectionRepository {
  // Helper method to transform server response to client format
  private transformCollection(serverCollection: any): Collection {
    return {
      id: serverCollection.id,
      name: serverCollection.name,
      slug: serverCollection.routeName, // Map routeName to slug
      description: serverCollection.description || "",
      imageUrl: serverCollection.imageUrl,
      isActive: serverCollection.status === "active", // Map status to isActive
      isHot: serverCollection.isHot || false,
      sortOrder: serverCollection.sortOrder || 0, // Default to 0 if not present
      productCount: serverCollection.productCount || 0,
      status: serverCollection.status,
      routeName: serverCollection.routeName,
      createdAt: serverCollection.createdAt,
      updatedAt: serverCollection.updatedAt,
    };
  }

  async getCollections(
    params: CollectionQueryParams
  ): Promise<CollectionListResponse> {
    try {
      const response = await http.get<ApiResponse<any[]>>(
        API_PATHS.COLLECTIONS
      );

      // Check if response has the expected structure
      let serverCollections: any[] = [];
      if (response.data?.data) {
        serverCollections = response.data.data;
      } else if (Array.isArray(response.data)) {
        serverCollections = response.data;
      } else {
        console.warn("Unexpected API response format:", response);
        serverCollections = [];
      }

      // Transform server data to client format
      const collections = serverCollections.map((item) =>
        this.transformCollection(item)
      );

      // Client-side filtering and pagination since server doesn't support it yet
      let filteredCollections = collections;

      // Apply filters
      if (params.isActive !== undefined) {
        filteredCollections = filteredCollections.filter(
          (c) => c.isActive === params.isActive
        );
      }
      if (params.isHot !== undefined) {
        filteredCollections = filteredCollections.filter(
          (c) => c.isHot === params.isHot
        );
      }
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        filteredCollections = filteredCollections.filter(
          (c) =>
            c.name.toLowerCase().includes(searchLower) ||
            c.slug.toLowerCase().includes(searchLower)
        );
      }

      // Apply sorting
      if (params.sortBy) {
        filteredCollections.sort((a, b) => {
          let aVal, bVal;
          switch (params.sortBy) {
            case "name":
              aVal = a.name.toLowerCase();
              bVal = b.name.toLowerCase();
              break;
            case "createdAt":
              aVal = new Date(a.createdAt).getTime();
              bVal = new Date(b.createdAt).getTime();
              break;
            case "sortOrder":
              aVal = a.sortOrder || 0;
              bVal = b.sortOrder || 0;
              break;
            case "productCount":
              aVal = a.productCount || 0;
              bVal = b.productCount || 0;
              break;
            default:
              aVal = a.createdAt;
              bVal = b.createdAt;
          }

          if (params.sortOrder === "desc") {
            return aVal < bVal ? 1 : -1;
          }
          return aVal > bVal ? 1 : -1;
        });
      }

      // Apply pagination
      const page = params.page || 1;
      const limit = params.limit || 12;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedCollections = filteredCollections.slice(
        startIndex,
        endIndex
      );

      return {
        data: paginatedCollections,
        pagination: {
          page,
          limit,
          total: filteredCollections.length,
          totalPages: Math.ceil(filteredCollections.length / limit),
        },
      };
    } catch (error) {
      console.error("Error fetching collections:", error);
      // Return empty result instead of throwing
      return {
        data: [],
        pagination: {
          page: params.page || 1,
          limit: params.limit || 12,
          total: 0,
          totalPages: 0,
        },
      };
    }
  }

  async getCollectionById(id: string): Promise<Collection> {
    try {
      const response = await http.get<ApiResponse<any>>(
        API_PATHS.COLLECTION_BY_ID(id)
      );
      const serverCollection = response.data?.data || response.data;
      return this.transformCollection(serverCollection);
    } catch (error) {
      console.error("Error fetching collection by id:", error);
      throw error;
    }
  }

  async getCollectionBySlug(slug: string): Promise<Collection> {
    try {
      const response = await http.get<ApiResponse<any>>(
        API_PATHS.COLLECTION_BY_SLUG(slug)
      );
      const serverCollection = response.data?.data || response.data;
      return this.transformCollection(serverCollection);
    } catch (error) {
      console.error("Error fetching collection by slug:", error);
      throw error;
    }
  }

  async getHotCollections(): Promise<Collection[]> {
    try {
      const response = await http.get<ApiResponse<any[]>>(
        API_PATHS.HOT_COLLECTIONS
      );
      const serverCollections = (response.data?.data || response.data || []) as any[];
      return serverCollections.map((item) => this.transformCollection(item));
    } catch (error) {
      console.error("Error fetching hot collections:", error);
      // Return empty array instead of throwing
      return [];
    }
  }
}

// Singleton instance
const collectionRepository = new CollectionRepository();

// Query Hooks following existing pattern
export const useCollections = (params: CollectionQueryParams) => {
  return useQuery({
    queryKey: [COLLECTION_CONSTANTS.CACHE_KEYS.COLLECTIONS, params],
    queryFn: () => collectionRepository.getCollections(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    throwOnError: false, // Don't throw errors, handle them in UI
  });
};

export const useCollectionById = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: [COLLECTION_CONSTANTS.CACHE_KEYS.COLLECTION_DETAIL, id],
    queryFn: () => collectionRepository.getCollectionById(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    throwOnError: false,
  });
};

export const useCollectionBySlug = (slug: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: [COLLECTION_CONSTANTS.CACHE_KEYS.COLLECTION_DETAIL, "slug", slug],
    queryFn: () => collectionRepository.getCollectionBySlug(slug),
    enabled: enabled && !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    throwOnError: false,
  });
};

export const useHotCollections = () => {
  return useQuery({
    queryKey: [COLLECTION_CONSTANTS.CACHE_KEYS.HOT_COLLECTIONS],
    queryFn: () => collectionRepository.getHotCollections(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    throwOnError: false,
  });
};
