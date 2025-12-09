// Information Types
export interface Information {
  id: string;
  config: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInformationRequest {
  config: Record<string, any>;
}

export interface UpdateInformationRequest
  extends Partial<CreateInformationRequest> {
  id: string;
}

export interface InformationQueryParams {
  page?: number;
  limit?: number;
}

export interface InformationListResponse {
  data: Information[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

// View Mode Types
export type InformationViewMode = "grid" | "table";

// Form State Types
export interface InformationFormState {
  isLoading: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

// Statistics Types
export interface InformationStatistics {
  totalInformations: number;
  recentInformations: Information[];
}
