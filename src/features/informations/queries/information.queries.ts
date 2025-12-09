import { useQuery } from "@tanstack/react-query";
import { InformationService } from "../services/information.services";
import { INFORMATION_CONSTANTS } from "../constants/information.constants";
import type {
  Information,
  InformationListResponse,
  InformationQueryParams,
} from "../types/information.types";

// Repository Pattern - Dependency Inversion Principle (DIP)
class InformationRepository {
  async getInformations(
    params: InformationQueryParams
  ): Promise<InformationListResponse> {
    try {
      return await InformationService.getInformations(params);
    } catch (error) {
      console.error("Error fetching informations:", error);
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

  async getInformationById(id: string): Promise<Information> {
    try {
      return await InformationService.getInformationById(id);
    } catch (error) {
      console.error("Error fetching information by id:", error);
      throw error;
    }
  }
}

// Singleton instance
const informationRepository = new InformationRepository();

// Query Hooks following existing pattern
export const useInformations = (params: InformationQueryParams) => {
  return useQuery({
    queryKey: [INFORMATION_CONSTANTS.CACHE_KEYS.INFORMATIONS, params],
    queryFn: () => informationRepository.getInformations(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    throwOnError: false, // Don't throw errors, handle them in UI
  });
};

export const useInformationById = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: [INFORMATION_CONSTANTS.CACHE_KEYS.INFORMATION_DETAIL, id],
    queryFn: () => informationRepository.getInformationById(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    throwOnError: false,
  });
};

// Legacy exports for backward compatibility
export const useInformationsList = useInformations;
export const useInformation = useInformationById;
