import { useQuery } from "@tanstack/react-query";
import { SHIPPING_FEE_QUERY_KEYS } from "../constants";
import {
  getShippingFees,
  getShippingFeeById,
  getDistinctAreas,
  getDistinctShippingTypes,
  getShippingFeesByArea,
  searchShippingFees,
  getShippingFeeStatistics,
} from "../services";
import type { ShippingFeeQueryParams, ShippingFeeSearchParams } from "../types";

/**
 * Custom hook for fetching paginated shipping fees list
 * Following Single Responsibility Principle - only handles list fetching
 */
export const useShippingFees = (params?: ShippingFeeQueryParams) => {
  return useQuery({
    queryKey: SHIPPING_FEE_QUERY_KEYS.LIST(params),
    queryFn: () => getShippingFees(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Custom hook for fetching single shipping fee by ID
 */
export const useShippingFee = (id: string, enabled = true) => {
  return useQuery({
    queryKey: SHIPPING_FEE_QUERY_KEYS.DETAIL(id),
    queryFn: () => getShippingFeeById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Custom hook for fetching distinct areas
 */
export const useShippingFeeAreas = () => {
  return useQuery({
    queryKey: SHIPPING_FEE_QUERY_KEYS.AREAS,
    queryFn: getDistinctAreas,
    staleTime: 30 * 60 * 1000, // 30 minutes - areas don't change often
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

/**
 * Custom hook for fetching distinct shipping types
 */
export const useShippingFeeTypes = () => {
  return useQuery({
    queryKey: SHIPPING_FEE_QUERY_KEYS.TYPES,
    queryFn: getDistinctShippingTypes,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

/**
 * Custom hook for fetching shipping fees by area
 */
export const useShippingFeesByArea = (area: string, enabled = true) => {
  return useQuery({
    queryKey: SHIPPING_FEE_QUERY_KEYS.BY_AREA(area),
    queryFn: () => getShippingFeesByArea(area),
    enabled: enabled && !!area,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Custom hook for searching shipping fees
 */
export const useSearchShippingFees = (
  params: ShippingFeeSearchParams,
  enabled = true
) => {
  return useQuery({
    queryKey: SHIPPING_FEE_QUERY_KEYS.SEARCH(params),
    queryFn: () => searchShippingFees(params),
    enabled: enabled && !!params.area && !!params.shippingType,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Custom hook for fetching shipping fee statistics
 */
export const useShippingFeeStatistics = () => {
  return useQuery({
    queryKey: SHIPPING_FEE_QUERY_KEYS.STATISTICS,
    queryFn: getShippingFeeStatistics,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};
