import { useForm } from "react-hook-form";
import { useCreateFeedbackMutation } from "../mutations/feedback.mutations";
import { FEEDBACK_VALIDATION_RULES } from "../constants/validation.constants";
import type { CreateFeedbackRequest } from "../types/feedback.types";

export const useCreateFeedback = () => {
  const mutation = useCreateFeedbackMutation();
  const method = useForm<CreateFeedbackRequest>({
    defaultValues: {
      customerName: "",
      content: "",
      imageUrl: "",
      rating: 5,
    },
  });

  const rules = FEEDBACK_VALIDATION_RULES;
  const onSubmit = method.handleSubmit(async (data) => {
    await mutation.mutateAsync(data);
  });

  return {
    ...method,
    rules,
    onSubmit,
    pending: mutation.isPending,
    isSuccess: mutation.isSuccess,
  };
};
