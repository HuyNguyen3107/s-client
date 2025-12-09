import RolesPage from "../pages/roles.page";
import { ROUTE_PATH } from "../../../constants/route-path.constants";
import { PermissionGuard } from "../../../components/permission-guard.component";
import { PAGE_PERMISSIONS } from "../../../constants/permissions.constants";

const RolesRoutes = {
  path: ROUTE_PATH.ROLES,
  element: (
    <PermissionGuard permission={PAGE_PERMISSIONS.ROLES}>
      <RolesPage />
    </PermissionGuard>
  ),
};

export default RolesRoutes;
