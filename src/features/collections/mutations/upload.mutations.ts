import { useMutation } from "@tanstack/react-query";
import { MUTATION_KEYS } from "../../../constants/mutation-key.constants";
import {
  uploadCollectionImage,
  deleteCollectionImage,
} from "../services/collection.services";
import { useToastStore } from "../../../store/toast.store";

export const useUploadCollectionImageMutation = () => {
  const { showToast } = useToastStore();

  return useMutation({
    mutationKey: [MUTATION_KEYS.UPLOAD_IMAGE],
    mutationFn: uploadCollectionImage,
    onError: (error: any) => {
      showToast(
        error?.response?.data?.message || "Có lỗi xảy ra khi upload ảnh",
        "error"
      );
    },
  });
};

export const useDeleteCollectionImageMutation = () => {
  const { showToast } = useToastStore();

  return useMutation({
    mutationKey: [MUTATION_KEYS.DELETE_IMAGE],
    mutationFn: deleteCollectionImage,
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
