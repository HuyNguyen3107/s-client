import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  Inventory,
  Warning,
  RemoveShoppingCart,
  CheckCircle,
  TrendingUp,
} from "@mui/icons-material";
import { useInventoryStatistics } from "../queries";
import { FormatUtils } from "../utils";
import { INVENTORY_CONSTANTS } from "../constants";

// Stats Card Component following Single Responsibility Principle
interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color,
  subtitle,
  trend,
}) => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" color={`${color}.main`}>
              {value}
            </Typography>
            {subtitle && (
              <Typography color="textSecondary" variant="body2">
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUp
                  fontSize="small"
                  color={trend.isPositive ? "success" : "error"}
                  sx={{
                    transform: trend.isPositive ? "none" : "rotate(180deg)",
                  }}
                />
                <Typography
                  variant="caption"
                  color={trend.isPositive ? "success.main" : "error.main"}
                  sx={{ ml: 0.5 }}
                >
                  {trend.value}%
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              width: 60,
              height: 60,
              borderRadius: 2,
              backgroundColor: `${color}.light`,
              color: `${color}.main`,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Stock Level Distribution Component
const StockLevelDistribution: React.FC<{
  totalItems: number;
  lowStockCount: number;
  outOfStockCount: number;
  healthyStockCount: number;
}> = ({ totalItems, lowStockCount, outOfStockCount, healthyStockCount }) => {
  const data = [
    {
      label: "Tồn kho tốt",
      count: healthyStockCount,
      color: INVENTORY_CONSTANTS.COLORS.HEALTHY_STOCK,
      percentage: FormatUtils.formatPercentage(healthyStockCount, totalItems),
    },
    {
      label: "Tồn kho thấp",
      count: lowStockCount,
      color: INVENTORY_CONSTANTS.COLORS.LOW_STOCK,
      percentage: FormatUtils.formatPercentage(lowStockCount, totalItems),
    },
    {
      label: "Hết hàng",
      count: outOfStockCount,
      color: INVENTORY_CONSTANTS.COLORS.OUT_OF_STOCK,
      percentage: FormatUtils.formatPercentage(outOfStockCount, totalItems),
    },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Phân bố tồn kho
        </Typography>
        <Box>
          {data.map((item, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography variant="body2" color="textSecondary">
                  {item.label}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" fontWeight="medium">
                    {FormatUtils.formatStockNumber(item.count)}
                  </Typography>
                  <Chip
                    label={item.percentage}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: "0.75rem" }}
                  />
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={totalItems > 0 ? (item.count / totalItems) * 100 : 0}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "grey.200",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: item.color,
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

// Main Inventory Stats Component
const InventoryStats: React.FC = () => {
  const { data: stats, isLoading, error } = useInventoryStatistics();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    console.error("Inventory stats error:", error);
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Không thể tải thống kê inventory. Vui lòng thử lại sau.
        <br />
        <Typography variant="caption" color="error">
          Chi tiết lỗi: {error.message || "Lỗi không xác định"}
        </Typography>
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Alert severity="info" sx={{ mb: 3 }}>
        Không có dữ liệu thống kê.
      </Alert>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Main Stats Cards */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Tổng sản phẩm"
            value={FormatUtils.formatStockNumber(stats.totalItems)}
            icon={<Inventory fontSize="large" />}
            color="primary"
            subtitle="Tổng số mặt hàng trong kho"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Tồn kho tốt"
            value={FormatUtils.formatStockNumber(stats.healthyStockCount)}
            icon={<CheckCircle fontSize="large" />}
            color="success"
            subtitle="Sản phẩm có tồn kho đủ"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Tồn kho thấp"
            value={FormatUtils.formatStockNumber(stats.lowStockCount)}
            icon={<Warning fontSize="large" />}
            color="warning"
            subtitle="Cần bổ sung sản phẩm"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Hết hàng"
            value={FormatUtils.formatStockNumber(stats.outOfStockCount)}
            icon={<RemoveShoppingCart fontSize="large" />}
            color="error"
            subtitle="Sản phẩm không còn tồn kho"
          />
        </Grid>

        {/* Total Value Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Giá trị tồn kho
              </Typography>
              <Typography variant="h3" color="primary.main" gutterBottom>
                {FormatUtils.formatCurrency(stats.totalValue)}
              </Typography>
              <Typography color="textSecondary" variant="body2">
                Tổng giá trị các sản phẩm trong kho
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Stock Distribution */}
        <Grid size={{ xs: 12, md: 6 }}>
          <StockLevelDistribution
            totalItems={stats.totalItems}
            lowStockCount={stats.lowStockCount}
            outOfStockCount={stats.outOfStockCount}
            healthyStockCount={stats.healthyStockCount}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default InventoryStats;
