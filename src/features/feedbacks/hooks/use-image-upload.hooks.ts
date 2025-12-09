import { useState } from "react";
import {
  useUploadImageMutation,
  useDeleteImageMutation,
} from "../mutations/upload.mutations";
import { FEEDBACK_CONSTANTS } from "../constants/feedback.constants";

export const useImageUpload = () => {
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const uploadMutation = useUploadImageMutation();
  const deleteMutation = useDeleteImageMutation();

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > FEEDBACK_CONSTANTS.IMAGE.MAX_SIZE_MB * 1024 * 1024) {
      return `Kích thước file không được vượt quá ${FEEDBACK_CONSTANTS.IMAGE.MAX_SIZE_MB}MB`;
    }

    // Check file type
    if (!FEEDBACK_CONSTANTS.IMAGE.ALLOWED_TYPES.includes(file.type as any)) {
      return "Định dạng file không được hỗ trợ. Vui lòng chọn file JPG, PNG, GIF hoặc WebP";
    }

    return null;
  };

  const uploadImage = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      throw new Error(validationError);
    }

    const result = await uploadMutation.mutateAsync(file);
    if (result.data?.url) {
      setUploadedImage(result.data.url);
    }
    return result;
  };

  const deleteImage = async (publicId: string) => {
    await deleteMutation.mutateAsync(publicId);
    setUploadedImage("");
  };

  const clearImage = () => {
    setUploadedImage("");
  };

  return {
    uploadedImage,
    setUploadedImage,
    uploadImage,
    deleteImage,
    clearImage,
    uploading: uploadMutation.isPending,
    deleting: deleteMutation.isPending,
    uploadError: uploadMutation.error,
  };
};
