import { useRoutes } from "react-router-dom";
import HomeRoute from "../features/home/routes/home.routes";
import AboutRoute from "../features/about/routes/about.routes";
import CollectionsRoute from "../features/collections/routes/collections.routes";
import PolicyRoute from "../features/policy/routes/policy.routes";
import ContactRoute from "../features/contact/routes/contact.routes";
import LoginRoute from "../features/login/routes/login.routes";
import DashboardRoutes from "../features/dashboard/routes/dashboard.routes";
import ProductOrderRoute from "../features/product-order/routes/product-order.routes";
import ProductCustomizeRoute from "../features/product-customize/routes/product-customize.routes";
import BackgroundCustomizeRoute from "../features/background-customize/routes/background-customize.routes";
import OrderRoute from "../features/order/routes/order.routes";

const AppRoutes = () => {
  return useRoutes([
    HomeRoute,
    AboutRoute,
    CollectionsRoute,
    ProductOrderRoute,
    ProductCustomizeRoute,
    BackgroundCustomizeRoute,
    OrderRoute,
    PolicyRoute,
    ContactRoute,
    LoginRoute,
    DashboardRoutes,
  ]);
};

export default AppRoutes;
