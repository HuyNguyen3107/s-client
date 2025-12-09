import { useRef, useEffect, useState } from "react";
import { Box, IconButton, Badge } from "@mui/material";
import {
  FaSearch,
  FaUser,
  FaShoppingCart,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import styles from "./header.module.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cart.store";
import { CartDrawer } from "./cart-drawer.component";

const navItems = [
  { label: "Trang chủ", to: "/" },
  { label: "Giới thiệu", to: "/about" },
  { label: "Bộ sưu tập", to: "/collections" },
  { label: "Tìm đơn hàng", to: "/order-tracking" },
  { label: "Chính sách", to: "/policy" },
  { label: "Liên hệ", to: "/contact" },
];

export default function Header() {
  const rootRef = useRef<HTMLElement | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const { getItemCount } = useCartStore();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const el = rootRef.current;
    const main = document.getElementById("main-content");
    if (!el || !main) return;

    function applyPadding() {
      if (!el || !main) return;
      const height = el.getBoundingClientRect().height;
      main.style.paddingTop = `${height}px`;
    }

    // set initially and on resize
    applyPadding();
    window.addEventListener("resize", applyPadding);
    return () => {
      window.removeEventListener("resize", applyPadding);
      // cleanup padding
      if (main) main.style.paddingTop = "";
    };
  }, []);

  // Close mobile menu on escape key and manage body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMobileMenu();
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header ref={rootRef} className={styles["header-root"]} role="banner">
      <div className="site-inner">
        {/* Logo */}
        <NavLink
          to="/"
          className={styles["header-logo"]}
          aria-label="Trang chủ Soligant"
        >
          <span className={styles["header-logo-text"]}>SOLIGANT.GIFTS</span>
        </NavLink>

        {/* Desktop Nav */}
        <nav className={styles["header-nav"]} aria-label="Main navigation">
          <ul className={styles["header-nav-list"]}>
            {navItems.map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    isActive
                      ? `${styles["header-nav-link"]} ${styles["active"]}`
                      : styles["header-nav-link"]
                  }
                  end={item.to === "/"}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Icons */}
        <Box className={styles["header-icons"]}>
          <IconButton
            size="small"
            aria-label="Tìm đơn hàng"
            sx={{ p: 0.5, color: "#fff" }}
            onClick={() => navigate("/order-tracking")}
            title="Tìm đơn hàng"
          >
            <FaSearch size={20} />
          </IconButton>
          <NavLink to="/login" className={styles["header-icon-link"]}>
            <IconButton
              size="small"
              aria-label="Tài khoản"
              sx={{ p: 0.5, color: "#fff" }}
            >
              <FaUser size={20} />
            </IconButton>
          </NavLink>
          <IconButton
            size="small"
            aria-label="Giỏ hàng"
            sx={{ p: 0.5, color: "#fff" }}
            onClick={() => setCartDrawerOpen(true)}
          >
            <Badge badgeContent={getItemCount()} color="error">
              <FaShoppingCart size={20} />
            </Badge>
          </IconButton>

          {/* Mobile Menu Button */}
          <button
            className={styles["mobile-menu-button"]}
            onClick={toggleMobileMenu}
            aria-label="Mở menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <FaBars />
          </button>
        </Box>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`${styles["mobile-menu-overlay"]} ${
          mobileMenuOpen ? styles.open : ""
        }`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* Mobile Menu */}
      <aside
        id="mobile-menu"
        className={`${styles["mobile-menu"]} ${
          mobileMenuOpen ? styles.open : ""
        }`}
        aria-label="Mobile navigation"
      >
        <div className={styles["mobile-menu-header"]}>
          <span className={styles["header-logo-text"]}>SOLIGANT.GIFTS</span>
          <button
            className={styles["mobile-menu-close"]}
            onClick={closeMobileMenu}
            aria-label="Đóng menu"
          >
            <FaTimes />
          </button>
        </div>

        <nav className={styles["mobile-menu-nav"]}>
          <ul className={styles["mobile-menu-list"]} role="list">
            {navItems.map((item) => (
              <li key={item.label} className={styles["mobile-menu-item"]}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    isActive
                      ? `${styles["mobile-menu-link"]} ${styles.active}`
                      : styles["mobile-menu-link"]
                  }
                  end={item.to === "/"}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Cart Drawer */}
      <CartDrawer
        open={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
      />
    </header>
  );
}
