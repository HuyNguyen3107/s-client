import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../constants/query-key.constants";
import {
  getPromotions,
  getPromotionById,
  getPromotionByCode,
  getActivePromotions,
  getPromotionStatistics,
} from "../services/promotion.services";
import type { PromotionQueryParams } from "../types/promotion.types";

export const usePromotions = (params?: PromotionQueryParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROMOTIONS, params],
    queryFn: () => getPromotions(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePromotionById = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROMOTION_BY_ID, id],
    queryFn: () => getPromotionById(id),
    enabled: !!id,
  });
};

export const usePromotionByCode = (promoCode: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROMOTION_BY_CODE, promoCode],
    queryFn: () => getPromotionByCode(promoCode),
    enabled: !!promoCode,
  });
};

export const useActivePromotions = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ACTIVE_PROMOTIONS],
    queryFn: getActivePromotions,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const usePromotionStatistics = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROMOTION_STATISTICS],
    queryFn: getPromotionStatistics,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};
