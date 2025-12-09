import PromotionManagementPage from "../pages/promotion-management.page.tsx";
import { ROUTE_PATH } from "../../../constants/route-path.constants";
import { PermissionGuard } from "../../../components/permission-guard.component";
import { PAGE_PERMISSIONS } from "../../../constants/permissions.constants";

const PromotionRoutes = {
  path: ROUTE_PATH.PROMOTIONS,
  element: (
    <PermissionGuard permission={PAGE_PERMISSIONS.PROMOTIONS}>
      <PromotionManagementPage />
    </PermissionGuard>
  ),
};

export default PromotionRoutes;
