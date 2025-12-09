import { useState } from "react";
import { usePromotions } from "../queries/promotion.queries";
import { useDeletePromotionMutation } from "../mutations/promotion.mutations";
import type { PromotionQueryParams } from "../types/promotion.types";
import { PROMOTION_CONSTANTS } from "../constants/promotion.constants";

export const usePromotionList = () => {
  const [params, setParams] = useState<PromotionQueryParams>({
    page: 1,
    limit: PROMOTION_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
  });

  const { data, isLoading, error } = usePromotions(params);
  const deleteMutation = useDeletePromotionMutation();

  const updateParams = (newParams: Partial<PromotionQueryParams>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  const resetParams = () => {
    setParams({
      page: 1,
      limit: PROMOTION_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
    });
  };

  const deletePromotion = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const goToPage = (page: number) => {
    updateParams({ page });
  };

  const changePageSize = (limit: number) => {
    updateParams({ page: 1, limit });
  };

  const toggleActiveFilter = () => {
    const newIsActive =
      params.isActive === undefined
        ? true
        : params.isActive === true
        ? false
        : undefined;
    updateParams({ page: 1, isActive: newIsActive });
  };

  return {
    // Data
    data,
    isLoading,
    error,
    params,

    // Actions
    updateParams,
    resetParams,
    deletePromotion,
    goToPage,
    changePageSize,
    toggleActiveFilter,

    // States
    deleting: deleteMutation.isPending,
  };
};
