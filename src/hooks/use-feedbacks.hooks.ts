import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants/query-key.constants";
import { API_PATHS } from "../constants/api-path.constants";
import http from "../libs/http.libs";

interface Feedback {
  id: string;
  customerName: string;
  content: string;
  imageUrl: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

interface FeedbackQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  rating?: number;
}

interface FeedbackListResponse {
  data: Feedback[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const fetchFeedbacks = async (
  params?: FeedbackQueryParams
): Promise<FeedbackListResponse> => {
  const response = await http.get(API_PATHS.FEEDBACKS, { params });
  return response.data;
};

export const useFeedbacks = (params?: FeedbackQueryParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.FEEDBACKS, params],
    queryFn: () => fetchFeedbacks(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
