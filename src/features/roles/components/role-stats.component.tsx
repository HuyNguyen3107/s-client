import React from "react";
import { Box, Paper, Typography, Chip, Card, CardContent } from "@mui/material";
import { Security, People, Assignment, TrendingUp } from "@mui/icons-material";
import { useRoles } from "../queries";

/**
 * Role Statistics Component - following Single Responsibility Principle
 * Responsible only for displaying role-related statistics
 */
export const RoleStats: React.FC = () => {
  const { data: rolesData, isLoading } = useRoles({ limit: 1000 }); // Get all roles for stats

  // Calculate statistics
  const stats = React.useMemo(() => {
    if (!rolesData?.data) {
      return {
        totalRoles: 0,
        totalUsers: 0,
        totalPermissions: 0,
        averagePermissionsPerRole: 0,
      };
    }

    const roles = rolesData.data;
    const totalRoles = roles.length;
    const totalUsers = roles.reduce((sum, role) => sum + role.userCount, 0);
    const totalPermissions = roles.reduce(
      (sum, role) => sum + role.permissionCount,
      0
    );
    const averagePermissionsPerRole =
      totalRoles > 0 ? Math.round(totalPermissions / totalRoles) : 0;

    return {
      totalRoles,
      totalUsers,
      totalPermissions,
      averagePermissionsPerRole,
    };
  }, [rolesData?.data]);

  const statCards = [
    {
      title: "Tổng số vai trò",
      value: stats.totalRoles,
      icon: <Security />,
      color: "primary",
    },
    {
      title: "Tổng người dùng",
      value: stats.totalUsers,
      icon: <People />,
      color: "success",
    },
    {
      title: "Tổng quyền hạn",
      value: stats.totalPermissions,
      icon: <Assignment />,
      color: "info",
    },
    {
      title: "TB quyền/vai trò",
      value: stats.averagePermissionsPerRole,
      icon: <TrendingUp />,
      color: "warning",
    },
  ];

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 3,
        }}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} sx={{ height: 120 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <Typography color="text.secondary">Đang tải...</Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Thống kê Vai trò
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 3,
          mb: 3,
        }}
      >
        {statCards.map((stat, index) => (
          <Card key={index} sx={{ height: "100%", borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    backgroundColor: `${stat.color}.light`,
                    color: `${stat.color}.main`,
                    mr: 2,
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {stat.value}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {stat.title}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Most Used Roles */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Vai trò được sử dụng nhiều nhất
        </Typography>

        {rolesData?.data?.length ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {rolesData.data
              .sort((a, b) => b.userCount - a.userCount)
              .slice(0, 5)
              .map((role, index) => (
                <Box
                  key={role.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    backgroundColor: index === 0 ? "primary.light" : "grey.50",
                    borderRadius: 1,
                    "&:hover": {
                      backgroundColor:
                        index === 0 ? "primary.light" : "grey.100",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography
                      variant="h6"
                      color={index === 0 ? "primary.main" : "inherit"}
                    >
                      #{index + 1}
                    </Typography>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {role.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {role.permissionCount} quyền hạn
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={`${role.userCount} người dùng`}
                    color={index === 0 ? "primary" : "default"}
                    size="small"
                  />
                </Box>
              ))}
          </Box>
        ) : (
          <Typography color="text.secondary">
            Chưa có dữ liệu để hiển thị
          </Typography>
        )}
      </Paper>
    </Box>
  );
};
