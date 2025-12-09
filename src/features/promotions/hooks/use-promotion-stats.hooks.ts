import { usePromotionStatistics } from "../queries/promotion.queries";
import type { Promotion } from "../types/promotion.types";

export const usePromotionStats = () => {
  const { data: statistics, isLoading, error } = usePromotionStatistics();

  const getPromotionStatus = (promotion: Promotion): string => {
    const now = new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = promotion.endDate ? new Date(promotion.endDate) : null;

    if (!promotion.isActive) return "inactive";
    if (startDate > now) return "upcoming";
    if (endDate && endDate < now) return "expired";
    return "active";
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatPercentage = (percentage: number): string => {
    return `${percentage}%`;
  };

  const calculateDiscountAmount = (
    promotion: Promotion,
    orderValue: number
  ): number => {
    if (orderValue < promotion.minOrderValue) return 0;

    let discount = 0;
    if (promotion.type === "PERCENTAGE") {
      discount = (orderValue * promotion.value) / 100;
    } else {
      discount = promotion.value;
    }

    return Math.min(discount, promotion.maxDiscountAmount ?? discount);
  };

  const isPromotionUsable = (promotion: Promotion): boolean => {
    const status = getPromotionStatus(promotion);
    const hasUsageLeft =
      !promotion.usageLimit || promotion.usageCount < promotion.usageLimit;

    return status === "active" && hasUsageLeft;
  };

  const getUsagePercentage = (promotion: Promotion): number => {
    if (!promotion.usageLimit) return 0;
    return (promotion.usageCount / promotion.usageLimit) * 100;
  };

  return {
    statistics,
    isLoading,
    error,
    getPromotionStatus,
    formatCurrency,
    formatPercentage,
    calculateDiscountAmount,
    isPromotionUsable,
    getUsagePercentage,
  };
};
