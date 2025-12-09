import { ROUTE_PATH } from "../../../constants/route-path.constants";
import InventoryPage from "../pages/inventory.page";
import { PermissionGuard } from "../../../components/permission-guard.component";
import { PAGE_PERMISSIONS } from "../../../constants/permissions.constants";

const InventoryRoutes = {
  path: ROUTE_PATH.INVENTORY,
  element: (
    <PermissionGuard permission={PAGE_PERMISSIONS.INVENTORY}>
      <InventoryPage />
    </PermissionGuard>
  ),
};

export default InventoryRoutes;
