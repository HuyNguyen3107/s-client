import React, { type ReactNode } from "react";
import { PermissionGuard } from "../components/permission-guard.component";
import { PERMISSIONS } from "../constants/permissions.constants";

interface FeaturePermissionWrapperProps {
  children: ReactNode;
  feature: keyof typeof FEATURE_PERMISSIONS;
  action?: "VIEW" | "CREATE" | "UPDATE" | "DELETE" | "LIST" | "MANAGE";
  fallback?: ReactNode;
  showError?: boolean;
}

// Map features to their permission prefixes
// Chỉ bao gồm các quyền thực sự có trong hệ thống
export const FEATURE_PERMISSIONS = {
  USERS: {
    VIEW: PERMISSIONS.USERS_VIEW,
    CREATE: PERMISSIONS.USERS_CREATE,
    UPDATE: PERMISSIONS.USERS_UPDATE,
    DELETE: PERMISSIONS.USERS_DELETE,
    LIST: PERMISSIONS.USERS_LIST,
    MANAGE: PERMISSIONS.USERS_MANAGE,
  },
  ROLES: {
    VIEW: PERMISSIONS.ROLES_VIEW,
    CREATE: PERMISSIONS.ROLES_CREATE,
    UPDATE: PERMISSIONS.ROLES_UPDATE,
    DELETE: PERMISSIONS.ROLES_DELETE,
    LIST: PERMISSIONS.ROLES_LIST,
    MANAGE: PERMISSIONS.ROLES_MANAGE,
  },
  PRODUCTS: {
    VIEW: PERMISSIONS.PRODUCTS_VIEW,
    CREATE: PERMISSIONS.PRODUCTS_CREATE,
    UPDATE: PERMISSIONS.PRODUCTS_UPDATE,
    DELETE: PERMISSIONS.PRODUCTS_DELETE,
    MANAGE: PERMISSIONS.PRODUCTS_MANAGE,
  },
  PRODUCT_VARIANTS: {
    VIEW: PERMISSIONS.PRODUCT_VARIANTS_VIEW,
    CREATE: PERMISSIONS.PRODUCT_VARIANTS_CREATE,
    UPDATE: PERMISSIONS.PRODUCT_VARIANTS_UPDATE,
    DELETE: PERMISSIONS.PRODUCT_VARIANTS_DELETE,
    MANAGE: PERMISSIONS.PRODUCT_VARIANTS_MANAGE,
  },
  PRODUCT_CATEGORIES: {
    VIEW: PERMISSIONS.PRODUCT_CATEGORIES_VIEW,
    CREATE: PERMISSIONS.PRODUCT_CATEGORIES_CREATE,
    UPDATE: PERMISSIONS.PRODUCT_CATEGORIES_UPDATE,
    DELETE: PERMISSIONS.PRODUCT_CATEGORIES_DELETE,
    MANAGE: PERMISSIONS.PRODUCT_CATEGORIES_MANAGE,
  },
  PRODUCT_CUSTOMS: {
    VIEW: PERMISSIONS.PRODUCT_CUSTOMS_VIEW,
    CREATE: PERMISSIONS.PRODUCT_CUSTOMS_CREATE,
    UPDATE: PERMISSIONS.PRODUCT_CUSTOMS_UPDATE,
    DELETE: PERMISSIONS.PRODUCT_CUSTOMS_DELETE,
    MANAGE: PERMISSIONS.PRODUCT_CUSTOMS_MANAGE,
  },
  COLLECTIONS: {
    VIEW: PERMISSIONS.COLLECTIONS_VIEW,
    CREATE: PERMISSIONS.COLLECTIONS_CREATE,
    UPDATE: PERMISSIONS.COLLECTIONS_UPDATE,
    DELETE: PERMISSIONS.COLLECTIONS_DELETE,
    MANAGE: PERMISSIONS.COLLECTIONS_MANAGE,
  },
  BACKGROUNDS: {
    VIEW: PERMISSIONS.BACKGROUNDS_VIEW,
    CREATE: PERMISSIONS.BACKGROUNDS_CREATE,
    UPDATE: PERMISSIONS.BACKGROUNDS_UPDATE,
    DELETE: PERMISSIONS.BACKGROUNDS_DELETE,
    MANAGE: PERMISSIONS.BACKGROUNDS_MANAGE,
  },
  ORDERS: {
    VIEW: PERMISSIONS.ORDERS_VIEW,
    UPDATE: PERMISSIONS.ORDERS_UPDATE,
    DELETE: PERMISSIONS.ORDERS_DELETE,
    LIST: PERMISSIONS.ORDERS_LIST,
    MANAGE: PERMISSIONS.ORDERS_MANAGE,
  },
  INVENTORY: {
    VIEW: PERMISSIONS.INVENTORY_VIEW,
    CREATE: PERMISSIONS.INVENTORY_CREATE,
    UPDATE: PERMISSIONS.INVENTORY_UPDATE,
    DELETE: PERMISSIONS.INVENTORY_DELETE,
    LIST: PERMISSIONS.INVENTORY_LIST,
    MANAGE: PERMISSIONS.INVENTORY_MANAGE,
  },
  FEEDBACKS: {
    VIEW: PERMISSIONS.FEEDBACKS_VIEW,
    UPDATE: PERMISSIONS.FEEDBACKS_UPDATE,
    DELETE: PERMISSIONS.FEEDBACKS_DELETE,
    MANAGE: PERMISSIONS.FEEDBACKS_MANAGE,
  },
  PROMOTIONS: {
    VIEW: PERMISSIONS.PROMOTIONS_VIEW,
    CREATE: PERMISSIONS.PROMOTIONS_CREATE,
    UPDATE: PERMISSIONS.PROMOTIONS_UPDATE,
    DELETE: PERMISSIONS.PROMOTIONS_DELETE,
    LIST: PERMISSIONS.PROMOTIONS_LIST,
    MANAGE: PERMISSIONS.PROMOTIONS_MANAGE,
  },
  SHIPPING_FEES: {
    VIEW: PERMISSIONS.SHIPPING_FEES_VIEW,
    CREATE: PERMISSIONS.SHIPPING_FEES_CREATE,
    UPDATE: PERMISSIONS.SHIPPING_FEES_UPDATE,
    DELETE: PERMISSIONS.SHIPPING_FEES_DELETE,
    MANAGE: PERMISSIONS.SHIPPING_FEES_MANAGE,
  },
  CONSULTATIONS: {
    VIEW: PERMISSIONS.CONSULTATIONS_VIEW,
    LIST: PERMISSIONS.CONSULTATIONS_LIST,
    UPDATE: PERMISSIONS.CONSULTATIONS_UPDATE,
    DELETE: PERMISSIONS.CONSULTATIONS_DELETE,
    MANAGE: PERMISSIONS.CONSULTATIONS_MANAGE,
  },
  INFORMATIONS: {
    VIEW: PERMISSIONS.INFORMATIONS_VIEW,
    CREATE: PERMISSIONS.INFORMATIONS_CREATE,
    UPDATE: PERMISSIONS.INFORMATIONS_UPDATE,
    DELETE: PERMISSIONS.INFORMATIONS_DELETE,
    MANAGE: PERMISSIONS.INFORMATIONS_MANAGE,
  },
  UPLOAD: {
    CREATE: PERMISSIONS.UPLOAD_CREATE,
    DELETE: PERMISSIONS.UPLOAD_DELETE,
    MANAGE: PERMISSIONS.UPLOAD_MANAGE,
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
  action?: "VIEW" | "CREATE" | "UPDATE" | "DELETE" | "LIST" | "MANAGE";
}> = ({ children, action = "VIEW" }) => (
  <FeaturePermissionWrapper feature="USERS" action={action}>
    {children}
  </FeaturePermissionWrapper>
);

export const RolesPermissionGuard: React.FC<{
  children: ReactNode;
  action?: "VIEW" | "CREATE" | "UPDATE" | "DELETE" | "LIST" | "MANAGE";
}> = ({ children, action = "VIEW" }) => (
  <FeaturePermissionWrapper feature="ROLES" action={action}>
    {children}
  </FeaturePermissionWrapper>
);

export const ProductsPermissionGuard: React.FC<{
  children: ReactNode;
  action?: "VIEW" | "CREATE" | "UPDATE" | "DELETE" | "MANAGE";
}> = ({ children, action = "VIEW" }) => (
  <FeaturePermissionWrapper feature="PRODUCTS" action={action}>
    {children}
  </FeaturePermissionWrapper>
);

export const OrdersPermissionGuard: React.FC<{
  children: ReactNode;
  action?: "VIEW" | "UPDATE" | "DELETE" | "LIST" | "MANAGE";
}> = ({ children, action = "VIEW" }) => (
  <FeaturePermissionWrapper feature="ORDERS" action={action}>
    {children}
  </FeaturePermissionWrapper>
);

export const InventoryPermissionGuard: React.FC<{
  children: ReactNode;
  action?: "VIEW" | "CREATE" | "UPDATE" | "DELETE" | "LIST" | "MANAGE";
}> = ({ children, action = "VIEW" }) => (
  <FeaturePermissionWrapper feature="INVENTORY" action={action}>
    {children}
  </FeaturePermissionWrapper>
);

export const CollectionsPermissionGuard: React.FC<{
  children: ReactNode;
  action?: "VIEW" | "CREATE" | "UPDATE" | "DELETE" | "MANAGE";
}> = ({ children, action = "VIEW" }) => (
  <FeaturePermissionWrapper feature="COLLECTIONS" action={action}>
    {children}
  </FeaturePermissionWrapper>
);

export const BackgroundsPermissionGuard: React.FC<{
  children: ReactNode;
  action?: "VIEW" | "CREATE" | "UPDATE" | "DELETE" | "MANAGE";
}> = ({ children, action = "VIEW" }) => (
  <FeaturePermissionWrapper feature="BACKGROUNDS" action={action}>
    {children}
  </FeaturePermissionWrapper>
);

export const FeedbacksPermissionGuard: React.FC<{
  children: ReactNode;
  action?: "VIEW" | "UPDATE" | "DELETE" | "MANAGE";
}> = ({ children, action = "VIEW" }) => (
  <FeaturePermissionWrapper feature="FEEDBACKS" action={action}>
    {children}
  </FeaturePermissionWrapper>
);

export const PromotionsPermissionGuard: React.FC<{
  children: ReactNode;
  action?: "VIEW" | "CREATE" | "UPDATE" | "DELETE" | "LIST" | "MANAGE";
}> = ({ children, action = "VIEW" }) => (
  <FeaturePermissionWrapper feature="PROMOTIONS" action={action}>
    {children}
  </FeaturePermissionWrapper>
);

export const ShippingFeesPermissionGuard: React.FC<{
  children: ReactNode;
  action?: "VIEW" | "CREATE" | "UPDATE" | "DELETE" | "MANAGE";
}> = ({ children, action = "VIEW" }) => (
  <FeaturePermissionWrapper feature="SHIPPING_FEES" action={action}>
    {children}
  </FeaturePermissionWrapper>
);

export const ConsultationsPermissionGuard: React.FC<{
  children: ReactNode;
  action?: "VIEW" | "LIST" | "UPDATE" | "DELETE" | "MANAGE";
}> = ({ children, action = "VIEW" }) => (
  <FeaturePermissionWrapper feature="CONSULTATIONS" action={action}>
    {children}
  </FeaturePermissionWrapper>
);

export const InformationsPermissionGuard: React.FC<{
  children: ReactNode;
  action?: "VIEW" | "CREATE" | "UPDATE" | "DELETE" | "MANAGE";
}> = ({ children, action = "VIEW" }) => (
  <FeaturePermissionWrapper feature="INFORMATIONS" action={action}>
    {children}
  </FeaturePermissionWrapper>
);

export default FeaturePermissionWrapper;
