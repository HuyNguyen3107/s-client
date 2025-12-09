import type { Permission } from "../constants/permissions.constants";
import { PERMISSIONS } from "../constants/permissions.constants";
import { ROUTE_PATH } from "../constants/route-path.constants";

export interface MenuItemPermission {
  path: string;
  permission: Permission | null;
}

// Map menu paths to required permissions
export const MENU_PERMISSIONS: Record<string, Permission | null> = {
  "/dashboard": null, // Dashboard accessible to all authenticated users
  "/dashboard/analytics": PERMISSIONS.REPORTS_VIEW,

  // User management
  [ROUTE_PATH.USERS]: PERMISSIONS.USERS_VIEW,
  [ROUTE_PATH.ROLES]: PERMISSIONS.ROLES_VIEW,

  // Products
  [ROUTE_PATH.PRODUCTS]: PERMISSIONS.PRODUCTS_VIEW,
  [ROUTE_PATH.PRODUCT_CATEGORIES]: PERMISSIONS.PRODUCT_CATEGORIES_VIEW,
  [ROUTE_PATH.PRODUCT_VARIANTS]: PERMISSIONS.PRODUCTS_VIEW,
  [ROUTE_PATH.PRODUCT_CUSTOMS]: PERMISSIONS.PRODUCTS_VIEW,

  // Inventory
  [ROUTE_PATH.INVENTORY]: PERMISSIONS.INVENTORY_VIEW,

  // Collections & Backgrounds
  [ROUTE_PATH.COLLECTIONS_MANAGEMENT]: PERMISSIONS.COLLECTIONS_VIEW,
  [ROUTE_PATH.BACKGROUNDS]: PERMISSIONS.BACKGROUNDS_VIEW,
  [ROUTE_PATH.INFORMATIONS]: PERMISSIONS.INFORMATIONS_VIEW,

  // Orders
  "/dashboard/order-management": PERMISSIONS.ORDERS_VIEW,
  "/dashboard/consultations": PERMISSIONS.CONSULTATIONS_VIEW,

  // Feedbacks & Promotions
  [ROUTE_PATH.FEEDBACKS]: PERMISSIONS.FEEDBACKS_VIEW,
  [ROUTE_PATH.PROMOTIONS]: PERMISSIONS.PROMOTIONS_VIEW,
  [ROUTE_PATH.SHIPPING_FEES]: PERMISSIONS.SHIPPING_FEES_VIEW,

  // Profile
  [ROUTE_PATH.PROFILE]: null, // Profile accessible to all
};

/**
 * Check if user has permission to access a menu item
 */
export const canAccessMenuItem = (
  path: string,
  userPermissions: string[]
): boolean => {
  const requiredPermission = MENU_PERMISSIONS[path];

  // No permission required - allow access
  if (!requiredPermission) {
    return true;
  }

  // Check if user has the required permission
  return userPermissions.includes(requiredPermission);
};

/**
 * Filter menu items based on user permissions
 */
export const filterMenuItemsByPermissions = <
  T extends { path: string; submenu?: T[] }
>(
  menuItems: T[],
  userPermissions: string[]
): T[] => {
  return (
    menuItems
      .filter((item) => canAccessMenuItem(item.path, userPermissions))
      .map((item) => {
        // Recursively filter submenu items
        if (item.submenu && item.submenu.length > 0) {
          return {
            ...item,
            submenu: filterMenuItemsByPermissions(
              item.submenu,
              userPermissions
            ),
          };
        }
        return item;
      })
      // Remove items with empty submenus
      .filter((item) => !item.submenu || item.submenu.length > 0)
  );
};
