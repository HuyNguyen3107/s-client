import { useLoginMutation } from "../login.mutation";
import { useForm } from "react-hook-form";
import type { LoginParams } from "../types/login.types";
import { LOGIN_RULES } from "../constants/rules.constants";
import { useEffect } from "react";

export const useLogin = () => {
  const mutation = useLoginMutation();
  const method = useForm<LoginParams>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched", // Validate khi field bị touched
    reValidateMode: "onChange", // Re-validate khi giá trị thay đổi
    criteriaMode: "all", // Hiển thị tất cả lỗi validation
  });

  const rules = LOGIN_RULES;
  const onSubmit = method.handleSubmit(async (data) => {
    await mutation.mutateAsync(data);
  });

  // Trigger validation khi component mount nếu có giá trị điền sẵn
  useEffect(() => {
    const email = method.getValues("email");
    const password = method.getValues("password");
    if (email || password) {
      // Delay một chút để đảm bảo form đã được mount và có thể có giá trị từ autofill
      const timer = setTimeout(() => {
        method.trigger(); // Trigger validation cho tất cả fields
      }, 100);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy một lần khi mount

  return { ...method, rules, onSubmit, pending: mutation.isPending };
};
