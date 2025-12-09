/**
 * Profile Routes
 */

import { ROUTE_PATH } from "../../../constants/route-path.constants";
import { ProfilePage } from "../pages";

const ProfileRoute = {
  path: ROUTE_PATH.PROFILE,
  element: <ProfilePage />,
};

export default ProfileRoute;
