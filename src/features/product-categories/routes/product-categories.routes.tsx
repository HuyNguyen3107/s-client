import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { ROUTE_PATH } from "../../../constants/route-path.constants";
import { PermissionGuard } from "../../../components/permission-guard.component";
import { PAGE_PERMISSIONS } from "../../../constants/permissions.constants";

// Lazy load components for better performance
const ProductCategoriesPage = lazy(
  () => import("../pages/product-categories.page")
);

/**
 * Product Categories Routes Configuration
 * Following Single Responsibility Principle - handles only routing configuration
 */
const ProductCategoriesRoutes: RouteObject = {
  path: ROUTE_PATH.PRODUCT_CATEGORIES,
  element: (
    <PermissionGuard permission={PAGE_PERMISSIONS.PRODUCT_CATEGORIES}>
      <Suspense
        fallback={
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        }
      >
        <ProductCategoriesPage />
      </Suspense>
    </PermissionGuard>
  ),
};

export default ProductCategoriesRoutes;
