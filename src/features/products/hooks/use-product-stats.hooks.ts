import { useProductStatistics } from "../queries/product.queries";

export const useProductStats = () => {
  const { data, isLoading, error } = useProductStatistics();

  return {
    statistics: data,
    isLoading,
    error,
  };
};
