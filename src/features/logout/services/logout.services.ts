import type { LogoutRequest, LogoutResponse } from "../types/logout.types";
import http from "../../../libs/http.libs";
import { API_PATHS } from "../../../constants/api-path.constants";

export const logout = async (data: LogoutRequest): Promise<LogoutResponse> => {
  const response = await http.post(API_PATHS.LOGOUT, data);
  return response.data;
};
