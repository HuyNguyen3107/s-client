import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  productCustomsService,
  type ProductCustom,
  type ProductCustomQueryParams,
} from "../services/product-customs.service";
import { QUERY_KEYS } from "../../../constants/query-key.constants";

export const useProductCustoms = (params?: ProductCustomQueryParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT_CUSTOMS, params],
    queryFn: () => productCustomsService.getProductCustoms(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProductCustomById = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT_CUSTOMS, id],
    queryFn: () => productCustomsService.getProductCustomById(id),
    enabled: !!id,
  });
};

export const useProductCustomsSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ProductCustom[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchProductCustoms = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await productCustomsService.searchProductCustoms(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching product customs:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchProductCustoms(searchQuery);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchProductCustoms]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchProductCustoms,
  };
};

export const useProductCustomsAutocomplete = () => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<ProductCustom[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOptions = useCallback(async (query: string) => {
    setLoading(true);
    try {
      if (!query.trim()) {
        // Load initial active products when query is empty
        const response = await productCustomsService.getProductCustoms({
          status: "active",
          limit: 20,
          sortBy: "name",
          sortOrder: "asc",
        });
        setOptions(response.data || []);
      } else {
        // Search with query
        const results = await productCustomsService.searchProductCustoms(query);
        setOptions(results);
      }
    } catch (error) {
      console.error("Error fetching product customs options:", error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial options on mount
  useEffect(() => {
    fetchOptions("");
  }, [fetchOptions]);

  // Debounced fetch when input changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchOptions(inputValue);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue, fetchOptions]);

  return {
    inputValue,
    setInputValue,
    options,
    loading,
    fetchOptions,
  };
};
