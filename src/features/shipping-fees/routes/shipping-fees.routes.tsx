import React from "react";
import { Routes, Route } from "react-router-dom";
import { ShippingFeesListPage } from "../pages";
import { PermissionGuard } from "../../../components/permission-guard.component";
import { PAGE_PERMISSIONS } from "../../../constants/permissions.constants";

/**
 * ShippingFeesRoutes Component
 * Following Single Responsibility Principle - only responsible for routing
 */
export const ShippingFeesRoutes: React.FC = () => {
  return (
    <PermissionGuard permission={PAGE_PERMISSIONS.SHIPPING_FEES}>
      <Routes>
        <Route index element={<ShippingFeesListPage />} />
        <Route path="/" element={<ShippingFeesListPage />} />
      </Routes>
    </PermissionGuard>
  );
};

export default ShippingFeesRoutes;
