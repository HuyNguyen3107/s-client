import type { RouteObject } from "react-router-dom";
import { ROUTE_PATH } from "../../../constants/route-path.constants";
import OrderPage from "../pages/order.page";
import OrderTrackingPage from "../pages/order-tracking.page";
import CheckoutPage from "../pages/checkout.page";
import BatchCheckoutPage from "../pages/batch-checkout.page";

const OrderRoute: RouteObject = {
  children: [
    {
      path: ROUTE_PATH.ORDER,
      element: <OrderPage />,
    },
    {
      path: "/checkout",
      element: <CheckoutPage />,
    },
    {
      path: "/batch-checkout",
      element: <BatchCheckoutPage />,
    },
    {
      path: ROUTE_PATH.ORDER_TRACKING,
      element: <OrderTrackingPage />,
    },
  ],
};

export default OrderRoute;
