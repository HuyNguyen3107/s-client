import { useMutation } from "@tanstack/react-query";
import { useToastStore } from "../../../store/toast.store";
import { MUTATION_KEYS } from "../../../constants/mutation-key.constants";
import {
  uploadBackgroundImage,
  deleteBackgroundImage,
} from "../services/background.services";

// Upload Mutations for Backgrounds - Single Responsibility Principle (SRP)

export const useUploadBackgroundImage = () => {
  const { showToast } = useToastStore();

  return useMutation({
    mutationKey: [MUTATION_KEYS.UPLOAD_BACKGROUND_IMAGE],
    mutationFn: (file: File) => uploadBackgroundImage(file),

    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Không thể tải lên hình ảnh";
      showToast(message, "error");
    },
  });
};

export const useDeleteBackgroundImage = () => {
  const { showToast } = useToastStore();

  return useMutation({
    mutationKey: [MUTATION_KEYS.DELETE_BACKGROUND_IMAGE],
    mutationFn: (publicId: string) => deleteBackgroundImage(publicId),

    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Không thể xóa hình ảnh";
      showToast(message, "error");
    },
  });
};
