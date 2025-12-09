import { useQuery } from "@tanstack/react-query";
import http from "../libs/http.libs";
import { API_PATHS } from "../constants/api-path.constants";
import { QUERY_KEYS } from "../constants/query-key.constants";

interface RecentFeedback {
  id: string;
  customerName: string;
  content: string;
  rating: number;
  createdAt: string;
}

interface RecentActivity {
  id: string;
  type: "feedback" | "user" | "product" | "promotion";
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

// Fetch recent feedbacks to use as activities
const fetchRecentFeedbacks = async (): Promise<RecentFeedback[]> => {
  const response = await http.get(API_PATHS.FEEDBACKS, {
    params: { limit: 5, page: 1 },
  });
  return response.data?.data || [];
};

export const useRecentFeedbacks = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.FEEDBACKS, "recent"],
    queryFn: fetchRecentFeedbacks,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: false,
  });
};

// Transform feedbacks to activities format
export const useRecentActivities = () => {
  const feedbacksQuery = useRecentFeedbacks();

  const activities: RecentActivity[] =
    feedbacksQuery.data?.map((feedback) => ({
      id: feedback.id,
      type: "feedback" as const,
      title: `Đánh giá mới từ ${feedback.customerName}`,
      description:
        feedback.content.length > 50
          ? feedback.content.substring(0, 50) + "..."
          : feedback.content,
      timestamp: formatRelativeTime(feedback.createdAt),
      icon: "star",
    })) || [];

  return {
    data: activities,
    isLoading: feedbacksQuery.isLoading,
    isError: feedbacksQuery.isError,
    error: feedbacksQuery.error,
  };
};

// Helper function to format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return "Vừa xong";
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} ngày trước`;
}
