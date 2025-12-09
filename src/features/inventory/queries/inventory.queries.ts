import { useQuery } from "@tanstack/react-query";
import {
  getInventories,
  getInventoryById,
  getInventoryByProductCustom,
  getLowStockItems,
  getInventoryStatistics,
} from "../services";
import type { InventoryQueryParams } from "../types";

// Query keys following consistent naming pattern
export const INVENTORY_QUERY_KEYS = {
  ALL: ["inventory"] as const,
  LISTS: () => [...INVENTORY_QUERY_KEYS.ALL, "list"] as const,
  LIST: (params?: InventoryQueryParams) =>
    [...INVENTORY_QUERY_KEYS.LISTS(), params] as const,
  DETAILS: () => [...INVENTORY_QUERY_KEYS.ALL, "detail"] as const,
  DETAIL: (id: string) => [...INVENTORY_QUERY_KEYS.DETAILS(), id] as const,
  BY_PRODUCT_CUSTOM: (productCustomId: string) =>
    [
      ...INVENTORY_QUERY_KEYS.ALL,
      "by-product-custom",
      productCustomId,
    ] as const,
  LOW_STOCK: () => [...INVENTORY_QUERY_KEYS.ALL, "low-stock"] as const,
  LOW_STOCK_ITEMS: (limit?: number) =>
    [...INVENTORY_QUERY_KEYS.LOW_STOCK(), limit] as const,
  STATISTICS: () => [...INVENTORY_QUERY_KEYS.ALL, "statistics"] as const,
};

// Inventory list query
export const useInventories = (params?: InventoryQueryParams) => {
  return useQuery({
    queryKey: INVENTORY_QUERY_KEYS.LIST(params),
    queryFn: () => getInventories(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Single inventory query
export const useInventory = (id: string, enabled = true) => {
  return useQuery({
    queryKey: INVENTORY_QUERY_KEYS.DETAIL(id),
    queryFn: () => getInventoryById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Inventory by product custom query
export const useInventoryByProductCustom = (
  productCustomId: string,
  enabled = true
) => {
  return useQuery({
    queryKey: INVENTORY_QUERY_KEYS.BY_PRODUCT_CUSTOM(productCustomId),
    queryFn: () => getInventoryByProductCustom(productCustomId),
    enabled: enabled && !!productCustomId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Low stock items query
export const useLowStockItems = (limit?: number) => {
  return useQuery({
    queryKey: INVENTORY_QUERY_KEYS.LOW_STOCK_ITEMS(limit),
    queryFn: () => getLowStockItems(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent updates for alerts)
  });
};

// Inventory statistics query
export const useInventoryStatistics = () => {
  return useQuery({
    queryKey: INVENTORY_QUERY_KEYS.STATISTICS(),
    queryFn: getInventoryStatistics,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Only retry network errors, not data structure errors
      return failureCount < 2 && error.message.includes("fetch");
    },
  });
};
