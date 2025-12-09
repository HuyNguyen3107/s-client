import ProductOrderPage from "../pages/product-order.page";
import MainLayout from "../../../layouts/main.layouts";
import { ROUTE_PATH } from "../../../constants/route-path.constants";

const ProductOrderRoute = {
  element: <MainLayout />,
  children: [
    {
      path: ROUTE_PATH.PRODUCT_ORDER,
      element: <ProductOrderPage />,
    },
  ],
};

export default ProductOrderRoute;
