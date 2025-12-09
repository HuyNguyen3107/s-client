import http from "../../../libs/http.libs";
import { API_PATHS } from "../../../constants/api-path.constants";
import type {
  Collection,
  CreateCollectionRequest,
  UpdateCollectionRequest,
  CollectionListResponse,
  CollectionQueryParams,
} from "../types/collection.types";
import type { UploadImageResponse } from "../../feedbacks/types/feedback.types";

// Collection services
export const getCollections = async (
  params?: CollectionQueryParams
): Promise<CollectionListResponse> => {
  const response = await http.get(API_PATHS.COLLECTIONS, { params });

  let collections: any[] = [];

  // Check for new API response format with wrapper
  if (response.data?.data && Array.isArray(response.data.data)) {
    collections = response.data.data;
  }
  // Fallback to old format (direct array)
  else if (Array.isArray(response.data)) {
    collections = response.data;
  }
  // Unknown format
  else {
    return {
      data: [],
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 12,
        total: 0,
        totalPages: 0,
      },
    };
  }

  // Transform collections to frontend format
  const transformedCollections = collections.map((item: any) => ({
    id: item.id,
    name: item.name,
    slug: item.routeName || item.slug, // Map routeName -> slug
    description: item.description || "", // Thêm description
    imageUrl: item.imageUrl,
    isActive: item.status === "active" || item.isActive,
    isHot: item.isHot || false,
    sortOrder: item.sortOrder || 0,
    productCount: item.productCount || 0,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));

  return {
    data: transformedCollections,
    pagination: {
      page: params?.page || 1,
      limit: params?.limit || 12,
      total: transformedCollections.length,
      totalPages: Math.ceil(
        transformedCollections.length / (params?.limit || 12)
      ),
    },
  };
};

export const getCollectionById = async (id: string): Promise<Collection> => {
  const response = await http.get(API_PATHS.COLLECTION_BY_ID(id));

  // Handle wrapped response
  const item = response.data?.data || response.data;
  return {
    id: item.id,
    name: item.name,
    slug: item.routeName || item.slug, // Map routeName -> slug
    description: item.description || "", // Thêm description
    imageUrl: item.imageUrl,
    isActive: item.status === "active" || item.isActive,
    isHot: item.isHot || false,
    sortOrder: item.sortOrder || 0,
    productCount: item.productCount || 0,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
};

export const getCollectionBySlug = async (
  slug: string
): Promise<Collection> => {
  const response = await http.get(API_PATHS.COLLECTION_BY_SLUG(slug));

  // Handle wrapped response
  const item = response.data?.data || response.data;
  return {
    id: item.id,
    name: item.name,
    slug: item.routeName || item.slug, // Map routeName -> slug
    description: item.description || "", // Thêm description
    imageUrl: item.imageUrl,
    isActive: item.status === "active" || item.isActive,
    isHot: item.isHot || false,
    sortOrder: item.sortOrder || 0,
    productCount: item.productCount || 0,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
};

export const getHotCollections = async (): Promise<Collection[]> => {
  const response = await http.get(API_PATHS.HOT_COLLECTIONS);

  // Handle wrapped response
  let collections: any[] = [];
  if (response.data?.data && Array.isArray(response.data.data)) {
    collections = response.data.data;
  } else if (Array.isArray(response.data)) {
    collections = response.data;
  }

  return collections.map((item: any) => ({
    id: item.id,
    name: item.name,
    slug: item.routeName || item.slug, // Map routeName -> slug
    description: item.description || "", // Thêm description
    imageUrl: item.imageUrl,
    isActive: item.status === "active" || item.isActive,
    isHot: item.isHot || false,
    sortOrder: item.sortOrder || 0,
    productCount: item.productCount || 0,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));
};

export const createCollection = async (
  data: CreateCollectionRequest
): Promise<Collection> => {
  // Map frontend fields to backend fields
  const backendData = {
    name: data.name,
    imageUrl: data.imageUrl || "", // Required by backend
    routeName: data.slug, // Map slug to routeName
    isHot: data.isHot || false,
    status: data.isActive ? "active" : "inactive",
  };

  const response = await http.post(API_PATHS.COLLECTIONS, backendData);

  // Map backend response to frontend structure
  const item = response.data?.data || response.data;
  return {
    id: item.id,
    name: item.name,
    slug: item.routeName || item.slug, // Map routeName -> slug
    description: item.description || "", // Thêm description
    imageUrl: item.imageUrl,
    isActive: item.status === "active" || item.isActive,
    isHot: item.isHot || false,
    sortOrder: item.sortOrder || 0,
    productCount: item.productCount || 0,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
};

export const updateCollection = async (
  data: UpdateCollectionRequest
): Promise<Collection> => {
  const { id, ...updateData } = data;

  // Map frontend fields to backend fields
  const backendData: any = {};
  if (updateData.name) backendData.name = updateData.name;
  if (updateData.imageUrl !== undefined)
    backendData.imageUrl = updateData.imageUrl;
  if (updateData.slug) backendData.routeName = updateData.slug; // Map slug to routeName
  if (updateData.isHot !== undefined) backendData.isHot = updateData.isHot;
  if (updateData.isActive !== undefined) {
    backendData.status = updateData.isActive ? "active" : "inactive";
  }

  const response = await http.patch(
    API_PATHS.COLLECTION_BY_ID(id),
    backendData
  );

  // Map backend response to frontend structure
  const item = response.data?.data || response.data;
  return {
    id: item.id,
    name: item.name,
    slug: item.routeName || item.slug, // Map routeName -> slug
    description: item.description || "", // Thêm description
    imageUrl: item.imageUrl,
    isActive: item.status === "active" || item.isActive,
    isHot: item.isHot || false,
    sortOrder: item.sortOrder || 0,
    productCount: item.productCount || 0,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
};

export const deleteCollection = async (
  id: string
): Promise<{ message: string }> => {
  const response = await http.delete(API_PATHS.COLLECTION_BY_ID(id));
  return response.data;
};

export const toggleCollectionStatus = async (
  id: string
): Promise<Collection> => {
  const response = await http.patch(API_PATHS.COLLECTION_TOGGLE_STATUS(id));

  // Map backend response to frontend structure
  const item = response.data?.data || response.data;
  return {
    id: item.id,
    name: item.name,
    slug: item.routeName || item.slug, // Map routeName -> slug
    description: item.description || "", // Thêm description
    imageUrl: item.imageUrl,
    isActive: item.status === "active" || item.isActive,
    isHot: item.isHot || false,
    sortOrder: item.sortOrder || 0,
    productCount: item.productCount || 0,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
};

// Upload services for collections (using same Cloudinary API as feedbacks)
export const uploadCollectionImage = async (
  file: File
): Promise<UploadImageResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await http.post(API_PATHS.UPLOAD_IMAGE, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteCollectionImage = async (
  publicId: string
): Promise<UploadImageResponse> => {
  const response = await http.delete(API_PATHS.DELETE_IMAGE(publicId));
  return response.data;
};
