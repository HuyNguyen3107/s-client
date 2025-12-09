import { useCallback } from "react";
import { useProductCustomStatisticsQuery } from "../queries";
import type {
  ProductCustomStatistics,
  IProductCustomStatsHook,
} from "../types";

/**
 * Hook for managing product custom statistics
 * Following Single Responsibility Principle - handles statistics data
 */
export const useProductCustomStats = (
  enabled: boolean = true
): IProductCustomStatsHook => {
  // Fetch statistics using React Query
  const {
    data: statistics,
    isLoading,
    error,
    refetch,
  } = useProductCustomStatisticsQuery(enabled);

  // Refresh function
  const refresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    statistics: statistics || {
      totalProductCustoms: 0,
      totalInventories: 0,
      productCustomsByStatus: [],
      productCustomsByCategory: [],
    },
    isLoading,
    error,
    refresh,
  };
};

/**
 * Hook for calculating derived statistics
 * @param statistics - Raw statistics data
 * @returns Processed statistics with additional calculations
 */
export const useProductCustomStatsDerived = (
  statistics?: ProductCustomStatistics
) => {
  const processedStats = {
    // Basic counts
    totalCustoms: statistics?.totalProductCustoms || 0,
    totalInventories: statistics?.totalInventories || 0,

    // Status breakdown
    statusBreakdown: statistics?.productCustomsByStatus || [],
    categoryBreakdown: statistics?.productCustomsByCategory || [],

    // Calculated fields
    averageCustomsPerCategory: 0,
    activeCustomsCount: 0,
    inactiveCustomsCount: 0,
    outOfStockCount: 0,
    discontinuedCount: 0,

    // Percentages
    activePercentage: 0,
    inactivePercentage: 0,
    outOfStockPercentage: 0,
    discontinuedPercentage: 0,
  };

  if (statistics) {
    // Calculate averages
    const categoryCount = statistics.productCustomsByCategory.length;
    processedStats.averageCustomsPerCategory =
      categoryCount > 0
        ? Math.round((statistics.totalProductCustoms / categoryCount) * 100) /
          100
        : 0;

    // Calculate status counts
    const statusMap = new Map(
      statistics.productCustomsByStatus.map((item) => [item.status, item.count])
    );

    processedStats.activeCustomsCount = statusMap.get("active") || 0;
    processedStats.inactiveCustomsCount = statusMap.get("inactive") || 0;
    processedStats.outOfStockCount = statusMap.get("out_of_stock") || 0;
    processedStats.discontinuedCount = statusMap.get("discontinued") || 0;

    // Calculate percentages
    const total = statistics.totalProductCustoms;
    if (total > 0) {
      processedStats.activePercentage = Math.round(
        (processedStats.activeCustomsCount / total) * 100
      );
      processedStats.inactivePercentage = Math.round(
        (processedStats.inactiveCustomsCount / total) * 100
      );
      processedStats.outOfStockPercentage = Math.round(
        (processedStats.outOfStockCount / total) * 100
      );
      processedStats.discontinuedPercentage = Math.round(
        (processedStats.discontinuedCount / total) * 100
      );
    }
  }

  return processedStats;
};

/**
 * Hook for getting top categories by customs count
 * @param statistics - Statistics data
 * @param limit - Number of top categories to return
 * @returns Top categories
 */
export const useTopCategoriesByCustoms = (
  statistics?: ProductCustomStatistics,
  limit: number = 5
) => {
  if (!statistics?.productCustomsByCategory) {
    return [];
  }

  return statistics.productCustomsByCategory
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
      percentage:
        statistics.totalProductCustoms > 0
          ? Math.round((item.count / statistics.totalProductCustoms) * 100)
          : 0,
    }));
};

/**
 * Hook for getting status distribution data for charts
 * @param statistics - Statistics data
 * @returns Chart data for status distribution
 */
export const useStatusDistributionChart = (
  statistics?: ProductCustomStatistics
) => {
  if (!statistics?.productCustomsByStatus) {
    return [];
  }

  const statusLabels: Record<string, string> = {
    active: "Đang hoạt động",
    inactive: "Không hoạt động",
    out_of_stock: "Hết hàng",
    discontinued: "Ngừng kinh doanh",
  };

  const statusColors: Record<string, string> = {
    active: "#4caf50",
    inactive: "#757575",
    out_of_stock: "#ff9800",
    discontinued: "#f44336",
  };

  return statistics.productCustomsByStatus.map((item) => ({
    label: statusLabels[item.status] || item.status,
    value: item.count,
    percentage:
      statistics.totalProductCustoms > 0
        ? Math.round((item.count / statistics.totalProductCustoms) * 100)
        : 0,
    color: statusColors[item.status] || "#9e9e9e",
    status: item.status,
  }));
};

/**
 * Hook for getting category distribution data for charts
 * @param statistics - Statistics data
 * @param limit - Number of categories to include
 * @returns Chart data for category distribution
 */
export const useCategoryDistributionChart = (
  statistics?: ProductCustomStatistics,
  limit: number = 10
) => {
  if (!statistics?.productCustomsByCategory) {
    return [];
  }

  const sortedCategories = statistics.productCustomsByCategory
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  // Generate colors
  const colors = [
    "#2196f3",
    "#4caf50",
    "#ff9800",
    "#f44336",
    "#9c27b0",
    "#00bcd4",
    "#8bc34a",
    "#ffc107",
    "#e91e63",
    "#3f51b5",
  ];

  return sortedCategories.map((item, index) => ({
    label: item.categoryName,
    value: item.count,
    percentage:
      statistics.totalProductCustoms > 0
        ? Math.round((item.count / statistics.totalProductCustoms) * 100)
        : 0,
    color: colors[index % colors.length],
  }));
};

/**
 * Hook for comparing current period with trends (if historical data available)
 * @param currentStats - Current period statistics
 * @param previousStats - Previous period statistics
 * @returns Trend analysis
 */
export const useProductCustomTrends = (
  currentStats?: ProductCustomStatistics,
  previousStats?: ProductCustomStatistics
) => {
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0)
      return { change: current, percentage: current > 0 ? 100 : 0 };
    const change = current - previous;
    const percentage = Math.round((change / previous) * 100);
    return { change, percentage };
  };

  const totalTrend = calculateTrend(
    currentStats?.totalProductCustoms || 0,
    previousStats?.totalProductCustoms || 0
  );

  const inventoryTrend = calculateTrend(
    currentStats?.totalInventories || 0,
    previousStats?.totalInventories || 0
  );

  return {
    totalCustomsTrend: totalTrend,
    inventoryTrend: inventoryTrend,
    hasIncreasedCustoms: totalTrend.change > 0,
    hasDecreasedCustoms: totalTrend.change < 0,
    isStableCustoms: totalTrend.change === 0,
  };
};
