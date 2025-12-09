import DashboardLayout from "../../../layouts/dashboard.layouts";
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

const DashboardRoutes = {
  element: <DashboardLayout />,
  children: [
    {
      path: ROUTE_PATH.DASHBOARD,
      element: <DashboardPage />,
    },
    {
      path: ROUTE_PATH.ORDER_MANAGEMENT,
      element: <OrderManagementPage />,
    },
    {
      path: "/dashboard/orders/:id/edit",
      element: <OrderEditPage />,
    },
    {
      path: "/dashboard/consultations",
      element: <ConsultationsPage />,
    },
    ProfileRoute,
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

export default DashboardRoutes;
