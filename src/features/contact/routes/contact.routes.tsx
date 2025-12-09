import { ROUTE_PATH } from "../../../constants/route-path.constants";
import MainLayout from "../../../layouts/main.layouts";
import ContactPage from "../page/contact.page";

const ContactRoute = {
  element: <MainLayout />,
  children: [
    {
      path: ROUTE_PATH.CONTACT,
      element: <ContactPage />,
    },
  ],
};

export default ContactRoute;
