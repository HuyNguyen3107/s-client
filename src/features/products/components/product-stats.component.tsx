import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Inventory,
  ViewModule,
  TrendingUp,
  Category,
  CheckCircle,
  Cancel,
  Schedule,
} from "@mui/icons-material";
import { useProductStats } from "../hooks/use-product-stats.hooks";

const ProductStats: React.FC = () => {
  const { statistics: stats, isLoading, error } = useProductStats();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Có lỗi xảy ra khi tải thống kê: {error.message}
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        Không có dữ liệu thống kê
      </Alert>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle />;
      case "inactive":
        return <Cancel />;
      case "draft":
        return <Schedule />;
      default:
        return <Inventory />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "error";
      case "draft":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Đang hoạt động";
      case "inactive":
        return "Không hoạt động";
      case "draft":
        return "Bản nháp";
      default:
        return status;
    }
  };

  // Tính toán phần trăm cho biểu đồ trạng thái
  const totalProducts = stats.totalProducts || 0;
  const maxStatusCount =
    stats.productsByStatus.length > 0
      ? Math.max(...stats.productsByStatus.map((item) => item.count))
      : 0;

  return (
    <Grid container spacing={3}>
      {/* Overview Cards */}
      <Grid size={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: "primary.light",
                  color: "primary.contrastText",
                }}
              >
                <Inventory />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {stats.totalProducts || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tổng sản phẩm
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: "warning.light",
                  color: "warning.contrastText",
                }}
              >
                <ViewModule />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {stats.totalProductVariants || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tổng biến thể sản phẩm
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: "success.light",
                  color: "success.contrastText",
                }}
              >
                <TrendingUp />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {stats.productsByCollection?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Bộ sưu tập có sản phẩm
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: "info.light",
                  color: "info.contrastText",
                }}
              >
                <Category />
              </Box>
              <Box>
                <Chip
                  label={`${stats.totalProductVariants || 0}/${
                    stats.totalProducts || 0
                  }`}
                  color="info"
                  variant="filled"
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Tỷ lệ biến thể/sản phẩm
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Status Distribution */}
      <Grid size={12}>
        <Card>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">Phân bố theo trạng thái</Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng: {totalProducts} sản phẩm
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {stats.productsByStatus && stats.productsByStatus.length > 0 ? (
                stats.productsByStatus.map((item) => {
                  const percentage =
                    totalProducts > 0 ? (item.count / totalProducts) * 100 : 0;
                  const barWidth =
                    maxStatusCount > 0
                      ? (item.count / maxStatusCount) * 100
                      : 0;

                  return (
                    <Grid size={12} key={item.status}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            minWidth: 120,
                          }}
                        >
                          {getStatusIcon(item.status)}
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {getStatusLabel(item.status)}
                          </Typography>
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={barWidth}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: "grey.200",
                              "& .MuiLinearProgress-bar": {
                                borderRadius: 4,
                                backgroundColor:
                                  item.status === "active"
                                    ? "success.main"
                                    : item.status === "inactive"
                                    ? "error.main"
                                    : "warning.main",
                              },
                            }}
                          />
                        </Box>
                        <Box sx={{ minWidth: 100, textAlign: "right" }}>
                          <Typography variant="body2" color="text.secondary">
                            {item.count} ({percentage.toFixed(1)}%)
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  );
                })
              ) : (
                <Grid size={12}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 2 }}
                  >
                    Không có dữ liệu trạng thái
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Collection Distribution */}
      <Grid size={12}>
        <Card>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">Phân bố theo bộ sưu tập</Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.productsByCollection.length} bộ sưu tập
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {stats.productsByCollection &&
              stats.productsByCollection.length > 0 ? (
                stats.productsByCollection.map((item, index) => {
                  const percentage =
                    totalProducts > 0 ? (item.count / totalProducts) * 100 : 0;
                  const maxCollectionCount = Math.max(
                    ...stats.productsByCollection.map((c) => c.count)
                  );
                  const barWidth =
                    maxCollectionCount > 0
                      ? (item.count / maxCollectionCount) * 100
                      : 0;

                  return (
                    <Grid size={12} key={index}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Box
                          sx={{
                            minWidth: 200,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Typography variant="body2">
                            {item.collectionName}
                          </Typography>
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={barWidth}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: "grey.200",
                              "& .MuiLinearProgress-bar": {
                                borderRadius: 4,
                                backgroundColor: "info.main",
                              },
                            }}
                          />
                        </Box>
                        <Box sx={{ minWidth: 100, textAlign: "right" }}>
                          <Typography variant="body2" color="text.secondary">
                            {item.count} ({percentage.toFixed(1)}%)
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  );
                })
              ) : (
                <Grid size={12}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 2 }}
                  >
                    Không có dữ liệu bộ sưu tập
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ProductStats;
