import CollectionsPage from "../pages/collections.page";
import CollectionManagementPage from "../pages/collection-management.page";
import MainLayout from "../../../layouts/main.layouts";
import { ROUTE_PATH } from "../../../constants/route-path.constants";
import { PermissionGuard } from "../../../components/permission-guard.component";
import { PAGE_PERMISSIONS } from "../../../constants/permissions.constants";

// Public Collections Route
const CollectionsRoute = {
  element: <MainLayout />,
  children: [
    {
      path: ROUTE_PATH.COLLECTIONS,
      element: <CollectionsPage />,
    },
  ],
};

// Dashboard Collections Routes for Management (Protected)
export const DashboardCollectionsRoute = {
  path: ROUTE_PATH.COLLECTIONS_MANAGEMENT,
  element: (
    <PermissionGuard permission={PAGE_PERMISSIONS.COLLECTIONS}>
      <CollectionManagementPage />
    </PermissionGuard>
  ),
};

export default CollectionsRoute;
