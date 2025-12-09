// Background customization types
export interface Background {
  id: string;
  productId: string;
  name: string;
  imageUrl: string;
  thumbnailUrl?: string;
  price?: number;
  category?: string;
  description?: string;
  tags?: string[];
  status?: "active" | "inactive";
  config?: any;
  createdAt: string | Date;
  updatedAt: string | Date;
  product?: {
    id: string;
    name: string;
    collection: {
      id: string;
      name: string;
    };
  };
}

export interface BackgroundCategory {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  thumbnailUrl?: string;
  backgroundCount: number;
  priority: number;
}

export interface BackgroundSelection {
  backgroundId: string;
  position?: {
    x: number;
    y: number;
  };
  scale?: number;
  rotation?: number;
  opacity?: number;
  blendMode?: string;
}

export interface BackgroundCustomization {
  id?: string;
  productId: string;
  variantId: string;
  customizationData: any; // Data from previous customization step
  backgroundSelections: BackgroundSelection[];
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BackgroundCustomizationRequest {
  productId: string;
  variantId: string;
  customizationData: any;
  backgroundSelections: BackgroundSelection[];
}

export interface BackgroundListResponse {
  data: Background[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BackgroundQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  tags?: string[];
  priceMin?: number;
  priceMax?: number;
  sortBy?: "name" | "price" | "createdAt";
  sortOrder?: "asc" | "desc";
}
