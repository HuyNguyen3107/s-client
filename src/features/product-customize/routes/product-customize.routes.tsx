import ProductCustomizePage from "../pages/product-customize.page";
import MainLayout from "../../../layouts/main.layouts";
import { ROUTE_PATH } from "../../../constants/route-path.constants";

const ProductCustomizeRoute = {
  element: <MainLayout />,
  children: [
    {
      path: ROUTE_PATH.PRODUCT_CUSTOMIZE,
      element: <ProductCustomizePage />,
    },
  ],
};

export default ProductCustomizeRoute;
