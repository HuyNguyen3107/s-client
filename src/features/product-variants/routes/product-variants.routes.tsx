import { ProductVariantsPage } from "../pages/product-variants.page";
import { ROUTE_PATH } from "../../../constants/route-path.constants";
import { PermissionGuard } from "../../../components/permission-guard.component";
import { PAGE_PERMISSIONS } from "../../../constants/permissions.constants";

const ProductVariantsRoutes = {
  path: ROUTE_PATH.PRODUCT_VARIANTS,
  element: (
    <PermissionGuard permission={PAGE_PERMISSIONS.PRODUCT_VARIANTS}>
      <ProductVariantsPage />
    </PermissionGuard>
  ),
};

export default ProductVariantsRoutes;
