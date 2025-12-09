export type LogoutRequest = {
  accessToken: string;
  refreshToken: string;
};

export type LogoutResponse = {
  message: string;
  success: boolean;
};
