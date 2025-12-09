import { useMutation } from "@tanstack/react-query";
import { login } from "./services/login.services";
import { useToastStore } from "../../store/toast.store";
import { useAuthStore } from "../../store/auth.store";
import { getLoginErrorMessage } from "../../utils/errors.utils";
import { useNavigate } from "react-router-dom";
import { MUTATION_KEYS } from "../../constants/mutation-key.constants";

export const useLoginMutation = () => {
  const { showToast } = useToastStore();
  const navigate = useNavigate();
  return useMutation({
    mutationKey: [MUTATION_KEYS.LOGIN],
    mutationFn: login,
    onSuccess: (data) => {
      showToast("Đăng nhập thành công", "success");
      useAuthStore.getState().setToken(data.accessToken);
      useAuthStore.getState().setRefreshToken(data.refreshToken);
      useAuthStore.getState().setUser(data.user);
      useAuthStore.getState().setTokenExpires(data.expiresAt);
      navigate("/dashboard");
    },
    onError: (error) => {
      const errorMessage = getLoginErrorMessage(+error);
      showToast(errorMessage, "error");
    },
  });
};
