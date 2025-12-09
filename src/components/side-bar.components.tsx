import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaChartBar,
  FaUsers,
  FaBox,
  FaComments,
  FaTag,
  FaTruck,
  FaUserCircle,
  FaSignOutAlt,
  FaAngleLeft,
  FaAngleRight,
  FaList,
  FaCube,
  FaPalette,
  FaWarehouse,
  FaUserShield,
  FaImages,
  FaShoppingCart,
  FaClipboardList,
  FaChartLine,
  FaPhoneAlt,
  FaCog,
} from "react-icons/fa";
import styles from "./side-bar.module.scss";
import { useLogout } from "../features/logout/hooks/use-logout.hooks";
import { useAuthStore } from "../store/auth.store";
import { useUserProfile } from "../hooks/use-user-profile.hooks";
import { ROUTE_PATH } from "../constants/route-path.constants";
import { usePermissions } from "../hooks/use-permissions.hook";
import { filterMenuItemsByPermissions } from "../utils/menu-permissions.utils";

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  submenu?: MenuItem[];
}

interface SideBarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const menuItems: MenuItem[] = [
  {
    path: "/dashboard",
    label: "Tổng quan",
    icon: <FaChartBar />,
  },
  // {
  //   path: "/dashboard/analytics",
  //   label: "Phân tích",
  //   icon: <FaChartLine />,
  // },
  {
    path: ROUTE_PATH.USERS,
    label: "Quản lý người dùng",
    icon: <FaUsers />,
  },
  {
    path: ROUTE_PATH.ROLES,
    label: "Vai trò & Quyền hạn",
    icon: <FaUserShield />,
  },
  {
    path: ROUTE_PATH.PRODUCTS,
    label: "Sản phẩm",
    icon: <FaBox />,
  },
  {
    path: ROUTE_PATH.PRODUCT_CATEGORIES,
    label: "Thể loại sản phẩm",
    icon: <FaList />,
  },
  {
    path: ROUTE_PATH.PRODUCT_VARIANTS,
    label: "Biến thể sản phẩm",
    icon: <FaCube />,
  },
  {
    path: ROUTE_PATH.PRODUCT_CUSTOMS,
    label: "Sản phẩm tùy chỉnh",
    icon: <FaPalette />,
  },
  {
    path: ROUTE_PATH.INVENTORY,
    label: "Quản lý Kho",
    icon: <FaWarehouse />,
  },
  {
    path: ROUTE_PATH.COLLECTIONS_MANAGEMENT,
    label: "Bộ sưu tập",
    icon: <FaBox />,
  },
  {
    path: ROUTE_PATH.BACKGROUNDS,
    label: "Background",
    icon: <FaImages />,
  },
  {
    path: ROUTE_PATH.INFORMATIONS,
    label: "Thông tin cấu hình",
    icon: <FaCog />,
  },
  {
    path: "/dashboard/order-management",
    label: "Quản lý đơn hàng",
    icon: <FaClipboardList />,
  },
  {
    path: "/dashboard/consultations",
    label: "Tư vấn khách hàng",
    icon: <FaPhoneAlt />,
  },
  // {
  //   path: "/dashboard/orders",
  //   label: "Đơn hàng",
  //   icon: <FaShoppingCart />,
  // },
  {
    path: ROUTE_PATH.FEEDBACKS,
    label: "Quản lý Feedbacks",
    icon: <FaComments />,
  },
  {
    path: ROUTE_PATH.PROMOTIONS,
    label: "Mã giảm giá",
    icon: <FaTag />,
  },
  {
    path: ROUTE_PATH.SHIPPING_FEES,
    label: "Phí vận chuyển",
    icon: <FaTruck />,
  },
];

