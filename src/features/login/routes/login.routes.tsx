import { ROUTE_PATH } from "../../../constants/route-path.constants";
import AuthLayout from "../../../layouts/auth.layouts";
import LoginPage from "../pages/login.pages";

const LoginRoute = {
  element: <AuthLayout />,
  children: [
    {
      path: ROUTE_PATH.LOGIN,
      element: <LoginPage />,
    },
  ],
};

export default LoginRoute;
