/**
 * Profile Hooks
 * Following Single Responsibility Principle
 */

import { useState, useCallback } from "react";
import { useUpdateProfile } from "../mutations/profile.mutations";
import { useUserProfile } from "../../../hooks/use-user-profile.hooks";
import { ProfileValidator } from "../utils/profile.validator";
import type {
  UpdateProfileFormData,
  ProfileFormErrors,
  UpdateProfileRequest,
} from "../types";

/**
 * Custom hook for profile form management
 */
export const useProfileForm = () => {
  const { data: profile, isLoading, isError, error } = useUserProfile();
  const updateProfileMutation = useUpdateProfile();

  const [formData, setFormData] = useState<UpdateProfileFormData>(() => ({
    name: profile?.name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  }));

  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  // Update form when profile data is loaded
  const updateFormFromProfile = useCallback(() => {
    if (profile) {
      setFormData((prev: UpdateProfileFormData) => ({
        ...prev,
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
      }));
    }
  }, [profile]);

  // Update field
  const updateField = useCallback(
    (field: keyof UpdateProfileFormData, value: string) => {
      setFormData((prev: UpdateProfileFormData) => ({
        ...prev,
        [field]: value,
      }));

      // Clear error for this field
      setErrors((prev: ProfileFormErrors) => ({
        ...prev,
        [field]: undefined,
      }));
    },
    []
  );

  // Validate form
  const validateForm = useCallback((): boolean => {
    const validationErrors = ProfileValidator.validateForm(formData);
    setErrors(validationErrors);
    return !ProfileValidator.hasErrors(validationErrors);
  }, [formData]);

  // Reset form
  const resetForm = useCallback(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
    setErrors({});
    setIsEditingPassword(false);
  }, [profile]);

  // Reset password fields
  const resetPasswordFields = useCallback(() => {
    setFormData((prev: UpdateProfileFormData) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
    setErrors((prev: ProfileFormErrors) => ({
      ...prev,
      currentPassword: undefined,
      newPassword: undefined,
      confirmPassword: undefined,
    }));
    setIsEditingPassword(false);
  }, []);

  // Get request data
  const getRequestData = useCallback((): UpdateProfileRequest => {
    const data: UpdateProfileRequest = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
    };

    // Only include password if user is changing it
    if (formData.newPassword && formData.currentPassword) {
      data.password = formData.newPassword;
      data.currentPassword = formData.currentPassword;
    }

    return data;
  }, [formData]);

  // Submit form
  const submitForm = useCallback(async () => {
    if (!validateForm()) {
      return {
        success: false,
        error: new Error("Form validation failed"),
      };
    }

    try {
      const requestData = getRequestData();
      await updateProfileMutation.mutateAsync(requestData);

      // Reset password fields after successful update
      if (isEditingPassword) {
        resetPasswordFields();
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error as Error,
      };
    }
  }, [
    validateForm,
    getRequestData,
    updateProfileMutation,
    isEditingPassword,
    resetPasswordFields,
  ]);

  return {
    profile,
    formData,
    errors,
    isLoading,
    isError,
    error,
    isEditingPassword,
    isUpdating: updateProfileMutation.isPending,
    updateField,
    validateForm,
    resetForm,
    resetPasswordFields,
    submitForm,
    setIsEditingPassword,
    updateFormFromProfile,
  };
};
