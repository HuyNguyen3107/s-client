import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Skeleton,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  TrendingUp,
  Inventory,
  Category,
  Assessment,
} from "@mui/icons-material";

// Types
import { PRODUCT_CUSTOM_CONSTANTS } from "../constants/product-custom.constants";

// Hooks
import { useProductCustomStats } from "../hooks/use-product-custom-stats.hooks";

// Props interface following Interface Segregation Principle
interface ProductCustomStatsProps {
  showTitle?: boolean;
  compact?: boolean;
  enabled?: boolean;
}

/**
 * ProductCustomStats - Statistics dashboard component
 * Following Single Responsibility Principle - displays analytics and metrics
 */
export const ProductCustomStats: React.FC<ProductCustomStatsProps> = ({
  showTitle = true,
  compact = false,
  enabled = true,
}) => {
  // Use custom hook for statistics
  const { statistics, isLoading, error, refresh } =
    useProductCustomStats(enabled);

  // Render loading skeleton
  const renderSkeleton = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index}>
          <CardContent>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" height={32} />
            <Skeleton variant="text" width="80%" />
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  // Render error state
  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <IconButton color="inherit" size="small" onClick={refresh}>
            <RefreshIcon />
          </IconButton>
        }
      >
        {error.message || "Đã xảy ra lỗi khi tải thống kê"}
      </Alert>
    );
  }

  // Render loading state
  if (isLoading || !statistics) {
    return (
      <Box>
        {showTitle && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" component="h2">
              Thống kê sản phẩm tùy chỉnh
            </Typography>
            <Skeleton variant="circular" width={40} height={40} />
          </Box>
        )}
        {renderSkeleton()}
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with refresh button */}
      {showTitle && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6" component="h2">
            Thống kê sản phẩm tùy chỉnh
          </Typography>
          <Tooltip title="Làm mới">
            <IconButton onClick={refresh} size="small">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: compact ? 2 : 3,
        }}
      >
        {/* Total Product Customs Card */}
        <Card
          sx={{
            height: "100%",
            background: "linear-gradient(135deg, #731618 0%, #5f0d10 100%)",
            color: "white",
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Assessment sx={{ fontSize: 40, mr: 2, opacity: 0.8 }} />
              <Box>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{ fontWeight: "bold" }}
                >
                  {statistics.totalProductCustoms.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Tổng sản phẩm tùy chỉnh
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Total Inventories Card */}
        <Card
          sx={{
            height: "100%",
            background: "linear-gradient(135deg, #731618 0%, #5f0d10 100%)",
            color: "white",
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Inventory sx={{ fontSize: 40, mr: 2, opacity: 0.8 }} />
              <Box>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{ fontWeight: "bold" }}
                >
                  {statistics.totalInventories.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Tổng kho hàng
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Status Distribution Cards */}
        {statistics.productCustomsByStatus?.map((statusData, index) => {
          const statusKey =
            statusData.status as keyof typeof PRODUCT_CUSTOM_CONSTANTS.STATUS_LABELS;
          const statusLabel =
            PRODUCT_CUSTOM_CONSTANTS.STATUS_LABELS[statusKey] ||
            statusData.status;

          const gradients = [
            "linear-gradient(135deg, #731618 0%, #5f0d10 100%)",
            "linear-gradient(135deg, #5f0d10 0%, #731618 100%)",
          ];

          return (
            <Card
              key={statusData.status}
              sx={{
                height: "100%",
                background: gradients[index % gradients.length],
                color: "white",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <TrendingUp sx={{ fontSize: 40, mr: 2, opacity: 0.8 }} />
                  <Box>
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{ fontWeight: "bold" }}
                    >
                      {statusData.count.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {statusLabel}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Category Distribution */}
      {statistics.productCustomsByCategory?.length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Category sx={{ mr: 2, color: "primary.main" }} />
              <Typography variant="h6" component="h3">
                Phân bố theo danh mục
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                },
                gap: 2,
              }}
            >
              {statistics.productCustomsByCategory.map(
                (categoryData, index) => (
                  <Card
                    variant="outlined"
                    sx={{ height: "100%" }}
                    key={categoryData.categoryName || index}
                  >
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography
                        variant="h5"
                        component="div"
                        color="primary"
                        sx={{ mb: 1 }}
                      >
                        {categoryData.count.toLocaleString()}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {categoryData.categoryName || "Không xác định"}
                      </Typography>

                      {/* Progress indicator */}
                      <Box
                        sx={{
                          height: 4,
                          backgroundColor: "grey.200",
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            height: "100%",
                            backgroundColor: "primary.main",
                            width: `${Math.min(
                              (categoryData.count /
                                statistics.totalProductCustoms) *
                                100,
                              100
                            )}%`,
                            transition: "width 0.3s ease",
                          }}
                        />
                      </Box>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: "block" }}
                      >
                        {(
                          (categoryData.count /
                            statistics.totalProductCustoms) *
                          100
                        ).toFixed(1)}
                        %
                      </Typography>
                    </CardContent>
                  </Card>
                )
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Quick Status Overview */}
      {!compact && statistics.productCustomsByStatus?.length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" component="h3" sx={{ mb: 3 }}>
              Tổng quan trạng thái
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {statistics.productCustomsByStatus.map((statusData) => {
                const statusKey =
                  statusData.status as keyof typeof PRODUCT_CUSTOM_CONSTANTS.STATUS_LABELS;
                const statusLabel =
                  PRODUCT_CUSTOM_CONSTANTS.STATUS_LABELS[statusKey] ||
                  statusData.status;
                const statusColor =
                  PRODUCT_CUSTOM_CONSTANTS.STATUS_COLORS[statusKey];
                const percentage = (
                  (statusData.count / statistics.totalProductCustoms) *
                  100
                ).toFixed(1);

                return (
                  <Chip
                    key={statusData.status}
                    label={`${statusLabel}: ${statusData.count} (${percentage}%)`}
                    sx={{
                      backgroundColor: statusColor,
                      color: "white",
                      fontWeight: "medium",
                      fontSize: "0.875rem",
                      px: 2,
                      py: 1,
                      height: "auto",
                      "& .MuiChip-label": {
                        px: 1,
                      },
                    }}
                  />
                );
              })}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
