export interface Feedback {
  id: string;
  customerName: string;
  content: string;
  imageUrl: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeedbackRequest {
  customerName: string;
  content: string;
  imageUrl: string;
  rating: number;
}

export interface UpdateFeedbackRequest {
  customerName?: string;
  content?: string;
  imageUrl?: string;
  rating?: number;
}

export interface FeedbackListResponse {
  data: Feedback[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FeedbackQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  rating?: number;
  sortBy?: "createdAt" | "rating" | "customerName";
  sortOrder?: "asc" | "desc";
}

export interface FeedbackStatistics {
  totalFeedbacks: number;
  averageRating: number;
  ratingDistribution: { rating: number; count: number }[];
}

export interface UploadImageResponse {
  success: boolean;
  message: string;
  data?: {
    url: string;
    public_id: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
  };
}
