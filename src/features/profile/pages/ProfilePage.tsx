/**
 * Profile Page
 * Trang quản lý thông tin cá nhân của người dùng
 */

import React from "react";
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  Avatar,
  Chip,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import {
  FaTachometerAlt as DashboardIcon,
  FaUser as UserIcon,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaShieldAlt,
} from "react-icons/fa";
import { ProfileForm } from "../components";
import { useUserProfile } from "../../../hooks/use-user-profile.hooks";
import { ROUTE_PATH } from "../../../constants/route-path.constants";

const ProfilePage: React.FC = () => {
  const { data: profile, isLoading } = useUserProfile();

  // Get user name with fallback
  const getUserName = () => {
    if (isLoading) return "Đang tải...";
    return profile?.name || "Người dùng";
  };

  // Get avatar initial
  const getAvatarInitial = () => {
    if (!profile?.name) return "U";
    return profile.name.charAt(0).toUpperCase();
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link
          component={RouterLink}
          underline="hover"
          color="inherit"
          to={ROUTE_PATH.DASHBOARD}
          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
        >
          <DashboardIcon fontSize="small" />
          Dashboard
        </Link>
        <Typography
          color="text.primary"
          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
        >
          <UserIcon fontSize="small" />
          Thông tin cá nhân
        </Typography>
      </Breadcrumbs>

      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Thông tin cá nhân
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý thông tin tài khoản và cài đặt bảo mật của bạn
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Profile Overview Card */}
        <Box sx={{ flex: { xs: "1", md: "0 0 350px" } }}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  py: 2,
                }}
              >
                {/* Avatar */}
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    mb: 2,
                    fontSize: "3rem",
                    bgcolor: "primary.main",
                  }}
                >
                  {getAvatarInitial()}
                </Avatar>

                {/* User Info */}
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {getUserName()}
                </Typography>

                {profile?.role && (
                  <Chip
                    icon={<FaShieldAlt />}
                    label={profile.role}
                    color="primary"
                    size="small"
                    sx={{ mb: 2 }}
                  />
                )}

                <Box sx={{ width: "100%", mt: 2 }}>
                  {/* Email */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1.5,
                      justifyContent: "flex-start",
                    }}
                  >
                    <FaEnvelope color="#666" />
                    <Typography variant="body2" color="text.secondary">
                      {profile?.email || "---"}
                    </Typography>
                  </Box>

                  {/* Phone */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1.5,
                      justifyContent: "flex-start",
                    }}
                  >
                    <FaPhone color="#666" />
                    <Typography variant="body2" color="text.secondary">
                      {profile?.phone || "---"}
                    </Typography>
                  </Box>

                  {/* Status */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      justifyContent: "flex-start",
                    }}
                  >
                    <FaCalendar color="#666" />
                    <Typography variant="body2" color="text.secondary">
                      Trạng thái:{" "}
                      {profile
                        ? profile.isActive
                          ? "Hoạt động"
                          : "Tạm khóa"
                        : "---"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Profile Form */}
        <Box sx={{ flex: 1 }}>
          <ProfileForm />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
