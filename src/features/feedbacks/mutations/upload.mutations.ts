import { useMutation } from "@tanstack/react-query";
import { MUTATION_KEYS } from "../../../constants/mutation-key.constants";
import { uploadImage, deleteImage } from "../services/feedback.services";
import { useToastStore } from "../../../store/toast.store";

export const useUploadImageMutation = () => {
  const { showToast } = useToastStore();

  return useMutation({
    mutationKey: [MUTATION_KEYS.UPLOAD_IMAGE],
    mutationFn: uploadImage,
    onError: (error: any) => {
      showToast(
        error?.response?.data?.message || "Có lỗi xảy ra khi upload ảnh",
        "error"
      );
    },
  });
};

export const useDeleteImageMutation = () => {
  const { showToast } = useToastStore();

  return useMutation({
    mutationKey: [MUTATION_KEYS.DELETE_IMAGE],
    mutationFn: deleteImage,
    onSuccess: () => {
      showToast("Xóa ảnh thành công!", "success");
    },
    onError: (error: any) => {
      showToast(
        error?.response?.data?.message || "Có lỗi xảy ra khi xóa ảnh",
        "error"
      );
    },
  });
};
