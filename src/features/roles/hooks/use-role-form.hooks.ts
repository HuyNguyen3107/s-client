import { useState, useCallback } from "react";
import type { RoleFormData, RoleFormErrors } from "../types";
import { ROLE_CONSTANTS } from "../constants";

/**
 * Role Form Hook - following Single Responsibility Principle
 * Handles form state, validation, and submission for role forms
 */
export const useRoleForm = (initialData?: Partial<RoleFormData>) => {
  const [formData, setFormData] = useState<RoleFormData>({
    name: initialData?.name || "",
    permissionIds: initialData?.permissionIds || [],
  });

  const [errors, setErrors] = useState<RoleFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation function
  const validateForm = useCallback((data: RoleFormData): RoleFormErrors => {
    const newErrors: RoleFormErrors = {};

    // Validate name
    if (!data.name.trim()) {
      newErrors.name = ROLE_CONSTANTS.ERROR_MESSAGES.ROLE_NAME_REQUIRED;
    } else if (
      data.name.trim().length < ROLE_CONSTANTS.VALIDATION.NAME_MIN_LENGTH
    ) {
      newErrors.name = ROLE_CONSTANTS.ERROR_MESSAGES.ROLE_NAME_TOO_SHORT;
    } else if (
      data.name.trim().length > ROLE_CONSTANTS.VALIDATION.NAME_MAX_LENGTH
    ) {
      newErrors.name = ROLE_CONSTANTS.ERROR_MESSAGES.ROLE_NAME_TOO_LONG;
    } else if (
      !/^[a-zA-Z0-9\s\u00C0-\u024F\u1E00-\u1EFF]+$/.test(data.name.trim())
    ) {
      newErrors.name = ROLE_CONSTANTS.ERROR_MESSAGES.ROLE_NAME_INVALID_CHARS;
    }

    return newErrors;
  }, []);

  // Update form field
  const updateField = useCallback(
    (field: keyof RoleFormData, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear error for this field when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    },
    [errors]
  );

  // Update name field
  const updateName = useCallback(
    (name: string) => {
      updateField("name", name);
    },
    [updateField]
  );

  // Update permissions
  const updatePermissions = useCallback(
    (permissionIds: string[]) => {
      updateField("permissionIds", permissionIds);
    },
    [updateField]
  );

  // Toggle permission
  const togglePermission = useCallback((permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permissionId)
        ? prev.permissionIds.filter((id) => id !== permissionId)
        : [...prev.permissionIds, permissionId],
    }));
  }, []);

  // Validate current form
  const validate = useCallback(() => {
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateForm]);

  // Reset form
  const reset = useCallback((newData?: Partial<RoleFormData>) => {
    setFormData({
      name: newData?.name || "",
      permissionIds: newData?.permissionIds || [],
    });
    setErrors({});
    setIsSubmitting(false);
  }, []);

  // Set submitting state
  const setSubmitting = useCallback((submitting: boolean) => {
    setIsSubmitting(submitting);
  }, []);

  // Set general error
  const setGeneralError = useCallback((error: string) => {
    setErrors((prev) => ({
      ...prev,
      general: error,
    }));
  }, []);

  // Clear errors
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    isSubmitting,

    // Actions
    updateField,
    updateName,
    updatePermissions,
    togglePermission,
    validate,
    reset,
    setSubmitting,
    setGeneralError,
    clearErrors,

    // Computed
    isValid: Object.keys(errors).length === 0,
    hasChanges: Boolean(
      formData.name.trim() || formData.permissionIds.length > 0
    ),
  };
};
