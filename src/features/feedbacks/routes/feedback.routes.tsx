import FeedbackManagementPage from "../pages/feedback-management.pages";
import { ROUTE_PATH } from "../../../constants/route-path.constants";
import { PermissionGuard } from "../../../components/permission-guard.component";
import { PAGE_PERMISSIONS } from "../../../constants/permissions.constants";

const FeedbackRoutes = {
  path: ROUTE_PATH.FEEDBACKS,
  element: (
    <PermissionGuard permission={PAGE_PERMISSIONS.FEEDBACKS}>
      <FeedbackManagementPage />
    </PermissionGuard>
  ),
};

export default FeedbackRoutes;
