import type { RouteObject } from "react-router-dom";
import { InformationManagementPage } from "../pages";
import { ROUTE_PATH } from "../../../constants/route-path.constants";
import { PermissionGuard } from "../../../components/permission-guard.component";
import { PAGE_PERMISSIONS } from "../../../constants/permissions.constants";

const InformationsRoutes: RouteObject = {
  path: ROUTE_PATH.INFORMATIONS,
  element: (
    <PermissionGuard permission={PAGE_PERMISSIONS.INFORMATIONS}>
      <InformationManagementPage />
    </PermissionGuard>
  ),
};

export default InformationsRoutes;
