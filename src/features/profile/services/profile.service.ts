/**
 * Profile Service
 * Following Single Responsibility Principle
 */

import type { UserProfile, UpdateProfileRequest, ApiResponse } from "../types";
import { API_PATHS } from "../../../constants/api-path.constants";
import http from "../../../libs/http.libs";

export interface IProfileService {
  getProfile(): Promise<UserProfile>;
  updateProfile(data: UpdateProfileRequest): Promise<UserProfile>;
}

/**
 * Profile Service Implementation
 */
export class ProfileService implements IProfileService {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await http.get<ApiResponse<UserProfile>>(
        API_PATHS.USER_PROFILE
      );

      if (!response.data.data) {
        throw new Error("Failed to fetch profile");
      }

      return response.data.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch profile");
    }
  }

  /**
   * Update current user profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    try {
      // Get current profile to get user ID
      const currentProfile = await this.getProfile();

      const response = await http.patch<ApiResponse<UserProfile>>(
        `${API_PATHS.USERS}/${currentProfile.id}`,
        data
      );

      if (!response.data.data) {
        throw new Error("Failed to update profile");
      }

      return response.data.data;
    } catch (error) {
      throw this.handleError(error, "Failed to update profile");
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

// Singleton instance
export const profileService = new ProfileService();
