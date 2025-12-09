import { useState } from "react";
import { useValidatePromotionMutation } from "../mutations/promotion.mutations";
import type {
  ValidatePromotionRequest,
  PromotionValidationResult,
} from "../types/promotion.types";

export const usePromotionValidator = () => {
  const [validationResult, setValidationResult] =
    useState<PromotionValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validateMutation = useValidatePromotionMutation();

  const validatePromotion = async (
    data: ValidatePromotionRequest
  ): Promise<PromotionValidationResult> => {
    setIsValidating(true);
    try {
      const result = await validateMutation.mutateAsync(data);
      setValidationResult(result);
      return result;
    } catch (error) {
      const errorResult: PromotionValidationResult = {
        isValid: false,
        error: "Có lỗi xảy ra khi xác thực mã giảm giá",
      };
      setValidationResult(errorResult);
      return errorResult;
    } finally {
      setIsValidating(false);
    }
  };

  const clearValidation = () => {
    setValidationResult(null);
  };

  return {
    validationResult,
    isValidating,
    validatePromotion,
    clearValidation,
  };
};
