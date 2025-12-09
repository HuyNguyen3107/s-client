import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../constants/query-key.constants";
import { MUTATION_KEYS } from "../../../constants/mutation-key.constants";
import {
  createFeedback,
  updateFeedback,
  deleteFeedback,
} from "../services/feedback.services";
import type { UpdateFeedbackRequest } from "../types/feedback.types";
import { useToastStore } from "../../../store/toast.store";

export const useCreateFeedbackMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationKey: [MUTATION_KEYS.CREATE_FEEDBACK],
    mutationFn: createFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDBACKS] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FEEDBACK_STATISTICS],
      });
      showToast("Tạo feedback thành công!", "success");
    },
    onError: (error: any) => {
      showToast(
        error?.response?.data?.message || "Có lỗi xảy ra khi tạo feedback",
        "error"
      );
    },
  });
};

export const useUpdateFeedbackMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationKey: [MUTATION_KEYS.UPDATE_FEEDBACK],
    mutationFn: ({ id, data }: { id: string; data: UpdateFeedbackRequest }) =>
      updateFeedback(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDBACKS] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FEEDBACK_BY_ID, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FEEDBACK_STATISTICS],
      });
      showToast("Cập nhật feedback thành công!", "success");
    },
    onError: (error: any) => {
      showToast(
        error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật feedback",
        "error"
      );
    },
  });
};

export const useDeleteFeedbackMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationKey: [MUTATION_KEYS.DELETE_FEEDBACK],
    mutationFn: deleteFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDBACKS] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FEEDBACK_STATISTICS],
      });
      showToast("Xóa feedback thành công!", "success");
    },
    onError: (error: any) => {
      showToast(
        error?.response?.data?.message || "Có lỗi xảy ra khi xóa feedback",
        "error"
      );
    },
  });
};
