import { useState, useEffect } from "react";
import { usePromotionById } from "../queries/promotion.queries";
import {
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
} from "../mutations/promotion.mutations";
import { PromotionType } from "../types/promotion.types";
import type {
  CreatePromotionRequest,
  UpdatePromotionRequest,
  IPromotionFormData,
  ValidationResult,
  IPromotionValidator,
} from "../types/promotion.types";
import {
  PROMOTION_CONSTANTS,
  PROMOTION_MESSAGES,
} from "../constants/promotion.constants";

// Promotion validator following Single Responsibility Principle
class PromotionValidator implements IPromotionValidator {
  validatePromotionForm(data: IPromotionFormData): ValidationResult {
    const errors: Record<string, string> = {};

    // Title validation
    if (!data.title.trim()) {
      errors.title = PROMOTION_MESSAGES.VALIDATION.REQUIRED_TITLE;
    } else if (
      data.title.length < PROMOTION_CONSTANTS.VALIDATION.MIN_TITLE_LENGTH ||
      data.title.length > PROMOTION_CONSTANTS.VALIDATION.MAX_TITLE_LENGTH
    ) {
      errors.title = PROMOTION_MESSAGES.VALIDATION.TITLE_LENGTH;
    }

    // Description validation
    if (!data.description.trim()) {
      errors.description = PROMOTION_MESSAGES.VALIDATION.REQUIRED_DESCRIPTION;
    } else if (
      data.description.length <
        PROMOTION_CONSTANTS.VALIDATION.MIN_DESCRIPTION_LENGTH ||
      data.description.length >
        PROMOTION_CONSTANTS.VALIDATION.MAX_DESCRIPTION_LENGTH
    ) {
      errors.description = PROMOTION_MESSAGES.VALIDATION.DESCRIPTION_LENGTH;
    }

    // Promo code validation
    if (!data.promoCode.trim()) {
      errors.promoCode = PROMOTION_MESSAGES.VALIDATION.REQUIRED_PROMO_CODE;
    } else if (!this.validatePromoCode(data.promoCode)) {
      errors.promoCode = PROMOTION_MESSAGES.VALIDATION.PROMO_CODE_FORMAT;
    } else if (
      data.promoCode.length <
        PROMOTION_CONSTANTS.VALIDATION.MIN_PROMO_CODE_LENGTH ||
      data.promoCode.length >
        PROMOTION_CONSTANTS.VALIDATION.MAX_PROMO_CODE_LENGTH
    ) {
      errors.promoCode = PROMOTION_MESSAGES.VALIDATION.PROMO_CODE_LENGTH;
    }

    // Value validation
    if (Number(data.value) < PROMOTION_CONSTANTS.VALIDATION.MIN_VALUE) {
      errors.value = PROMOTION_MESSAGES.VALIDATION.INVALID_VALUE;
    } else if (
      data.type === PromotionType.PERCENTAGE &&
      Number(data.value) > PROMOTION_CONSTANTS.VALIDATION.MAX_PERCENTAGE_VALUE
    ) {
      errors.value = PROMOTION_MESSAGES.VALIDATION.PERCENTAGE_RANGE;
    }

    // Min order value validation
    if (
      Number(data.minOrderValue || 0) <
      PROMOTION_CONSTANTS.VALIDATION.MIN_ORDER_VALUE
    ) {
      errors.minOrderValue = PROMOTION_MESSAGES.VALIDATION.INVALID_MIN_ORDER;
    }

    // Max discount amount validation (optional)
    if (
      data.maxDiscountAmount &&
      Number(data.maxDiscountAmount) < PROMOTION_CONSTANTS.VALIDATION.MIN_VALUE
    ) {
      errors.maxDiscountAmount =
        PROMOTION_MESSAGES.VALIDATION.INVALID_MAX_DISCOUNT;
    }

    // Date range validation
    if (data.endDate && !this.validateDateRange(data.startDate, data.endDate)) {
      errors.endDate = PROMOTION_MESSAGES.VALIDATION.INVALID_DATE_RANGE;
    }

    // Usage limit validation
    // Usage limit is optional (empty means unlimited). When provided, it must be an integer > 0
    if (
      data.usageLimit !== undefined &&
      data.usageLimit !== null &&
      (typeof data.usageLimit === "string" ? data.usageLimit !== "" : true) &&
      Number(data.usageLimit) <= 0
    ) {
      errors.usageLimit = PROMOTION_MESSAGES.VALIDATION.INVALID_USAGE_LIMIT;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  validatePromoCode(promoCode: string): boolean {
    const promoCodeRegex = /^[A-Z0-9_]+$/;
    return promoCodeRegex.test(promoCode.toUpperCase());
  }

  validateDateRange(startDate: string, endDate?: string): boolean {
    if (!endDate) return true;
    return new Date(endDate) > new Date(startDate);
  }
}

const validator = new PromotionValidator();

export const usePromotionForm = (promotionId?: string) => {
  const [formData, setFormData] = useState<IPromotionFormData>({
    ...PROMOTION_CONSTANTS.FORM.DEFAULT_VALUES,
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const { data: existingPromotion, isLoading: loadingPromotion } =
    usePromotionById(promotionId || "");

  const createMutation = useCreatePromotionMutation();
  const updateMutation = useUpdatePromotionMutation();

  const isEditing = !!promotionId;
  const isLoading = loadingPromotion;
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Initialize form with existing data when editing
  useEffect(() => {
    if (existingPromotion && isEditing) {
      setFormData({
        title: existingPromotion.title,
        description: existingPromotion.description,
        type: existingPromotion.type,
        value: existingPromotion.value,
        minOrderValue: existingPromotion.minOrderValue,
        maxDiscountAmount: existingPromotion.maxDiscountAmount || "",
        startDate: existingPromotion.startDate.split("T")[0], // Convert to date input format
        endDate: existingPromotion.endDate
          ? existingPromotion.endDate.split("T")[0]
          : "",
        usageLimit: existingPromotion.usageLimit,
        promoCode: existingPromotion.promoCode,
        isActive: existingPromotion.isActive,
      });
    }
  }, [existingPromotion, isEditing]);

  const updateField = <K extends keyof IPromotionFormData>(
    field: K,
    value: IPromotionFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const result = validator.validatePromotionForm(formData);
    setValidationErrors(result.errors);
    return result.isValid;
  };

  const resetForm = () => {
    setFormData({ ...PROMOTION_CONSTANTS.FORM.DEFAULT_VALUES });
    setValidationErrors({});
  };

  // allow optionally passing an override id (useful when parent already has the promotion object)
  const submitForm = async (overrideId?: string): Promise<boolean> => {
    const isValid = validateForm();
    if (!isValid) {
      return false;
    }

    try {
      // Convert form data to API format
      const processedData = {
        ...formData,
        value: Number(formData.value) || 0,
        minOrderValue: Number(formData.minOrderValue) || 0,
        maxDiscountAmount: formData.maxDiscountAmount
          ? Number(formData.maxDiscountAmount)
          : undefined,
      };

      const idToUse = overrideId ?? promotionId;
      if (isEditing && idToUse) {
        const updateData: UpdatePromotionRequest = {
          ...processedData,
          usageLimit: processedData.usageLimit || undefined,
          endDate: processedData.endDate || undefined,
        };
        await updateMutation.mutateAsync({ id: idToUse, data: updateData });
        return true;
      } else {
        const createData: CreatePromotionRequest = {
          ...processedData,
          usageLimit: processedData.usageLimit || undefined,
          endDate: processedData.endDate || undefined,
        };
        await createMutation.mutateAsync(createData);
        resetForm();
        return true;
      }
    } catch (error) {
      // Error handling is done in the mutation
      return false;
      return false;
    }
  };

  return {
    // Form state
    formData,
    validationErrors,
    isEditing,
    isLoading,
    isSubmitting,

    // Form actions
    updateField,
    validateForm,
    resetForm,
    submitForm,

    // Existing promotion data
    existingPromotion,
  };
};
