import http from "../../../libs/http.libs";
import { API_PATHS } from "../../../constants/api-path.constants";
import type {
  Information,
  CreateInformationRequest,
  UpdateInformationRequest,
  InformationListResponse,
  InformationQueryParams,
} from "../types/information.types";

/**
 * Information Services - Single Responsibility Principle (SRP)
 * Each function has a single responsibility for handling API calls
 */

export class InformationService {
  // Get informations with pagination
  static async getInformations(
    params?: InformationQueryParams
  ): Promise<InformationListResponse> {
    const response = await http.get(API_PATHS.INFORMATIONS, { params });

    // Handle different response formats
    if (response.data?.data && Array.isArray(response.data.data)) {
      return {
        data: response.data.data,
        total: response.data.total || response.data.data.length,
        page: response.data.page || params?.page || 1,
        limit: response.data.limit || params?.limit || 10,
        totalPages:
          response.data.totalPages ||
          Math.ceil(
            (response.data.total || response.data.data.length) /
              (params?.limit || 10)
          ),
      };
    }

    // Direct array format
    if (Array.isArray(response.data)) {
      return {
        data: response.data,
        total: response.data.length,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: Math.ceil(response.data.length / (params?.limit || 10)),
      };
    }

    throw new Error("Invalid API response format");
  }

  // Get single information by ID
  static async getInformationById(id: string): Promise<Information> {
    const response = await http.get(API_PATHS.INFORMATION_BY_ID(id));
    return response.data?.data || response.data;
  }

  // Create new information
  static async createInformation(
    data: CreateInformationRequest
  ): Promise<Information> {
    const response = await http.post(API_PATHS.INFORMATIONS, data);
    return response.data?.data || response.data;
  }

  // Update existing information
  static async updateInformation(
    data: UpdateInformationRequest
  ): Promise<Information> {
    const { id, ...updateData } = data;
    const response = await http.patch(
      API_PATHS.INFORMATION_BY_ID(id),
      updateData
    );
    return response.data?.data || response.data;
  }

  // Delete information
  static async deleteInformation(id: string): Promise<{ message: string }> {
    const response = await http.delete(API_PATHS.INFORMATION_BY_ID(id));
    return response.data;
  }
}

// Export individual functions for backward compatibility
export const getInformations = InformationService.getInformations;
export const getInformationById = InformationService.getInformationById;
export const createInformation = InformationService.createInformation;
export const updateInformation = InformationService.updateInformation;
export const deleteInformation = InformationService.deleteInformation;
