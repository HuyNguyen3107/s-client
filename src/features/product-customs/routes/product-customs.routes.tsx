import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { ROUTE_PATH } from "../../../constants/route-path.constants";
import { PermissionGuard } from "../../../components/permission-guard.component";
import { PAGE_PERMISSIONS } from "../../../constants/permissions.constants";

// Lazy load the main page component
const ProductCustomsPage = lazy(() =>
  import("../pages/product-customs.page").then((module) => ({
    default: module.ProductCustomsPage,
  }))
);

// Route configuration following Single Responsibility Principle
const ProductCustomsRoutes: RouteObject = {
  path: ROUTE_PATH.PRODUCT_CUSTOMS,
  element: (
    <PermissionGuard permission={PAGE_PERMISSIONS.PRODUCT_CUSTOMS}>
      <Suspense
        fallback={
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        }
      >
        <ProductCustomsPage />
      </Suspense>
    </PermissionGuard>
  ),
};

export default ProductCustomsRoutes;
