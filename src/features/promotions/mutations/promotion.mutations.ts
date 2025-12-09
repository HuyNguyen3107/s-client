import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../constants/query-key.constants";
import { MUTATION_KEYS } from "../../../constants/mutation-key.constants";
import {
  createPromotion,
  updatePromotion,
  deletePromotion,
  validatePromotion,
  applyPromotion,
} from "../services/promotion.services";
import type {
  CreatePromotionRequest,
  UpdatePromotionRequest,
  ValidatePromotionRequest,
} from "../types/promotion.types";
import { PROMOTION_MESSAGES } from "../constants/promotion.constants";
import { useToastStore } from "../../../store/toast.store";

export const useCreatePromotionMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationKey: [MUTATION_KEYS.CREATE_PROMOTION],
    mutationFn: (data: CreatePromotionRequest) => createPromotion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROMOTIONS] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ACTIVE_PROMOTIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PROMOTION_STATISTICS],
      });
      showToast(PROMOTION_MESSAGES.SUCCESS.CREATE, "success");
    },
    onError: (error: any) => {
      showToast(
        error?.response?.data?.message || PROMOTION_MESSAGES.ERROR.CREATE,
        "error"
      );
    },
  });
};

export const useUpdatePromotionMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationKey: [MUTATION_KEYS.UPDATE_PROMOTION],
    mutationFn: ({ id, data }: { id: string; data: UpdatePromotionRequest }) =>
      updatePromotion(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROMOTIONS] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PROMOTION_BY_ID, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ACTIVE_PROMOTIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PROMOTION_STATISTICS],
      });
      showToast(PROMOTION_MESSAGES.SUCCESS.UPDATE, "success");
    },
    onError: (error: any) => {
      showToast(
        error?.response?.data?.message || PROMOTION_MESSAGES.ERROR.UPDATE,
        "error"
      );
    },
  });
};

export const useDeletePromotionMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationKey: [MUTATION_KEYS.DELETE_PROMOTION],
    mutationFn: (id: string) => deletePromotion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROMOTIONS] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ACTIVE_PROMOTIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PROMOTION_STATISTICS],
      });
      showToast(PROMOTION_MESSAGES.SUCCESS.DELETE, "success");
    },
    onError: (error: any) => {
      showToast(
        error?.response?.data?.message || PROMOTION_MESSAGES.ERROR.DELETE,
        "error"
      );
    },
  });
};

export const useValidatePromotionMutation = () => {
  const { showToast } = useToastStore();

  return useMutation({
    mutationKey: [MUTATION_KEYS.VALIDATE_PROMOTION],
    mutationFn: (data: ValidatePromotionRequest) => validatePromotion(data),
    onSuccess: (result) => {
      if (result.isValid) {
        showToast(PROMOTION_MESSAGES.SUCCESS.VALIDATE, "success");
      } else {
        showToast(result.error || PROMOTION_MESSAGES.ERROR.VALIDATE, "error");
      }
    },
    onError: (error: any) => {
      showToast(
        error?.response?.data?.message || PROMOTION_MESSAGES.ERROR.VALIDATE,
        "error"
      );
    },
  });
};

export const useApplyPromotionMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationKey: [MUTATION_KEYS.APPLY_PROMOTION],
    mutationFn: (promoCode: string) => applyPromotion(promoCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROMOTIONS] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PROMOTION_STATISTICS],
      });
      showToast(PROMOTION_MESSAGES.SUCCESS.APPLY, "success");
    },
    onError: (error: any) => {
      showToast(
        error?.response?.data?.message || PROMOTION_MESSAGES.ERROR.VALIDATE,
        "error"
      );
    },
  });
};
