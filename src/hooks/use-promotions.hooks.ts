import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants/query-key.constants";
import { API_PATHS } from "../constants/api-path.constants";
import http from "../libs/http.libs";

interface Promotion {
  id: string;
  title: string;
  description: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT";
  value: number;
  minOrderValue: number;
  maxDiscountAmount?: number;
  promoCode: string;
  startDate: string;
  endDate?: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

const fetchActivePromotions = async (): Promise<Promotion[]> => {
  const response = await http.get<ApiResponse<Promotion[]>>(
    API_PATHS.ACTIVE_PROMOTIONS
  );
  return response.data.data || [];
};

export const useActivePromotions = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ACTIVE_PROMOTIONS],
    queryFn: fetchActivePromotions,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
};
