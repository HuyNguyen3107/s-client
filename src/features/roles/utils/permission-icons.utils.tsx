import React from "react";
import {
  People,
  TheaterComedy,
  Lock,
  GroupAdd,
  VpnKey,
  PersonAddAlt,
  Inventory2,
  Category,
  Palette,
  Tune,
  Collections,
  ShoppingCart,
  Warehouse,
  CardGiftcard,
  RateReview,
  LocalShipping,
  Assessment,
  Settings,
  Wallpaper,
  Phone,
  Notifications,
  CloudUpload,
  Build,
  Visibility,
  Add,
  Edit,
  Delete,
  Info,
  Send,
  SwapHoriz,
  FileDownload,
  PlaylistAddCheck,
  Bookmark,
  Reply,
  Backup,
  RestorePage,
  ListAlt,
  Assignment,
  FactCheck,
  AdminPanelSettings,
  ManageAccounts,
} from "@mui/icons-material";
import { type SvgIconProps } from "@mui/material";

/**
 * Get icon component for permission category
 */
export const getCategoryIcon = (
  category: string,
  props?: SvgIconProps
): React.ReactElement => {
  const iconMap: Record<string, React.ReactElement> = {
    users: <People {...props} />,
    roles: <TheaterComedy {...props} />,
    permissions: <Lock {...props} />,
    "user-roles": <GroupAdd {...props} />,
    "role-permissions": <VpnKey {...props} />,
    "user-permissions": <PersonAddAlt {...props} />,
    products: <Inventory2 {...props} />,
    "product-categories": <Category {...props} />,
    "product-variants": <Palette {...props} />,
    "product-customs": <Tune {...props} />,
    collections: <Collections {...props} />,
    orders: <ShoppingCart {...props} />,
    inventory: <Warehouse {...props} />,
    promotions: <CardGiftcard {...props} />,
    feedbacks: <RateReview {...props} />,
    "shipping-fees": <LocalShipping {...props} />,
    reports: <Assessment {...props} />,
    settings: <Settings {...props} />,
    backgrounds: <Wallpaper {...props} />,
    consultations: <Phone {...props} />,
    notifications: <Notifications {...props} />,
    informations: <Info {...props} />,
    upload: <CloudUpload {...props} />,
    system: <AdminPanelSettings {...props} />,
  };

  return iconMap[category.toLowerCase()] || <Build {...props} />;
};

/**
 * Get icon component for permission action
 */
export const getActionIcon = (
  action: string,
  props?: SvgIconProps
): React.ReactElement => {
  const iconMap: Record<string, React.ReactElement> = {
    view: <Visibility {...props} />,
    create: <Add {...props} />,
    update: <Edit {...props} />,
    delete: <Delete {...props} />,
    list: <ListAlt {...props} />,
    manage: <ManageAccounts {...props} />,
    files: <CloudUpload {...props} />,
    assign: <PlaylistAddCheck {...props} />,
    revoke: <Delete {...props} />,
    "update-status": <SwapHoriz {...props} />,
    transfer: <SwapHoriz {...props} />,
    export: <FileDownload {...props} />,
    adjust: <Tune {...props} />,
    reserve: <Bookmark {...props} />,
    report: <Assessment {...props} />,
    validate: <FactCheck {...props} />,
    respond: <Reply {...props} />,
    send: <Send {...props} />,
    backup: <Backup {...props} />,
    restore: <RestorePage {...props} />,
    logs: <Assignment {...props} />,
    admin: <AdminPanelSettings {...props} />,
    config: <Settings {...props} />,
    // Specific report actions
    orders: <ShoppingCart {...props} />,
    inventory: <Warehouse {...props} />,
    revenue: <Assessment {...props} />,
    users: <People {...props} />,
  };

  return iconMap[action.toLowerCase()] || <Settings {...props} />;
};

/**
 * Get color for category
 */
export const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    users: "primary",
    roles: "secondary",
    permissions: "error",
    "user-roles": "info",
    "role-permissions": "warning",
    "user-permissions": "success",
    products: "primary",
    "product-categories": "info",
    "product-variants": "secondary",
    "product-customs": "warning",
    collections: "secondary",
    orders: "success",
    inventory: "warning",
    promotions: "error",
    feedbacks: "info",
    "shipping-fees": "primary",
    reports: "success",
    settings: "warning",
    backgrounds: "secondary",
    consultations: "info",
    notifications: "error",
    informations: "info",
    upload: "primary",
    system: "error",
  };

  return colorMap[category.toLowerCase()] || "default";
};
