import { ROUTE_PATH } from "../../../constants/route-path.constants";
import { UserListPage } from "../pages";
import { PermissionGuard } from "../../../components/permission-guard.component";
import { PAGE_PERMISSIONS } from "../../../constants/permissions.constants";

/**
 * User Management Routes - Following Single Responsibility Principle
 * Defines all routes related to user management
 */
const usersRoutes = {
  path: ROUTE_PATH.USERS,
  element: (
    <PermissionGuard permission={PAGE_PERMISSIONS.USERS}>
      <UserListPage />
    </PermissionGuard>
  ),
};

export default usersRoutes;
