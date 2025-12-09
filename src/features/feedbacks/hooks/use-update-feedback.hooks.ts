import { useForm } from "react-hook-form";
import { useUpdateFeedbackMutation } from "../mutations/feedback.mutations";
import { FEEDBACK_VALIDATION_RULES } from "../constants/validation.constants";
import type { UpdateFeedbackRequest, Feedback } from "../types/feedback.types";

export const useUpdateFeedback = (feedback?: Feedback) => {
  const mutation = useUpdateFeedbackMutation();
  const method = useForm<UpdateFeedbackRequest>({
    defaultValues: {
      customerName: feedback?.customerName || "",
      content: feedback?.content || "",
      imageUrl: feedback?.imageUrl || "",
      rating: feedback?.rating || 5,
    },
  });

  const rules = FEEDBACK_VALIDATION_RULES;
  const onSubmit = method.handleSubmit(async (data) => {
    if (!feedback?.id) return;
    await mutation.mutateAsync({ id: feedback.id, data });
  });

  return {
    ...method,
    rules,
    onSubmit,
    pending: mutation.isPending,
    isSuccess: mutation.isSuccess,
  };
};
