import { useState, useEffect } from "react";
import { backgroundService } from "../services/background.service";
import type {
  Background,
  BackgroundCategory,
  BackgroundQueryParams,
  BackgroundListResponse,
} from "../types/background.types";

// Hook to fetch background categories
export function useBackgroundCategories() {
  const [categories, setCategories] = useState<BackgroundCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await backgroundService.getBackgroundCategories();
      setCategories(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch categories"
      );
      console.error("Error fetching background categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, error, refetch: fetchCategories };
}

// Hook to fetch backgrounds with filtering
export function useBackgrounds(params: BackgroundQueryParams = {}) {
  const [data, setData] = useState<BackgroundListResponse>({
    data: [],
    meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBackgrounds = async (newParams: BackgroundQueryParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const finalParams = { ...params, ...newParams };
      const result = await backgroundService.getBackgrounds(finalParams);
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch backgrounds"
      );
      console.error("Error fetching backgrounds:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackgrounds();
  }, [
    params.page,
    params.limit,
    params.category,
    params.search,
    params.priceMin,
    params.priceMax,
    params.sortBy,
    params.sortOrder,
  ]);

  return {
    backgrounds: data.data,
    meta: data.meta,
    loading,
    error,
    refetch: fetchBackgrounds,
  };
}

// Hook to fetch single background
export function useBackground(id: string | null) {
  const [background, setBackground] = useState<Background | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setBackground(null);
      setLoading(false);
      return;
    }

    const fetchBackground = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await backgroundService.getBackgroundById(id);
        setBackground(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch background"
        );
        console.error("Error fetching background:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBackground();
  }, [id]);

  return { background, loading, error };
}
