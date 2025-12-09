// Re-export all hooks for backward compatibility and easier imports
export { useCreateFeedback } from "./use-create-feedback.hooks";
export { useUpdateFeedback } from "./use-update-feedback.hooks";
export { useFeedbackList } from "./use-feedback-list.hooks";
export { useFeedbackStats } from "./use-feedback-stats.hooks";
export { useImageUpload } from "./use-image-upload.hooks";

// Re-export queries for direct usage
export {
  useFeedbacks,
  useFeedbackById,
  useFeedbackStatistics,
} from "../queries/feedback.queries";

// Re-export mutations for direct usage
export {
  useCreateFeedbackMutation,
  useUpdateFeedbackMutation,
  useDeleteFeedbackMutation,
} from "../mutations/feedback.mutations";

export {
  useUploadImageMutation,
  useDeleteImageMutation,
} from "../mutations/upload.mutations";
