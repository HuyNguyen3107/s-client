import React, { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress, Typography, Paper } from "@mui/material";
import { Lock as LockIcon } from "@mui/icons-material";
import { usePermissions } from "../hooks/use-permissions.hook";
import type { Permission } from "../constants/permissions.constants";

interface PermissionGuardProps {
  children: ReactNode;
  permission: Permission | null;
  fallback?: ReactNode;
  redirectTo?: string;
  showError?: boolean;
}

/**
 * Permission Guard Component
 * Protects routes/components based on user permissions
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  fallback,
  redirectTo,
  showError = true,
}) => {
  const { hasPermission, isLoading } = usePermissions();

  // Loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Check permission
  const allowed = hasPermission(permission);

  // If not allowed
  if (!allowed) {
    // Redirect if specified
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    // Show custom fallback if provided
    if (fallback) {
      return <>{fallback}</>;
    }

    // Show default error message
    if (showError) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            p: 3,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              maxWidth: 500,
              border: "1px solid",
              borderColor: "error.light",
            }}
          >
            <LockIcon sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Không có quyền truy cập
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản
              trị viên nếu bạn cho rằng đây là lỗi.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quyền yêu cầu: <strong>{permission}</strong>
            </Typography>
          </Paper>
        </Box>
      );
    }

    // Don't render anything
    return null;
  }

  // Render children if allowed
  return <>{children}</>;
};

interface PermissionCheckProps {
  children: ReactNode;
  permission: Permission | null;
  fallback?: ReactNode;
}

/**
 * Permission Check Component
 * Conditionally renders children based on permission
 * Does not show error messages, just hides content
 */
export const PermissionCheck: React.FC<PermissionCheckProps> = ({
  children,
  permission,
  fallback = null,
}) => {
  const { hasPermission, isLoading } = usePermissions();

  if (isLoading) {
    return null;
  }

  const allowed = hasPermission(permission);

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

interface MultiPermissionGuardProps {
  children: ReactNode;
  permissions: (Permission | null)[];
  requireAll?: boolean; // true = AND, false = OR
  fallback?: ReactNode;
  redirectTo?: string;
  showError?: boolean;
}

/**
 * Multi Permission Guard Component
 * Protects routes/components based on multiple permissions
 */
export const MultiPermissionGuard: React.FC<MultiPermissionGuardProps> = ({
  children,
  permissions,
  requireAll = false,
  fallback,
  redirectTo,
  showError = true,
}) => {
  const { hasAllPermissions, hasAnyPermission, isLoading } = usePermissions();

  // Loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Check permissions
  const allowed = requireAll
    ? hasAllPermissions(permissions)
    : hasAnyPermission(permissions);

  // If not allowed
  if (!allowed) {
    // Redirect if specified
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    // Show custom fallback if provided
    if (fallback) {
      return <>{fallback}</>;
    }

    // Show default error message
    if (showError) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            p: 3,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              maxWidth: 500,
              border: "1px solid",
              borderColor: "error.light",
            }}
          >
            <LockIcon sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Không có quyền truy cập
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản
              trị viên nếu bạn cho rằng đây là lỗi.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quyền yêu cầu ({requireAll ? "tất cả" : "một trong"}):
            </Typography>
            <Typography variant="body2" color="text.secondary" component="div">
              <ul style={{ textAlign: "left", display: "inline-block" }}>
                {permissions.map((perm, index) => (
                  <li key={index}>
                    <strong>{perm || "Không yêu cầu"}</strong>
                  </li>
                ))}
              </ul>
            </Typography>
          </Paper>
        </Box>
      );
    }

    // Don't render anything
    return null;
  }

  // Render children if allowed
  return <>{children}</>;
};

export default PermissionGuard;
