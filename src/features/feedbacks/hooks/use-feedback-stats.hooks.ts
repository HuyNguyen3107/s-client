import { useFeedbackStatistics } from "../queries/feedback.queries";

export const useFeedbackStats = () => {
  const { data, isLoading, error } = useFeedbackStatistics();

  return {
    statistics: data,
    isLoading,
    error,
  };
};
