import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { Home, Category, Extension } from "@mui/icons-material";
import ProductVariantStats from "../components/product-variant-stats.component";
import { ProductVariantList } from "../components/product-variant-list.component";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

/**
 * Tab Panel Component following Single Responsibility Principle
 */
const TabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  index,
  ...other
}) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`variant-tabpanel-${index}`}
      aria-labelledby={`variant-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

/**
 * Generate tab props for accessibility
 */
function a11yProps(index: number) {
  return {
    id: `variant-tab-${index}`,
    "aria-controls": `variant-tabpanel-${index}`,
  };
}

interface ProductVariantsPageProps {
  productId?: string; // For filtering by specific product
}

/**
 * Product Variants Management Page
 * Following Single Responsibility Principle - manages the overall page structure and navigation
 */
export const ProductVariantsPage: React.FC<ProductVariantsPageProps> = ({
  productId,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link
            underline="hover"
            color="inherit"
            href="/dashboard"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <Home fontSize="inherit" />
            Trang chủ
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="/dashboard/products"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <Category fontSize="inherit" />
            Sản phẩm
          </Link>
          <Typography
            color="text.primary"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <Extension fontSize="inherit" />
            Biến thể sản phẩm
          </Typography>
        </Breadcrumbs>

        {/* Page Title */}
        <Typography variant="h4" component="h1" gutterBottom>
          Quản lý biến thể sản phẩm
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý các biến thể của sản phẩm như màu sắc, kích thước, kiểu dáng
          và cấu hình
        </Typography>
      </Box>

      {/* Navigation Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="Product variants tabs"
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTabs-indicator": {
              height: 3,
            },
          }}
        >
          <Tab label="Thống kê" {...a11yProps(0)} iconPosition="start" />
          <Tab
            label="Danh sách biến thể"
            {...a11yProps(1)}
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box>
        {/* Statistics Tab */}
        <TabPanel value={activeTab} index={0}>
          <ProductVariantStats productId={productId} />
        </TabPanel>

        {/* Variants List Tab */}
        <TabPanel value={activeTab} index={1}>
          <ProductVariantList
            initialProductId={productId}
            initialViewMode="grid"
          />
        </TabPanel>
      </Box>
    </Container>
  );
};
