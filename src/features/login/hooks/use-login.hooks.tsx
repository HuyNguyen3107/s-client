import { useLoginMutation } from "../login.mutation";
import { useForm } from "react-hook-form";
import type { LoginParams } from "../types/login.types";
import { LOGIN_RULES } from "../constants/rules.constants";

export const useLogin = () => {
  const mutation = useLoginMutation();
  const method = useForm<LoginParams>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const rules = LOGIN_RULES;
  const onSubmit = method.handleSubmit(async (data) => {
    await mutation.mutateAsync(data);
  });
  return { ...method, rules, onSubmit, pending: mutation.isPending };
};
