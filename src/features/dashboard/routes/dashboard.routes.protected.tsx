import { PermissionGuard } from "../../../components/permission-guard.component";
import { PAGE_PERMISSIONS } from "../../../constants/permissions.constants";
import { ROUTE_PATH } from "../../../constants/route-path.constants";
import DashboardPage from "../pages/dashboard.pages";
import FeedbackRoutes from "../../feedbacks/routes/feedback.routes";
import PromotionRoutes from "../../promotions/routes/promotion.routes";
import ShippingFeeRoutes from "../../shipping-fees/routes/shipping-fees.routes";
import ProductVariantsRoutes from "../../product-variants/routes/product-variants.routes";
import InventoryRoutes from "../../inventory/routes/inventory.routes";
import RolesRoutes from "../../roles/routes/roles.routes";
import UsersRoutes from "../../users/routes/users.routes";
import { DashboardCollectionsRoute } from "../../collections/routes/collections.routes";
import ProductsRoutes from "../../products/routes/products.routes";
import ProductCategoriesRoutes from "../../product-categories/routes/product-categories.routes";
import ProductCustomsRoutes from "../../product-customs/routes/product-customs.routes";
import BackgroundsRoutes from "../../backgrounds/routes/backgrounds.routes";
import InformationsRoutes from "../../informations/routes/informations.routes";
import ProfileRoute from "../../profile/routes/profile.routes";
import OrderManagementPage from "../../order/pages/order-management.page";
import OrderEditPage from "../../order/pages/order-edit.page";
import ConsultationsPage from "../../consultations/pages/consultations.page";
import DashboardLayout from "../../../layouts/dashboard.layouts";

const DashboardRoutesWithPermissions = {
  element: <DashboardLayout />,
  children: [
    {
      path: ROUTE_PATH.DASHBOARD,
      element: (
        <PermissionGuard permission={PAGE_PERMISSIONS.DASHBOARD}>
          <DashboardPage />
        </PermissionGuard>
      ),
    },
    {
      path: ROUTE_PATH.ORDER_MANAGEMENT,
      element: (
        <PermissionGuard permission={PAGE_PERMISSIONS.ORDER_MANAGEMENT}>
          <OrderManagementPage />
        </PermissionGuard>
      ),
    },
    {
      path: ROUTE_PATH.ORDER_EDIT,
      element: (
        <PermissionGuard permission={PAGE_PERMISSIONS.ORDER_MANAGEMENT}>
          <OrderEditPage />
        </PermissionGuard>
      ),
    },
    {
      path: "/dashboard/consultations",
      element: (
        <PermissionGuard permission={PAGE_PERMISSIONS.CONSULTATIONS}>
          <ConsultationsPage />
        </PermissionGuard>
      ),
    },
    // Profile - no permission required
    ProfileRoute,

    // Protected feature routes
    FeedbackRoutes,
    PromotionRoutes,
    ProductVariantsRoutes,
    InventoryRoutes,
    RolesRoutes,
    UsersRoutes,
    DashboardCollectionsRoute,
    ProductsRoutes,
    ProductCategoriesRoutes,
    ProductCustomsRoutes,
    BackgroundsRoutes,
    InformationsRoutes,
    {
      path: ROUTE_PATH.SHIPPING_FEES + "/*",
      element: <ShippingFeeRoutes />,
    },
  ],
};

export default DashboardRoutesWithPermissions;
