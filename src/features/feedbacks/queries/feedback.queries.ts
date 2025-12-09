import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../constants/query-key.constants";
import {
  getFeedbacks,
  getFeedbackById,
  getFeedbackStatistics,
} from "../services/feedback.services";
import type { FeedbackQueryParams } from "../types/feedback.types";

export const useFeedbacks = (params?: FeedbackQueryParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.FEEDBACKS, params],
    queryFn: () => getFeedbacks(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFeedbackById = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.FEEDBACK_BY_ID, id],
    queryFn: () => getFeedbackById(id),
    enabled: !!id,
  });
};

export const useFeedbackStatistics = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.FEEDBACK_STATISTICS],
    queryFn: getFeedbackStatistics,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
