import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { ROUTE_PATH } from "../../../constants/route-path.constants";
import { PermissionGuard } from "../../../components/permission-guard.component";
import { PAGE_PERMISSIONS } from "../../../constants/permissions.constants";

// Lazy load components for better performance
const ProductsPage = lazy(() => import("../pages/products.page"));

const ProductsRoutes: RouteObject = {
  path: ROUTE_PATH.PRODUCTS,
  element: (
    <PermissionGuard permission={PAGE_PERMISSIONS.PRODUCTS}>
      <Suspense
        fallback={
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        }
      >
        <ProductsPage />
      </Suspense>
    </PermissionGuard>
  ),
};

export default ProductsRoutes;
