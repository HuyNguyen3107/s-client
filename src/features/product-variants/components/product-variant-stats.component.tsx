import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  TrendingUp,
  Inventory2,
  AttachMoney,
  Category,
} from "@mui/icons-material";
import { useProductVariantStats } from "../hooks";
import { ProductVariantFormatter } from "../utils";
import { PRODUCT_VARIANT_CONSTANTS } from "../constants";

interface ProductVariantStatsProps {
  productId?: string; // Optional filter by specific product
}

/**
 * Product Variant Statistics Component
 * Following Single Responsibility Principle - displays variant statistics and metrics
 */
const ProductVariantStats: React.FC<ProductVariantStatsProps> = ({
  productId,
}) => {
  const { statistics, isLoading, error } = useProductVariantStats(productId);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error.message || PRODUCT_VARIANT_CONSTANTS.ERROR_MESSAGES.SERVER_ERROR}
      </Alert>
    );
  }

  if (!statistics) {
    return (
      <Alert severity="info" sx={{ mb: 3 }}>
        Không có dữ liệu thống kê
      </Alert>
    );
  }

  return (
    <Box>
      {/* Main Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Total Variants */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Tổng số biến thể
                  </Typography>
                  <Typography variant="h4" component="h3">
                    {statistics.totalVariants.toLocaleString("vi-VN")}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "primary.light",
                    borderRadius: "50%",
                    p: 2,
                    color: "primary.contrastText",
                  }}
                >
                  <Inventory2 fontSize="large" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Value */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Tổng giá trị
                  </Typography>
                  <Typography variant="h5" component="h3">
                    {ProductVariantFormatter.formatPrice(
                      statistics.totalVariants * statistics.averagePrice
                    )}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "success.light",
                    borderRadius: "50%",
                    p: 2,
                    color: "success.contrastText",
                  }}
                >
                  <AttachMoney fontSize="large" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Average Price */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Giá trung bình
                  </Typography>
                  <Typography variant="h5" component="h3">
                    {ProductVariantFormatter.formatPrice(
                      statistics.averagePrice
                    )}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "info.light",
                    borderRadius: "50%",
                    p: 2,
                    color: "info.contrastText",
                  }}
                >
                  <TrendingUp fontSize="large" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Products */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Sản phẩm có biến thể
                  </Typography>
                  <Typography variant="h4" component="h3">
                    {statistics.variantsByProduct.length.toLocaleString(
                      "vi-VN"
                    )}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "warning.light",
                    borderRadius: "50%",
                    p: 2,
                    color: "warning.contrastText",
                  }}
                >
                  <Category fontSize="large" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Statistics */}
      <Grid container spacing={3}>
        {/* Status Distribution */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Phân bố theo trạng thái
              </Typography>
              <Box sx={{ mt: 2 }}>
                {statistics.variantsByStatus.map(
                  (statusData: any, index: number) => {
                    const percentage =
                      statistics.totalVariants > 0
                        ? Math.round(
                            (statusData.count / statistics.totalVariants) * 100
                          )
                        : 0;

                    return (
                      <Box
                        key={statusData.status || `status-${index}`}
                        sx={{ mb: 2 }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Chip
                              label={ProductVariantFormatter.getStatusLabel(
                                statusData.status
                              )}
                              color={
                                ProductVariantFormatter.getStatusColor(
                                  statusData.status
                                ) as any
                              }
                              size="small"
                            />
                          </Box>
                          <Typography variant="body2" fontWeight="medium">
                            {statusData.count} ({percentage}%)
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    );
                  }
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Products by Variant Count */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sản phẩm có nhiều biến thể nhất
              </Typography>
              <Paper variant="outlined" sx={{ mt: 2 }}>
                <List dense>
                  {statistics.variantsByProduct
                    .slice(0, 6)
                    .map((productData: any, index: number) => (
                      <ListItem
                        key={productData.productId || `product-${index}`}
                      >
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="subtitle2" component="span">
                                {ProductVariantFormatter.truncateText(
                                  productData.productName,
                                  30
                                )}
                              </Typography>
                              <Chip
                                label={`${productData.count} biến thể`}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            productData.minPrice != null &&
                            productData.maxPrice != null &&
                            !isNaN(productData.minPrice) &&
                            !isNaN(productData.maxPrice)
                              ? `Giá từ ${ProductVariantFormatter.formatPrice(
                                  productData.minPrice
                                )} - ${ProductVariantFormatter.formatPrice(
                                  productData.maxPrice
                                )}`
                              : "Chưa có thông tin giá"
                          }
                        />
                      </ListItem>
                    ))}
                </List>

                {statistics.variantsByProduct.length > 6 && (
                  <Box sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      +{statistics.variantsByProduct.length - 6} sản phẩm khác
                    </Typography>
                  </Box>
                )}
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Additional Info */}
      <Paper sx={{ mt: 3, p: 3, backgroundColor: "background.paper" }}>
        <Typography variant="h6" gutterBottom>
          Thông tin tổng quan
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
          <Chip
            label={`Giá thấp nhất: ${ProductVariantFormatter.formatPrice(
              statistics.priceRange.min
            )}`}
            variant="outlined"
            color="success"
          />
          <Chip
            label={`Giá cao nhất: ${ProductVariantFormatter.formatPrice(
              statistics.priceRange.max
            )}`}
            variant="outlined"
            color="error"
          />
          <Chip
            label={`Sản phẩm có biến thể: ${statistics.variantsByProduct.length}`}
            variant="outlined"
            color="primary"
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default ProductVariantStats;
