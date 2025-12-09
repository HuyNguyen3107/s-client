import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  getProducts,
  getProductById,
  getProductsByCollection,
  getProductStatistics,
} from "../services";
import type { ProductQueryParams } from "../types";

// Query keys following consistent naming pattern
export const PRODUCT_QUERY_KEYS = {
  ALL: ["products"] as const,
  LISTS: () => [...PRODUCT_QUERY_KEYS.ALL, "list"] as const,
  LIST: (params?: ProductQueryParams) =>
    [...PRODUCT_QUERY_KEYS.LISTS(), params] as const,
  DETAILS: () => [...PRODUCT_QUERY_KEYS.ALL, "detail"] as const,
  DETAIL: (id: string) => [...PRODUCT_QUERY_KEYS.DETAILS(), id] as const,
  BY_COLLECTION: (collectionId: string) =>
    [...PRODUCT_QUERY_KEYS.ALL, "by-collection", collectionId] as const,
  STATISTICS: () => [...PRODUCT_QUERY_KEYS.ALL, "statistics"] as const,
};

// Products list query
export const useProducts = (params?: ProductQueryParams) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.LIST(params),
    queryFn: () => getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useInfiniteProducts = (params?: ProductQueryParams) => {
  const baseLimit = params?.limit ?? 12;
  return useInfiniteQuery({
    queryKey: PRODUCT_QUERY_KEYS.LIST({ ...params, limit: baseLimit }),
    queryFn: ({ pageParam = 1 }) =>
      getProducts({ ...params, page: pageParam as number, limit: baseLimit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const next = (lastPage.meta?.page || 1) + 1;
      const totalPages = lastPage.meta?.totalPages || 1;
      return next <= totalPages ? next : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Single product query
export const useProduct = (id: string, enabled = true) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.DETAIL(id),
    queryFn: () => getProductById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Products by collection query
export const useProductsByCollection = (
  collectionId: string,
  enabled = true
) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.BY_COLLECTION(collectionId),
    queryFn: () => getProductsByCollection(collectionId),
    enabled: enabled && !!collectionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Product statistics query
export const useProductStatistics = () => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.STATISTICS(),
    queryFn: getProductStatistics,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Only retry network errors, not data structure errors
      return failureCount < 2 && error.message.includes("fetch");
    },
  });
};
