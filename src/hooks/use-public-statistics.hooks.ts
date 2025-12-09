import { useQuery } from "@tanstack/react-query";
import http from "../libs/http.libs";
import { QUERY_KEYS } from "../constants/query-key.constants";

interface PublicStatistics {
  products: {
    total: number;
  };
  feedbacks: {
    total: number;
    averageRating: number;
  };
  promotions: {
    total: number;
  };
  users: {
    total: number;
  };
}

// Fetch public statistics (no authentication required)
const fetchPublicStatistics = async (): Promise<PublicStatistics> => {
  const response = await http.get("/public-stats");
  return response.data.data; // Server returns { statusCode, message, data }
};

export const usePublicStatistics = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_STATISTICS, "public"],
    queryFn: fetchPublicStatistics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