const SideBar: React.FC<SideBarProps> = ({
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const { token, refreshToken, user } = useAuthStore();
  const { data: userProfile, isLoading: isUserLoading } = useUserProfile();
  const { permissions, isLoading: isLoadingPermissions } = usePermissions();
  const { onSubmit } = useLogout({
    accessToken: token || "",
    refreshToken: refreshToken || "",
  });

  // Use data from store first, then from API
  const currentUser = user || userProfile;

  // Filter menu items based on permissions
  const filteredMenuItems = React.useMemo(() => {
    if (isLoadingPermissions) {
      return menuItems; // Show all while loading
    }

    return filterMenuItemsByPermissions(menuItems, permissions);
  }, [permissions, isLoadingPermissions]);

  // Close mobile menu when route changes
  React.useEffect(() => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  }, [location.pathname]);

  const isActivePath = (path: string) => {
    // Exact match for the current path
    if (location.pathname === path) {
      return true;
    }

    // For dashboard root, only match exact path to avoid highlighting when on other pages
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }

    // For other paths, check if current path starts with the menu path
    // but make sure it's not just a partial match (e.g., /dashboard shouldn't match /dashboard/users)
    return location.pathname.startsWith(path + "/");
  };

  const toggleSubmenu = (path: string) => {
    setExpandedMenus((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const renderMenuItem = (item: MenuItem) => {
    const isActive = isActivePath(item.path);
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedMenus.includes(item.path);

    return (
      <li key={item.path} className={styles.menuItem}>
        <div className={styles.menuItemWrapper}>
          <Link
            to={item.path}
            className={`${styles.menuLink} ${isActive ? styles.active : ""}`}
            title={isCollapsed ? item.label : ""}
          >
            <span className={styles.menuIcon}>{item.icon}</span>
            {!isCollapsed && (
              <>
                <span className={styles.menuLabel}>{item.label}</span>
                {hasSubmenu && (
                  <button
                    className={`${styles.submenuToggle} ${
                      isExpanded ? styles.expanded : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleSubmenu(item.path);
                    }}
                  >
                    ▼
                  </button>
                )}
              </>
            )}
          </Link>
        </div>

        {hasSubmenu && !isCollapsed && isExpanded && (
          <ul className={styles.submenu}>
            {item.submenu!.map((subItem) => (
              <li key={subItem.path} className={styles.submenuItem}>
                <Link
                  to={subItem.path}
                  className={`${styles.submenuLink} ${
                    isActivePath(subItem.path) ? styles.active : ""
                  }`}
                >
                  <span className={styles.submenuIcon}>{subItem.icon}</span>
                  <span className={styles.submenuLabel}>{subItem.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""} ${
        isMobileOpen ? styles.open : ""
      }`}
    >
      <div className={styles.sidebarHeader}>
        <div className={styles.logo}>
          {/* Logo navigates to home */}
          <Link to={ROUTE_PATH.HOME} className={styles.logoLink}>
            {!isCollapsed ? (
              <span className={styles.logoText}>Soligant</span>
            ) : (
              <span className={styles.logoIcon}>S</span>
            )}
          </Link>
        </div>

        <button
          className={styles.collapseButton}
          onClick={onToggleCollapse}
          title={isCollapsed ? "Mở rộng" : "Thu gọn"}
        >
          {isCollapsed ? <FaAngleRight /> : <FaAngleLeft />}
        </button>
      </div>

      <nav className={styles.navigation}>
        <ul className={styles.menuList}>
          {filteredMenuItems.map(renderMenuItem)}
        </ul>
      </nav>

      <div className={styles.sidebarFooter}>
        <Link to={ROUTE_PATH.PROFILE} className={styles.userProfile}>
          <div className={styles.userAvatar}>
            <FaUserCircle />
          </div>
          {!isCollapsed && (
            <div className={styles.userInfo}>
              <span className={styles.userName}>
                {isUserLoading
                  ? "Đang tải..."
                  : currentUser?.name || "Người dùng"}
              </span>
              <span className={styles.userRole}>
                {currentUser?.role || "Quản trị viên"}
              </span>
            </div>
          )}
        </Link>

        {!isCollapsed && (
          <button className={styles.logoutButton} onClick={() => onSubmit()}>
            <span className={styles.logoutIcon}>
              <FaSignOutAlt />
            </span>
            <span>Đăng xuất</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default SideBar;
