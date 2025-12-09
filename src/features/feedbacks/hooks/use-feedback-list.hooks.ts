import { useState } from "react";
import { useFeedbacks } from "../queries/feedback.queries";
import { useDeleteFeedbackMutation } from "../mutations/feedback.mutations";
import type { FeedbackQueryParams } from "../types/feedback.types";
import { FEEDBACK_CONSTANTS } from "../constants/feedback.constants";

export const useFeedbackList = () => {
  const [params, setParams] = useState<FeedbackQueryParams>({
    page: 1,
    limit: FEEDBACK_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data, isLoading, error } = useFeedbacks(params);
  const deleteMutation = useDeleteFeedbackMutation();

  const updateParams = (newParams: Partial<FeedbackQueryParams>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  const deleteFeedback = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  return {
    data,
    isLoading,
    error,
    params,
    updateParams,
    deleteFeedback,
    deleting: deleteMutation.isPending,
  };
};
