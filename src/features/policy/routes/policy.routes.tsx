import MainLayout from "../../../layouts/main.layouts";
import PolicyPage from "../page/policy.page";

const PolicyRoute = {
  element: <MainLayout />,
  children: [
    {
      path: "/policy",
      element: <PolicyPage />,
    },
  ],
};

export default PolicyRoute;
