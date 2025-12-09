import { useQuery } from "@tanstack/react-query";
import http from "../libs/http.libs";
import { API_PATHS } from "../constants/api-path.constants";
import { QUERY_KEYS } from "../constants/query-key.constants";
import { useAuthStore } from "../store/auth.store";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  isActive: boolean;
  role?: string;
}

interface UseUserProfileOptions {
  enabled?: boolean;
}

const fetchUserProfile = async (): Promise<UserProfile> => {
  const response = await http.get(API_PATHS.USER_PROFILE);
  // API returns { message, data }, we need only the data
  return response.data.data;
};

export const useUserProfile = (options: UseUserProfileOptions = {}) => {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: [QUERY_KEYS.USER_PROFILE],
    queryFn: fetchUserProfile,
    enabled: !!token && (options.enabled ?? true),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};
