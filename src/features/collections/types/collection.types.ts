// Collection Types - Interface Segregation Principle (ISP)
export interface Collection {
  id: string;
  name: string;
  slug: string; // maps to routeName from server
  description?: string;
  imageUrl?: string;
  isActive: boolean; // derived from status field
  isHot: boolean;
  sortOrder: number; // default value when not present
  productCount?: number; // calculated from products relation
  status?: string; // raw status from server
  routeName?: string; // raw routeName from server
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollectionRequest {
  name: string;
  slug: string;
  imageUrl?: string;
  isActive?: boolean;
  isHot?: boolean;
}

export interface UpdateCollectionRequest
  extends Partial<CreateCollectionRequest> {
  id: string;
}

export interface CollectionQueryParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
  isHot?: boolean;
  sortBy?: "name" | "createdAt" | "sortOrder" | "productCount";
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface CollectionListResponse {
  data: Collection[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface CollectionStatistics {
  totalCollections: number;
  activeCollections: number;
  hotCollections: number;
  totalProducts: number;
}

// Action Types for Strategy Pattern
export type CollectionAction =
  | "create"
  | "edit"
  | "delete"
  | "toggle-status"
  | "toggle-hot"
  | "view";

export interface CollectionActionHandler {
  type: CollectionAction;
  execute: (collection: Collection) => void | Promise<void>;
}

// View Mode Types
export type CollectionViewMode = "grid" | "table" | "list";

// Form State Types
export interface CollectionFormState {
  isLoading: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}
