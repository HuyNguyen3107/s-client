export const API_PATHS = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  USER_PROFILE: "/user/profile",
  // Feedbacks
  FEEDBACKS: "/feedbacks",
  FEEDBACK_BY_ID: (id: string) => `/feedbacks/${id}`,
  FEEDBACK_STATISTICS: "/feedbacks/statistics",
  // Promotions
  PROMOTIONS: "/promotions",
  PROMOTION_BY_ID: (id: string) => `/promotions/${id}`,
  PROMOTION_BY_CODE: (promoCode: string) => `/promotions/code/${promoCode}`,
  VALIDATE_PROMOTION: "/promotions/validate",
  APPLY_PROMOTION: (promoCode: string) => `/promotions/apply/${promoCode}`,
  ACTIVE_PROMOTIONS: "/promotions/active",
  PROMOTION_STATISTICS: "/promotions/statistics",
  // Roles
  ROLES: "/roles",
  ROLE_BY_ID: (id: string) => `/roles/${id}`,
  // Permissions
  PERMISSIONS: "/permissions",
  PERMISSION_BY_ID: (id: string) => `/permissions/${id}`,
  // Role Permissions
  ROLE_PERMISSIONS: "/role-permissions",
  ROLE_PERMISSIONS_BY_ROLE: (roleId: string) =>
    `/role-permissions/role/${roleId}`,
  ASSIGN_PERMISSIONS_TO_ROLE: (roleId: string) =>
    `/role-permissions/assign/${roleId}`,
  REMOVE_PERMISSION_FROM_ROLE: (roleId: string, permissionId: string) =>
    `/role-permissions/role/${roleId}/permission/${permissionId}`,
  // Products
  PRODUCTS: "/products",
  PRODUCT_BY_ID: (id: string) => `/products/${id}`,
  PRODUCTS_BY_COLLECTION: (collectionId: string) =>
    `/products/collection/${collectionId}`,
  PRODUCT_STATUS: (id: string) => `/products/${id}/status`,
  PRODUCT_STATISTICS: "/products/statistics",
  // Product Categories
  PRODUCT_CATEGORIES: "/product-categories",
  PRODUCT_CATEGORY_BY_ID: (id: string) => `/product-categories/${id}`,
  PRODUCT_CATEGORIES_BY_PRODUCT: (productId: string) =>
    `/product-categories/product/${productId}`,
  PRODUCT_CATEGORY_STATISTICS: "/product-categories/statistics",
  // Product Variants
  PRODUCT_VARIANTS: "/product-variants",
  PRODUCT_VARIANT_BY_ID: (id: string) => `/product-variants/${id}`,
  PRODUCT_VARIANTS_BY_PRODUCT: (productId: string) =>
    `/product-variants/product/${productId}`,
  PRODUCT_VARIANT_STATUS: (id: string) => `/product-variants/${id}/status`,
  PRODUCT_VARIANT_DUPLICATE: (id: string) =>
    `/product-variants/${id}/duplicate`,
  PRODUCT_VARIANT_STATISTICS: "/product-variants/statistics",
  // Product Customs
  PRODUCT_CUSTOMS: "/product-customs",
  PRODUCT_CUSTOM_BY_ID: (id: string) => `/product-customs/${id}`,
  PRODUCT_CUSTOMS_BY_CATEGORY: (categoryId: string) =>
    `/product-customs/category/${categoryId}`,
  PRODUCT_CUSTOM_STATUS: (id: string) => `/product-customs/${id}/status`,
  PRODUCT_CUSTOM_STATISTICS: "/product-customs/statistics",
  // Collections
  COLLECTIONS: "/collections",
  COLLECTION_BY_ID: (id: string) => `/collections/${id}`,
  HOT_COLLECTIONS: "/collections/hot",
  COLLECTION_BY_SLUG: (slug: string) => `/collections/route/${slug}`,
  COLLECTION_TOGGLE_STATUS: (id: string) => `/collections/${id}/toggle-status`,
  // Upload
  UPLOAD_IMAGE: "/upload/image",
  UPLOAD_IMAGES: "/upload/images",
  DELETE_IMAGE: (publicId: string) => `/upload/image/${publicId}`,
  // Shipping Fees
  SHIPPING_FEES: "/shipping-fees",
  SHIPPING_FEE_BY_ID: (id: string) => `/shipping-fees/${id}`,
  SHIPPING_FEE_AREAS: "/shipping-fees/areas",
  SHIPPING_FEE_TYPES: "/shipping-fees/shipping-types",
  SHIPPING_FEE_STATISTICS: "/shipping-fees/statistics",
  SHIPPING_FEE_BY_AREA: (area: string) => `/shipping-fees/by-area/${area}`,
  SHIPPING_FEE_SEARCH: "/shipping-fees/search",
  // Inventory
  INVENTORY: "/inventory",
  INVENTORY_BY_ID: (id: string) => `/inventory/${id}`,
  INVENTORY_BY_PRODUCT_CUSTOM: (productCustomId: string) =>
    `/inventory/product-custom/${productCustomId}`,
  INVENTORY_LOW_STOCK: "/inventory/low-stock",
  INVENTORY_REPORT: "/inventory/report",
  INVENTORY_ADJUST_STOCK: (id: string) => `/inventory/${id}/adjust-stock`,
  INVENTORY_RESERVE_STOCK: (id: string) => `/inventory/${id}/reserve-stock`,
  INVENTORY_RELEASE_RESERVED_STOCK: (id: string) =>
    `/inventory/${id}/release-reserved-stock`,
  // Users
  USERS: "/user",
  USER_BY_ID: (id: string) => `/user/${id}`,
  USER_ROLES: (userId: string) => `/user/${userId}/roles`,
  // User Roles
  USER_ROLES_MANAGEMENT: "/user-roles",
  USER_ROLE_BY_ID: (id: string) => `/user-roles/${id}`,
  ASSIGN_ROLES_TO_USER: "/user-roles/assign",
  REMOVE_ROLES_FROM_USER: (userId: string) =>
    `/user-roles/user/${userId}/roles`,
  USERS_BY_ROLE: (roleId: string) => `/user-roles/role/${roleId}/users`,
  // User Permissions
  USER_PERMISSIONS: (userId: string) =>
    `/user-permissions/user/${userId}/permissions`,
  USER_ROLES_BY_USER: (userId: string) =>
    `/user-permissions/user/${userId}/roles`,
  CHECK_USER_PERMISSION: (userId: string, permission: string) =>
    `/user-permissions/user/${userId}/permission/${permission}`,
  CHECK_USER_ROLE: (userId: string, role: string) =>
    `/user-permissions/user/${userId}/role/${role}`,
  // Backgrounds
  BACKGROUNDS: "/backgrounds",
  BACKGROUND_BY_ID: (id: string) => `/backgrounds/${id}`,
  BACKGROUNDS_BY_PRODUCT: (productId: string) =>
    `/backgrounds/product/${productId}`,
  // Orders
  ORDERS: "/orders",
  ORDER_BY_ID: (id: string) => `/orders/${id}`,
  // Consultations
  CONSULTATIONS: "/consultations",
  CONSULTATION_BY_ID: (id: string) => `/consultations/${id}`,
  CONSULTATION_UPDATE_STATUS: (id: string) => `/consultations/${id}/status`,
  // Informations
  INFORMATIONS: "/informations",
  INFORMATION_BY_ID: (id: string) => `/informations/${id}`,
};
