// Components
// export { PromotionCard } from "./components/promotion-card.component";
export { PromotionForm } from "./components/promotion-form.component";
// export { PromotionValidatorComponent } from "./components/promotion-validator.component";

// Pages
// export { PromotionManagementPage } from "./pages/promotion-management.page";

// Hooks
export { usePromotionList } from "./hooks/use-promotion-list.hooks";
export { usePromotionForm } from "./hooks/use-promotion-form.hooks";
export { usePromotionValidator } from "./hooks/use-promotion-validator.hooks";
export { usePromotionStats } from "./hooks/use-promotion-stats.hooks";

// Queries and Mutations
export {
  usePromotions,
  usePromotionById,
  usePromotionByCode,
  useActivePromotions,
  usePromotionStatistics,
} from "./queries/promotion.queries";

export {
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
  useValidatePromotionMutation,
  useApplyPromotionMutation,
} from "./mutations/promotion.mutations";

// Services
export { promotionService } from "./services/promotion.services";

// Types
export type {
  Promotion,
  CreatePromotionRequest,
  UpdatePromotionRequest,
  PromotionListResponse,
  PromotionQueryParams,
  ValidatePromotionRequest,
  PromotionValidationResult,
  PromotionStatistics,
  IPromotionFormData,
  IPromotionValidator,
  ValidationResult,
} from "./types/promotion.types";

export { PromotionType } from "./types/promotion.types";

// Constants
export {
  PROMOTION_CONSTANTS,
  PROMOTION_MESSAGES,
  PROMOTION_STATUS_COLORS,
} from "./constants/promotion.constants";

// Routes
export { default as PromotionRoutes } from "./routes/promotion.routes";
