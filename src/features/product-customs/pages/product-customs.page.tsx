import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Alert,
  Breadcrumbs,
  Link,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  List as ListIcon,
  Analytics as AnalyticsIcon,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { ROUTE_PATH } from "../../../constants/route-path.constants";

// Components
import { ProductCustomList } from "../components/product-custom-list.component";
import { ProductCustomStats } from "../components/product-custom-stats.component";

// Types
import type { ProductCustom } from "../types/product-custom.types";

// Tab panel component following Single Responsibility Principle
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  index,
  ...other
}) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    id={`product-custom-tabpanel-${index}`}
    aria-labelledby={`product-custom-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </Box>
);

// Tab props generator following DRY principle
const a11yProps = (index: number) => ({
  id: `product-custom-tab-${index}`,
  "aria-controls": `product-custom-tabpanel-${index}`,
});

/**
 * Product Customs Main Page
 * Following Single Responsibility Principle - main dashboard for product customs management
 */
export const ProductCustomsPage: React.FC = () => {
  // Local state
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedCustom, setSelectedCustom] = useState<ProductCustom | null>(
    null
  );

  // Event handlers
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleSelectCustom = (custom: ProductCustom) => {
    setSelectedCustom(custom);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
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
          <ListIcon fontSize="small" />
          Sản phẩm Tùy chỉnh
        </Typography>
      </Breadcrumbs>

      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Quản lý Sản phẩm Tùy chỉnh
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý và theo dõi các sản phẩm tùy chỉnh trong hệ thống
        </Typography>
      </Box>

      {/* Main Content */}
      <Paper elevation={1} sx={{ overflow: "hidden" }}>
        {/* Tab Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            aria-label="product custom management tabs"
            sx={{
              "& .MuiTab-root": {
                minHeight: 72,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 500,
              },
            }}
          >
            <Tab
              icon={<DashboardIcon />}
              iconPosition="start"
              label="Tổng quan"
              {...a11yProps(0)}
            />
            <Tab
              icon={<ListIcon />}
              iconPosition="start"
              label="Danh sách sản phẩm"
              {...a11yProps(1)}
            />
            <Tab
              icon={<AnalyticsIcon />}
              iconPosition="start"
              label="Thống kê chi tiết"
              {...a11yProps(2)}
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ px: 3 }}>
          {/* Overview Tab */}
          <TabPanel value={currentTab} index={0}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {/* Statistics Overview */}
              <ProductCustomStats showTitle={false} compact />

              {/* Recent Products Preview */}
              <Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  Sản phẩm gần đây
                </Typography>
                <ProductCustomList onSelectItem={handleSelectCustom} readonly />
              </Box>

              {/* Info Box */}
              <Alert severity="info">
                <Typography variant="body2">
                  <strong>Mẹo:</strong> Sử dụng tab "Danh sách sản phẩm" để quản
                  lý toàn bộ sản phẩm tùy chỉnh, hoặc tab "Thống kê chi tiết" để
                  xem báo cáo phân tích.
                </Typography>
              </Alert>
            </Box>
          </TabPanel>

          {/* Product List Tab */}
          <TabPanel value={currentTab} index={1}>
            <ProductCustomList onSelectItem={handleSelectCustom} />
          </TabPanel>

          {/* Detailed Statistics Tab */}
          <TabPanel value={currentTab} index={2}>
            <ProductCustomStats />
          </TabPanel>
        </Box>
      </Paper>

      {/* Selected Product Info (if needed for future features) */}
      {selectedCustom && (
        <Box sx={{ display: "none" }}>
          {/* Placeholder for selected product actions/details */}
          <Typography variant="body2">
            Selected: {selectedCustom.name}
          </Typography>
        </Box>
      )}
    </Container>
  );
};
