import http from "../../../libs/http.libs";
import { API_PATHS } from "../../../constants/api-path.constants";
import type {
  Feedback,
  CreateFeedbackRequest,
  UpdateFeedbackRequest,
  FeedbackListResponse,
  FeedbackQueryParams,
  FeedbackStatistics,
  UploadImageResponse,
} from "../types/feedback.types";

// Feedback services
export const getFeedbacks = async (
  params?: FeedbackQueryParams
): Promise<FeedbackListResponse> => {
  const response = await http.get(API_PATHS.FEEDBACKS, { params });
  return response.data;
};

export const getFeedbackById = async (id: string): Promise<Feedback> => {
  const response = await http.get(API_PATHS.FEEDBACK_BY_ID(id));
  return response.data;
};

export const createFeedback = async (
  data: CreateFeedbackRequest
): Promise<Feedback> => {
  const response = await http.post(API_PATHS.FEEDBACKS, data);
  return response.data;
};

export const updateFeedback = async (
  id: string,
  data: UpdateFeedbackRequest
): Promise<Feedback> => {
  const response = await http.patch(API_PATHS.FEEDBACK_BY_ID(id), data);
  return response.data;
};

export const deleteFeedback = async (
  id: string
): Promise<{ message: string }> => {
  const response = await http.delete(API_PATHS.FEEDBACK_BY_ID(id));
  return response.data;
};

export const getFeedbackStatistics = async (): Promise<FeedbackStatistics> => {
  const response = await http.get(API_PATHS.FEEDBACK_STATISTICS);
  return response.data;
};

// Upload services
export const uploadImage = async (file: File): Promise<UploadImageResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await http.post(API_PATHS.UPLOAD_IMAGE, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const uploadMultipleImages = async (
  files: File[]
): Promise<UploadImageResponse> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await http.post(API_PATHS.UPLOAD_IMAGES, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteImage = async (
  publicId: string
): Promise<UploadImageResponse> => {
  const response = await http.delete(API_PATHS.DELETE_IMAGE(publicId));
  return response.data;
};
