import { ROUTE_PATH } from "../../../constants/route-path.constants";
import MainLayout from "../../../layouts/main.layouts";

import AboutPage from "../page/about.page";

const AboutRoute = {
  element: <MainLayout />,
  children: [
    {
      path: ROUTE_PATH.ABOUT,
      element: <AboutPage />,
    },
  ],
};

export default AboutRoute;
