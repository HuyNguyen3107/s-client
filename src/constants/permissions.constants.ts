/**
 * Permission constants aligned with backend
 * Format: module.action
 */
export const PERMISSIONS = {
  // ============================================
  // QUYỀN QUẢN LÝ NGƯỜI DÙNG
  // ============================================
  USERS_VIEW: "users.view",
  USERS_CREATE: "users.create",
  USERS_UPDATE: "users.update",
  USERS_DELETE: "users.delete",
  USERS_LIST: "users.list",
  USERS_MANAGE: "users.manage",

  // ============================================
  // QUYỀN QUẢN LÝ VAI TRÒ
  // ============================================
  ROLES_VIEW: "roles.view",
  ROLES_CREATE: "roles.create",
  ROLES_UPDATE: "roles.update",
  ROLES_DELETE: "roles.delete",
  ROLES_LIST: "roles.list",
  ROLES_MANAGE: "roles.manage",

  // ============================================
  // QUYỀN QUẢN LÝ QUYỀN HẠN
  // ============================================
  PERMISSIONS_VIEW: "permissions.view",
  PERMISSIONS_CREATE: "permissions.create",
  PERMISSIONS_UPDATE: "permissions.update",
  PERMISSIONS_DELETE: "permissions.delete",
  PERMISSIONS_LIST: "permissions.list",
  PERMISSIONS_MANAGE: "permissions.manage",

  // ============================================
  // QUYỀN GÁN VAI TRÒ CHO NGƯỜI DÙNG
  // ============================================
  USER_ROLES_VIEW: "user-roles.view",
  USER_ROLES_ASSIGN: "user-roles.assign",
  USER_ROLES_REVOKE: "user-roles.revoke",
  USER_ROLES_MANAGE: "user-roles.manage",

  // ============================================
  // QUYỀN GÁN QUYỀN CHO VAI TRÒ
  // ============================================
  ROLE_PERMISSIONS_VIEW: "role-permissions.view",
  ROLE_PERMISSIONS_ASSIGN: "role-permissions.assign",
  ROLE_PERMISSIONS_REVOKE: "role-permissions.revoke",
  ROLE_PERMISSIONS_MANAGE: "role-permissions.manage",

  // ============================================
  // QUYỀN QUẢN LÝ BỘ SƯU TẬP
  // ============================================
  COLLECTIONS_VIEW: "collections.view",
  COLLECTIONS_CREATE: "collections.create",
  COLLECTIONS_UPDATE: "collections.update",
  COLLECTIONS_DELETE: "collections.delete",
  COLLECTIONS_LIST: "collections.list",
  COLLECTIONS_MANAGE: "collections.manage",

  // ============================================
  // QUYỀN QUẢN LÝ SẢN PHẨM
  // ============================================
  PRODUCTS_VIEW: "products.view",
  PRODUCTS_CREATE: "products.create",
  PRODUCTS_UPDATE: "products.update",
  PRODUCTS_DELETE: "products.delete",
  PRODUCTS_LIST: "products.list",
  PRODUCTS_MANAGE: "products.manage",

  // ============================================
  // QUYỀN QUẢN LÝ BIẾN THỂ SẢN PHẨM
  // ============================================
  PRODUCT_VARIANTS_VIEW: "product-variants.view",
  PRODUCT_VARIANTS_CREATE: "product-variants.create",
  PRODUCT_VARIANTS_UPDATE: "product-variants.update",
  PRODUCT_VARIANTS_DELETE: "product-variants.delete",
  PRODUCT_VARIANTS_LIST: "product-variants.list",
  PRODUCT_VARIANTS_MANAGE: "product-variants.manage",

  // ============================================
  // QUYỀN QUẢN LÝ DANH MỤC SẢN PHẨM
  // ============================================
  PRODUCT_CATEGORIES_VIEW: "product-categories.view",
  PRODUCT_CATEGORIES_CREATE: "product-categories.create",
  PRODUCT_CATEGORIES_UPDATE: "product-categories.update",
  PRODUCT_CATEGORIES_DELETE: "product-categories.delete",
  PRODUCT_CATEGORIES_LIST: "product-categories.list",
  PRODUCT_CATEGORIES_MANAGE: "product-categories.manage",

  // ============================================
  // QUYỀN QUẢN LÝ SẢN PHẨM TÙY CHỈNH
  // ============================================
  PRODUCT_CUSTOMS_VIEW: "product-customs.view",
  PRODUCT_CUSTOMS_CREATE: "product-customs.create",
  PRODUCT_CUSTOMS_UPDATE: "product-customs.update",
  PRODUCT_CUSTOMS_DELETE: "product-customs.delete",
  PRODUCT_CUSTOMS_LIST: "product-customs.list",
  PRODUCT_CUSTOMS_MANAGE: "product-customs.manage",

  // ============================================
  // QUYỀN QUẢN LÝ BACKGROUND
  // ============================================
  BACKGROUNDS_VIEW: "backgrounds.view",
  BACKGROUNDS_CREATE: "backgrounds.create",
  BACKGROUNDS_UPDATE: "backgrounds.update",
  BACKGROUNDS_DELETE: "backgrounds.delete",
  BACKGROUNDS_LIST: "backgrounds.list",
  BACKGROUNDS_MANAGE: "backgrounds.manage",

  // ============================================
  // QUYỀN QUẢN LÝ ĐƠN HÀNG
  // ============================================
  ORDERS_VIEW: "orders.view",
  ORDERS_CREATE: "orders.create",
  ORDERS_UPDATE: "orders.update",
  ORDERS_DELETE: "orders.delete",
  ORDERS_LIST: "orders.list",
  ORDERS_MANAGE: "orders.manage",
  ORDERS_ASSIGN: "orders.assign",
  ORDERS_UPDATE_STATUS: "orders.update-status",
  ORDERS_TRANSFER: "orders.transfer",
  ORDERS_EXPORT: "orders.export",

  // ============================================
  // QUYỀN QUẢN LÝ KHO HÀNG
  // ============================================
  INVENTORY_VIEW: "inventory.view",
  INVENTORY_CREATE: "inventory.create",
  INVENTORY_UPDATE: "inventory.update",
  INVENTORY_DELETE: "inventory.delete",
  INVENTORY_LIST: "inventory.list",
  INVENTORY_MANAGE: "inventory.manage",
  INVENTORY_ADJUST: "inventory.adjust",
  INVENTORY_RESERVE: "inventory.reserve",
  INVENTORY_REPORT: "inventory.report",

  // ============================================
  // QUYỀN QUẢN LÝ KHUYẾN MÃI
  // ============================================
  PROMOTIONS_VIEW: "promotions.view",
  PROMOTIONS_CREATE: "promotions.create",
  PROMOTIONS_UPDATE: "promotions.update",
  PROMOTIONS_DELETE: "promotions.delete",
  PROMOTIONS_LIST: "promotions.list",
  PROMOTIONS_MANAGE: "promotions.manage",
  PROMOTIONS_VALIDATE: "promotions.validate",

  // ============================================
  // QUYỀN QUẢN LÝ PHÍ VẬN CHUYỂN
  // ============================================
  SHIPPING_FEES_VIEW: "shipping-fees.view",
  SHIPPING_FEES_CREATE: "shipping-fees.create",
  SHIPPING_FEES_UPDATE: "shipping-fees.update",
  SHIPPING_FEES_DELETE: "shipping-fees.delete",
  SHIPPING_FEES_LIST: "shipping-fees.list",
  SHIPPING_FEES_MANAGE: "shipping-fees.manage",

  // ============================================
  // QUYỀN QUẢN LÝ PHẢN HỒI
  // ============================================
  FEEDBACKS_VIEW: "feedbacks.view",
  FEEDBACKS_CREATE: "feedbacks.create",
  FEEDBACKS_UPDATE: "feedbacks.update",
  FEEDBACKS_DELETE: "feedbacks.delete",
  FEEDBACKS_LIST: "feedbacks.list",
  FEEDBACKS_MANAGE: "feedbacks.manage",
  FEEDBACKS_RESPOND: "feedbacks.respond",

  // ============================================
  // QUYỀN QUẢN LÝ TƯ VẤN
  // ============================================
  CONSULTATIONS_VIEW: "consultations.view",
  CONSULTATIONS_CREATE: "consultations.create",
  CONSULTATIONS_UPDATE: "consultations.update",
  CONSULTATIONS_DELETE: "consultations.delete",
  CONSULTATIONS_LIST: "consultations.list",
  CONSULTATIONS_MANAGE: "consultations.manage",

  // ============================================
  // QUYỀN QUẢN LÝ THÔNG TIN (PAGES)
  // ============================================
  INFORMATIONS_VIEW: "informations.view",
  INFORMATIONS_CREATE: "informations.create",
  INFORMATIONS_UPDATE: "informations.update",
  INFORMATIONS_DELETE: "informations.delete",
  INFORMATIONS_LIST: "informations.list",
  INFORMATIONS_MANAGE: "informations.manage",

  // ============================================
  // QUYỀN QUẢN LÝ THÔNG BÁO
  // ============================================
  NOTIFICATIONS_VIEW: "notifications.view",
  NOTIFICATIONS_CREATE: "notifications.create",
  NOTIFICATIONS_UPDATE: "notifications.update",
  NOTIFICATIONS_DELETE: "notifications.delete",
  NOTIFICATIONS_LIST: "notifications.list",
  NOTIFICATIONS_MANAGE: "notifications.manage",
  NOTIFICATIONS_SEND: "notifications.send",

  // ============================================
  // QUYỀN QUẢN LÝ UPLOAD
  // ============================================
  UPLOAD_VIEW: "upload.view",
  UPLOAD_CREATE: "upload.create",
  UPLOAD_DELETE: "upload.delete",
  UPLOAD_MANAGE: "upload.manage",

  // ============================================
  // QUYỀN BÁO CÁO & THỐNG KÊ
  // ============================================
  REPORTS_VIEW: "reports.view",
  REPORTS_ORDERS: "reports.orders",
  REPORTS_INVENTORY: "reports.inventory",
  REPORTS_REVENUE: "reports.revenue",
  REPORTS_USERS: "reports.users",
  REPORTS_EXPORT: "reports.export",
  REPORTS_MANAGE: "reports.manage",

  // ============================================
  // QUYỀN CÀI ĐẶT HỆ THỐNG
  // ============================================
  SETTINGS_VIEW: "settings.view",
  SETTINGS_UPDATE: "settings.update",
  SETTINGS_MANAGE: "settings.manage",

  // ============================================
  // QUYỀN HỆ THỐNG (SUPER ADMIN)
  // ============================================
  SYSTEM_ADMIN: "system.admin",
  SYSTEM_CONFIG: "system.config",
  SYSTEM_BACKUP: "system.backup",
  SYSTEM_RESTORE: "system.restore",
  SYSTEM_LOGS: "system.logs",
} as const;

