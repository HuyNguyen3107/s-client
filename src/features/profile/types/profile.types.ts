/**
 * Profile Types
 * Following Single Responsibility Principle
 */

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  isActive: boolean;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  currentPassword?: string;
}

export interface UpdateProfileFormData {
  name: string;
  email: string;
  phone: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface ProfileFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface ApiResponse<T = any> {
  message: string;
  data: T;
}
