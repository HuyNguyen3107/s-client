import { useMutation } from "@tanstack/react-query";
import { logout } from "./services/logout.services";
import { useToastStore } from "../../store/toast.store";
import { MUTATION_KEYS } from "../../constants/mutation-key.constants";
import { useNavigate } from "react-router-dom";
import { getLogoutErrorMessage } from "../../utils/errors.utils";
import { useAuthStore } from "../../store/auth.store";
import { ROUTE_PATH } from "../../constants/route-path.constants";

export const useLogoutMutation = () => {
  const { showToast } = useToastStore();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: logout,
    mutationKey: [MUTATION_KEYS.LOGOUT],
    onSuccess: () => {
      showToast("Đăng xuất thành công", "success");
      useAuthStore.getState().clearToken();
      localStorage.clear();
      navigate(ROUTE_PATH.LOGIN);
    },
    onError: (error) => {
      const errorMessage = getLogoutErrorMessage(+error);
      showToast(errorMessage, "error");
    },
  });
};
