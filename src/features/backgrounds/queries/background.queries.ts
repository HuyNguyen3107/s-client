import { useQuery } from "@tanstack/react-query";
import { BackgroundService } from "../services/background.services";
import { BACKGROUND_CONSTANTS } from "../constants/background.constants";
import type {
  Background,
  BackgroundListResponse,
  BackgroundQueryParams,
} from "../types/background.types";

// Repository Pattern - Dependency Inversion Principle (DIP)
class BackgroundRepository {
  async getBackgrounds(
    params: BackgroundQueryParams
  ): Promise<BackgroundListResponse> {
    try {
      return await BackgroundService.getBackgrounds(params);
    } catch (error) {
      console.error("Error fetching backgrounds:", error);
      // Return empty result instead of throwing
      return {
        data: [],
        total: 0,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: 0,
      };
    }
  }

  async getBackgroundById(id: string): Promise<Background> {
    try {
      return await BackgroundService.getBackgroundById(id);
    } catch (error) {
      console.error("Error fetching background by id:", error);
      throw error;
    }
  }

  async getBackgroundsByProduct(productId: string): Promise<Background[]> {
    try {
      return await BackgroundService.getBackgroundsByProduct(productId);
    } catch (error) {
      console.error("Error fetching backgrounds by product:", error);
      return [];
    }
  }
}

// Singleton instance
const backgroundRepository = new BackgroundRepository();

// Query Hooks following existing pattern
export const useBackgrounds = (params: BackgroundQueryParams) => {
  return useQuery({
    queryKey: [BACKGROUND_CONSTANTS.CACHE_KEYS.BACKGROUNDS, params],
    queryFn: () => backgroundRepository.getBackgrounds(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    throwOnError: false, // Don't throw errors, handle them in UI
  });
};

export const useBackgroundById = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: [BACKGROUND_CONSTANTS.CACHE_KEYS.BACKGROUND_DETAIL, id],
    queryFn: () => backgroundRepository.getBackgroundById(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    throwOnError: false,
  });
};

export const useBackgroundsByProduct = (
  productId: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [
      BACKGROUND_CONSTANTS.CACHE_KEYS.BACKGROUNDS_BY_PRODUCT,
      productId,
    ],
    queryFn: () => backgroundRepository.getBackgroundsByProduct(productId),
    enabled: enabled && !!productId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    throwOnError: false,
  });
};

// Legacy exports for backward compatibility
export const useBackgroundsList = useBackgrounds;
export const useBackground = useBackgroundById;
