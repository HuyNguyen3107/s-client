import { useState, useCallback } from "react";
import type {
  IShippingFeeFormData,
  IShippingFeeFormErrors,
  ValidationResult,
  IShippingFeeValidator,
} from "../types";
import {
  SHIPPING_FEE_VALIDATION,
  SHIPPING_FEE_ERROR_MESSAGES,
} from "../constants";

/**
 * Validator class following Single Responsibility Principle
 * This class only handles validation logic
 */
class ShippingFeeValidator implements IShippingFeeValidator {
  validateShippingFeeForm(data: IShippingFeeFormData): ValidationResult {
    const errors: IShippingFeeFormErrors = {};

    // Validate shipping type
    if (!this.validateShippingType(data.shippingType)) {
      if (!data.shippingType.trim()) {
        errors.shippingType =
          SHIPPING_FEE_ERROR_MESSAGES.SHIPPING_TYPE_REQUIRED;
      } else if (
        data.shippingType.trim().length <
        SHIPPING_FEE_VALIDATION.MIN_SHIPPING_TYPE_LENGTH
      ) {
        errors.shippingType =
          SHIPPING_FEE_ERROR_MESSAGES.SHIPPING_TYPE_TOO_SHORT;
      } else if (
        data.shippingType.trim().length >
        SHIPPING_FEE_VALIDATION.MAX_SHIPPING_TYPE_LENGTH
      ) {
        errors.shippingType =
          SHIPPING_FEE_ERROR_MESSAGES.SHIPPING_TYPE_TOO_LONG;
      }
    }

    // Validate area
    if (!this.validateArea(data.area)) {
      if (!data.area.trim()) {
        errors.area = SHIPPING_FEE_ERROR_MESSAGES.AREA_REQUIRED;
      } else if (
        data.area.trim().length < SHIPPING_FEE_VALIDATION.MIN_AREA_LENGTH
      ) {
        errors.area = SHIPPING_FEE_ERROR_MESSAGES.AREA_TOO_SHORT;
      } else if (
        data.area.trim().length > SHIPPING_FEE_VALIDATION.MAX_AREA_LENGTH
      ) {
        errors.area = SHIPPING_FEE_ERROR_MESSAGES.AREA_TOO_LONG;
      }
    }

    // Validate estimated delivery time
    if (!this.validateEstimatedDeliveryTime(data.estimatedDeliveryTime)) {
      if (!data.estimatedDeliveryTime.trim()) {
        errors.estimatedDeliveryTime =
          SHIPPING_FEE_ERROR_MESSAGES.ESTIMATED_DELIVERY_TIME_REQUIRED;
      } else if (
        data.estimatedDeliveryTime.trim().length <
        SHIPPING_FEE_VALIDATION.MIN_DELIVERY_TIME_LENGTH
      ) {
        errors.estimatedDeliveryTime =
          SHIPPING_FEE_ERROR_MESSAGES.ESTIMATED_DELIVERY_TIME_TOO_SHORT;
      } else if (
        data.estimatedDeliveryTime.trim().length >
        SHIPPING_FEE_VALIDATION.MAX_DELIVERY_TIME_LENGTH
      ) {
        errors.estimatedDeliveryTime =
          SHIPPING_FEE_ERROR_MESSAGES.ESTIMATED_DELIVERY_TIME_TOO_LONG;
      }
    }

    // Validate shipping fee
    if (!this.validateShippingFee(data.shippingFee)) {
      if (!data.shippingFee && data.shippingFee !== 0) {
        errors.shippingFee = SHIPPING_FEE_ERROR_MESSAGES.SHIPPING_FEE_REQUIRED;
      } else {
        const fee =
          typeof data.shippingFee === "string"
            ? parseFloat(data.shippingFee)
            : data.shippingFee;
        if (isNaN(fee)) {
          errors.shippingFee = SHIPPING_FEE_ERROR_MESSAGES.SHIPPING_FEE_INVALID;
        } else if (fee < SHIPPING_FEE_VALIDATION.MIN_SHIPPING_FEE) {
          errors.shippingFee = SHIPPING_FEE_ERROR_MESSAGES.SHIPPING_FEE_TOO_LOW;
        } else if (fee > SHIPPING_FEE_VALIDATION.MAX_SHIPPING_FEE) {
          errors.shippingFee =
            SHIPPING_FEE_ERROR_MESSAGES.SHIPPING_FEE_TOO_HIGH;
        }
      }
    }

    // Validate notes (optional)
    if (
      data.notesOrRemarks &&
      data.notesOrRemarks.length > SHIPPING_FEE_VALIDATION.MAX_NOTES_LENGTH
    ) {
      errors.notesOrRemarks = SHIPPING_FEE_ERROR_MESSAGES.NOTES_TOO_LONG;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  validateShippingType(shippingType: string): boolean {
    if (!shippingType || !shippingType.trim()) return false;
    const trimmed = shippingType.trim();
    return (
      trimmed.length >= SHIPPING_FEE_VALIDATION.MIN_SHIPPING_TYPE_LENGTH &&
      trimmed.length <= SHIPPING_FEE_VALIDATION.MAX_SHIPPING_TYPE_LENGTH
    );
  }

  validateArea(area: string): boolean {
    if (!area || !area.trim()) return false;
    const trimmed = area.trim();
    return (
      trimmed.length >= SHIPPING_FEE_VALIDATION.MIN_AREA_LENGTH &&
      trimmed.length <= SHIPPING_FEE_VALIDATION.MAX_AREA_LENGTH
    );
  }

  validateShippingFee(fee: number | string): boolean {
    if (fee === null || fee === undefined) return false;
    const numericFee = typeof fee === "string" ? parseFloat(fee) : fee;
    if (isNaN(numericFee)) return false;
    return (
      numericFee >= SHIPPING_FEE_VALIDATION.MIN_SHIPPING_FEE &&
      numericFee <= SHIPPING_FEE_VALIDATION.MAX_SHIPPING_FEE
    );
  }

  validateEstimatedDeliveryTime(time: string): boolean {
    if (!time || !time.trim()) return false;
    const trimmed = time.trim();
    return (
      trimmed.length >= SHIPPING_FEE_VALIDATION.MIN_DELIVERY_TIME_LENGTH &&
      trimmed.length <= SHIPPING_FEE_VALIDATION.MAX_DELIVERY_TIME_LENGTH
    );
  }

  validateDateRange(startDate: string, endDate?: string): boolean {
    if (!startDate) return false;
    if (!endDate) return true;

    const start = new Date(startDate);
    const end = new Date(endDate);
    return start <= end;
  }
}

// Create singleton instance
const validator = new ShippingFeeValidator();

/**
 * Custom hook for form validation
 * Following Single Responsibility Principle - only handles form validation state
 */
export const useShippingFeeValidation = () => {
  const [errors, setErrors] = useState<IShippingFeeFormErrors>({});
  const [isValid, setIsValid] = useState(false);

  const validateForm = useCallback((data: IShippingFeeFormData) => {
    const result = validator.validateShippingFeeForm(data);
    setErrors(result.errors);
    setIsValid(result.isValid);
    return result;
  }, []);

  const validateField = useCallback(
    (field: keyof IShippingFeeFormData, value: any) => {
      const newErrors = { ...errors };

      switch (field) {
        case "shippingType":
          if (!validator.validateShippingType(value)) {
            if (!value.trim()) {
              newErrors.shippingType =
                SHIPPING_FEE_ERROR_MESSAGES.SHIPPING_TYPE_REQUIRED;
            } else if (
              value.trim().length <
              SHIPPING_FEE_VALIDATION.MIN_SHIPPING_TYPE_LENGTH
            ) {
              newErrors.shippingType =
                SHIPPING_FEE_ERROR_MESSAGES.SHIPPING_TYPE_TOO_SHORT;
            } else {
              newErrors.shippingType =
                SHIPPING_FEE_ERROR_MESSAGES.SHIPPING_TYPE_TOO_LONG;
            }
          } else {
            delete newErrors.shippingType;
          }
          break;

        case "area":
          if (!validator.validateArea(value)) {
            if (!value.trim()) {
              newErrors.area = SHIPPING_FEE_ERROR_MESSAGES.AREA_REQUIRED;
            } else if (
              value.trim().length < SHIPPING_FEE_VALIDATION.MIN_AREA_LENGTH
            ) {
              newErrors.area = SHIPPING_FEE_ERROR_MESSAGES.AREA_TOO_SHORT;
            } else {
              newErrors.area = SHIPPING_FEE_ERROR_MESSAGES.AREA_TOO_LONG;
            }
          } else {
            delete newErrors.area;
          }
          break;

        case "estimatedDeliveryTime":
          if (!validator.validateEstimatedDeliveryTime(value)) {
            if (!value.trim()) {
              newErrors.estimatedDeliveryTime =
                SHIPPING_FEE_ERROR_MESSAGES.ESTIMATED_DELIVERY_TIME_REQUIRED;
            } else if (
              value.trim().length <
              SHIPPING_FEE_VALIDATION.MIN_DELIVERY_TIME_LENGTH
            ) {
              newErrors.estimatedDeliveryTime =
                SHIPPING_FEE_ERROR_MESSAGES.ESTIMATED_DELIVERY_TIME_TOO_SHORT;
            } else {
              newErrors.estimatedDeliveryTime =
                SHIPPING_FEE_ERROR_MESSAGES.ESTIMATED_DELIVERY_TIME_TOO_LONG;
            }
          } else {
            delete newErrors.estimatedDeliveryTime;
          }
          break;

        case "shippingFee":
          if (!validator.validateShippingFee(value)) {
            if (!value && value !== 0) {
              newErrors.shippingFee =
                SHIPPING_FEE_ERROR_MESSAGES.SHIPPING_FEE_REQUIRED;
            } else {
              const fee = typeof value === "string" ? parseFloat(value) : value;
              if (isNaN(fee)) {
                newErrors.shippingFee =
                  SHIPPING_FEE_ERROR_MESSAGES.SHIPPING_FEE_INVALID;
              } else if (fee < SHIPPING_FEE_VALIDATION.MIN_SHIPPING_FEE) {
                newErrors.shippingFee =
                  SHIPPING_FEE_ERROR_MESSAGES.SHIPPING_FEE_TOO_LOW;
              } else {
                newErrors.shippingFee =
                  SHIPPING_FEE_ERROR_MESSAGES.SHIPPING_FEE_TOO_HIGH;
              }
            }
          } else {
            delete newErrors.shippingFee;
          }
          break;

        case "notesOrRemarks":
          if (
            value &&
            value.length > SHIPPING_FEE_VALIDATION.MAX_NOTES_LENGTH
          ) {
            newErrors.notesOrRemarks =
              SHIPPING_FEE_ERROR_MESSAGES.NOTES_TOO_LONG;
          } else {
            delete newErrors.notesOrRemarks;
          }
          break;
      }

      setErrors(newErrors);
      setIsValid(Object.keys(newErrors).length === 0);
      return Object.keys(newErrors).length === 0;
    },
    [errors]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
    setIsValid(false);
  }, []);

  const clearFieldError = useCallback(
    (field: keyof IShippingFeeFormErrors) => {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
      setIsValid(Object.keys(newErrors).length === 0);
    },
    [errors]
  );

  return {
    errors,
    isValid,
    validateForm,
    validateField,
    clearErrors,
    clearFieldError,
  };
};

/**
 * Custom hook for form state management
 * Following Single Responsibility Principle - only handles form state
 */
export const useShippingFeeForm = (
  initialData?: Partial<IShippingFeeFormData>
) => {
  const [formData, setFormData] = useState<IShippingFeeFormData>({
    shippingType: "",
    area: "",
    estimatedDeliveryTime: "",
    shippingFee: "",
    notesOrRemarks: "",
    ...initialData,
  });

  const [isDirty, setIsDirty] = useState(false);

  const updateField = useCallback(
    (field: keyof IShippingFeeFormData, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      setIsDirty(true);
    },
    []
  );

  const updateFormData = useCallback((data: Partial<IShippingFeeFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
    setIsDirty(true);
  }, []);

  const resetForm = useCallback((newData?: Partial<IShippingFeeFormData>) => {
    setFormData({
      shippingType: "",
      area: "",
      estimatedDeliveryTime: "",
      shippingFee: "",
      notesOrRemarks: "",
      ...newData,
    });
    setIsDirty(false);
  }, []);

  const getSubmitData = useCallback((): IShippingFeeFormData => {
    return {
      ...formData,
      shippingType: formData.shippingType.trim(),
      area: formData.area.trim(),
      estimatedDeliveryTime: formData.estimatedDeliveryTime.trim(),
      notesOrRemarks: formData.notesOrRemarks?.trim() || undefined,
    };
  }, [formData]);

  return {
    formData,
    isDirty,
    updateField,
    updateFormData,
    resetForm,
    getSubmitData,
  };
};

// Export validator instance for direct use
export { validator as shippingFeeValidator };
