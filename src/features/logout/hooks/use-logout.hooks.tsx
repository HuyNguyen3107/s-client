import type { LogoutRequest } from "../types/logout.types";
import { useLogoutMutation } from "../use-logout.mutation";

export const useLogout = (params: LogoutRequest) => {
  const mutation = useLogoutMutation();
  const onSubmit = async () => {
    await mutation.mutateAsync(params);
  };

  return { onSubmit };
};
