// Background Types - Interface Segregation Principle (ISP)
import type { BackgroundConfig } from "./background-config.types";

export interface Background {
  id: string;
  productId: string;
  name?: string;
  description?: string;
  imageUrl: string;
  config?: BackgroundConfig;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: string;
    name: string;
    collection: {
      id: string;
      name: string;
    };
  };
}

export interface CreateBackgroundRequest {
  productId: string;
  name?: string;
  description?: string;
  imageUrl: string;
  config?: BackgroundConfig;
}

export interface UpdateBackgroundRequest
  extends Partial<CreateBackgroundRequest> {
  id: string;
}

export interface BackgroundQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  productId?: string;
}

export interface BackgroundListResponse {
  data: Background[];
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

// Action Types for Strategy Pattern
export type BackgroundAction =
  | "create"
  | "edit"
  | "delete"
  | "view"
  | "duplicate";

export interface BackgroundActionHandler {
  type: BackgroundAction;
  execute: (background: Background) => void | Promise<void>;
}

// View Mode Types
export type BackgroundViewMode = "grid" | "table" | "list";

// Form State Types
export interface BackgroundFormState {
  isLoading: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

// Filter Types
export interface BackgroundFilters {
  productId?: string;
  search?: string;
}

// Statistics Types
export interface BackgroundStatistics {
  totalBackgrounds: number;
  backgroundsByProduct: { productName: string; count: number }[];
  recentBackgrounds: Background[];
}
