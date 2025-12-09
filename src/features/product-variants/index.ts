// Product Variants Feature Module
// Following SOLID principles with clear separation of concerns

// Main Page Component
export { ProductVariantsPage } from "./pages/product-variants.page";

// Components
export * from "./components";

// Hooks
export * from "./hooks";

// Services - export cụ thể để tránh conflict
export { ProductVariantService } from "./services/product-variant.service";

// Types - export cụ thể để tránh conflict  
export * from "./types/product-variant.types";

// Utils
export * from "./utils";

// Constants
export { PRODUCT_VARIANT_CONSTANTS } from "./constants";
