import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import type { ReactNode } from "react";
import { ROUTE_PATH } from "../constants/route-path.constants";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { token } = useAuthStore((state) => state);
  const isAuthPage = location.pathname === ROUTE_PATH.LOGIN;

  if (!token && !isAuthPage) {
    return <Navigate to={ROUTE_PATH.LOGIN} replace />;
  }

  if (token && isAuthPage) {
    return <Navigate to={ROUTE_PATH.DASHBOARD} replace />;
  }
  return <>{children}</>;
}
