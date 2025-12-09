import BackgroundCustomizePage from "../pages/background-customize.page";
import MainLayout from "../../../layouts/main.layouts";
import { ROUTE_PATH } from "../../../constants/route-path.constants";

const BackgroundCustomizeRoute = {
  element: <MainLayout />,
  children: [
    {
      path: ROUTE_PATH.BACKGROUND_CUSTOMIZE,
      element: <BackgroundCustomizePage />,
    },
  ],
};

export default BackgroundCustomizeRoute;
