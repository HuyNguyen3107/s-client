import type { RouteObject } from "react-router-dom";
import { BackgroundManagementPage } from "../pages";
import { ROUTE_PATH } from "../../../constants/route-path.constants";
import { PermissionGuard } from "../../../components/permission-guard.component";
import { PAGE_PERMISSIONS } from "../../../constants/permissions.constants";

/**
 * Background Routes - Following Open/Closed Principle (OCP)
 * Easy to extend with new routes without modifying existing code
 */

const BackgroundsRoutes: RouteObject = {
  path: ROUTE_PATH.BACKGROUNDS,
  element: (
    <PermissionGuard permission={PAGE_PERMISSIONS.BACKGROUNDS}>
      <BackgroundManagementPage />
    </PermissionGuard>
  ),
};

export default BackgroundsRoutes;
