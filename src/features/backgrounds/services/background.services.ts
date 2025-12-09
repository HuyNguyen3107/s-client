import http from "../../../libs/http.libs";
import { API_PATHS } from "../../../constants/api-path.constants";
import type {
  Background,
  CreateBackgroundRequest,
  UpdateBackgroundRequest,
  BackgroundListResponse,
  BackgroundQueryParams,
} from "../types/background.types";
import type { UploadImageResponse } from "../../feedbacks/types/feedback.types";

/**
 * Background Services - Single Responsibility Principle (SRP)
 * Each function has a single responsibility for handling API calls
 */

export class BackgroundService {
  // Get backgrounds with pagination and filters
  static async getBackgrounds(
    params?: BackgroundQueryParams
  ): Promise<BackgroundListResponse> {
    const response = await http.get(API_PATHS.BACKGROUNDS, { params });

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

  // Get backgrounds by product ID
  static async getBackgroundsByProduct(
    productId: string
  ): Promise<Background[]> {
    const response = await http.get(
      API_PATHS.BACKGROUNDS_BY_PRODUCT(productId)
    );

    // Handle wrapped response
    return response.data?.data || response.data || [];
  }

  // Get single background by ID
  static async getBackgroundById(id: string): Promise<Background> {
    const response = await http.get(API_PATHS.BACKGROUND_BY_ID(id));
    return response.data?.data || response.data;
  }

  // Create new background
  static async createBackground(
    data: CreateBackgroundRequest
  ): Promise<Background> {
    const response = await http.post(API_PATHS.BACKGROUNDS, data);
    return response.data?.data || response.data;
  }

  // Update existing background
  static async updateBackground(
    data: UpdateBackgroundRequest
  ): Promise<Background> {
    const { id, ...updateData } = data;
    const response = await http.patch(
      API_PATHS.BACKGROUND_BY_ID(id),
      updateData
    );
    return response.data?.data || response.data;
  }

  // Delete background
  static async deleteBackground(id: string): Promise<{ message: string }> {
    const response = await http.delete(API_PATHS.BACKGROUND_BY_ID(id));
    return response.data;
  }

  // Upload image service
  static async uploadImage(file: File): Promise<UploadImageResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await http.post(API_PATHS.UPLOAD_IMAGE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  // Delete image service
  static async deleteImage(publicId: string): Promise<UploadImageResponse> {
    const response = await http.delete(API_PATHS.DELETE_IMAGE(publicId));
    return response.data;
  }
}

// Export individual functions for backward compatibility
export const getBackgrounds = BackgroundService.getBackgrounds;
export const getBackgroundsByProduct =
  BackgroundService.getBackgroundsByProduct;
export const getBackgroundById = BackgroundService.getBackgroundById;
export const createBackground = BackgroundService.createBackground;
export const updateBackground = BackgroundService.updateBackground;
export const deleteBackground = BackgroundService.deleteBackground;
export const uploadBackgroundImage = BackgroundService.uploadImage;
export const deleteBackgroundImage = BackgroundService.deleteImage;
