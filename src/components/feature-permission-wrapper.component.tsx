import React, { type ReactNode } from "react";
import { PermissionGuard } from "../components/permission-guard.component";
import { PERMISSIONS } from "../constants/permissions.constants";

interface FeaturePermissionWrapperProps {
  children: ReactNode;
  feature: keyof typeof FEATURE_PERMISSIONS;
  action?: "VIEW" | "CREATE" | "UPDATE" | "DELETE";
  fallback?: ReactNode;
  showError?: boolean;
}

// Map features to their permission prefixes
export const FEATURE_PERMISSIONS = {
  USERS: {
    VIEW: PERMISSIONS.USERS_VIEW,
    CREATE: PERMISSIONS.USERS_CREATE,
    UPDATE: PERMISSIONS.USERS_UPDATE,
    DELETE: PERMISSIONS.USERS_DELETE,
  },
  ROLES: {
    VIEW: PERMISSIONS.ROLES_VIEW,
    CREATE: PERMISSIONS.ROLES_CREATE,
    UPDATE: PERMISSIONS.ROLES_UPDATE,
    DELETE: PERMISSIONS.ROLES_DELETE,
  },
  PRODUCTS: {
    VIEW: PERMISSIONS.PRODUCTS_VIEW,
    CREATE: PERMISSIONS.PRODUCTS_CREATE,
    UPDATE: PERMISSIONS.PRODUCTS_UPDATE,
    DELETE: PERMISSIONS.PRODUCTS_DELETE,
  },
  COLLECTIONS: {
    VIEW: PERMISSIONS.COLLECTIONS_VIEW,
    CREATE: PERMISSIONS.COLLECTIONS_CREATE,
    UPDATE: PERMISSIONS.COLLECTIONS_UPDATE,
    DELETE: PERMISSIONS.COLLECTIONS_DELETE,
  },
  ORDERS: {
    VIEW: PERMISSIONS.ORDERS_VIEW,
    CREATE: PERMISSIONS.ORDERS_CREATE,
    UPDATE: PERMISSIONS.ORDERS_UPDATE,
    DELETE: PERMISSIONS.ORDERS_DELETE,
  },
  INVENTORY: {
    VIEW: PERMISSIONS.INVENTORY_VIEW,
    UPDATE: PERMISSIONS.INVENTORY_UPDATE,
  },
  FEEDBACKS: {
    VIEW: PERMISSIONS.FEEDBACKS_VIEW,
    CREATE: PERMISSIONS.FEEDBACKS_CREATE,
    UPDATE: PERMISSIONS.FEEDBACKS_UPDATE,
    DELETE: PERMISSIONS.FEEDBACKS_DELETE,
  },
  PROMOTIONS: {
    VIEW: PERMISSIONS.PROMOTIONS_VIEW,
    CREATE: PERMISSIONS.PROMOTIONS_CREATE,
    UPDATE: PERMISSIONS.PROMOTIONS_UPDATE,
    DELETE: PERMISSIONS.PROMOTIONS_DELETE,
  },
  SHIPPING: {
    VIEW: PERMISSIONS.SHIPPING_FEES_VIEW,
    CREATE: PERMISSIONS.SHIPPING_FEES_CREATE,
    UPDATE: PERMISSIONS.SHIPPING_FEES_UPDATE,
    DELETE: PERMISSIONS.SHIPPING_FEES_DELETE,
  },
  BACKGROUNDS: {
    VIEW: PERMISSIONS.BACKGROUNDS_VIEW,
    CREATE: PERMISSIONS.BACKGROUNDS_CREATE,
    UPDATE: PERMISSIONS.BACKGROUNDS_UPDATE,
    DELETE: PERMISSIONS.BACKGROUNDS_DELETE,
  },
  CONSULTATIONS: {
    VIEW: PERMISSIONS.CONSULTATIONS_VIEW,
    CREATE: PERMISSIONS.CONSULTATIONS_CREATE,
    UPDATE: PERMISSIONS.CONSULTATIONS_UPDATE,
    DELETE: PERMISSIONS.CONSULTATIONS_DELETE,
  },
  REPORTS: {
    VIEW: PERMISSIONS.REPORTS_VIEW,
  },
} as const;

/**
 * Feature Permission Wrapper
 * Wraps a feature component with permission check
 */
export const FeaturePermissionWrapper: React.FC<
  FeaturePermissionWrapperProps
> = ({ children, feature, action = "VIEW", fallback, showError = true }) => {
  const permissions = FEATURE_PERMISSIONS[feature];
  const requiredPermission = (permissions as any)[action];

  return (
    <PermissionGuard
      permission={requiredPermission}
      fallback={fallback}
      showError={showError}
    >
      {children}
    </PermissionGuard>
  );
};

// Shorthand components for common use cases
export const UsersPermissionGuard: React.FC<{
  children: ReactNode;
  action?: "VIEW" | "CREATE" | "UPDATE" | "DELETE";
}> = ({ children, action = "VIEW" }) => (
  <FeaturePermissionWrapper feature="USERS" action={action}>
    {children}
  </FeaturePermissionWrapper>
);

export const RolesPermissionGuard: React.FC<{
  children: ReactNode;
  action?: "VIEW" | "CREATE" | "UPDATE" | "DELETE";
}> = ({ children, action = "VIEW" }) => (
  <FeaturePermissionWrapper feature="ROLES" action={action}>
    {children}
  </FeaturePermissionWrapper>
);

export const ProductsPermissionGuard: React.FC<{
  children: ReactNode;
  action?: "VIEW" | "CREATE" | "UPDATE" | "DELETE";
}> = ({ children, action = "VIEW" }) => (
  <FeaturePermissionWrapper feature="PRODUCTS" action={action}>
    {children}
  </FeaturePermissionWrapper>
);

export const OrdersPermissionGuard: React.FC<{
  children: ReactNode;
  action?: "VIEW" | "CREATE" | "UPDATE" | "DELETE";
}> = ({ children, action = "VIEW" }) => (
  <FeaturePermissionWrapper feature="ORDERS" action={action}>
    {children}
  </FeaturePermissionWrapper>
);

export const InventoryPermissionGuard: React.FC<{
  children: ReactNode;
  action?: "VIEW" | "UPDATE";
}> = ({ children, action = "VIEW" }) => (
  <FeaturePermissionWrapper feature="INVENTORY" action={action}>
    {children}
  </FeaturePermissionWrapper>
);

export default FeaturePermissionWrapper;
