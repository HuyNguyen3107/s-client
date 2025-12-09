import { API_PATHS } from "../../../constants/api-path.constants";
import http from "../../../libs/http.libs";
import type { LoginParams, LoginResponse } from "../types/login.types";

export const login = async (params: LoginParams) => {
  const response = await http.post<LoginResponse>(API_PATHS.LOGIN, params);
  return response.data;
};
