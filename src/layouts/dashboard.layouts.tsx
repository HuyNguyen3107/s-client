import { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import AuthGuard from "../components/auth-guard.components";
import SideBar from "../components/side-bar.components";
import { OrderNotificationBell } from "../components/order-notification-bell.components";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import "./dashboard.layouts.scss";

export default function DashboardLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const handleCloseMobileMenu = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <AuthGuard>
      <div className="dashboard-layout">
        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            className="mobile-menu-button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <FaBars />
          </button>
        )}

        {/* Notification Bell - Fixed position in top right */}
        <Box
          sx={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 1100,
          }}
        >
          <OrderNotificationBell />
        </Box>

        {/* Mobile Overlay */}
        {isMobile && isMobileMenuOpen && (
          <div
            className="mobile-overlay"
            onClick={handleCloseMobileMenu}
            role="button"
            tabIndex={0}
            aria-label="Close menu"
          />
        )}

        <SideBar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={handleCloseMobileMenu}
        />
        <main
          className={`dashboard-main ${
            isSidebarCollapsed ? "sidebar-collapsed" : ""
          }`}
        >
          <div className="dashboard-content">
            <Outlet />
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
