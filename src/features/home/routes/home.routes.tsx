import HomePage from "../page/home.page";
import MainLayout from "../../../layouts/main.layouts";
import { ROUTE_PATH } from "../../../constants/route-path.constants";

const HomeRoute = {
  element: <MainLayout />,
  children: [
    {
      path: ROUTE_PATH.HOME,
      element: <HomePage />,
    },
  ],
};

export default HomeRoute;
