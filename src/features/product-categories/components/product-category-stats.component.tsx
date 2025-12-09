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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
} from "@mui/material";
import {
  Category,
  Inventory,
  TrendingUp,
  Assessment,
} from "@mui/icons-material";
import { useProductCategoryStats } from "../hooks";
import { ProductCategoryStatsUtils } from "../utils";

/**
 * Product Category Statistics Component
 * Following Single Responsibility Principle - displays statistics and analytics
 */
const ProductCategoryStats: React.FC = () => {
  const { statistics: stats, isLoading, error } = useProductCategoryStats();

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

  // Process data for better display
  const categoryDistribution =
    ProductCategoryStatsUtils.calculateCategoryDistribution(
      stats.categoriesByProduct
    );
  const topCategories = ProductCategoryStatsUtils.getTopCategories(
    stats.customsByCategory,
    5
  );

  return (
    <Grid container spacing={3}>
      {/* Overview Cards */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 56,
                  height: 56,
                }}
              >
                <Category fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {stats.totalCategories}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tổng thể loại
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: "success.main",
                  width: 56,
                  height: 56,
                }}
              >
                <Inventory fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {stats.totalProductCustoms}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sản phẩm tùy chỉnh
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: "info.main",
                  width: 56,
                  height: 56,
                }}
              >
                <TrendingUp fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {stats.totalCategories > 0
                    ? Math.round(
                        (stats.totalProductCustoms / stats.totalCategories) * 10
                      ) / 10
                    : 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  TB sản phẩm/thể loại
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: "warning.main",
                  width: 56,
                  height: 56,
                }}
              >
                <Assessment fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {categoryDistribution.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sản phẩm có thể loại
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Distribution by Product */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Phân bố thể loại theo sản phẩm
            </Typography>

            {categoryDistribution.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography color="text.secondary">
                  Chưa có dữ liệu phân bố
                </Typography>
              </Box>
            ) : (
              <List>
                {categoryDistribution.slice(0, 8).map((item, index) => (
                  <ListItem
                    key={index}
                    divider={index < categoryDistribution.length - 1}
                  >
                    <ListItemIcon>
                      <Category color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.productName}
                      secondary={
                        <Box sx={{ mt: 1 }} component="div">
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                            component="div"
                          >
                            <Typography variant="body2" component="span">
                              {item.count} thể loại
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              component="span"
                            >
                              {item.percentage}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={item.percentage}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      }
                      secondaryTypographyProps={{ component: "div" }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Top Categories by Custom Products */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top 5 thể loại có nhiều sản phẩm tùy chỉnh
            </Typography>

            {topCategories.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography color="text.secondary">
                  Chưa có sản phẩm tùy chỉnh nào
                </Typography>
              </Box>
            ) : (
              <List>
                {topCategories.map((item, index) => (
                  <ListItem
                    key={index}
                    divider={index < topCategories.length - 1}
                  >
                    <ListItemIcon>
                      <Chip
                        label={index + 1}
                        color={
                          index === 0
                            ? "primary"
                            : index === 1
                            ? "secondary"
                            : "default"
                        }
                        size="small"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.categoryName}
                      secondary={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 0.5,
                          }}
                          component="div"
                        >
                          <Inventory fontSize="small" color="action" />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            component="span"
                          >
                            {item.count} sản phẩm tùy chỉnh
                          </Typography>
                        </Box>
                      }
                      secondaryTypographyProps={{ component: "div" }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Summary Insights */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Thông tin tổng quan
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "primary.50",
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "primary.200",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    color="primary.main"
                    gutterBottom
                  >
                    Hiệu suất thể loại
                  </Typography>
                  <Typography variant="body2">
                    {stats.totalCategories === 0
                      ? "Chưa có thể loại nào được tạo"
                      : stats.totalProductCustoms === 0
                      ? "Các thể loại đã được tạo nhưng chưa có sản phẩm tùy chỉnh nào"
                      : `Trung bình mỗi thể loại có ${
                          Math.round(
                            (stats.totalProductCustoms /
                              stats.totalCategories) *
                              10
                          ) / 10
                        } sản phẩm tùy chỉnh`}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "success.50",
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "success.200",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    color="success.main"
                    gutterBottom
                  >
                    Khuyến nghị
                  </Typography>
                  <Typography variant="body2">
                    {stats.totalCategories === 0
                      ? "Hãy tạo thể loại đầu tiên cho sản phẩm của bạn"
                      : stats.totalProductCustoms === 0
                      ? "Hãy tạo sản phẩm tùy chỉnh cho các thể loại đã có"
                      : "Tiếp tục phát triển các thể loại và sản phẩm tùy chỉnh"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ProductCategoryStats;