// Permission types
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Page permissions mapping - quyền cần để xem trang
export const PAGE_PERMISSIONS = {
  DASHBOARD: null, // No specific permission needed
  USERS: PERMISSIONS.USERS_VIEW,
  ROLES: PERMISSIONS.ROLES_VIEW,
  PERMISSIONS: PERMISSIONS.PERMISSIONS_VIEW,
  PRODUCTS: PERMISSIONS.PRODUCTS_VIEW,
  PRODUCT_VARIANTS: PERMISSIONS.PRODUCT_VARIANTS_VIEW,
  PRODUCT_CATEGORIES: PERMISSIONS.PRODUCT_CATEGORIES_VIEW,
  PRODUCT_CUSTOMS: PERMISSIONS.PRODUCT_CUSTOMS_VIEW,
  COLLECTIONS: PERMISSIONS.COLLECTIONS_VIEW,
  BACKGROUNDS: PERMISSIONS.BACKGROUNDS_VIEW,
  ORDERS: PERMISSIONS.ORDERS_VIEW,
  ORDER_MANAGEMENT: PERMISSIONS.ORDERS_VIEW,
  INVENTORY: PERMISSIONS.INVENTORY_VIEW,
  PROMOTIONS: PERMISSIONS.PROMOTIONS_VIEW,
  SHIPPING_FEES: PERMISSIONS.SHIPPING_FEES_VIEW,
  FEEDBACKS: PERMISSIONS.FEEDBACKS_VIEW,
  CONSULTATIONS: PERMISSIONS.CONSULTATIONS_VIEW,
  INFORMATIONS: PERMISSIONS.INFORMATIONS_VIEW,
  NOTIFICATIONS: PERMISSIONS.NOTIFICATIONS_VIEW,
  REPORTS: PERMISSIONS.REPORTS_VIEW,
  SETTINGS: PERMISSIONS.SETTINGS_VIEW,
} as const;

// Permission groups for easier management
export const PERMISSION_GROUPS = {
  USER_MANAGEMENT: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.USERS_LIST,
    PERMISSIONS.USERS_MANAGE,
  ],
  ROLE_MANAGEMENT: [
    PERMISSIONS.ROLES_VIEW,
    PERMISSIONS.ROLES_CREATE,
    PERMISSIONS.ROLES_UPDATE,
    PERMISSIONS.ROLES_DELETE,
    PERMISSIONS.ROLES_LIST,
    PERMISSIONS.ROLES_MANAGE,
  ],
  PRODUCT_MANAGEMENT: [
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.PRODUCTS_CREATE,
    PERMISSIONS.PRODUCTS_UPDATE,
    PERMISSIONS.PRODUCTS_DELETE,
    PERMISSIONS.PRODUCTS_LIST,
    PERMISSIONS.PRODUCTS_MANAGE,
  ],
  ORDER_MANAGEMENT: [
    PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.ORDERS_CREATE,
    PERMISSIONS.ORDERS_UPDATE,
    PERMISSIONS.ORDERS_DELETE,
    PERMISSIONS.ORDERS_LIST,
    PERMISSIONS.ORDERS_MANAGE,
    PERMISSIONS.ORDERS_ASSIGN,
    PERMISSIONS.ORDERS_UPDATE_STATUS,
    PERMISSIONS.ORDERS_TRANSFER,
    PERMISSIONS.ORDERS_EXPORT,
  ],
  INVENTORY_MANAGEMENT: [
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.INVENTORY_CREATE,
    PERMISSIONS.INVENTORY_UPDATE,
    PERMISSIONS.INVENTORY_DELETE,
    PERMISSIONS.INVENTORY_LIST,
    PERMISSIONS.INVENTORY_MANAGE,
    PERMISSIONS.INVENTORY_ADJUST,
    PERMISSIONS.INVENTORY_RESERVE,
    PERMISSIONS.INVENTORY_REPORT,
  ],
  SYSTEM_MANAGEMENT: [
    PERMISSIONS.SYSTEM_ADMIN,
    PERMISSIONS.SYSTEM_CONFIG,
    PERMISSIONS.SYSTEM_BACKUP,
    PERMISSIONS.SYSTEM_RESTORE,
    PERMISSIONS.SYSTEM_LOGS,
  ],
} as const;
